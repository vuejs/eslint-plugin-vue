/**
 * @fileoverview disallow duplication of class names in class attributes
 * @author Yizack Rangel
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @param {VDirective} node
 * @param {Expression} [expression]
 * @return {IterableIterator<{
 *  node: Literal | VAttribute | VDirective,
 *  target?: VLiteral | Literal
 * }>}
 */
function* extractDuplicateNode(node, expression) {
  const nodeExpression = expression ?? node.value?.expression
  if (!nodeExpression) return

  switch (nodeExpression.type) {
    case 'Literal': {
      yield { node, target: nodeExpression }
      break
    }
    case 'ObjectExpression': {
      for (const prop of nodeExpression.properties) {
        if (
          prop.type === 'Property' &&
          prop.key &&
          prop.key.type === 'Literal' &&
          typeof prop.key.value === 'string' &&
          prop.key.value.includes(' ')
        ) {
          yield { node: prop.key }
        }
      }
      break
    }
    case 'ArrayExpression': {
      for (const element of nodeExpression.elements) {
        if (!element || element.type === 'SpreadElement') continue

        yield* extractDuplicateNode(node, element)
      }
      break
    }
    case 'ConditionalExpression': {
      yield* extractDuplicateNode(node, nodeExpression.consequent)
      yield* extractDuplicateNode(node, nodeExpression.alternate)
      break
    }
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: 'https://eslint.vuejs.org/rules/no-duplicate-class-names.html',
      description: 'disallow duplication of class names in class attributes',
      categories: undefined
    },
    fixable: 'code',
    schema: [],
    messages: {
      duplicateClassName: "Duplicate class name '{{name}}'."
    }
  },
  /** @param {RuleContext} context */
  create: (context) => {
    /**
     * @param {VAttribute | VDirective | Literal} node
     * @param {VLiteral | Literal | null} [target]
     */
    function reportDuplicateClasses(node, target) {
      const fixTarget = target ?? node
      if (!fixTarget || !fixTarget.value) return

      const classList = fixTarget.value
      if (typeof classList !== 'string') return

      const classNames = classList.split(/\s+/).filter(Boolean)
      if (classNames.length <= 1) return

      const seen = new Set()
      /** @type {string[]} */
      const duplicates = []

      for (const className of classNames) {
        if (seen.has(className)) {
          if (!duplicates.includes(className)) {
            duplicates.push(className)
          }
        } else {
          seen.add(className)
        }
      }

      if (duplicates.length === 0) return

      context.report({
        node,
        messageId: 'duplicateClassName',
        data: { name: duplicates.join(', ') },
        fix: (fixer) => {
          const uniqueClasses = []
          const seenInUnique = new Set()

          for (const className of classNames) {
            if (!seenInUnique.has(className)) {
              uniqueClasses.push(className)
              seenInUnique.add(className)
            }
          }

          const unique = uniqueClasses.join(' ')
          const sourceCode = context.getSourceCode()
          const raw = sourceCode.text.slice(
            fixTarget.range[0],
            fixTarget.range[1]
          )
          const quote = raw[0]
          return fixer.replaceText(fixTarget, `${quote}${unique}${quote}`)
        }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VAttribute} node */
      "VAttribute[directive=false][key.name='class'][value.type='VLiteral']"(
        node
      ) {
        reportDuplicateClasses(node, node.value)
      },
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.argument.name='class'][value.type='VExpressionContainer']"(
        node
      ) {
        for (const { node: reportNode, target } of extractDuplicateNode(node)) {
          reportDuplicateClasses(reportNode, target)
        }
      }
    })
  }
}
