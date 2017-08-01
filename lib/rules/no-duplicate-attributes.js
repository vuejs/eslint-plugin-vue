/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Get the name of the given attribute node.
 * @param {ASTNode} attribute The attribute node to get.
 * @returns {string} The name of the attribute.
 */
function getName (attribute) {
  if (!attribute.directive) {
    return attribute.key.name
  }
  if (attribute.key.name === 'bind') {
    return attribute.key.argument || null
  }
  return null
}

/**
 * Creates AST event handlers for no-duplicate-attributes.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  const options = context.options[0] || {}
  const allowCoexistStyle = Boolean(options.allowCoexistStyle !== false)
  const allowCoexistClass = Boolean(options.allowCoexistClass !== false)

  const directiveNames = new Set()
  const attributeNames = new Set()

  function isDuplicate (name) {
    if (allowCoexistStyle && name === 'style') {
      return directiveNames.has(name)
    }
    if (allowCoexistClass && name === 'class') {
      return directiveNames.has(name)
    }
    return directiveNames.has(name) || attributeNames.has(name)
  }

  utils.registerTemplateBodyVisitor(context, {
    'VStartTag' () {
      directiveNames.clear()
      attributeNames.clear()
    },
    'VAttribute' (node) {
      const name = getName(node)
      if (name == null) {
        return
      }

      if (isDuplicate(name)) {
        context.report({
          node,
          loc: node.loc,
          message: "Duplicate attribute '{{name}}'.",
          data: { name }
        })
      }

      if (node.directive) {
        directiveNames.add(name)
      } else {
        attributeNames.add(name)
      }
    }
  })

  return {}
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'disallow duplicate attributes.',
      category: 'Best Practices',
      recommended: false
    },
    fixable: false,

    schema: [
      {
        type: 'object',
        properties: {
          allowCoexistClass: {
            type: 'boolean'
          },
          allowCoexistStyle: {
            type: 'boolean'
          }
        }
      }
    ]
  }
}
