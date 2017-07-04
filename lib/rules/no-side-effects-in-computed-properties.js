/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

function create (context) {
  return utils.executeOnVueComponent(context, (properties) => {
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Don\'t introduce side effects in computed properties',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    schema: []
  }
}
