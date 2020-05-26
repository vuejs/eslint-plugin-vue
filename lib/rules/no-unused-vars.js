/**
 * @fileoverview disallow unused variable definitions of v-for directives or scope attributes.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow unused variable definitions of v-for directives or scope attributes',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-unused-vars.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignorePattern: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const option = context.options[0] || {}
    const ignorePattern = option.ignorePattern
    let ignoreRegEx = null
    if (ignorePattern) {
      ignoreRegEx = new RegExp(ignorePattern, 'u')
    }
    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        const variables = node.variables
        for (let i = variables.length - 1; i >= 0; i--) {
          const variable = variables[i]

          if (variable.references.length) {
            break
          }

          if (ignoreRegEx != null && ignoreRegEx.test(variable.id.name)) {
            continue
          }
          context.report({
            node: variable.id,
            loc: variable.id.loc,
            message: `'{{name}}' is defined but never used.`,
            data: variable.id,
            suggest:
              ignorePattern === '^_'
                ? [
                    {
                      desc: `Replace the ${variable.id.name} with _${variable.id.name}`,
                      fix(fixer) {
                        return fixer.replaceText(
                          variable.id,
                          `_${variable.id.name}`
                        )
                      }
                    }
                  ]
                : []
          })
        }
      }
    })
  }
}
