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
 * @param {Set<string>} classes
 * @param {*} node
 * @param {RuleContext} context
 * @param {Set<string>} forbiddenClasses
 */
const reportForbiddenClasses = (classes, node, context, forbiddenClasses) => {
  classes.forEach((className) => {
    if (forbiddenClasses.has(className)) {
      context.report({
        node,
        loc: node.value.loc,
        messageId: 'forbiddenClass',
        data: {
          class: className
        }
      })
    }
  })
}

/**
 * Recursively flatten a binary Expression into a string
 * @param {BinaryExpression | Expression} left
 * @param {BinaryExpression | Expression} right
 * @returns {string}
 */
const flattenBinaryExpression = (left, right) => {
  const result = []
  if (left) {
    if (left.type === 'Literal') {
      result.push(left.value)
    } else if (
      left.type === 'BinaryExpression' &&
      left.left.type !== 'PrivateIdentifier'
    ) {
      result.push(flattenBinaryExpression(left.left, left.right))
    }
  }

  if (right) {
    if (right.type === 'Literal') {
      result.push(right.value)
    } else if (
      right.type === 'BinaryExpression' &&
      right.left.type !== 'PrivateIdentifier'
    ) {
      result.push(flattenBinaryExpression(right.left, right.right))
    }
  }

  return result.join(' ')
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
      // <Element class="forbidden" />
      /**
       * @param {VAttribute & { value: VLiteral } } node
       */
      'VAttribute[directive=false][key.name="class"]'(node) {
        const classes = new Set(node.value.value.split(/\s+/))
        reportForbiddenClasses(classes, node, context, forbiddenClasses)
      },

      // <Element :class="{forbidden: someBoolean}" />
      /**
       * @param {VAttribute & { value: { expression: ObjectExpression } } } node
       */
      'VAttribute[directive=true][key.name.name="bind"][key.argument.name="class"][value.expression.type="ObjectExpression"]'(
        node
      ) {
        const classes = node.value.expression.properties
          .filter(
            (property) =>
              property.type === 'Property' &&
              (property.key.type === 'Literal' ||
                property.key.type === 'Identifier')
          )
          .reduce((acc, property) => {
            // Ugly early return to make TS happy
            if (
              property.type !== 'Property' ||
              (property.key.type !== 'Literal' &&
                property.key.type !== 'Identifier')
            )
              return acc
            let value = ''
            if (property.key.type === 'Literal') {
              value = (property.key.value || '').toString()
            } else {
              value = property.key.name
            }
            const values = value.split(/\s+/)
            values.forEach((/** @type {string} */ className) => {
              acc.add(className)
            })
            return acc
          }, new Set())
        reportForbiddenClasses(classes, node, context, forbiddenClasses)
      },

      // <Element :class="`forbidden ${someVar}`" />
      /**
       * @param {VAttribute & { value: { expression: TemplateLiteral } } } node
       */
      'VAttribute[directive=true][key.argument.name="class"][value.expression.type="TemplateLiteral"]'(
        node
      ) {
        const strings = node.value.expression.quasis.reduce(
          (acc, templateElement) => {
            const classNames = templateElement.value.raw.split(/\s+/)
            classNames.forEach((className) => {
              acc.add(className)
            })
            return acc
          },
          new Set()
        )
        reportForbiddenClasses(strings, node, context, forbiddenClasses)
      },

      // <Element :class="'forbidden'" />
      /**
       * @param {VAttribute & { value: { expression: Literal } } } node
       */
      'VAttribute[directive=true][key.argument.name="class"][value.expression.type="Literal"]'(
        node
      ) {
        if (!node.value.expression.value) return
        const classNames = new Set(
          node.value.expression.value.toString().split(/\s+/)
        )
        reportForbiddenClasses(classNames, node, context, forbiddenClasses)
      },

      // <Element :class="'forbidden' + ' otherClass'" />
      /**
       * @param {VAttribute & { value: { expression: BinaryExpression } } } node
       */
      'VAttribute[directive=true][key.argument.name="class"][value.expression.type="BinaryExpression"]'(
        node
      ) {
        if (node.value.expression.left.type === 'PrivateIdentifier') return
        const classNames = new Set(
          flattenBinaryExpression(
            node.value.expression.left,
            node.value.expression.right
          ).split(/\s+/)
        )
        reportForbiddenClasses(classNames, node, context, forbiddenClasses)
      }
    })
  }
}
