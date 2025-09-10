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
 * @return {IterableIterator<{ node: Literal | TemplateElement }>}
 */
function* extractClassNodes(node, expression) {
  const nodeExpression = expression ?? node.value?.expression
  if (!nodeExpression) return

  switch (nodeExpression.type) {
    case 'Literal': {
      yield { node: nodeExpression }
      break
    }
    case 'ObjectExpression': {
      for (const prop of nodeExpression.properties) {
        if (
          prop.type === 'Property' &&
          prop.key?.type === 'Literal' &&
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

        yield* extractClassNodes(node, element)
      }
      break
    }
    case 'ConditionalExpression': {
      yield* extractClassNodes(node, nodeExpression.consequent)
      yield* extractClassNodes(node, nodeExpression.alternate)
      break
    }
    case 'TemplateLiteral': {
      for (const quasi of nodeExpression.quasis) {
        yield { node: quasi }
      }
      for (const expr of nodeExpression.expressions) {
        yield* extractClassNodes(node, expr)
      }
      break
    }
    case 'BinaryExpression': {
      if (nodeExpression.operator === '+') {
        yield* extractClassNodes(node, nodeExpression.left)
        yield* extractClassNodes(node, nodeExpression.right)
      }
      break
    }
  }
}

/**
 * @param {string} raw - raw class names string including quotes
 * @returns {string}
 */
function removeDuplicateClassNames(raw) {
  const quote = raw[0]
  const inner = raw.slice(1, -1)
  const tokens = inner.split(/(\s+)/)

  /** @type {string[]} */
  const kept = []
  const used = new Set()

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (!token) continue

    const isWhitespace = /^\s+$/.test(token)

    if (isWhitespace) {
      // add whitespace to the last kept item or as leading whitespace
      if (kept.length > 0) {
        kept[kept.length - 1] += token
      } else {
        kept.push(token)
      }
    } else if (used.has(token)) {
      // handle duplicate class name
      const nextToken = tokens[i + 1]
      const hasNextWhitespace =
        kept.length > 0 && i + 1 < tokens.length && /^\s+$/.test(nextToken)

      if (hasNextWhitespace) {
        // update spaces of the last non-whitespace item
        for (let j = kept.length - 1; j >= 0; j--) {
          const isNotWhitespace = !/^\s+$/.test(kept[j])
          if (isNotWhitespace) {
            const parts = kept[j].split(/(\s+)/)
            kept[j] = parts[0] + nextToken
            break
          }
        }
        i++ // skip the whitespace token
      }
    } else {
      kept.push(token)
      used.add(token)
    }
  }

  // remove trailing whitespace from the last item if it's not purely whitespace
  // unless the original string ended with whitespace
  const endsWithSpace = /\s$/.test(inner)
  if (kept.length > 0 && !endsWithSpace) {
    const lastItem = kept[kept.length - 1]
    const isLastWhitespace = /^\s+$/.test(lastItem)
    if (!isLastWhitespace) {
      const parts = lastItem.split(/(\s+)/)
      kept[kept.length - 1] = parts[0]
    }
  }

  return quote + kept.join('') + quote
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
     * @param {VLiteral | Literal | TemplateElement | null} node
     */
    function reportDuplicateClasses(node) {
      if (!node?.value) return

      const classList =
        typeof node.value === 'object' && 'raw' in node.value
          ? node.value.raw
          : node.value

      if (typeof classList !== 'string') return

      const classNames = classList.split(/\s+/).filter(Boolean)
      if (classNames.length <= 1) return

      const seen = new Set()
      const duplicates = new Set()

      for (const className of classNames) {
        if (seen.has(className)) {
          duplicates.add(className)
        } else {
          seen.add(className)
        }
      }

      if (duplicates.size === 0) return

      context.report({
        node,
        messageId: 'duplicateClassName',
        data: { name: [...duplicates].join(', ') },
        fix: (fixer) => {
          const sourceCode = context.getSourceCode()
          const raw = sourceCode.text.slice(node.range[0], node.range[1])
          return fixer.replaceText(node, removeDuplicateClassNames(raw))
        }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VAttribute} node */
      "VAttribute[directive=false][key.name='class'][value.type='VLiteral']"(
        node
      ) {
        reportDuplicateClasses(node.value)
      },
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.argument.name='class'][value.type='VExpressionContainer']"(
        node
      ) {
        for (const { node: reportNode } of extractClassNodes(node)) {
          reportDuplicateClasses(reportNode)
        }
      }
    })
  }
}
