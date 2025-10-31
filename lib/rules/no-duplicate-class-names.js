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
 * @param {boolean} [unconditional=true] whether the expression is unconditional
 * @return {IterableIterator<{ node: Literal | TemplateElement, unconditional: boolean }>}
 */
function* extractClassNodes(node, expression, unconditional = true) {
  const nodeExpression = expression ?? node.value?.expression
  if (!nodeExpression) return

  switch (nodeExpression.type) {
    case 'Literal': {
      yield { node: nodeExpression, unconditional }
      break
    }
    case 'ObjectExpression': {
      for (const prop of nodeExpression.properties) {
        if (
          prop.type === 'Property' &&
          prop.key?.type === 'Literal' &&
          typeof prop.key.value === 'string'
        ) {
          yield { node: prop.key, unconditional: false }
        }
      }
      break
    }
    case 'ArrayExpression': {
      for (const element of nodeExpression.elements) {
        if (!element || element.type === 'SpreadElement') continue
        yield* extractClassNodes(node, element, unconditional)
      }
      break
    }
    case 'ConditionalExpression': {
      yield* extractClassNodes(node, nodeExpression.consequent, false)
      yield* extractClassNodes(node, nodeExpression.alternate, false)
      break
    }
    case 'TemplateLiteral': {
      for (const quasi of nodeExpression.quasis) {
        yield { node: quasi, unconditional }
      }
      for (const expr of nodeExpression.expressions) {
        yield* extractClassNodes(node, expr, unconditional)
      }
      break
    }
    case 'BinaryExpression': {
      if (nodeExpression.operator === '+') {
        yield* extractClassNodes(node, nodeExpression.left, unconditional)
        yield* extractClassNodes(node, nodeExpression.right, unconditional)
      }
      break
    }
    case 'LogicalExpression': {
      yield* extractClassNodes(node, nodeExpression.left, unconditional)
      yield* extractClassNodes(node, nodeExpression.right, unconditional)
      break
    }
  }
}

/**
 * @param {string} classList
 * @returns {string[]}
 */
function getClassNames(classList) {
  return classList.split(/\s+/).filter(Boolean)
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

/** @param {VLiteral | Literal | TemplateElement | null} node */
function getRawValue(node) {
  if (!node?.value) return null
  return typeof node.value === 'object' && 'raw' in node.value
    ? node.value.raw
    : node.value
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
      duplicateClassNames: 'Duplicate class name{{plural}} {{names}}.'
    }
  },
  /** @param {RuleContext} context */
  create: (context) => {
    /**
     * @param {VLiteral | Literal | TemplateElement | null} node
     */
    function reportDuplicateClasses(node) {
      if (!node?.value) return

      const classList = getRawValue(node)
      if (typeof classList !== 'string') return

      const classNames = getClassNames(classList)
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
        messageId: 'duplicateClassNames',
        data: {
          names: [...duplicates].map((name) => `'${name}'`).join(', '),
          plural: duplicates.size > 1 ? 's' : ''
        },
        fix: (fixer) => {
          const sourceCode = context.getSourceCode()
          const raw = sourceCode.text.slice(node.range[0], node.range[1])
          return fixer.replaceText(node, removeDuplicateClassNames(raw))
        }
      })

      return duplicates
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
        const parent = node.parent
        const attrs = parent.attributes || []
        const staticAttr = attrs.find(
          (attr) =>
            attr.key &&
            attr.key.name === 'class' &&
            attr.value &&
            attr.value.type === 'VLiteral'
        )

        // get static classes
        /** @type {Set<string> | null} */
        let staticClasses = null
        if (
          staticAttr &&
          staticAttr.value &&
          staticAttr.value.type === 'VLiteral'
        ) {
          staticClasses = new Set(getClassNames(String(staticAttr.value.value)))
        }

        /** @type {Set<string>} */
        const reported = new Set()

        /** @type {Set<string>} */
        const duplicatesInExpression = new Set()

        /** @type {Map<string, ASTNode>} */
        const seen = new Map()

        /** @type {Map<string, {node: ASTNode, unconditional: boolean}>} */
        const collected = new Map()

        const classNodes = extractClassNodes(node)
        for (const { node: reportNode, unconditional } of classNodes) {
          // report fixable duplicates and collect reported class names
          const reportedClasses = reportDuplicateClasses(reportNode)
          if (reportedClasses) {
            for (const reportedClass of reportedClasses)
              reported.add(reportedClass)
          }

          // collect all class names and check for cross nodes duplicates
          const classList = getRawValue(reportNode)
          if (typeof classList !== 'string') continue
          const classNames = getClassNames(classList)

          for (const className of classNames) {
            // skip if already reported by reportDuplicateClasses
            if (reported.has(className)) continue
            const existing = collected.get(className)
            if (existing) {
              // only add duplicate if at least one is unconditional
              if (existing.unconditional || unconditional) {
                duplicatesInExpression.add(className)
              }
            } else {
              collected.set(className, {
                node: reportNode.parent,
                unconditional
              })
            }
            // track unconditional duplicates separately for reporting
            if (unconditional) {
              if (seen.has(className)) {
                duplicatesInExpression.add(className)
              } else {
                seen.set(className, reportNode.parent)
              }
            }
          }

          // report cross attribute duplicates
          if (staticClasses) {
            const intersection = classNames.filter((n) => staticClasses.has(n))
            if (intersection.length > 0 && parent) {
              context.report({
                node: parent,
                messageId: 'duplicateClassNames',
                data: {
                  names: intersection.map((name) => `'${name}'`).join(', '),
                  plural: intersection.length > 1 ? 's' : ''
                }
              })
            }
          }
        }

        // report cross node duplicates
        for (const className of duplicatesInExpression) {
          const reportNode =
            seen.get(className) || collected.get(className)?.node
          if (reportNode) {
            context.report({
              node: reportNode,
              messageId: 'duplicateClassNames',
              data: {
                names: `'${className}'`,
                plural: ''
              }
            })
          }
        }
      }
    })
  }
}
