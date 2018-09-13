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
    schema: [{
      type: 'object',
      properties: {
        ignoreWhenBindingPresent: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create (context) {
    const options = context.options[0] || {}
    const ignoreWhenBindingPresent = options.ignoreWhenBindingPresent !== undefined ? options.ignoreWhenBindingPresent : true
    const usedComponents = []
    let registeredComponents = []
    let ignoreReporting = false
    let templateLocation

    return utils.defineTemplateBodyVisitor(context, {
      VElement (node) {
        if (utils.isHtmlElementNode(node) && !utils.isHtmlWellKnownElementName(node.rawName)) {
          usedComponents.push(node.rawName)
        }
      },
      "VAttribute[directive=true][key.name='bind'][key.argument='is']" (node) {
        if (node.value.type !== 'VExpressionContainer') return

        if (node.value.expression.type === 'Literal') {
          usedComponents.push(node.value.expression.value)
        } else if (ignoreWhenBindingPresent) {
          ignoreReporting = true
        }
      },
      "VAttribute[directive=false][key.name='is']" (node) {
        usedComponents.push(node.value.value)
      },
      "VElement[name='template']" (rootNode) {
        templateLocation = templateLocation || rootNode.loc.start
      },
      "VElement[name='template']:exit" (rootNode) {
        if (
          rootNode.loc.start !== templateLocation ||
          ignoreReporting
        ) return

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
