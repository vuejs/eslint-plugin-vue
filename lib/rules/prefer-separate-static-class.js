/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { defineTemplateBodyVisitor, getStringLiteralValue } = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * @param {ASTNode} node
 * @returns {node is Literal | TemplateLiteral}
 */
function isStringLiteral(node) {
  return (
    (node.type === 'Literal' && typeof node.value === 'string') ||
    (node.type === 'TemplateLiteral' && node.expressions.length === 0)
  )
}

/**
 * @param {VReference[]} references
 * @param {Identifier} identifier
 * @returns {boolean}
 */
function referencesInclude(references, identifier) {
  return references.some((reference) => reference.id === identifier)
}

/**
 * @param {Expression | VForExpression | VOnExpression | VSlotScopeExpression | VFilterSequenceExpression} expressionNode
 * @param {VReference[]} references
 * @returns {(Literal | TemplateLiteral | Identifier)[]}
 */
function findStaticClasses(expressionNode, references) {
  if (isStringLiteral(expressionNode)) {
    return [expressionNode]
  }

  if (expressionNode.type === 'ArrayExpression') {
    return expressionNode.elements.flatMap((element) => {
      if (element === null || element.type === 'SpreadElement') {
        return []
      }
      return findStaticClasses(element, references)
    })
  }

  if (expressionNode.type === 'ObjectExpression') {
    return expressionNode.properties.flatMap((property) => {
      if (
        property.type === 'Property' &&
        property.value.type === 'Literal' &&
        property.value.value === true &&
        (isStringLiteral(property.key) ||
          (property.key.type === 'Identifier' &&
            !referencesInclude(references, property.key)))
      ) {
        return [property.key]
      }
      return []
    })
  }

  return []
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require static class names in template to be in a separate `class` attribute',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-separate-static-class.html'
    },
    fixable: null,
    schema: [],
    messages: {
      preferSeparateStaticClass:
        'Static class "{{className}}" should be in a static `class` attribute.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return defineTemplateBodyVisitor(context, {
      /** @param {VDirectiveKey} directiveKeyNode */
      "VAttribute[directive=true] > VDirectiveKey[name.name='bind'][argument.name='class']"(
        directiveKeyNode
      ) {
        const attributeNode = directiveKeyNode.parent
        if (!attributeNode.value || !attributeNode.value.expression) {
          return
        }

        const staticClassNameNodes = findStaticClasses(
          attributeNode.value.expression,
          attributeNode.value.references
        )

        for (const staticClassNameNode of staticClassNameNodes) {
          const className =
            staticClassNameNode.type === 'Identifier'
              ? staticClassNameNode.name
              : getStringLiteralValue(staticClassNameNode, true)

          if (className === null) {
            continue
          }

          context.report({
            node: staticClassNameNode,
            messageId: 'preferSeparateStaticClass',
            data: { className }
          })
        }
      }
    })
  }
}
