/**
 * @author Sosuke Suzuki
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using arrow functions to define watcher',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-arrow-functions-in-watch.html'
    },
    fixable: null,
    schema: []
  },
  create (context) {
    return utils.executeOnVue(context, (obj) => {
      const watchNode = obj.properties.find((property) => utils.getStaticPropertyName(property) === 'watch')
      if (watchNode == null) {
        return
      }
      const watchValue = watchNode.value
      if (watchValue.type !== 'ObjectExpression') {
        return
      }
      for (const property of watchValue.properties) {
        if (property.type === 'Property' && property.value.type === 'ArrowFunctionExpression') {
          context.report({
            node: property,
            message: 'You should not use an arrow function to define a watcher.'
          })
        }
      }
    })
  }
}
