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

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'prevent `<script setup>` variables used in `<template>` to be marked as unused', // eslint-disable-line consistent-docs-description
      categories: ['base'],
      url: 'https://eslint.vuejs.org/rules/script-setup-uses-vars.html'
    },
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
     * `casing.camelCase()` converts the beginning to lowercase,
     * but does not convert the case of the beginning character when converting with Vue3.
     * @see https://github.com/vuejs/vue-next/blob/1ffd48a2f5fd3eead3ea29dae668b7ed1c6f6130/packages/shared/src/index.ts#L116
     * @param {string} str
     */
    function camelize(str) {
      return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
    }
    /**
     * @see https://github.com/vuejs/vue-next/blob/1ffd48a2f5fd3eead3ea29dae668b7ed1c6f6130/packages/compiler-core/src/transforms/transformElement.ts#L321
     * @param {string} name
     */
    function markElementVariableAsUsed(name) {
      if (scriptVariableNames.has(name)) {
        context.markVariableAsUsed(name)
      }
      const camelName = camelize(name)
      if (scriptVariableNames.has(camelName)) {
        context.markVariableAsUsed(camelName)
      }
      const pascalName = casing.capitalize(camelName)
      if (scriptVariableNames.has(pascalName)) {
        context.markVariableAsUsed(pascalName)
      }
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
          markElementVariableAsUsed(node.rawName)
        },
        /** @param {VDirective} node */
        'VAttribute[directive=true]'(node) {
          if (utils.isBuiltInDirectiveName(node.key.name.name)) {
            return
          }
          markElementVariableAsUsed(`v-${node.key.name.rawName}`)
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
