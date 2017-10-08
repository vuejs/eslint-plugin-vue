/**
 * @fileoverview external-script
 * @author Pietari Heino
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const utils = require('../utils')

function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    'VElement' (node) {
      // console.log()
      const rule = context.options[0]
      const required = rule === 'always'
      // console.log(rule)
      // console.log(required)
      const scriptTags = node.tokens.filter(t => t.value === 'script')

      const startIndex = node.tokens.indexOf(scriptTags[0])
      const closeIndex = node.tokens.indexOf(scriptTags[1])

      const tokensInScript = node.tokens.slice(startIndex, closeIndex)
      const scriptCount = tokensInScript.filter(t => t.value === 'src' || t.value === ':src').length

      if (required && scriptCount === 0) {
        context.report({
          node: node,
          loc: node.loc,
          message: "'<script>' must require external script files"
        })
      }
      if (!required && scriptCount > 0) {
        context.report({
          node: node,
          loc: node.loc,
          message: "'<script>' cannot require external script files"
        })
      }
    }
  })
};

module.exports = {
  meta: {
    docs: {
      description: 'Require or disallow the use of external script files',
      category: '',
      recommended: false
    },
    fixable: false,
    schema: [
      {
        enum: ['always', 'never']
      }
    ]
  },
  create
}
