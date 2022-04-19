/**
 * @fileoverview Internal rule to prevent missing or invalid meta property in core rules.
 * @author Vitor Balocco
 */

'use strict'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Gets the property of the Object node passed in that has the name specified.
 *
 * @param {string} propertyName Name of the property to return.
 * @param {ASTNode} node The ObjectExpression node.
 * @returns {ASTNode} The Property node or null if not found.
 */
function getPropertyFromObject(propertyName, node) {
  if (node && node.type === 'ObjectExpression') {
    const properties = node.properties

    for (const property of properties) {
      if (property.key.name === propertyName) {
        return property
      }
    }
  }
  return null
}

/**
 * Extracts the `meta` property from the ObjectExpression that all rules export.
 *
 * @param {ASTNode} exportsNode ObjectExpression node that the rule exports.
 * @returns {ASTNode} The `meta` Property node or null if not found.
 */
function getMetaPropertyFromExportsNode(exportsNode) {
  return getPropertyFromObject('meta', exportsNode)
}

/**
 * Whether this `meta` ObjectExpression has a `docs` property defined or not.
 *
 * @param {ASTNode} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `docs` property exists.
 */
function hasMetaDocs(metaPropertyNode) {
  return Boolean(getPropertyFromObject('docs', metaPropertyNode.value))
}

/**
 * Whether this `meta` ObjectExpression has a `docs.category` property defined or not.
 *
 * @param {ASTNode} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `docs.category` property exists.
 */
function hasMetaDocsCategories(metaPropertyNode) {
  const metaDocs = getPropertyFromObject('docs', metaPropertyNode.value)

  return metaDocs && getPropertyFromObject('categories', metaDocs.value)
}

/**
 * Checks the validity of the meta definition of this rule and reports any errors found.
 *
 * @param {RuleContext} context The ESLint rule context.
 * @param {ASTNode} exportsNode ObjectExpression node that the rule exports.
 * @param {boolean} ruleIsFixable whether the rule is fixable or not.
 * @returns {void}
 */
function checkMetaValidity(context, exportsNode) {
  const metaProperty = getMetaPropertyFromExportsNode(exportsNode)

  if (!metaProperty) {
    context.report(exportsNode, 'Rule is missing a meta property.')
    return
  }

  if (!hasMetaDocs(metaProperty)) {
    context.report(metaProperty, 'Rule is missing a meta.docs property.')
    return
  }

  if (!hasMetaDocsCategories(metaProperty)) {
    context.report(
      metaProperty,
      'Rule is missing a meta.docs.categories property.'
    )
    return
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce correct use of `meta` property in core rules',
      categories: ['Internal']
    },

    schema: []
  },

  create(context) {
    let exportsNode

    return {
      AssignmentExpression(node) {
        if (
          node.left &&
          node.right &&
          node.left.type === 'MemberExpression' &&
          node.left.object.name === 'module' &&
          node.left.property.name === 'exports'
        ) {
          exportsNode = node.right
        }
      },

      'Program:exit'(programNode) {
        checkMetaValidity(context, exportsNode)
      }
    }
  }
}
