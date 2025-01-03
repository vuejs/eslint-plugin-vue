/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const { getRuleOptions } = require('../utils/rule-options')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow v-text / v-html on component',
      categories: ['vue2-essential', 'vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-v-text-v-html-on-component.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: {
              type: 'string'
            },
            uniqueItems: true
          },
          ignoreElementNamespaces: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    defaultOptions: [
      {
        allow: [],
        ignoreElementNamespaces: false
      }
    ],
    messages: {
      disallow:
        "Using {{directiveName}} on component may break component's content."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const [{ allow, ignoreElementNamespaces }] = getRuleOptions(
      context,
      __filename
    )
    /** @type {Set<string>} */
    const allowedComponentNames = new Set(allow)

    /**
     * Check whether the given node is an allowed component or not.
     * @param {VElement} node The start tag node to check.
     * @returns {boolean} `true` if the node is an allowed component.
     */
    function isAllowedComponent(node) {
      const componentName = node.rawName
      return (
        allowedComponentNames.has(componentName) ||
        allowedComponentNames.has(casing.pascalCase(componentName)) ||
        allowedComponentNames.has(casing.kebabCase(componentName))
      )
    }

    /**
     * Verify for v-text and v-html directive
     * @param {VDirective} node
     */
    function verify(node) {
      const element = node.parent.parent
      if (
        utils.isCustomComponent(element, ignoreElementNamespaces) &&
        !isAllowedComponent(element)
      ) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'disallow',
          data: {
            directiveName: `v-${node.key.name.name}`
          }
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='text']": verify,
      "VAttribute[directive=true][key.name.name='html']": verify
    })
  }
}
