/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const casing = require('../utils/casing')

// ------------------------------------------------------------------------------
// Rule helpers
// ------------------------------------------------------------------------------

/**
 * `casing.camelCase()` converts the beginning to lowercase,
 * but does not convert the case of the beginning character when converting with Vue3.
 * @see https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/shared/src/index.ts#L105
 * @param {string} str
 */
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of undefined components in `<template>`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-undef-components.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignorePatterns: {
            type: 'array'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      undef: "The '<{{name}}>' component has been used, but not defined.",
      typeOnly:
        "The '<{{name}}>' component has been used, but '{{name}}' only refers to a type."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    /** @type {string[]} */
    const ignorePatterns = options.ignorePatterns || []

    /**
     * Check whether the given element name is a verify target or not.
     *
     * @param {string} rawName The element name.
     * @returns {boolean}
     */
    function isVerifyTargetComponent(rawName) {
      const kebabCaseName = casing.kebabCase(rawName)

      if (
        utils.isHtmlWellKnownElementName(rawName) ||
        utils.isSvgWellKnownElementName(rawName) ||
        utils.isBuiltInComponentName(kebabCaseName)
      ) {
        return false
      }
      const pascalCaseName = casing.pascalCase(rawName)
      // Check ignored patterns
      if (
        ignorePatterns.some((pattern) => {
          const regExp = new RegExp(pattern)
          return (
            regExp.test(rawName) ||
            regExp.test(kebabCaseName) ||
            regExp.test(pascalCaseName)
          )
        })
      ) {
        return false
      }
      return true
    }

    /** @type { (rawName:string, reportNode: ASTNode) => void } */
    let verifyName
    /** @type {RuleListener} */
    let scriptVisitor = {}
    /** @type {TemplateListener} */
    const templateBodyVisitor = {
      VElement(node) {
        if (!utils.isHtmlElementNode(node) && !utils.isSvgElementNode(node)) {
          return
        }
        verifyName(node.rawName, node.startTag)
      },
      /** @param {VAttribute} node */
      "VAttribute[directive=false][key.name='is']"(node) {
        if (
          !node.value // `<component is />`
        )
          return
        const value = node.value.value.startsWith('vue:') // Usage on native elements 3.1+
          ? node.value.value.slice(4)
          : node.value.value
        verifyName(value, node)
      }
    }

    if (utils.isScriptSetup(context)) {
      // For <script setup>
      /** @type {Set<string>} */
      const scriptVariableNames = new Set()
      const scriptTypeOnlyNames = new Set()
      const globalScope = context.getSourceCode().scopeManager.globalScope
      if (globalScope) {
        for (const variable of globalScope.variables) {
          scriptVariableNames.add(variable.name)
        }
        const moduleScope = globalScope.childScopes.find(
          (scope) => scope.type === 'module'
        )
        for (const variable of (moduleScope && moduleScope.variables) || []) {
          if (
            // Check for type definitions. e.g. type Foo = {}
            (variable.isTypeVariable && !variable.isValueVariable) ||
            // type-only import seems to have isValueVariable set to true. So we need to check the actual Node.
            (variable.defs.length > 0 &&
              variable.defs.every((def) => {
                if (def.type !== 'ImportBinding') {
                  return false
                }
                if (def.parent.importKind === 'type') {
                  // check for `import type Foo from './xxx'`
                  return true
                }
                if (
                  def.node.type === 'ImportSpecifier' &&
                  def.node.importKind === 'type'
                ) {
                  // check for `import { type Foo } from './xxx'`
                  return true
                }
                return false
              }))
          ) {
            scriptTypeOnlyNames.add(variable.name)
          } else {
            scriptVariableNames.add(variable.name)
          }
        }
      }
      /**
       * @see https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/compiler-core/src/transforms/transformElement.ts#L334
       * @param {string} name
       */
      const existsSetupReference = (name) => {
        if (scriptVariableNames.has(name)) {
          return true
        }
        const camelName = camelize(name)
        if (scriptVariableNames.has(camelName)) {
          return true
        }
        const pascalName = casing.capitalize(camelName)
        if (scriptVariableNames.has(pascalName)) {
          return true
        }
        return false
      }
      verifyName = (rawName, reportNode) => {
        if (!isVerifyTargetComponent(rawName)) {
          return
        }
        if (existsSetupReference(rawName)) {
          return
        }
        // Check namespace
        // https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/compiler-core/src/transforms/transformElement.ts#L305
        const dotIndex = rawName.indexOf('.')
        if (dotIndex > 0 && existsSetupReference(rawName.slice(0, dotIndex))) {
          return
        }

        context.report({
          node: reportNode,
          messageId: scriptTypeOnlyNames.has(rawName) ? 'typeOnly' : 'undef',
          data: {
            name: rawName
          }
        })
      }
    } else {
      // For Options API

      /**
       * All registered components
       * @type {string[]}
       */
      const registeredComponentNames = []
      /**
       * All registered components, transformed to kebab-case
       * @type {string[]}
       */
      const registeredComponentKebabCaseNames = []

      /**
       * All registered components using kebab-case syntax
       * @type {string[]}
       */
      const componentsRegisteredAsKebabCase = []

      scriptVisitor = utils.executeOnVue(context, (obj) => {
        registeredComponentNames.push(
          ...utils.getRegisteredComponents(obj).map(({ name }) => name)
        )

        const nameProperty = utils.findProperty(obj, 'name')

        if (nameProperty && utils.isStringLiteral(nameProperty.value)) {
          const name = utils.getStringLiteralValue(nameProperty.value)
          if (name) {
            registeredComponentNames.push(name)
          }
        }

        registeredComponentKebabCaseNames.push(
          ...registeredComponentNames.map((name) => casing.kebabCase(name))
        )
        componentsRegisteredAsKebabCase.push(
          ...registeredComponentNames.filter(
            (name) => name === casing.kebabCase(name)
          )
        )
      })

      verifyName = (rawName, reportNode) => {
        if (!isVerifyTargetComponent(rawName)) {
          return
        }
        if (registeredComponentNames.includes(rawName)) {
          return
        }
        const kebabCaseName = casing.kebabCase(rawName)
        if (
          registeredComponentKebabCaseNames.includes(kebabCaseName) &&
          !casing.isPascalCase(rawName)
        ) {
          // Component registered as `foo-bar` cannot be used as `FooBar`
          return
        }

        context.report({
          node: reportNode,
          messageId: 'undef',
          data: {
            name: rawName
          }
        })
      }

      /** @param {VDirective} node */
      templateBodyVisitor[
        "VAttribute[directive=true][key.name.name='bind'][key.argument.name='is'], VAttribute[directive=true][key.name.name='is']"
      ] = (node) => {
        if (
          !node.value ||
          node.value.type !== 'VExpressionContainer' ||
          !node.value.expression
        )
          return

        if (node.value.expression.type === 'Literal') {
          verifyName(`${node.value.expression.value}`, node)
        }
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      templateBodyVisitor,
      scriptVisitor
    )
  }
}
