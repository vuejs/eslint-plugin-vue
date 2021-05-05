/**
 * @fileoverview Emit definitions should be detailed
 * @author Pig Fang
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('../utils').ComponentArrayEmit} ComponentArrayEmit
 * @typedef {import('../utils').ComponentObjectEmit} ComponentObjectEmit
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require type definitions in emits',
      categories: ['vue3-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/require-emit-types.html'
    },
    fixable: null,
    messages: {
      missing: 'Emit "{{name}}" should define at least its type.'
    },
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    /**
     * @param {ComponentArrayEmit|ComponentObjectEmit} emit
     */
    function checker({ value, node, emitName }) {
      const hasType =
        !!value &&
        (value.type === 'ArrowFunctionExpression' ||
          value.type === 'FunctionExpression')

      if (!hasType) {
        const name =
          emitName ||
          (node.type === 'Identifier' && node.name) ||
          'Unknown emit'

        context.report({
          node,
          messageId: 'missing',
          data: { name }
        })
      }
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      utils.getComponentEmits(obj).forEach(checker)
    })
  }
}
