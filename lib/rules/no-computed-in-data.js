/**
 * @fileoverview Ensure computed properties are not used in the data()
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require computed properties are not used in the data()',
      category: '',
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/no-computed-in-data.html'
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function (context) {
    // variables should be defined here

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {

      // give me methods

    }
  }
}
