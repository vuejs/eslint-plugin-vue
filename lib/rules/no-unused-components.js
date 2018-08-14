/**
 * @fileoverview Report used components
 * @author Michał Sajnóg
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const casing = require('../utils/casing')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow registering components that are not used inside templates',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/no-unused-components.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    const usedComponents = []
    let registeredComponents = []
    let templateLocation

    return utils.defineTemplateBodyVisitor(context, {
      VElement (node) {
        if (!utils.isCustomComponent(node)) return
        let usedComponentName

        if (utils.hasAttribute(node, 'is')) {
          usedComponentName = utils.findAttribute(node, 'is').value.value
        } else if (utils.hasDirective(node, 'bind', 'is')) {
          const directiveNode = utils.findDirective(node, 'bind', 'is')
          if (
            directiveNode.value.type === 'VExpressionContainer' &&
            directiveNode.value.expression.type === 'Literal'
          ) {
            usedComponentName = directiveNode.value.expression.value
          }
        } else {
          usedComponentName = node.rawName
        }

        if (usedComponentName) {
          usedComponents.push(usedComponentName)
        }
      },
      "VElement[name='template']" (rootNode) {
        templateLocation = templateLocation || rootNode.loc.start
      },
      "VElement[name='template']:exit" (rootNode) {
        if (rootNode.loc.start !== templateLocation) return

        registeredComponents
          .filter(({ name }) => {
            // If the component name is PascalCase
            // it can be used in varoious of ways inside template,
            // like "theComponent", "The-component" etc.
            // but except snake_case
            if (casing.pascalCase(name) === name) {
              return !usedComponents.some(n => {
                return n.indexOf('_') === -1 && name === casing.pascalCase(n)
              })
            } else {
              // In any other case the used component name must exactly match
              // the registered name
              return usedComponents.indexOf(name) === -1
            }
          })
          .forEach(({ node, name }) => context.report({
            node,
            message: 'The "{{name}}" component has been registered but not used.',
            data: {
              name
            }
          }))
      }
    }, utils.executeOnVue(context, (obj) => {
      registeredComponents = utils.getRegisteredComponents(obj)
    }))
  }
}
