/**
 * @author Kamogelo Moalusi <github.com/thesheppard>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// @ts-nocheck
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require components to be defined using `defineComponent`',
      categories: ['vue3-recommended', 'vue2-recommended'],
      url: 'https://eslint.vuejs.org/rules/prefer-define-component.html'
    },
    fixable: null,
    schema: [],
    messages: {
      'prefer-define-component': 'Use `defineComponent` to define a component.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const filePath = context.getFilename()
    if (!utils.isVueFile(filePath)) return {}

    const sourceCode = context.getSourceCode()
    const documentFragment = sourceCode.parserServices.getDocumentFragment?.()

    // Check if there's a non-setup script tag
    const hasNormalScript =
      documentFragment &&
      documentFragment.children.some(
        (e) =>
          utils.isVElement(e) &&
          e.name === 'script' &&
          (!e.startTag.attributes ||
            !e.startTag.attributes.some((attr) => attr.key.name === 'setup'))
      )

    // If no regular script tag, we don't need to check
    if (!hasNormalScript) return {}

    // Skip checking if there's only a setup script (no normal script)
    if (utils.isScriptSetup(context) && !hasNormalScript) return {}

    let hasDefineComponent = false
    /** @type {ExportDefaultDeclaration | null} */
    let exportDefaultNode = null
    let hasVueExtend = false

    return utils.compositingVisitors(utils.defineVueVisitor(context, {}), {
      /** @param {ExportDefaultDeclaration} node */
      'Program > ExportDefaultDeclaration'(node) {
        exportDefaultNode = node
      },

      /** @param {CallExpression} node */
      'Program > ExportDefaultDeclaration > CallExpression'(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'defineComponent'
        ) {
          hasDefineComponent = true
          return
        }

        // Support aliased imports
        if (node.callee.type === 'Identifier') {
          const variable = utils.findVariableByIdentifier(context, node.callee)
          if (
            variable &&
            variable.defs &&
            variable.defs.length > 0 &&
            variable.defs[0].node.type === 'ImportSpecifier' &&
            variable.defs[0].node.imported &&
            variable.defs[0].node.imported.name === 'defineComponent'
          ) {
            hasDefineComponent = true
            return
          }
        }

        // Check for Vue.extend case
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'Vue' &&
          node.callee.property &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'extend'
        ) {
          hasVueExtend = true
        }
      },

      'Program > ExportDefaultDeclaration > ObjectExpression'() {
        hasDefineComponent = false
      },

      'Program:exit'() {
        if (exportDefaultNode && (hasVueExtend || !hasDefineComponent)) {
          context.report({
            node: exportDefaultNode,
            messageId: 'prefer-define-component'
          })
        }
      }
    })
  }
}
