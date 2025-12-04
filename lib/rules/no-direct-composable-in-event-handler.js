/**
 * @author Nils Haberkamp
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * Check if the given function name follows the composable naming convention (starts with 'use')
 * @param {string | null | undefined} name The function name
 * @returns {boolean} `true` if the function name starts with 'use'
 */
function isComposable(name) {
  return Boolean(name && name.startsWith('use'))
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow direct composable usage in event handler',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-direct-composable-in-event-handler.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbiddenComposableUsage:
        'Direct composable usage in event handler is not allowed.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      'VAttribute[directive=true][key.name.name="on"]'(node) {
        const eventHandler = node.value

        if (!eventHandler || !eventHandler.expression) {
          return
        }

        if (
          eventHandler.expression.type === 'Identifier' &&
          isComposable(eventHandler.expression.name)
        ) {
          context.report({
            node,
            messageId: 'forbiddenComposableUsage',
            loc: {
              start: {
                line: node.loc.start.line,
                column: node.loc.start.column
              },
              end: {
                line: node.loc.end.line,
                column: node.loc.end.column
              }
            }
          })
        }
      }
    })
  }
}
