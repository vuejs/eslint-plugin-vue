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
      category: 'essential',
      url: 'https://eslint.vuejs.org/rules/no-unused-vars.html'
    },
    fixable: 'code',
    schema: [
      {
        'type': 'object',
        'properties': {
          'varIgnorePattern': {
            'type': 'string'
          }
        },
        'additionalProperties': false
      }
    ]
  },

  create (context) {
    const option = context.options[0] || { varIgnorePattern: '^_' }
    const pattern = option['varIgnorePattern'] || '^_'
    // only use for construct a regularExpression
    // eslint-disable-next-line no-eval
    const regExp = eval(`/${pattern}/`)
    return utils.defineTemplateBodyVisitor(context, {
      VElement (node) {
        const variables = node.variables

        for (
          let i = variables.length - 1;
          i >= 0 && !regExp.test(variables[i].id.name) && !variables[i].references.length;
          i--
        ) {
          const variable = variables[i]
          context.report({
            node: variable.id,
            loc: variable.id.loc,
            message: `'{{name}}' is defined but never used.`,
            data: variable.id,
            suggest: [
              {
                desc: 'Replace the unused-var with default ignore pattern',
                fix: function (fixer) {
                  return fixer.replaceText(variable.id, `_${variable.id.name}`)
                }
              }
            ]
          })
        }
      }
    })
  }
}
