/**
 * @fileoverview enforce valid `.sync` modifier on `v-bind` directives
 * @author Yosuke Ota
 */
import utils from '../utils/index.js'

/**
 * Check whether the given node is valid or not.
 */
function isValidElement(node: VElement): boolean {
  return utils.isCustomComponent(node)
}

/**
 * Check whether the given node is a MemberExpression containing an optional chaining.
 * e.g.
 * - `a?.b`
 * - `a?.b.c`
 */
function isOptionalChainingMemberExpression(node: ASTNode): boolean {
  return (
    node.type === 'ChainExpression' &&
    node.expression.type === 'MemberExpression'
  )
}

/**
 * Check whether the given node can be LHS (left-hand side).
 */
function isLhs(node: ASTNode): boolean {
  return node.type === 'Identifier' || node.type === 'MemberExpression'
}

/**
 * Check whether the given node is a MemberExpression of a possibly null object.
 * e.g.
 * - `(a?.b).c`
 * - `(null).foo`
 */
function isMaybeNullObjectMemberExpression(node: ASTNode): boolean {
  if (node.type !== 'MemberExpression') {
    return false
  }
  switch (node.object.type) {
    case 'ChainExpression': {
      // `(a?.b).c`
      return true
    }
    case 'Literal': {
      // `(null).foo`
      return node.object.value === null && !node.object.bigint
    }
    case 'MemberExpression': {
      return isMaybeNullObjectMemberExpression(node.object)
    }
    default: {
      return false
    }
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `.sync` modifier on `v-bind` directives',
      categories: ['vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-bind-sync.html'
    },
    fixable: null,
    deprecated: true,
    schema: [],
    messages: {
      unexpectedInvalidElement:
        "'.sync' modifiers aren't supported on <{{name}}> non Vue-components.",
      unexpectedOptionalChaining:
        "Optional chaining cannot appear in 'v-bind' with '.sync' modifiers.",
      unexpectedNonLhsExpression:
        "'.sync' modifiers require the attribute value which is valid as LHS.",
      unexpectedNullObject:
        "'.sync' modifier has potential null object property access.",
      unexpectedUpdateIterationVariable:
        "'.sync' modifiers cannot update the iteration variable '{{varName}}' itself."
    }
  },
  create(context: RuleContext) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='bind']"(node: VDirective) {
        if (!node.key.modifiers.map((mod) => mod.name).includes('sync')) {
          return
        }
        const element = node.parent.parent
        const name = element.name

        if (!isValidElement(element)) {
          context.report({
            node,
            messageId: 'unexpectedInvalidElement',
            data: { name }
          })
        }

        if (!node.value) {
          return
        }

        const expression = node.value.expression
        if (!expression) {
          // Parsing error
          return
        }
        if (isOptionalChainingMemberExpression(expression)) {
          context.report({
            node: expression,
            messageId: 'unexpectedOptionalChaining'
          })
        } else if (!isLhs(expression)) {
          context.report({
            node: expression,
            messageId: 'unexpectedNonLhsExpression'
          })
        } else if (isMaybeNullObjectMemberExpression(expression)) {
          context.report({
            node: expression,
            messageId: 'unexpectedNullObject'
          })
        }

        for (const reference of node.value.references) {
          const id = reference.id
          if (id.parent.type !== 'VExpressionContainer') {
            continue
          }
          const variable = reference.variable
          if (variable) {
            context.report({
              node: expression,
              messageId: 'unexpectedUpdateIterationVariable',
              data: { varName: id.name }
            })
          }
        }
      }
    })
  }
}
