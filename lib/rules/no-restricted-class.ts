/**
 * @fileoverview Forbid certain classes from being used
 * @author Tao Bojlen
 */
import utils from '../utils/index.js'
import { toRegExpGroupMatcher } from '../utils/regexp.ts'

const reportForbiddenClass = (
  className: string,
  node: any,
  context: RuleContext,
  isForbiddenClass: (name: string) => boolean
) => {
  if (isForbiddenClass(className)) {
    const loc = node.value ? node.value.loc : node.loc
    context.report({
      node,
      loc,
      messageId: 'forbiddenClass',
      data: {
        class: className
      }
    })
  }
}

function* extractClassNames(
  node: Expression,
  textOnly?: boolean
): IterableIterator<{ className: string; reportNode: ESNode }> {
  if (node.type === 'Literal') {
    yield* `${node.value}`
      .split(/\s+/)
      .map((className) => ({ className, reportNode: node }))
    return
  }
  if (node.type === 'TemplateLiteral') {
    for (const templateElement of node.quasis) {
      yield* templateElement.value.cooked
        .split(/\s+/)
        .map((className) => ({ className, reportNode: templateElement }))
    }
    for (const expr of node.expressions) {
      yield* extractClassNames(expr, true)
    }
    return
  }
  if (node.type === 'BinaryExpression') {
    if (node.operator !== '+') {
      return
    }
    yield* extractClassNames(node.left, true)
    yield* extractClassNames(node.right, true)
    return
  }
  if (textOnly) {
    return
  }
  if (node.type === 'ObjectExpression') {
    for (const prop of node.properties) {
      if (prop.type !== 'Property') {
        continue
      }
      const classNames = utils.getStaticPropertyName(prop)
      if (!classNames) {
        continue
      }
      yield* classNames
        .split(/\s+/)
        .map((className) => ({ className, reportNode: prop.key }))
    }
    return
  }
  if (node.type === 'ArrayExpression') {
    for (const element of node.elements) {
      if (element == null) {
        continue
      }
      if (element.type === 'SpreadElement') {
        continue
      }
      yield* extractClassNames(element)
    }
    return
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow specific classes in Vue components',
      url: 'https://eslint.vuejs.org/rules/no-restricted-class.html',
      categories: undefined
    },
    fixable: null,
    schema: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    messages: {
      forbiddenClass: "'{{class}}' class is not allowed."
    }
  },

  create(context: RuleContext) {
    const { options = [] } = context
    const isForbiddenClass = toRegExpGroupMatcher(options)

    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute[directive=false][key.name="class"][value!=null]'(
        node: VAttribute & { value: VLiteral }
      ) {
        for (const className of node.value.value.split(/\s+/)) {
          reportForbiddenClass(className, node, context, isForbiddenClass)
        }
      },

      "VAttribute[directive=true][key.name.name='bind'][key.argument.name='class'] > VExpressionContainer.value"(
        node: VExpressionContainer
      ) {
        if (!node.expression) {
          return
        }

        for (const { className, reportNode } of extractClassNames(
          node.expression as Expression
        )) {
          reportForbiddenClass(className, reportNode, context, isForbiddenClass)
        }
      }
    })
  }
}
