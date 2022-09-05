/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// ...

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '',
      categories: undefined,
      url: ''
    },
    fixable: null,
    schema: [],
    messages: {
      // ...
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    // ...

    return utils.defineTemplateBodyVisitor(context, {
      // ...
    })
  }
}
