/**
 * @fileoverview Enforce consistent indentation in html template
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function create (context) {
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

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consistent indentation in html template',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {
        oneOf: [
          {
            enum: ['tab']
          },
          {
            type: 'integer',
            minimum: 0
          }
        ]
      }
    ]
  },

  create
}
