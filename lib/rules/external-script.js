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
      const rule = context.options[0]
      const required = rule === 'always'

      if ('tokens' in node) {
        const scriptTags = node.tokens.filter(t => t.value === 'script')
        const openingTag = scriptTags[0]
        const errorLocation = openingTag.loc
        const startIndex = node.tokens.indexOf(scriptTags[0])
        const closeIndex = node.tokens.indexOf(scriptTags[1])

        const tokensInScript = node.tokens.slice(startIndex, closeIndex)
        const srcTokens = tokensInScript.filter(t => t.value === 'src' || t.value === ':src')
        const srcCount = srcTokens.length

        if (required && srcCount === 0) {
          context.report({
            node: node,
            loc: errorLocation,
            message: "'<script>' must require external script files"
          })
        }
        if (!required && srcCount > 0) {
          context.report({
            node: node,
            loc: errorLocation,
            message: "'<script>' cannot require external script files"
          })
        }
      }
    }
  })
};

module.exports = {
  meta: {
    docs: {
      description: 'require or disallow the use of external script files',
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
