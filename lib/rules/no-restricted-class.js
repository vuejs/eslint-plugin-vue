/**
 * @fileoverview Forbid certain classes from being used
 * @author Tao Bojlen
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
 * Report a forbidden class
 * @param {string} className
 * @param {*} node
 * @param {RuleContext} context
 * @param {Set<string>} forbiddenClasses
 */
const reportForbiddenClass = (className, node, context, forbiddenClasses) => {
  if (forbiddenClasses.has(className)) {
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

/**
 * @param {Expression} node
 * @param {boolean} [textOnly]
 * @returns {IterableIterator<{ className:string, reportNode: ESNode }>}
 */
function* extractClassNames(node, textOnly) {
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

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow specific classes in Vue components',
      url: 'https://eslint.vuejs.org/rules/no-restricted-class.html',
      categories: undefined
    },
    fixable: null,
    messages: {
      forbiddenClass: "'{{class}}' class is not allowed."
    },
    schema: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },

  /** @param {RuleContext} context */
  create(context) {
    const forbiddenClasses = new Set(context.options || [])

    return utils.defineTemplateBodyVisitor(context, {
      /**
       * @param {VAttribute & { value: VLiteral } } node
       */
      'VAttribute[directive=false][key.name="class"]'(node) {
        node.value.value
          .split(/\s+/)
          .forEach((className) =>
            reportForbiddenClass(className, node, context, forbiddenClasses)
          )
      },

      /** @param {VExpressionContainer} node */
      "VAttribute[directive=true][key.name.name='bind'][key.argument.name='class'] > VExpressionContainer.value"(
        node
      ) {
        if (!node.expression) {
          return
        }

        for (const { className, reportNode } of extractClassNames(
          /** @type {Expression} */ (node.expression)
        )) {
          reportForbiddenClass(className, reportNode, context, forbiddenClasses)
        }
      }
    })
  }
}
