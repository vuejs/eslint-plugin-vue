/**
 * @fileoverview disallow duplication of class names in class attributes
 * @author Yizack Rangel
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

interface GluedEdges {
  start: boolean
  end: boolean
}

interface JoinedClassName {
  name: string
  node: ASTNode
  isUnconditional: boolean
}

interface ClassNode {
  node: Literal | TemplateElement
  isUnconditional: boolean
  parentExpr?: Expression
  /** Set for a string part of a concatenation or template literal */
  joined?: {
    gluedEdges: GluedEdges
    /** Class names starting in this part, each once per joined expression */
    classNames: JoinedClassName[]
    /** Duplicate class names of the joined expression, set on its last part */
    duplicates: string[]
  }
}

type JoinedItem =
  | { type: 'part'; index: number }
  | { type: 'expression' }
  | { type: 'conditional'; branches: JoinedSequence[] }

interface JoinedSequence {
  items: JoinedItem[]
  /** The branches of conditional expressions containing the sequence */
  path: string
  /** The sequence and index of the conditional expression of a branch */
  parent?: { sequence: JoinedSequence; index: number }
}

function isConcatenation(
  node: ASTNode | null | undefined
): node is BinaryExpression {
  return node?.type === 'BinaryExpression' && node.operator === '+'
}

/**
 * Split the joined string of a concatenation or template literal into class
 * names, so that `'ta' + 'g tag'` has the class names `tag` and `tag`. A class
 * name joined with an expression, e.g. `text-` in `` `text-${color}` ``, is
 * ambiguous and skipped. The strings in a branch of a conditional expression
 * are joined with the strings around the conditional expression only when
 * each branch is separated from them, e.g. `c` in `(a ? 'b ' : '') + 'c c'`.
 */
function* extractJoinedClassNodes(
  node: VDirective,
  expression: BinaryExpression | TemplateLiteral,
  isUnconditional: boolean
): IterableIterator<ClassNode> {
  const parts: { node: Literal | TemplateElement; text: string }[] = []
  const expressions: { node: Expression; isUnconditional: boolean }[] = []
  const sequences: JoinedSequence[] = []
  let conditionalCount = 0

  function collect(
    target: Expression | PrivateIdentifier,
    sequence: JoinedSequence
  ) {
    if (isConcatenation(target)) {
      collect(target.left, sequence)
      collect(target.right, sequence)
    } else if (target.type === 'TemplateLiteral') {
      for (const [i, quasi] of target.quasis.entries()) {
        parts.push({ node: quasi, text: quasi.value.cooked ?? quasi.value.raw })
        sequence.items.push({ type: 'part', index: parts.length - 1 })
        if (i < target.expressions.length) {
          collect(target.expressions[i], sequence)
        }
      }
    } else if (target.type === 'Literal' && typeof target.value === 'string') {
      parts.push({ node: target, text: target.value })
      sequence.items.push({ type: 'part', index: parts.length - 1 })
    } else if (
      target.type === 'ConditionalExpression' ||
      target.type === 'LogicalExpression'
    ) {
      // the value of a logical expression is one of its operands
      const id = conditionalCount++
      const parent = { sequence, index: sequence.items.length }
      const branchNodes =
        target.type === 'ConditionalExpression'
          ? [target.consequent, target.alternate]
          : [target.left, target.right]
      const branches = branchNodes.map((branch, i) => {
        const branchSequence: JoinedSequence = {
          items: [],
          path: `${sequence.path}${id}:${i}/`,
          parent
        }
        sequences.push(branchSequence)
        collect(branch, branchSequence)
        return branchSequence
      })
      sequence.items.push({ type: 'conditional', branches })
    } else if (target.type !== 'PrivateIdentifier') {
      expressions.push({ node: target, isUnconditional: !sequence.path })
      sequence.items.push({ type: 'expression' })
    }
  }

  const root: JoinedSequence = { items: [], path: '' }
  sequences.push(root)
  collect(expression, root)

  /**
   * How a string meets the string next to it: `separated` by whitespace, `glued`
   * to it, or `empty`, so that it depends on the string after it.
   */
  type Edge = 'separated' | 'glued' | 'empty'

  /** Get the edge of the item at its start or end */
  function getItemEdge(item: JoinedItem, isAtEnd: boolean): Edge {
    if (item.type === 'expression') return 'glued'
    if (item.type === 'part') {
      const text = parts[item.index].text
      if (!text) return 'empty'
      return /[ \t\n\f\r]/.test(isAtEnd ? text.at(-1)! : text[0])
        ? 'separated'
        : 'glued'
    }
    const edges = item.branches.map((branch) =>
      getSequenceEdge(branch, isAtEnd)
    )
    if (edges.includes('glued')) return 'glued'
    return edges.every((edge) => edge === 'separated') ? 'separated' : 'empty'
  }

  const sequenceEdges = new Map<JoinedSequence, [Edge, Edge]>()
  function getSequenceEdge(sequence: JoinedSequence, isAtEnd: boolean): Edge {
    let edges = sequenceEdges.get(sequence)
    if (!edges) {
      const { items } = sequence
      const findEdge = (indexes: number[], isEnd: boolean) => {
        for (const i of indexes) {
          const edge = getItemEdge(items[i], isEnd)
          if (edge !== 'empty') return edge
        }
        return 'empty'
      }
      const indexes = items.map((_, i) => i)
      edges = [findEdge(indexes, false), findEdge(indexes.reverse(), true)]
      sequenceEdges.set(sequence, edges)
    }
    return edges[isAtEnd ? 1 : 0]
  }

  // whether the string before or after each item is glued to it, where the
  // items of a branch continue the items around its conditional expression
  const gluedBefore = new Map<JoinedSequence, boolean[]>()
  const gluedAfter = new Map<JoinedSequence, boolean[]>()
  for (const sequence of sequences) {
    const { items, parent } = sequence
    const before: boolean[] = []
    let isGlued = parent
      ? gluedBefore.get(parent.sequence)![parent.index]
      : false
    for (const item of items) {
      before.push(isGlued)
      const edge = getItemEdge(item, true)
      if (edge !== 'empty') isGlued = edge === 'glued'
    }
    const after: boolean[] = []
    isGlued = parent ? gluedAfter.get(parent.sequence)![parent.index] : false
    for (let i = items.length - 1; i >= 0; i--) {
      after[i] = isGlued
      const edge = getItemEdge(items[i], false)
      if (edge !== 'empty') isGlued = edge === 'glued'
    }
    gluedBefore.set(sequence, before)
    gluedAfter.set(sequence, after)
  }

  const gluedEdges = parts.map(() => ({ start: false, end: false }))
  const occurrences: {
    name: string
    path: string
    part: number
    node: ASTNode
  }[] = []
  for (const sequence of sequences) {
    // join the consecutive parts of the sequence
    let start = 0
    while (start < sequence.items.length) {
      if (sequence.items[start].type !== 'part') {
        start++
        continue
      }
      let end = start
      while (sequence.items[end + 1]?.type === 'part') end++
      const indexes = sequence.items
        .slice(start, end + 1)
        .map((item) => (item as { index: number }).index)
      const texts = indexes.map((i) => parts[i].text)
      const joined = texts.join('')
      const isGluedBefore = gluedBefore.get(sequence)![start]
      const isGluedAfter = gluedAfter.get(sequence)![end]
      const isGlued = (offset: number) =>
        /^[^ \t\n\f\r]{2}$/.test(
          (isGluedBefore && offset === 0 ? 'x' : (joined[offset - 1] ?? ' ')) +
            (isGluedAfter && offset === joined.length
              ? 'x'
              : (joined[offset] ?? ' '))
        )
      const offsets: number[] = []
      let offset = 0
      for (const [k, i] of indexes.entries()) {
        offsets.push(offset)
        gluedEdges[i].start = isGlued(offset)
        offset += texts[k].length
        gluedEdges[i].end = isGlued(offset)
      }
      for (const match of joined.matchAll(/[^ \t\n\f\r]+/g)) {
        const matchEnd = match.index + match[0].length
        if (
          (isGluedBefore && match.index === 0) ||
          (isGluedAfter && matchEnd === joined.length)
        ) {
          continue
        }
        let first = 0
        while (offsets[first] + texts[first].length <= match.index) first++
        let last = first
        while (last + 1 < texts.length && offsets[last + 1] < matchEnd) last++
        // the innermost expression that contains all parts of the class name
        let reportNode = parts[indexes[first]].node.parent
        while (reportNode.range[1] < parts[indexes[last]].node.range[1]) {
          reportNode = reportNode.parent!
        }
        occurrences.push({
          name: match[0],
          path: sequence.path,
          part: indexes[first],
          node: reportNode
        })
      }
      start = end + 1
    }
  }
  occurrences.sort((a, b) => a.part - b.part)

  // a class name in a branch is a duplicate of one outside any branch or in
  // the same branch, but not of one in another branch
  const classNames = parts.map((): JoinedClassName[] => [])
  const duplicates: string[] = []
  const occurrencesByName = new Map<string, typeof occurrences>()
  for (const occurrence of occurrences) {
    const same = occurrencesByName.get(occurrence.name)
    if (same) same.push(occurrence)
    else occurrencesByName.set(occurrence.name, [occurrence])
  }
  for (const [name, same] of occurrencesByName) {
    const hasUnconditional = same.some(({ path }) => !path)
    classNames[same[0].part].push({
      name,
      node: same[0].node,
      isUnconditional: isUnconditional && hasUnconditional
    })
    const paths = same.map(({ path }) => path)
    if (
      (hasUnconditional && same.length > 1) ||
      paths.some((path, i) => paths.indexOf(path) !== i)
    ) {
      duplicates.push(name)
    }
  }

  for (const [i, part] of parts.entries()) {
    yield {
      node: part.node,
      isUnconditional,
      parentExpr: expression,
      joined: {
        gluedEdges: gluedEdges[i],
        classNames: classNames[i],
        duplicates: i === parts.length - 1 ? duplicates : []
      }
    }
  }
  for (const target of expressions) {
    yield* extractClassNodes(
      node,
      target.node,
      isUnconditional && target.isUnconditional,
      expression
    )
  }
}

function* extractClassNodes(
  node: VDirective,
  expression?: Expression,
  isUnconditional = true,
  parentExpr?: Expression
): IterableIterator<ClassNode> {
  const nodeExpression = expression ?? node.value?.expression
  if (!nodeExpression) return

  switch (nodeExpression.type) {
    case 'Literal': {
      yield { node: nodeExpression, isUnconditional, parentExpr }
      break
    }
    case 'ObjectExpression': {
      for (const prop of nodeExpression.properties) {
        if (
          prop.type === 'Property' &&
          prop.key?.type === 'Literal' &&
          typeof prop.key.value === 'string'
        ) {
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
      yield* extractJoinedClassNodes(node, nodeExpression, isUnconditional)
      break
    }
    case 'BinaryExpression': {
      if (nodeExpression.operator === '+') {
        yield* extractJoinedClassNodes(node, nodeExpression, isUnconditional)
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

function getClassNames(classList: string, gluedEdges?: GluedEdges): string[] {
  // class names are separated by ASCII whitespace only, like in `classList`
  const classNames = classList.split(/[ \t\n\f\r]+/)
  if (gluedEdges?.start) classNames.shift()
  if (gluedEdges?.end) classNames.pop()
  return classNames.filter(Boolean)
}

/**
 * Append the given token to the last non-whitespace item in `kept`.
 */
function appendToLastClassName(kept: string[], token: string) {
  for (let j = kept.length - 1; j >= 0; j--) {
    if (!/^[ \t\n\f\r]+$/.test(kept[j])) {
      const parts = kept[j].split(/([ \t\n\f\r]+)/)
      kept[j] = parts[0] + token
      return
    }
  }
}

/**
 * Remove duplicate class names from `raw`, the class names string including
 * its delimiters: the quotes, or `` ` `` or `}` before and `` ` `` or `${`
 * after a part of a template literal.
 */
function removeDuplicateClassNames(
  raw: string,
  closingLength: number,
  gluedEdges?: GluedEdges
): string {
  const opening = raw[0]
  const closing = raw.slice(-closingLength)
  const inner = raw.slice(1, -closingLength)
  const tokens = inner.split(/([ \t\n\f\r]+)/)

  const kept: string[] = []
  const used = new Set()

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (!token) continue

    const isWhitespace = /^[ \t\n\f\r]+$/.test(token)
    const isGlued =
      (i === 0 && gluedEdges?.start) ||
      (i === tokens.length - 1 && gluedEdges?.end)

    if (isWhitespace) {
      // add whitespace to the last kept item or as leading whitespace
      if (kept.length > 0) {
        kept[kept.length - 1] += token
      } else {
        kept.push(token)
      }
    } else if (!isGlued && used.has(token)) {
      // handle duplicate class name
      const nextToken = tokens[i + 1]
      const hasNextWhitespace =
        kept.length > 0 &&
        i + 1 < tokens.length &&
        /^[ \t\n\f\r]+$/.test(nextToken)

      if (hasNextWhitespace) {
        // update spaces of the last non-whitespace item
        appendToLastClassName(kept, nextToken)
        i++ // skip the whitespace token
      }
    } else {
      kept.push(token)
      if (!isGlued) used.add(token)
    }
  }

  // remove trailing whitespace from the last item if it's not purely whitespace
  // unless the original string ended with whitespace
  const hasTrailingSpace = /[ \t\n\f\r]$/.test(inner)
  const lastItem = kept.at(-1)
  if (lastItem && !hasTrailingSpace) {
    const isLastWhitespace = /^[ \t\n\f\r]+$/.test(lastItem)
    if (!isLastWhitespace) {
      const parts = lastItem.split(/([ \t\n\f\r]+)/)
      kept[kept.length - 1] = parts[0]
    }
  }

  return opening + kept.join('') + closing
}

function getClassList(node: VLiteral | Literal | TemplateElement | null) {
  if (!node?.value) return null
  return typeof node.value === 'object' && 'raw' in node.value
    ? (node.value.cooked ?? node.value.raw)
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
      node: VLiteral | Literal | TemplateElement | null,
      gluedEdges?: GluedEdges
    ) {
      if (!node?.value) return

      const classList = getClassList(node)
      if (typeof classList !== 'string') return

      const classNames = getClassNames(classList, gluedEdges)
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

      const raw = context.sourceCode.text.slice(node.range[0], node.range[1])
      // a part of a template literal followed by an expression ends with `${`
      const closingLength =
        node.type === 'TemplateElement' && !node.tail ? 2 : 1
      // the class names are fixed in the source text, which must not have escapes
      // (line breaks are normalized to `\n` in the value)
      const canFix =
        raw.slice(1, -closingLength).replaceAll(/\r\n?/g, '\n') === classList

      context.report({
        node,
        messageId: 'duplicateClassNames',
        data: {
          names: [...duplicates].map((name) => `'${name}'`).join(', '),
          plural: duplicates.size > 1 ? 's' : ''
        },
        fix: canFix
          ? (fixer) =>
              fixer.replaceText(
                node,
                removeDuplicateClassNames(raw, closingLength, gluedEdges)
              )
          : null
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
          reportNode: ASTNode,
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
              node: reportNode,
              isUnconditional,
              parentExpr
            })
          }
          // track unconditional duplicates separately for reporting
          if (isUnconditional) {
            if (seen.has(className)) {
              duplicatesInExpression.add(className)
            } else {
              seen.set(className, reportNode)
            }
          }
        }

        const classNodes = extractClassNodes(node)
        for (const {
          node: reportNode,
          isUnconditional,
          parentExpr,
          joined
        } of classNodes) {
          // report fixable duplicates and collect reported class names
          const reportedClasses = reportDuplicateClasses(
            reportNode,
            joined?.gluedEdges
          )
          if (reportedClasses) {
            for (const reportedClass of reportedClasses)
              reported.add(reportedClass)
          }

          // collect all class names and check for cross nodes duplicates
          let classNameNodes = joined?.classNames
          if (!classNameNodes) {
            const classList = getClassList(reportNode)
            if (typeof classList !== 'string') continue
            classNameNodes = getClassNames(classList).map((name) => ({
              name,
              node: reportNode.parent,
              isUnconditional
            }))
          }
          const classNames = classNameNodes.map(({ name }) => name)

          for (const classNameNode of classNameNodes) {
            collectClassName(
              classNameNode.name,
              classNameNode.node,
              classNameNode.isUnconditional,
              parentExpr
            )
          }
          const joinedDuplicates = joined?.duplicates ?? []
          for (const className of joinedDuplicates) {
            if (!reported.has(className)) duplicatesInExpression.add(className)
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
