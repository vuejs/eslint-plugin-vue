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
      description: 'disallow unused variable definitions of v-for directives or scope attributes',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-unused-vars.html'
    },
    fixable: null,
    schema: [
      {
        'type': 'object',
        'properties': {
          'ignorePattern': {
            'type': 'string'
          }
        },
        'additionalProperties': false
      }
    ]
  },

  create (context) {
    const option = context.options[0] || { }
    const pattern = option['ignorePattern']
    let regExp = null
    if (pattern) {
      regExp = new RegExp(pattern, 'u')
    }
    return utils.defineTemplateBodyVisitor(context, {
      VElement (node) {
        const variables = node.variables

        for (
          let i = variables.length - 1;
          // eslint-disable-next-line no-unmodified-loop-condition
          i >= 0 && !variables[i].references.length && (regExp === null || !regExp.test(variables[i].id.name));
          i--
        ) {
          const variable = variables[i]
          context.report({
            node: variable.id,
            loc: variable.id.loc,
            message: `'{{name}}' is defined but never used.`,
            data: variable.id,
            suggest: pattern === '^_' ? [
              {
                desc: `Replace the ${variable.id.name} with _${variable.id.name}`,
                fix: function (fixer) {
                  return fixer.replaceText(variable.id, `_${variable.id.name}`)
                }
              }
            ] : []
          })
        }
      }
    })
  }
}
