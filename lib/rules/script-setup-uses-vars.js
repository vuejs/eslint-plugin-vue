/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { getStyleVariablesContext } = require('../utils/style-variables')
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const casing = require('../utils/casing')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * `casing.camelCase()` converts the beginning to lowercase,
 * but does not convert the case of the beginning character when converting with Vue3.
 * @see https://github.com/vuejs/vue-next/blob/2749c15170ad4913e6530a257db485d4e7ed2283/packages/shared/src/index.ts#L116
 * @param {string} str
 */
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'prevent `<script setup>` variables used in `<template>` to be marked as unused', // eslint-disable-line eslint-plugin/require-meta-docs-description
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/script-setup-uses-vars.html'
    },
    deprecated: true,
    schema: []
  },
  /**
   * @param {RuleContext} context - The rule context.
   * @returns {RuleListener} AST event handlers.
   */
  create(context) {
    if (!utils.isScriptSetup(context)) {
      return {}
    }
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
     * @see https://github.com/vuejs/vue-next/blob/2749c15170ad4913e6530a257db485d4e7ed2283/packages/compiler-core/src/transforms/transformElement.ts#L333
     * @param {string} name
     */
    function markSetupReferenceVariableAsUsed(name) {
      if (scriptVariableNames.has(name)) {
        context.markVariableAsUsed(name)
        return true
      }
      const camelName = camelize(name)
      if (scriptVariableNames.has(camelName)) {
        context.markVariableAsUsed(camelName)
        return true
      }
      const pascalName = casing.capitalize(camelName)
      if (scriptVariableNames.has(pascalName)) {
        context.markVariableAsUsed(pascalName)
        return true
      }
      return false
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        VExpressionContainer(node) {
          for (const ref of node.references.filter(
            (ref) => ref.variable == null
          )) {
            context.markVariableAsUsed(ref.id.name)
          }
        },
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
          if (!markSetupReferenceVariableAsUsed(node.rawName)) {
            // Check namespace
            // https://github.com/vuejs/vue-next/blob/2749c15170ad4913e6530a257db485d4e7ed2283/packages/compiler-core/src/transforms/transformElement.ts#L304
            const dotIndex = node.rawName.indexOf('.')
            if (dotIndex > 0) {
              markSetupReferenceVariableAsUsed(node.rawName.slice(0, dotIndex))
            }
          }
        },
        /** @param {VDirective} node */
        'VAttribute[directive=true]'(node) {
          if (utils.isBuiltInDirectiveName(node.key.name.name)) {
            return
          }
          markSetupReferenceVariableAsUsed(`v-${node.key.name.rawName}`)
        },
        /** @param {VAttribute} node */
        'VAttribute[directive=false]'(node) {
          if (node.key.name === 'ref' && node.value) {
            context.markVariableAsUsed(node.value.value)
          }
        }
      },
      {
        Program() {
          const styleVars = getStyleVariablesContext(context)
          if (styleVars) {
            for (const ref of styleVars.references) {
              context.markVariableAsUsed(ref.id.name)
            }
          }
        }
      },
      {
        templateBodyTriggerSelector: 'Program'
      }
    )
  }
}
