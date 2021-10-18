/**
 * @author Marton Csordas
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const casing = require('../utils/casing')
const utils = require('../utils')

const RESERVED_NAMES_IN_VUE3 = new Set(
  require('../utils/vue3-builtin-components')
)

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Returns true if the given component name is valid, otherwise false.
 * @param {string} name
 * */
function isValidComponentName(name) {
  if (name.toLowerCase() === 'app' || RESERVED_NAMES_IN_VUE3.has(name)) {
    return true
  } else {
    const elements = casing.kebabCase(name).split('-')
    return elements.length > 1
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require component names to be always multi-word',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/multi-word-component-names.html'
    },
    schema: [],
    messages: {
      unexpected: 'Component name "{{value}}" should always be multi-word.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const fileName = context.getFilename()
    let componentName = fileName.replace(/\.[^/.]+$/, '')

    return utils.compositingVisitors(
      {
        /** @param {Program} node */
        Program(node) {
          if (
            !node.body.length &&
            utils.isVueFile(fileName) &&
            !isValidComponentName(componentName)
          ) {
            context.report({
              messageId: 'unexpected',
              data: {
                value: componentName
              },
              loc: { line: 1, column: 0 }
            })
          }
        }
      },

      utils.executeOnVue(context, (obj) => {
        const node = utils.findProperty(obj, 'name')

        /** @type {SourceLocation | null} */
        let loc = null

        // Check if the component has a name property.
        if (node) {
          const valueNode = node.value
          if (valueNode.type !== 'Literal') return

          componentName = `${valueNode.value}`
          loc = node.loc
        } else if (
          obj.parent.type === 'CallExpression' &&
          obj.parent.arguments.length === 2
        ) {
          // The component is registered globally with 'Vue.component', where
          // the first paremter is the component name.
          const argument = obj.parent.arguments[0]
          if (argument.type !== 'Literal') return

          componentName = `${argument.value}`
          loc = argument.loc
        }

        if (!isValidComponentName(componentName)) {
          context.report({
            messageId: 'unexpected',
            data: {
              value: componentName
            },
            loc: loc || { line: 1, column: 0 }
          })
        }
      })
    )
  }
}
