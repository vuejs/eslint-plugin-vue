/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview Disallow use of deprecated `.sync` modifier on `v-bind` directive (in Vue.js 3.0.0+)
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
      description: 'disallow use of deprecated `.sync` modifier on `v-bind` directive (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-v-bind-sync.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      syncModifierIsDeprecated: "'.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead."
    }
  },
  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='bind']" (node) {
        if (node.key.modifiers.map(mod => mod.name).includes('sync')) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'syncModifierIsDeprecated',
            fix: (fixer) => {
              const isUsingSpreadSyntax = node.key.argument == null
              const hasMultipleModifiers = node.key.modifiers.length > 1
              if (isUsingSpreadSyntax || hasMultipleModifiers) {
                return
              }

              const bindArgument = context.getSourceCode().getText(node.key.argument)
              return fixer.replaceText(node.key, `v-model:${bindArgument}`)
            }
          })
        }
      }
    })
  }
}
