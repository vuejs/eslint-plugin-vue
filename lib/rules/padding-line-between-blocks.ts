/**
 * @fileoverview Require or disallow padding lines between blocks
 * @author Yosuke Ota
 */
import utils from '../utils/index.js'

/**
 * Split the source code into multiple lines based on the line delimiters.
 */
function splitLines(text: string): string[] {
  return text.split(/\r\n|[\r\n\u{2028}\u{2029}]/gu)
}

/**
 * Check and report blocks for `never` configuration.
 * This autofix removes blank lines between the given 2 blocks.
 * @private
 */
function verifyForNever(
  context: RuleContext,
  prevBlock: VElement,
  nextBlock: VElement,
  betweenTokens: Token[]
): void {
  if (prevBlock.loc.end.line === nextBlock.loc.start.line) {
    // same line
    return
  }
  const tokenOrNodes = [...betweenTokens, nextBlock]
  let prev: ASTNode | Token = prevBlock
  const paddingLines: [ASTNode | Token, ASTNode | Token][] = []
  for (const tokenOrNode of tokenOrNodes) {
    const numOfLineBreaks = tokenOrNode.loc.start.line - prev.loc.end.line
    if (numOfLineBreaks > 1) {
      paddingLines.push([prev, tokenOrNode])
    }
    prev = tokenOrNode
  }
  if (paddingLines.length === 0) {
    return
  }

  context.report({
    node: nextBlock,
    messageId: 'never',
    *fix(fixer) {
      for (const [prevToken, nextToken] of paddingLines) {
        const start = prevToken.range[1]
        const end = nextToken.range[0]
        const paddingText = context.sourceCode.text.slice(start, end)
        const lastSpaces = splitLines(paddingText).pop()
        yield fixer.replaceTextRange([start, end], `\n${lastSpaces}`)
      }
    }
  })
}

/**
 * Check and report blocks for `always` configuration.
 * This autofix inserts a blank line between the given 2 blocks.
 * @private
 */
function verifyForAlways(
  context: RuleContext,
  prevBlock: VElement,
  nextBlock: VElement,
  betweenTokens: Token[]
): void {
  const tokenOrNodes = [...betweenTokens, nextBlock]
  let prev: ASTNode | Token = prevBlock
  let linebreak: ASTNode | Token | undefined
  for (const tokenOrNode of tokenOrNodes) {
    const numOfLineBreaks = tokenOrNode.loc.start.line - prev.loc.end.line
    if (numOfLineBreaks > 1) {
      // Already padded.
      return
    }
    if (!linebreak && numOfLineBreaks > 0) {
      linebreak = prev
    }
    prev = tokenOrNode
  }

  context.report({
    node: nextBlock,
    messageId: 'always',
    fix(fixer) {
      return linebreak
        ? fixer.insertTextAfter(linebreak, '\n')
        : fixer.insertTextAfter(prevBlock, '\n\n')
    }
  })
}

/**
 * Types of blank lines.
 * `never` and `always` are defined.
 * Those have `verify` method to check and report statements.
 * @private
 */
const PaddingTypes = {
  never: { verify: verifyForNever },
  always: { verify: verifyForAlways }
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'require or disallow padding lines between blocks',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/padding-line-between-blocks.html'
    },
    // eslint-disable-next-line eslint-plugin/require-meta-fixable -- fixer is not recognized
    fixable: 'whitespace',
    schema: [
      {
        enum: Object.keys(PaddingTypes)
      }
    ],
    messages: {
      never: 'Unexpected blank line before this block.',
      always: 'Expected blank line before this block.'
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    if (!sourceCode.parserServices.getDocumentFragment) {
      return {}
    }
    const df = sourceCode.parserServices.getDocumentFragment()
    if (!df) {
      return {}
    }
    const documentFragment = df

    const option: 'always' | 'never' = context.options[0] || 'always'
    const paddingType = PaddingTypes[option]

    let tokens: Token[]
    function getTopLevelHTMLElements(): VElement[] {
      return documentFragment.children.filter(utils.isVElement)
    }

    function getTokenAndCommentsBetween(prev: VElement, next: VElement) {
      // When there is no <template>, tokenStore.getTokensBetween cannot be used.
      if (!tokens) {
        tokens = [
          ...documentFragment.tokens.filter(
            (token) => token.type !== 'HTMLWhitespace'
          ),
          ...documentFragment.comments
        ].sort((a, b) => a.range[0] - b.range[0])
      }

      let token = tokens.shift()

      const results = []
      while (token) {
        if (prev.range[1] <= token.range[0]) {
          if (next.range[0] <= token.range[0]) {
            tokens.unshift(token)
            break
          }
          results.push(token)
        }
        token = tokens.shift()
      }

      return results
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {},
      {
        Program(node: Program) {
          if (utils.hasInvalidEOF(node)) {
            return
          }
          const elements = [...getTopLevelHTMLElements()]

          let prev = elements.shift()
          for (const element of elements) {
            if (!prev) {
              return
            }
            const betweenTokens = getTokenAndCommentsBetween(prev, element)
            paddingType.verify(context, prev, element, betweenTokens)
            prev = element
          }
        }
      }
    )
  }
}
