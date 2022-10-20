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
    return
  }

  const metaDocs = getPropertyFromObject('docs', metaProperty.value)
  if (!metaDocs) {
    return
  }

  const categories = getPropertyFromObject('categories', metaDocs.value)
  if (!categories) {
    context.report({
      node: metaDocs,
      message: 'Rule is missing a meta.docs.categories property.',
      fix(fixer) {
        const category = getPropertyFromObject('category', metaDocs.value)
        if (!category) {
          return null
        }
        const fixes = [fixer.replaceText(category.key, 'categories')]
        if (
          category.value &&
          category.value.type === 'Literal' &&
          typeof category.value.value === 'string'
        ) {
          // fixes.push(fixer.insertTextBefore(category.value, '['), fixer.insertTextAfter(category.value, ']'))

          // for vue3 migration
          if (category.value.value !== 'base') {
            fixes.push(
              fixer.insertTextBefore(
                category.value,
                `['vue3-${category.value.value}', `
              )
            )
          } else {
            fixes.push(fixer.insertTextBefore(category.value, '['))
          }
          fixes.push(fixer.insertTextAfter(category.value, ']'))
        }
        return fixes
      }
    })
    return
  }

  if (
    categories.value &&
    categories.value.type !== 'ArrayExpression' &&
    !(categories.value.type === 'Literal' && categories.value.value == null) &&
    !(
      categories.value.type === 'Identifier' &&
      categories.value.name === 'undefined'
    )
  ) {
    context.report(categories.value, 'meta.docs.categories must be an array.')
  }
}

module.exports = {
  meta: {
    docs: {
      description: 'enforce correct use of `meta` property in core rules',
      categories: ['Internal']
    },
    fixable: 'code',
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
