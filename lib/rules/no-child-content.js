/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
'use strict'
const utils = require('../utils')

/**
 * @typedef {object} RuleOption
 * @property {string[]} additionalDirectives
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    hasSuggestions: true,
    type: 'problem',
    docs: {
      description:
        "disallow element's child contents which would be overwritten by a directive like `v-html` or `v-text`",
      categories: [],
      url: 'https://eslint.vuejs.org/rules/no-child-content.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          additionalDirectives: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              type: 'string'
            }
          }
        },
        required: ['additionalDirectives']
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const directives = new Set(['html', 'text'])

    /** @type {RuleOption | undefined} */
    const option = context.options[0]
    if (option !== undefined) {
      for (const directive of option.additionalDirectives) {
        directives.add(directive)
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} directiveNode */
      'VAttribute[directive=true]'(directiveNode) {
        const directiveName = directiveNode.key.name.name
        const elementNode = directiveNode.parent.parent

        if (directives.has(directiveName) && elementNode.children.length > 0) {
          const firstChildNode = elementNode.children[0]
          const lastChildNode =
            elementNode.children[elementNode.children.length - 1]

          context.report({
            node: elementNode,
            loc: {
              start: firstChildNode.loc.start,
              end: lastChildNode.loc.end
            },
            message:
              'Child content is disallowed because it will be overwritten by the v-{{ directiveName }} directive.',
            data: { directiveName },
            suggest: [
              {
                desc: 'Remove child content.',
                *fix(fixer) {
                  for (const childNode of elementNode.children) {
                    yield fixer.remove(childNode)
                  }
                }
              }
            ]
          })
        }
      }
    })
  }
}
