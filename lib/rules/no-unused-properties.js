/**
 * @fileoverview Disallow unused properties, data and computed properties.
 * @author Learning Equality
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const remove = require('lodash/remove')
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const GROUP_PROPERTY = 'props'
const GROUP_DATA = 'data'
const GROUP_COMPUTED_PROPERTY = 'computed'
const GROUP_WATCHER = 'watch'

const PROPERTY_LABEL = {
  [GROUP_PROPERTY]: 'property',
  [GROUP_DATA]: 'data',
  [GROUP_COMPUTED_PROPERTY]: 'computed property'
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Extract names from references objects.
 */
const getReferencesNames = references => {
  if (!references || !references.length) {
    return []
  }

  return references.map(reference => {
    if (!reference.id || !reference.id.name) {
      return
    }

    return reference.id.name
  })
}

/**
 * Report all unused properties.
 */
const reportUnusedProperties = (context, properties) => {
  if (!properties || !properties.length) {
    return
  }

  properties.forEach(property => {
    context.report({
      node: property.node,
      message: `Unused ${PROPERTY_LABEL[property.groupName]} found: "${property.name}"`
    })
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused properties, data and computed properties',
      category: undefined,
      url: 'https://eslint.vuejs.org/rules/no-unused-properties.html'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    let hasTemplate
    let rootTemplateEnd
    let unusedProperties = []
    const thisExpressionsVariablesNames = []

    const initialize = {
      Program (node) {
        if (context.parserServices.getTemplateBodyTokenStore == null) {
          context.report({
            loc: { line: 1, column: 0 },
            message:
              'Use the latest vue-eslint-parser. See also https://vuejs.github.io/eslint-plugin-vue/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
          })
          return
        }

        hasTemplate = Boolean(node.templateBody)
      }
    }

    const scriptVisitor = Object.assign(
      {},
      {
        'MemberExpression[object.type="ThisExpression"][property.type="Identifier"][property.name]' (
          node
        ) {
          thisExpressionsVariablesNames.push(node.property.name)
        }
      },
      utils.executeOnVue(context, obj => {
        unusedProperties = Array.from(
          utils.iterateProperties(obj, new Set([GROUP_PROPERTY, GROUP_DATA, GROUP_COMPUTED_PROPERTY]))
        )

        const watchers = Array.from(utils.iterateProperties(obj, new Set([GROUP_WATCHER])))
        const watchersNames = watchers.map(watcher => watcher.name)

        remove(unusedProperties, property => {
          return (
            thisExpressionsVariablesNames.includes(property.name) ||
            watchersNames.includes(property.name)
          )
        })

        if (!hasTemplate && unusedProperties.length) {
          reportUnusedProperties(context, unusedProperties)
        }
      })
    )

    const templateVisitor = {
      'VExpressionContainer[expression!=null][references]' (node) {
        const referencesNames = getReferencesNames(node.references)

        remove(unusedProperties, property => {
          return referencesNames.includes(property.name)
        })
      },
      // save root template end location - just a helper to be used
      // for a decision if a parser reached the end of the root template
      "VElement[name='template']" (node) {
        if (rootTemplateEnd) {
          return
        }

        rootTemplateEnd = node.loc.end
      },
      "VElement[name='template']:exit" (node) {
        if (node.loc.end !== rootTemplateEnd) {
          return
        }

        if (unusedProperties.length) {
          reportUnusedProperties(context, unusedProperties)
        }
      }
    }

    return Object.assign(
      {},
      initialize,
      utils.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor)
    )
  }
}
