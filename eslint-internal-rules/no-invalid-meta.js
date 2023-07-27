/**
 * @fileoverview Internal rule to prevent missing or invalid meta property in core rules.
 * @author Vitor Balocco
 */

'use strict'

/**
 * Gets the property of the Object node passed in that has the name specified.
 *
 * @param {string} propertyName Name of the property to return.
 * @param {ASTNode} node The ObjectExpression node.
 * @returns {ASTNode} The Property node or null if not found.
 */
function getPropertyFromObject(propertyName, node) {
  if (node && node.type === 'ObjectExpression') {
    for (const property of node.properties) {
      if (property.type === 'Property' && property.key.name === propertyName) {
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
    context.report({
      node: exportsNode,
      messageId: 'missingMeta'
    })
    return
  }

  if (!hasMetaDocs(metaProperty)) {
    context.report({
      node: 'metaDocs',
      messageId: 'missingMetaDocs'
    })
    return
  }

  if (!hasMetaDocsCategories(metaProperty)) {
    context.report({
      node: metaProperty,
      messageId: 'missingMetaDocsCategories'
    })
    return
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce correct use of `meta` property in core rules',
      categories: ['Internal']
    },
    schema: [],
    messages: {
      missingMeta: 'Rule is missing a meta property.',
      missingMetaDocs: 'Rule is missing a meta.docs property.',
      missingMetaDocsCategories:
        'Rule is missing a meta.docs.categories property.'
    }
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
