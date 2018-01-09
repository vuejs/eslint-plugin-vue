/**
 * @fileoverview disallow unused variable definitions of v-for directives or scope attributes.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
'use strict'

const utils = require('../utils')

/**
 * Creates AST event handlers for require-v-for-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    VElement (node) {
      const variables = node.variables

      for (
        let i = variables.length - 1;
        i >= 0 && !variables[i].references.length;
        i--
      ) {
        const variable = variables[i]
        context.report({
          node: variable.id,
          loc: variable.id.loc,
          message: `'{{name}}' is defined but never used.`,
          data: variable.id
        })
      }
    }
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'disallow unused variable definitions of v-for directives or scope attributes',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-unused-vars.md'
    },
    fixable: null,
    schema: []
  }
}
