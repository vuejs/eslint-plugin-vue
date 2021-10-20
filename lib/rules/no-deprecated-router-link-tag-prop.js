/**
 * @author Marton Csordas
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const casing = require('../utils/casing')

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/** @param {RuleContext} context */
function getComponentNames(context) {
  let components = ['RouterLink']

  if (context.options[0] && context.options[0].components) {
    components = context.options[0].components
  }

  return components.reduce((prev, curr) => {
    prev.add(casing.kebabCase(curr))
    prev.add(casing.pascalCase(curr))
    return prev
  }, new Set())
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated `tag` property on `RouterLink` (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
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
    const components = getComponentNames(context)

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (!components.has(node.rawName)) return

        /** @type VIdentifier | null */
        let tagKey = null

        const tagAttr = utils.getAttribute(node, 'tag')
        if (tagAttr) {
          tagKey = tagAttr.key
        } else {
          const directive = utils.getDirective(node, 'bind', 'tag')
          if (directive) {
            const arg = directive.key.argument
            if (arg && arg.type === 'VIdentifier') {
              tagKey = arg
            }
          }
        }

        if (tagKey) {
          context.report({
            node: tagKey,
            messageId: 'deprecated',
            data: {
              element: node.rawName
            }
          })
        }
      }
    })
  }
}
