/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

function isStaticClassTemplateElement(
  templateElement: TemplateElement,
  index: number,
  templateLiteral: TemplateLiteral
): boolean {
  const value = templateElement.value.cooked
  return (
    value.trim() !== '' &&
    (index === 0 || /^\s/u.test(value)) &&
    (index === templateLiteral.expressions.length || /\s$/u.test(value))
  )
}

function findStaticClasses(
  expressionNode: ASTNode | TemplateLiteral
): (Literal | TemplateLiteral | TemplateElement | Identifier)[] {
  if (
    expressionNode.type === 'TemplateLiteral' &&
    expressionNode.expressions.length > 0
  ) {
    return expressionNode.quasis.filter((templateElement, index) =>
      isStaticClassTemplateElement(templateElement, index, expressionNode)
    )
  }

  if (utils.isStringLiteral(expressionNode)) {
    return [expressionNode]
  }

  switch (expressionNode.type) {
    case 'ArrayExpression': {
      return expressionNode.elements.flatMap((element) =>
        element === null || element.type === 'SpreadElement'
          ? []
          : findStaticClasses(element)
      )
    }

    case 'ObjectExpression': {
      return expressionNode.properties.flatMap((property) =>
        property.type === 'Property' &&
        property.value.type === 'Literal' &&
        property.value.value === true &&
        (utils.isStringLiteral(property.key) ||
          (property.key.type === 'Identifier' && !property.computed))
          ? [property.key]
          : []
      )
    }
  }

  return []
}

function getStaticClassName(
  staticClassNameNode: Literal | TemplateLiteral | TemplateElement | Identifier
): string | null {
  if (staticClassNameNode.type === 'Identifier') {
    return staticClassNameNode.name
  }
  if (staticClassNameNode.type === 'TemplateElement') {
    const value = staticClassNameNode.value.cooked
    return value === null ? null : value.trim().replaceAll(/\s+/gu, ' ')
  }
  return utils.getStringLiteralValue(staticClassNameNode, true)
}

function isStaticClassAttribute(
  attributeNode: VAttribute | VDirective
): attributeNode is VAttribute & { value: VLiteral } {
  return (
    !attributeNode.directive &&
    attributeNode.key.name === 'class' &&
    attributeNode.value !== null
  )
}

/**
 * Removes the node together with the comma before or after the node.
 */
function* removeNodeWithComma(
  fixer: RuleFixer,
  tokenStore: ParserServices.TokenStore,
  node: ASTNode
) {
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

export default {
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
  create(context: RuleContext) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true] > VDirectiveKey[name.name='bind'][argument.name='class']"(
        directiveKeyNode: VDirectiveKey
      ) {
        // `.attr` and `.prop` set the raw `class` attribute or DOM property,
        // so the value is not a normalized class list
        if (
          directiveKeyNode.modifiers.some(
            (modifier) => modifier.name === 'attr' || modifier.name === 'prop'
          )
        ) {
          return
        }

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
                if (utils.isStringLiteral(expressionNode)) {
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
                  listNode.type !== 'ArrayExpression' &&
                  listNode.type !== 'ObjectExpression'
                ) {
                  return
                }

                const elements =
                  listNode.type === 'ObjectExpression'
                    ? listNode.properties
                    : listNode.elements

                if (listNode === expressionNode && elements.length === 1) {
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
