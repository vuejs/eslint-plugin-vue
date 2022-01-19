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
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow undefined components in `<template>` with `<script setup>`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-undef-components-in-script-setup.html'
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
      undef:
        "The '<{{name}}>' component has been used, but not defined in <script setup>."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    if (!utils.isScriptSetup(context)) {
      return {}
    }
    const options = context.options[0] || {}
    /** @type {string[]} */
    const ignorePatterns = options.ignorePatterns || []

    /** @type {Set<string>} */
    const scriptVariableNames = new Set()
    const globalScope = context.getSourceCode().scopeManager.globalScope
    if (globalScope) {
      for (const variable of globalScope.variables) {
        scriptVariableNames.add(variable.name)
      }
      const moduleScope = globalScope.childScopes.find(
        (scope) => scope.type === 'module'
      )
      for (const variable of (moduleScope && moduleScope.variables) || []) {
        scriptVariableNames.add(variable.name)
      }
    }
    /**
     * `casing.camelCase()` converts the beginning to lowercase,
     * but does not convert the case of the beginning character when converting with Vue3.
     * @see https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/shared/src/index.ts#L105
     * @param {string} str
     */
    function camelize(str) {
      return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
    }
    /**
     * @see https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/compiler-core/src/transforms/transformElement.ts#L334
     * @param {string} name
     */
    function existsSetupReference(name) {
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

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (
          (!utils.isHtmlElementNode(node) && !utils.isSvgElementNode(node)) ||
          (node.rawName === node.name &&
            (utils.isHtmlWellKnownElementName(node.rawName) ||
              utils.isSvgWellKnownElementName(node.rawName))) ||
          utils.isBuiltInComponentName(node.rawName)
        ) {
          return
        }
        if (existsSetupReference(node.rawName)) {
          return
        }
        // Check namespace
        // https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/compiler-core/src/transforms/transformElement.ts#L305
        const dotIndex = node.rawName.indexOf('.')
        if (dotIndex > 0) {
          if (existsSetupReference(node.rawName.slice(0, dotIndex))) {
            return
          }
        }

        // Check ignored patterns
        if (
          ignorePatterns.some((pattern) => {
            const regExp = new RegExp(pattern)
            return (
              regExp.test(node.rawName) ||
              regExp.test(casing.kebabCase(node.rawName)) ||
              regExp.test(casing.pascalCase(node.rawName)) ||
              regExp.test(casing.camelCase(node.rawName)) ||
              regExp.test(casing.snakeCase(node.rawName))
            )
          })
        ) {
          return
        }

        context.report({
          node: node.startTag,
          messageId: 'undef',
          data: {
            name: node.rawName
          }
        })
      }
    })
  }
}
