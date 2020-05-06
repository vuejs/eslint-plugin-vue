/**
 * @fileoverview Report used components that are not registered
 * @author Jesús Ángel González Novez
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('eslint-plugin-vue/lib/utils')
const casing = require('eslint-plugin-vue/lib/utils/casing')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using components that are not registered',
      categories: ['essential'],
      url: 'https://eslint.vuejs.org/rules/no-unregistered-components.html'
    },
    fixable: null,
    schema: [{
      type: 'object',
      properties: {
        ignorePatterns: {
          type: 'array'
        }
      },
      additionalProperties: false
    }]
  },

  create (context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []
    const usedComponentNodes = []
    const registeredComponents = []
    let templateLocation

    return utils.defineTemplateBodyVisitor(context, {
      VElement (node) {
        if (
          (!utils.isHtmlElementNode(node) && !utils.isSvgElementNode(node)) ||
          utils.isHtmlWellKnownElementName(node.rawName) ||
          utils.isSvgWellKnownElementName(node.rawName) ||
          node.rawName === 'component'
        ) {
          return
        }

        usedComponentNodes.push({ node, name: node.rawName })
      },
      "VAttribute[directive=true][key.name.name='bind'][key.argument.name='is']" (node) {
        if (
          !node.value ||
          node.value.type !== 'VExpressionContainer' ||
          !node.value.expression
        ) return

        if (node.value.expression.type === 'Literal') {
          usedComponentNodes.push({ node, name: node.value.expression.value })
        }
      },
      "VAttribute[directive=false][key.name='is']" (node) {
        usedComponentNodes.push({ node, name: node.value.value })
      },
      "VElement[name='template']" (rootNode) {
        templateLocation = templateLocation || rootNode.loc.start
      },
      "VElement[name='template']:exit" (rootNode) {
        if (
          rootNode.loc.start !== templateLocation ||
          utils.hasAttribute(rootNode, 'src')
        ) return

        const registeredComponentNames = registeredComponents.map(({ name }) => casing.kebabCase(name))

        usedComponentNodes
          .filter(({ name }) => {
            const kebabCaseName = casing.kebabCase(name)
            if (ignorePatterns.find(pattern => {
              const regExp = new RegExp(pattern)
              return regExp.test(kebabCaseName) ||
                regExp.test(casing.pascalCase(name)) ||
                regExp.test(casing.camelCase(name)) ||
                regExp.test(casing.snakeCase(name)) ||
                regExp.test(name)
            })) return false
            return registeredComponentNames.indexOf(kebabCaseName) === -1
          })
          .forEach(({ node, name }) => context.report({
            node,
            message: 'The "{{name}}" component has been used but not registered.',
            data: {
              name
            }
          }))
      }
    }, utils.executeOnVue(context, (obj) => {
      registeredComponents.push(...utils.getRegisteredComponents(obj))
    }))
  }
}
