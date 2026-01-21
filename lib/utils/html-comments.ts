import utils from './index.js'

export interface CommentParserConfig {
  exceptions?: string[]
}

export type HTMLCommentVisitor = (comment: ParsedHTMLComment) => void

export interface CommentVisitorOption {
  includeDirectives?: boolean
}

interface HTMLCommentOpen extends Token {
  type: 'HTMLCommentOpen'
}

interface HTMLCommentOpenDecoration extends Token {
  type: 'HTMLCommentOpenDecoration'
}

interface HTMLCommentValue extends Token {
  type: 'HTMLCommentValue'
}

interface HTMLCommentClose extends Token {
  type: 'HTMLCommentClose'
}

interface HTMLCommentCloseDecoration extends Token {
  type: 'HTMLCommentCloseDecoration'
}

export interface ParsedHTMLComment {
  open: HTMLCommentOpen
  openDecoration: HTMLCommentOpenDecoration | null
  value: HTMLCommentValue | null
  closeDecoration: HTMLCommentCloseDecoration | null
  close: HTMLCommentClose
}

const COMMENT_DIRECTIVE = /^\s*eslint-(?:en|dis)able/
const IE_CONDITIONAL_IF = /^\[if\s+/
const IE_CONDITIONAL_ENDIF = /\[endif]$/

const TYPE_HTML_COMMENT_OPEN = 'HTMLCommentOpen'
const TYPE_HTML_COMMENT_OPEN_DECORATION = 'HTMLCommentOpenDecoration'
const TYPE_HTML_COMMENT_VALUE = 'HTMLCommentValue'
const TYPE_HTML_COMMENT_CLOSE = 'HTMLCommentClose'
const TYPE_HTML_COMMENT_CLOSE_DECORATION = 'HTMLCommentCloseDecoration'

function isCommentDirective(comment: HTMLComment): boolean {
  return COMMENT_DIRECTIVE.test(comment.value)
}

function isIEConditionalComment(comment: HTMLComment): boolean {
  return (
    IE_CONDITIONAL_IF.test(comment.value) ||
    IE_CONDITIONAL_ENDIF.test(comment.value)
  )
}

/**
 * Define HTML comment parser
 */
function defineParser(
  sourceCode: SourceCode,
  config: CommentParserConfig | null
): (node: Token) => ParsedHTMLComment | null {
  config = config || {}

  const exceptions = config.exceptions || []

  /**
   * Get a open decoration string from comment contents.
   */
  function getOpenDecoration(contents: string): string {
    let decoration = ''
    for (const exception of exceptions) {
      const length = exception.length
      let index = 0
      while (contents.startsWith(exception, index)) {
        index += length
      }
      const exceptionLength = index
      if (decoration.length < exceptionLength) {
        decoration = contents.slice(0, exceptionLength)
      }
    }
    return decoration
  }

  /**
   * Get a close decoration string from comment contents.
   */
  function getCloseDecoration(contents: string): string {
    let decoration = ''
    for (const exception of exceptions) {
      const length = exception.length
      let index = contents.length
      while (contents.endsWith(exception, index)) {
        index -= length
      }
      const exceptionLength = contents.length - index
      if (decoration.length < exceptionLength) {
        decoration = contents.slice(index)
      }
    }
    return decoration
  }

  return function parseHTMLComment(node: Token): ParsedHTMLComment | null {
    if (node.type !== 'HTMLComment') {
      // Is not HTMLComment
      return null
    }

    const htmlCommentText = sourceCode.getText(node)

    if (
      !htmlCommentText.startsWith('<!--') ||
      !htmlCommentText.endsWith('-->')
    ) {
      // Is not normal HTML Comment
      // e.g. Error Code: "abrupt-closing-of-empty-comment", "incorrectly-closed-comment"
      return null
    }

    let valueText = htmlCommentText.slice(4, -3)
    const openDecorationText = getOpenDecoration(valueText)
    valueText = valueText.slice(openDecorationText.length)
    const firstCharIndex = valueText.search(/\S/)
    const beforeSpace =
      firstCharIndex >= 0 ? valueText.slice(0, firstCharIndex) : valueText
    valueText = valueText.slice(beforeSpace.length)

    const closeDecorationText = getCloseDecoration(valueText)
    if (closeDecorationText) {
      valueText = valueText.slice(0, -closeDecorationText.length)
    }
    const lastCharIndex = valueText.search(/\S\s*$/)
    const afterSpace =
      lastCharIndex >= 0 ? valueText.slice(lastCharIndex + 1) : valueText
    if (afterSpace) {
      valueText = valueText.slice(0, -afterSpace.length)
    }

    let tokenIndex = node.range[0]
    const createToken = <T extends string>(
      type: T,
      value: string
    ): Token & { type: T } => {
      const range: Range = [tokenIndex, tokenIndex + value.length]
      tokenIndex = range[1]
      let loc: SourceLocation | undefined
      return {
        type,
        value,
        range,
        get loc() {
          if (loc) {
            return loc
          }
          return (loc = {
            start: sourceCode.getLocFromIndex(range[0]),
            end: sourceCode.getLocFromIndex(range[1])
          })
        }
      }
    }

    const open: HTMLCommentOpen = createToken(TYPE_HTML_COMMENT_OPEN, '<!--')
    const openDecoration: HTMLCommentOpenDecoration | null = openDecorationText
      ? createToken(TYPE_HTML_COMMENT_OPEN_DECORATION, openDecorationText)
      : null
    tokenIndex += beforeSpace.length
    const value: HTMLCommentValue | null = valueText
      ? createToken(TYPE_HTML_COMMENT_VALUE, valueText)
      : null
    tokenIndex += afterSpace.length
    const closeDecoration: HTMLCommentCloseDecoration | null =
      closeDecorationText
        ? createToken(TYPE_HTML_COMMENT_CLOSE_DECORATION, closeDecorationText)
        : null
    const close: HTMLCommentClose = createToken(TYPE_HTML_COMMENT_CLOSE, '-->')

    return {
      /** HTML comment open (`<!--`) */
      open,
      /** decoration of the start of HTML comments. (`*****` when `<!--*****`) */
      openDecoration,
      /** value of HTML comment. whitespaces and other tokens are not included. */
      value,
      /** decoration of the end of HTML comments.  (`*****` when `*****-->`) */
      closeDecoration,
      /** HTML comment close (`-->`) */
      close
    }
  }
}

/**
 * Define HTML comment visitor
 */
export function defineVisitor(
  context: RuleContext,
  config: CommentParserConfig | null,
  visitHTMLComment: HTMLCommentVisitor,
  visitorOption?: CommentVisitorOption
): RuleListener {
  return {
    Program(node) {
      visitorOption = visitorOption || {}
      if (utils.hasInvalidEOF(node)) {
        return
      }
      if (!node.templateBody) {
        return
      }
      const parse = defineParser(context.sourceCode, config)

      for (const comment of node.templateBody.comments) {
        if (comment.type !== 'HTMLComment') {
          continue
        }
        if (!visitorOption.includeDirectives && isCommentDirective(comment)) {
          // ignore directives
          continue
        }
        if (isIEConditionalComment(comment)) {
          // ignore IE conditional
          continue
        }

        const tokens = parse(comment)
        if (tokens) {
          visitHTMLComment(tokens)
        }
      }
    }
  }
}
