/**
 * @fileoverview detect if there is a potential typo in your component property
 * @author IWANABETHATGUY
 */
'use strict'

const { executeOnVue, editDistance } = require('../utils')
const vueComponentOptions = require('../utils/vue-component-options.json')
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow a potential typo in your component property',
      category: 'essential',
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/no-potential-property-typo.html'
    },
    fixable: null,
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

    return executeOnVue(context, obj => {
      // TODO: threshold is an option
      const threshold = 1
      const componentInstanceOptions = obj.properties.filter(
        p => p.type === 'Property' && p.key.type === 'Identifier'
      )
      if (!componentInstanceOptions.length) {
        return
      }
      componentInstanceOptions.forEach(option => {
        const name = option.key.name
        const potentialTypoList = vueComponentOptions
          .map(o => ({ option: o, distance: editDistance(o, name) }))
          .filter(({ distance }) => distance > threshold || distance === 0)
          .sort((a, b) => a.distance - b.distance)
        if (potentialTypoList.length) {
          context.report({
            node: option.key,
            loc: option.key.loc,
            message: `'{{name}}' may be a typo, which is similar to vue component option {{option}}.`,
            data: {
              name,
              option: potentialTypoList.map(({ option }) => option).join(',')
            },
            suggestion: potentialTypoList.map(({ option }) => ({
              desc: `Replace property ${name} to ${option}`,
              fix (fixer) {
                return fixer.replaceText(option.key, option)
              }
            }))
          })
        }
      })
    })
  }
}
