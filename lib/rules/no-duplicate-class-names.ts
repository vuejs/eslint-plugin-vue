/**
 * @fileoverview disallow duplication of class names in class attributes
 * @author Yizack Rangel
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

function* extractClassNodes(
  node: VDirective,
  expression?: Expression,
  isUnconditional = true,
  parentExpr?: Expression
): IterableIterator<{
  node: Literal | TemplateLiteral | TemplateElement
  isUnconditional: boolean
  parentExpr?: Expression
}> {
  const nodeExpression = expression ?? node.value?.expression
  if (!nodeExpression) return

  switch (nodeExpression.type) {
    case 'Literal': {
      yield { node: nodeExpression, isUnconditional, parentExpr }
      break
    }
    case 'ObjectExpression': {
      for (const prop of nodeExpression.properties) {
        if (prop.type === 'Property' && utils.isStringLiteral(prop.key)) {
          yield {
            node: prop.key,
            isUnconditional: false,
            parentExpr: nodeExpression
          }
        }
      }
      break
    }
    case 'ArrayExpression': {
      for (const element of nodeExpression.elements) {
        if (!element || element.type === 'SpreadElement') continue
        yield* extractClassNodes(node, element, isUnconditional, nodeExpression)
      }
      break
    }
    case 'ConditionalExpression': {
      yield* extractClassNodes(
        node,
        nodeExpression.consequent,
        false,
        nodeExpression
      )
      yield* extractClassNodes(
        node,
        nodeExpression.alternate,
        false,
        nodeExpression
      )
      break
    }
    case 'TemplateLiteral': {
      for (const quasi of nodeExpression.quasis) {
        yield { node: quasi, isUnconditional, parentExpr: nodeExpression }
      }
      for (const expr of nodeExpression.expressions) {
        yield* extractClassNodes(node, expr, isUnconditional, nodeExpression)
      }
      break
    }
    case 'BinaryExpression': {
      if (nodeExpression.operator === '+') {
        yield* extractClassNodes(
          node,
          nodeExpression.left,
          isUnconditional,
          nodeExpression
        )
        yield* extractClassNodes(
          node,
          nodeExpression.right,
          isUnconditional,
          nodeExpression
        )
      }
      break
    }
    case 'LogicalExpression': {
      yield* extractClassNodes(
        node,
        nodeExpression.left,
        isUnconditional,
        nodeExpression
      )
      yield* extractClassNodes(
        node,
        nodeExpression.right,
        false,
        nodeExpression
      )
      break
    }
  }
}

function getClassNames(classList: string): string[] {
  return classList.split(/\s+/).filter(Boolean)
}

/**
 * Append the given token to the last non-whitespace item in `kept`.
 */
function appendToLastClassName(kept: string[], token: string) {
  for (let j = kept.length - 1; j >= 0; j--) {
    if (!/^\s+$/.test(kept[j])) {
      const parts = kept[j].split(/(\s+)/)
      kept[j] = parts[0] + token
      return
    }
  }
}

/**
 * Remove duplicate class names from `raw`, the class names string including its quotes.
 */
function removeDuplicateClassNames(raw: string): string {
  const quote = raw[0]
  const inner = raw.slice(1, -1)
  const tokens = inner.split(/(\s+)/)

  const kept: string[] = []
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
        appendToLastClassName(kept, nextToken)
        i++ // skip the whitespace token
      }
    } else {
      kept.push(token)
      used.add(token)
    }
  }

  // remove trailing whitespace from the last item if it's not purely whitespace
  // unless the original string ended with whitespace
  const hasTrailingSpace = /\s$/.test(inner)
  const lastItem = kept.at(-1)
  if (lastItem && !hasTrailingSpace) {
    const isLastWhitespace = /^\s+$/.test(lastItem)
    if (!isLastWhitespace) {
      const parts = lastItem.split(/(\s+)/)
      kept[kept.length - 1] = parts[0]
    }
  }

  return quote + kept.join('') + quote
}

function getRawValue(
  node: VLiteral | Literal | TemplateLiteral | TemplateElement | null
) {
  if (!node) return null
  if (node.type === 'TemplateLiteral') {
    return node.quasis[0].value.raw
  }
  if (!node.value) return null
  return typeof node.value === 'object' && 'raw' in node.value
    ? node.value.raw
    : node.value
}

export default {
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
  create: (context: RuleContext) => {
    function reportDuplicateClasses(
      node: VLiteral | Literal | TemplateLiteral | TemplateElement | null
    ) {
      if (!node) return
      const classList = getRawValue(node)
      if (typeof classList !== 'string') return

      const classNames = getClassNames(classList)
      if (classNames.length <= 1) return

      const seen = new Set()
      const duplicates = new Set<string>()

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
          const sourceCode = context.sourceCode
          const raw = sourceCode.text.slice(node.range[0], node.range[1])
          return fixer.replaceText(node, removeDuplicateClassNames(raw))
        }
      })

      return duplicates
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=false][key.name='class'][value.type='VLiteral']"(
        node: VAttribute
      ) {
        reportDuplicateClasses(node.value)
      },
      "VAttribute[directive=true][key.argument.name='class'][value.type='VExpressionContainer']"(
        node: VDirective
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
        const staticClasses: Set<string> | null =
          staticAttr && staticAttr.value && staticAttr.value.type === 'VLiteral'
            ? new Set(getClassNames(String(staticAttr.value.value)))
            : null

        const reported = new Set<string>()

        const duplicatesInExpression = new Set<string>()

        const seen = new Map<string, ASTNode>()

        const collected = new Map<
          string,
          { node: ASTNode; isUnconditional: boolean; parentExpr?: Expression }
        >()

        function collectClassName(
          className: string,
          reportNode: Literal | TemplateLiteral | TemplateElement,
          isUnconditional: boolean,
          parentExpr?: Expression
        ) {
          // skip if already reported by reportDuplicateClasses
          if (reported.has(className)) {
            return
          }
          const existing = collected.get(className)
          if (existing) {
            // only add duplicate if at least one is unconditional, or share the same combining parent
            const isSameParent =
              parentExpr &&
              existing.parentExpr === parentExpr &&
              (parentExpr.type === 'BinaryExpression' ||
                parentExpr.type === 'TemplateLiteral')

            if (isUnconditional || isSameParent || existing.isUnconditional) {
              duplicatesInExpression.add(className)
            }
          } else {
            collected.set(className, {
              node: reportNode.parent,
              isUnconditional,
              parentExpr
            })
          }
          // track unconditional duplicates separately for reporting
          if (isUnconditional) {
            if (seen.has(className)) {
              duplicatesInExpression.add(className)
            } else {
              seen.set(className, reportNode.parent)
            }
          }
        }

        const classNodes = extractClassNodes(node)
        for (const {
          node: reportNode,
          isUnconditional,
          parentExpr
        } of classNodes) {
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
            collectClassName(className, reportNode, isUnconditional, parentExpr)
          }

          // report cross attribute duplicates
          if (!staticClasses) {
            continue
          }
          const intersection = classNames.filter((n) => staticClasses.has(n))
          if (parent && intersection.length > 0) {
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
