/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce type-based `defineProps`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-props-declaration.html'
    },
    fixable: null,
    schema: [],
    messages: {
      hasArg: 'Use type-based declaration instead of runtime declaration.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup || !utils.hasAttribute(scriptSetup, 'lang', 'ts')) {
      return {}
    }

    return utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(node) {
        if (node.arguments.length > 0) {
          context.report({
            node,
            messageId: 'hasArg'
          })
        }
      }
    })
  }
}
