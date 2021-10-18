/**
 * @author Marton Csordas
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated `tag` property on `RouterLink` (in Vue.js 3.0.0+)',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-deprecated-router-link-tag-prop.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          components: {
            type: 'array',
            items: {
              type: 'string'
            },
            uniqueItems: true,
            minItems: 1
          }
        }
      }
    ],
    messages: {
      deprecated:
        "'tag' property on '{{element}}' component is deprecated. Use scoped slots instead."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    let components = ['RouterLink']
    if (context.options[0] && context.options[0].components) {
      components = context.options[0].components
    }

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (!components.includes(node.rawName)) return

        const attributes = node.startTag.attributes
        attributes.forEach((attr) => {
          /** @type VIdentifier | null */
          let tagAttr = null

          if (attr.key.type === 'VIdentifier') {
            tagAttr = attr.key
          } else if (attr.directive && attr.key.type === 'VDirectiveKey') {
            const arg = attr.key.argument
            if (arg && arg.type === 'VIdentifier') {
              tagAttr = arg
            }
          }

          if (tagAttr && tagAttr.name === 'tag') {
            context.report({
              node: tagAttr,
              messageId: 'deprecated',
              data: {
                element: node.rawName
              }
            })
          }
        })
      }
    })
  }
}
