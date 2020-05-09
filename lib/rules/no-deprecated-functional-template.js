/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated the `functional` template (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-functional-template.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'The `functional` template are deprecated.'
    }
  },

  create (context) {
    return {
      Program (program) {
        const element = program.templateBody
        if (element == null) {
          return
        }

        const functional = utils.getAttribute(element, 'functional')

        if (functional) {
          context.report({
            node: functional,
            messageId: 'unexpected'
          })
        }
      }
    }
  }
}
