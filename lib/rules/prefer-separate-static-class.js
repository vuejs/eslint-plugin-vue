/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
'use strict'

const {
  defineTemplateBodyVisitor,
  isStringLiteral,
  getStringLiteralValue
} = require('../utils')

/**
 * @param {TemplateElement} templateElement
 * @param {number} index
 * @param {TemplateLiteral} templateLiteral
 * @returns {boolean}
 */
function isStaticClassTemplateElement(templateElement, index, templateLiteral) {
  const value = templateElement.value.cooked
  if (!value || value.trim() === '') {
    return false
  }

  return (
    (index === 0 || /^\s/u.test(value)) &&
    (index === templateLiteral.expressions.length || /\s$/u.test(value))
  )
}

/**
 * @param {ASTNode | TemplateLiteral} expressionNode
 * @returns {(Literal | TemplateLiteral | TemplateElement | Identifier)[]}
 */
function findStaticClasses(expressionNode) {
  if (expressionNode.type === 'TemplateLiteral') {
    if (expressionNode.expressions.length === 0) {
      return [expressionNode]
    }
    return expressionNode.quasis.filter((templateElement, index) =>
      isStaticClassTemplateElement(templateElement, index, expressionNode)
    )
  }

  if (isStringLiteral(expressionNode)) {
    return [expressionNode]
  }

  if (expressionNode.type === 'ArrayExpression') {
    return expressionNode.elements.flatMap((element) => {
      if (element === null || element.type === 'SpreadElement') {
        return []
      }
      return findStaticClasses(element)
    })
  }

  if (expressionNode.type === 'ObjectExpression') {
    return expressionNode.properties.flatMap((property) => {
      if (
        property.type === 'Property' &&
        property.value.type === 'Literal' &&
        property.value.value === true
      ) {
        const key = /** @type {ASTNode | TemplateLiteral} */ (property.key)
        if (key.type === 'TemplateLiteral') {
          return findStaticClasses(key)
        }
        if (isStringLiteral(key)) {
          return [key]
        }
        if (key.type === 'Identifier' && !property.computed) {
          return [key]
        }
      }
      return []
    })
  }

  return []
}

/**
 * @param {Literal | TemplateLiteral | TemplateElement | Identifier} staticClassNameNode
 * @returns {string | null}
 */
function getStaticClassName(staticClassNameNode) {
  if (staticClassNameNode.type === 'Identifier') {
    return staticClassNameNode.name
  }
  if (staticClassNameNode.type === 'TemplateElement') {
    const value = staticClassNameNode.value.cooked
    return value === null ? null : value.trim().replaceAll(/\s+/gu, ' ')
  }
  return getStringLiteralValue(staticClassNameNode, true)
}

/**
 * @param {VAttribute | VDirective} attributeNode
 * @returns {attributeNode is VAttribute & { value: VLiteral }}
 */
function isStaticClassAttribute(attributeNode) {
  return (
    !attributeNode.directive &&
    attributeNode.key.name === 'class' &&
    attributeNode.value !== null
  )
}

/**
 * Removes the node together with the comma before or after the node.
 * @param {RuleFixer} fixer
 * @param {ParserServices.TokenStore} tokenStore
 * @param {ASTNode} node
 */
function* removeNodeWithComma(fixer, tokenStore, node) {
  const prevToken = tokenStore.getTokenBefore(node)
  if (prevToken.type === 'Punctuator' && prevToken.value === ',') {
    yield fixer.removeRange([prevToken.range[0], node.range[1]])
    return
  }

  const [nextToken, nextNextToken] = tokenStore.getTokensAfter(node, {
    count: 2
  })
  if (
    nextToken.type === 'Punctuator' &&
    nextToken.value === ',' &&
    (nextNextToken.type !== 'Punctuator' ||
      (nextNextToken.value !== ']' && nextNextToken.value !== '}'))
  ) {
    yield fixer.removeRange([node.range[0], nextNextToken.range[0]])
    return
  }

  yield fixer.remove(node)
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require static class names in template to be in a separate `class` attribute',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-separate-static-class.html'
    },
    fixable: 'code',
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

        const expressionNode = attributeNode.value.expression
        const staticClassNameNodes = findStaticClasses(expressionNode)

        for (const staticClassNameNode of staticClassNameNodes) {
          const className = getStaticClassName(staticClassNameNode)

          if (className === null) {
            continue
          }

          context.report({
            node: staticClassNameNode,
            messageId: 'preferSeparateStaticClass',
            data: { className },
            *fix(fixer) {
              if (staticClassNameNode.type === 'TemplateElement') {
                return
              }

              let isDynamicClassDirectiveRemoved = false

              yield* removeFromClassDirective()
              yield* addToClassAttribute()

              /**
               * Remove class from dynamic `:class` directive.
               */
              function* removeFromClassDirective() {
                if (isStringLiteral(expressionNode)) {
                  yield fixer.remove(attributeNode)
                  isDynamicClassDirectiveRemoved = true
                  return
                }

                const listElement =
                  staticClassNameNode.parent.type === 'Property'
                    ? staticClassNameNode.parent
                    : staticClassNameNode

                const listNode = listElement.parent
                if (
                  listNode.type === 'ArrayExpression' ||
                  listNode.type === 'ObjectExpression'
                ) {
                  const elements =
                    listNode.type === 'ObjectExpression'
                      ? listNode.properties
                      : listNode.elements

                  if (elements.length === 1 && listNode === expressionNode) {
                    yield fixer.remove(attributeNode)
                    isDynamicClassDirectiveRemoved = true
                    return
                  }

                  const sourceCode = context.sourceCode
                  const tokenStore =
                    sourceCode.parserServices.getTemplateBodyTokenStore()

                  if (elements.length === 1) {
                    yield* removeNodeWithComma(fixer, tokenStore, listNode)
                    return
                  }

                  yield* removeNodeWithComma(fixer, tokenStore, listElement)
                }
              }

              /**
               * Add class to static `class` attribute.
               */
              function* addToClassAttribute() {
                const existingStaticClassAttribute =
                  attributeNode.parent.attributes.find(isStaticClassAttribute)
                if (existingStaticClassAttribute) {
                  const literalNode = existingStaticClassAttribute.value
                  yield fixer.replaceText(
                    literalNode,
                    `"${literalNode.value} ${className}"`
                  )
                  return
                }

                // new static `class` attribute
                const separator = isDynamicClassDirectiveRemoved ? '' : ' '
                yield fixer.insertTextBefore(
                  attributeNode,
                  `class="${className}"${separator}`
                )
              }
            }
          })
        }
      }
    })
  }
}
