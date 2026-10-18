/**
 * @author Yosuke Ota
 * @fileoverview Rule to check for max length on a line of Vue file.
 */
import utils from '../utils/index.js'

const OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    code: {
      type: 'integer',
      minimum: 0
    },
    template: {
      type: 'integer',
      minimum: 0
    },
    comments: {
      type: 'integer',
      minimum: 0
    },
    tabWidth: {
      type: 'integer',
      minimum: 0
    },
    ignorePattern: {
      type: 'string'
    },
    ignoreComments: {
      type: 'boolean'
    },
    ignoreTrailingComments: {
      type: 'boolean'
    },
    ignoreUrls: {
      type: 'boolean'
    },
    ignoreStrings: {
      type: 'boolean'
    },
    ignoreTemplateLiterals: {
      type: 'boolean'
    },
    ignoreRegExpLiterals: {
      type: 'boolean'
    },
    ignoreHTMLAttributeValues: {
      type: 'boolean'
    },
    ignoreHTMLTextContents: {
      type: 'boolean'
    }
  },
  additionalProperties: false
}

const OPTIONS_OR_INTEGER_SCHEMA = {
  oneOf: [
    OPTIONS_SCHEMA,
    {
      type: 'integer',
      minimum: 0
    }
  ]
}

/**
 * Computes the length of a line that may contain tabs. The width of each
 * tab will be the number of spaces to the next tab stop, which are `tabWidth`
 * spaces apart.
 */
function computeLineLength(line: string, tabWidth: number): number {
  let extraCharacterCount = 0

  const re = /\t/gu
  let ret
  while ((ret = re.exec(line))) {
    const offset = ret.index
    const totalOffset = offset + extraCharacterCount
    const previousTabStopOffset = tabWidth ? totalOffset % tabWidth : 0
    const spaceCount = tabWidth - previousTabStopOffset
    extraCharacterCount += spaceCount - 1 // -1 for the replaced tab
  }

  return [...line].length + extraCharacterCount
}

/**
 * Tells if a given comment is trailing: it starts on the current line and
 * extends to or past the end of the current line. `lineNumber` is one-indexed.
 */
function isTrailingComment(
  line: string,
  lineNumber: number,
  comment: Token | null
): comment is Token {
  return Boolean(
    comment &&
    comment.loc.start.line === lineNumber &&
    lineNumber <= comment.loc.end.line &&
    (comment.loc.end.line > lineNumber ||
      comment.loc.end.column === line.length)
  )
}

/**
 * Tells if a comment encompasses the entire line. `lineNumber` is one-indexed.
 */
function isFullLineComment(
  line: string,
  lineNumber: number,
  comment: Token | null
): boolean {
  if (!comment) {
    return false
  }
  const start = comment.loc.start
  const end = comment.loc.end
  const isFirstTokenOnLine = !line.slice(0, comment.loc.start.column).trim()

  return (
    comment &&
    (start.line < lineNumber ||
      (start.line === lineNumber && isFirstTokenOnLine)) &&
    (end.line > lineNumber ||
      (end.line === lineNumber && end.column === line.length))
  )
}

/**
 * Gets the line after the comment and any remaining trailing whitespace is
 * stripped.
 */
function stripTrailingComment(line: string, comment: Token): string {
  // loc.column is zero-indexed
  return line.slice(0, comment.loc.start.column).replace(/\s+$/u, '')
}

/**
 * Group AST nodes by line number, both start and end.
 *
 * @private
 */
function groupByLineNumber(nodes: Token[]): { [key: number]: Token[] } {
  const grouped: { [key: number]: Token[] } = {}
  for (const node of nodes) {
    for (let i = node.loc.start.line; i <= node.loc.end.line; ++i) {
      if (!Array.isArray(grouped[i])) {
        grouped[i] = []
      }
      grouped[i].push(node)
    }
  }
  return grouped
}

export default {
  meta: {
    type: 'layout',

    docs: {
      description: 'enforce a maximum line length in `.vue` files',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/max-len.html',
      extensionSource: {
        url: 'https://eslint.org/docs/rules/max-len',
        name: 'ESLint core'
      }
    },

    schema: [
      OPTIONS_OR_INTEGER_SCHEMA,
      OPTIONS_OR_INTEGER_SCHEMA,
      OPTIONS_SCHEMA
    ],
    messages: {
      max: 'This line has a length of {{lineLength}}. Maximum allowed is {{maxLength}}.',
      maxComment:
        'This line has a comment length of {{lineLength}}. Maximum allowed is {{maxCommentLength}}.'
    }
  },
  create(context: RuleContext): RuleListener {
    /*
     * Inspired by https://tools.ietf.org/html/rfc3986#appendix-B, however:
     * - They're matching an entire string that we know is a URI
     * - We're matching part of a string where we think there *might* be a URL
     * - We're only concerned about URLs, as picking out any URI would cause
     *   too many false positives
     * - We don't care about matching the entire URL, any small segment is fine
     */
    const URL_REGEXP = /[^:/?#]:\/\/[^?#]/u

    const sourceCode = context.sourceCode
    const tokens: Token[] = []
    const comments: (HTMLComment | HTMLBogusComment | Comment)[] = []
    const htmlAttributeValues: VLiteral[] = []

    // The options object must be the last option specified…
    const options = Object.assign({}, context.options.at(-1))

    // …but max code length…
    if (typeof context.options[0] === 'number') {
      options.code = context.options[0]
    }

    // …and tabWidth can be optionally specified directly as integers.
    if (typeof context.options[1] === 'number') {
      options.tabWidth = context.options[1]
    }
    const scriptMaxLength: number =
      typeof options.code === 'number' ? options.code : 80
    const tabWidth: number =
      typeof options.tabWidth === 'number' ? options.tabWidth : 2 // default value of `vue/html-indent`
    const templateMaxLength: number =
      typeof options.template === 'number' ? options.template : scriptMaxLength
    const shouldIgnoreComments = Boolean(options.ignoreComments)
    const shouldIgnoreStrings = Boolean(options.ignoreStrings)
    const shouldIgnoreTemplateLiterals = Boolean(options.ignoreTemplateLiterals)
    const shouldIgnoreRegExpLiterals = Boolean(options.ignoreRegExpLiterals)
    const shouldIgnoreTrailingComments =
      Boolean(options.ignoreTrailingComments) || Boolean(options.ignoreComments)
    const shouldIgnoreUrls = Boolean(options.ignoreUrls)
    const shouldIgnoreHTMLAttributeValues = Boolean(
      options.ignoreHTMLAttributeValues
    )
    const shouldIgnoreHTMLTextContents = Boolean(options.ignoreHTMLTextContents)
    const maxCommentLength: number = options.comments
    let ignorePattern: RegExp = options.ignorePattern || null

    if (ignorePattern) {
      ignorePattern = new RegExp(ignorePattern, 'u')
    }

    /**
     * Retrieves an array containing all strings (" or ') in the source code.
     */
    function getAllStrings(): Token[] {
      return tokens.filter(
        (token) =>
          token.type === 'String' ||
          (token.type === 'JSXText' &&
            sourceCode.getNodeByRangeIndex(token.range[0] - 1).type ===
              'JSXAttribute')
      )
    }

    /**
     * Retrieves an array containing all template literals in the source code.
     */
    function getAllTemplateLiterals(): Token[] {
      return tokens.filter((token) => token.type === 'Template')
    }

    /**
     * Retrieves an array containing all RegExp literals in the source code.
     */
    function getAllRegExpLiterals(): Token[] {
      return tokens.filter((token) => token.type === 'RegularExpression')
    }

    /**
     * Retrieves an array containing all HTML texts in the source code.
     */
    function getAllHTMLTextContents(): Token[] {
      return tokens.filter((token) => token.type === 'HTMLText')
    }

    /**
     * Check the program for max length
     * @private
     */
    function checkProgramForMaxLength(node: Program): void {
      const programNode = node
      const templateBody = node.templateBody

      // setup tokens
      const scriptTokens = sourceCode.ast.tokens
      const scriptComments = sourceCode.getAllComments()

      if (templateBody && sourceCode.parserServices.getTemplateBodyTokenStore) {
        const tokenStore = sourceCode.parserServices.getTemplateBodyTokenStore()

        const templateTokens = tokenStore.getTokens(templateBody, {
          includeComments: true
        })

        if (templateBody.range[0] < programNode.range[0]) {
          tokens.push(...templateTokens, ...scriptTokens)
        } else {
          tokens.push(...scriptTokens, ...templateTokens)
        }
      } else {
        tokens.push(...scriptTokens)
      }

      if (
        shouldIgnoreComments ||
        maxCommentLength ||
        shouldIgnoreTrailingComments
      ) {
        // list of comments to ignore
        if (templateBody) {
          if (templateBody.range[0] < programNode.range[0]) {
            comments.push(...templateBody.comments, ...scriptComments)
          } else {
            comments.push(...scriptComments, ...templateBody.comments)
          }
        } else {
          comments.push(...scriptComments)
        }
      }

      let scriptLinesRange: Range | undefined
      if (scriptTokens.length > 0) {
        scriptLinesRange =
          scriptComments.length > 0
            ? [
                Math.min(
                  scriptTokens[0].loc.start.line,
                  scriptComments[0].loc.start.line
                ),
                Math.max(
                  scriptTokens.at(-1)!.loc.end.line,
                  scriptComments.at(-1)!.loc.end.line
                )
              ]
            : [
                scriptTokens[0].loc.start.line,
                scriptTokens.at(-1)!.loc.end.line
              ]
      } else if (scriptComments.length > 0) {
        scriptLinesRange = [
          scriptComments[0].loc.start.line,
          scriptComments.at(-1)!.loc.end.line
        ]
      }
      const templateLinesRange = templateBody && [
        templateBody.loc.start.line,
        templateBody.loc.end.line
      ]

      // split (honors line-ending)
      const lines = sourceCode.lines

      const strings = getAllStrings()
      const stringsByLine = groupByLineNumber(strings)

      const templateLiterals = getAllTemplateLiterals()
      const templateLiteralsByLine = groupByLineNumber(templateLiterals)

      const regExpLiterals = getAllRegExpLiterals()
      const regExpLiteralsByLine = groupByLineNumber(regExpLiterals)

      const htmlAttributeValuesByLine = groupByLineNumber(htmlAttributeValues)

      const htmlTextContents = getAllHTMLTextContents()
      const htmlTextContentsByLine = groupByLineNumber(htmlTextContents)

      const commentsByLine = groupByLineNumber(comments)

      for (const [i, line] of lines.entries()) {
        // i is zero-indexed, line numbers are one-indexed
        const lineNumber = i + 1

        const inScript =
          scriptLinesRange &&
          scriptLinesRange[0] <= lineNumber &&
          lineNumber <= scriptLinesRange[1]
        const inTemplate =
          templateLinesRange &&
          templateLinesRange[0] <= lineNumber &&
          lineNumber <= templateLinesRange[1]
        // check if line is inside a script or template and not ignored
        if (
          (!inScript && !inTemplate) ||
          (shouldIgnoreStrings && stringsByLine[lineNumber]) ||
          (shouldIgnoreTemplateLiterals &&
            templateLiteralsByLine[lineNumber]) ||
          (shouldIgnoreRegExpLiterals && regExpLiteralsByLine[lineNumber]) ||
          (shouldIgnoreHTMLAttributeValues &&
            htmlAttributeValuesByLine[lineNumber]) ||
          (shouldIgnoreHTMLTextContents && htmlTextContentsByLine[lineNumber])
        ) {
          continue
        }

        /*
         * if we're checking comment length; we need to know whether this
         * line is a comment
         */
        let isCommentLine = false
        let textToMeasure

        /*
         * comments to check.
         */
        if (commentsByLine[lineNumber]) {
          const commentList = [...commentsByLine[lineNumber]]

          let comment = commentList.pop() || null

          if (isFullLineComment(line, lineNumber, comment)) {
            isCommentLine = true
            textToMeasure = line
          } else if (
            shouldIgnoreTrailingComments &&
            isTrailingComment(line, lineNumber, comment)
          ) {
            textToMeasure = stripTrailingComment(line, comment)

            // ignore multiple trailing comments in the same line
            comment = commentList.pop() || null

            while (isTrailingComment(textToMeasure, lineNumber, comment)) {
              textToMeasure = stripTrailingComment(textToMeasure, comment)
            }
          } else {
            textToMeasure = line
          }
        } else {
          textToMeasure = line
        }

        if (
          (ignorePattern && ignorePattern.test(textToMeasure)) ||
          (shouldIgnoreUrls && URL_REGEXP.test(textToMeasure)) ||
          (isCommentLine && shouldIgnoreComments)
        ) {
          // ignore this line
          continue
        }

        const maxLength = Math.max(
          inScript ? scriptMaxLength : 0,
          inTemplate ? templateMaxLength : 0
        )
        const lineLength = computeLineLength(textToMeasure, tabWidth)
        const commentLengthApplies = isCommentLine && maxCommentLength

        if (commentLengthApplies) {
          if (lineLength > maxCommentLength) {
            context.report({
              node,
              loc: {
                start: { line: lineNumber, column: maxCommentLength },
                end: { line: lineNumber, column: lineLength }
              },
              messageId: 'maxComment',
              data: {
                lineLength,
                maxCommentLength
              }
            })
          }
        } else if (lineLength > maxLength) {
          context.report({
            node,
            loc: {
              start: { line: lineNumber, column: maxLength },
              end: { line: lineNumber, column: lineLength }
            },
            messageId: 'max',
            data: {
              lineLength,
              maxLength
            }
          })
        }
      }
    }

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(context, {
        'VAttribute[directive=false] > VLiteral'(node: VLiteral) {
          htmlAttributeValues.push(node)
        }
      }),
      {
        'Program:exit'(node) {
          checkProgramForMaxLength(node)
        }
      }
    )
  }
}
