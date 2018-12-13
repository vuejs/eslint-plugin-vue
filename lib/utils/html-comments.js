const utils = require('./')

const COMMENT_DIRECTIVE = /^\s*eslint-(?:en|dis)able/
const IE_CONDITIONAL_IF = /^\[if\s+/
const IE_CONDITIONAL_ENDIF = /\[endif\]$/

function isCommentDirective (comment) {
  return COMMENT_DIRECTIVE.test(comment.value)
}

function isIEConditionalComment (comment) {
  return IE_CONDITIONAL_IF.test(comment.value) || IE_CONDITIONAL_ENDIF.test(comment.value)
}

/**
 * Define HTML comment tokenizer
 *
 * @param {SourceCode} sourceCode The source code instance.
 * @param {object} config The config.
 * @returns {object} HTML comment tokenizer.
 */
function defineTokenizer (sourceCode, config) {
  config = config || {}

  const exceptions = config.exceptions || []

  /**
   * Get a open decoration string from comment contents.
   * @param {string} contents comment contents
   * @returns {string} decoration string
   */
  function getOpenDecoration (contents) {
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
   * @param {string} contents comment contents
   * @returns {string} decoration string
   */
  function getCloseDecoration (contents) {
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

  /**
   * Tokenize HTMLComment.
   * @param {ASTNode} node a comment token
   * @returns {object} the result of HTMLComment tokens.
   */
  return function tokenizeHTMLComment (node) {
    if (node.type !== 'HTMLComment') {
      // Is not HTMLComment
      return null
    }

    const htmlCommentText = sourceCode.getText(node)

    if (!htmlCommentText.startsWith('<!--') || !htmlCommentText.endsWith('-->')) {
      // Is not normal HTML Comment
      // e.g. Error Code: "abrupt-closing-of-empty-comment", "incorrectly-closed-comment"
      return null
    }

    let valueText = htmlCommentText.slice(4, -3)
    const openDecorationText = getOpenDecoration(valueText)
    valueText = valueText.slice(openDecorationText.length)
    const firstCharIndex = valueText.search(/\S/)
    const beforeSpace = firstCharIndex >= 0 ? valueText.slice(0, firstCharIndex) : valueText
    valueText = valueText.slice(beforeSpace.length)

    const closeDecorationText = getCloseDecoration(valueText)
    if (closeDecorationText) {
      valueText = valueText.slice(0, -closeDecorationText.length)
    }
    const lastCharIndex = valueText.search(/\S\s*$/)
    const afterSpace = lastCharIndex >= 0 ? valueText.slice(lastCharIndex + 1) : valueText
    if (afterSpace) {
      valueText = valueText.slice(0, -afterSpace.length)
    }

    let tokenIndex = node.range[0]
    const createToken = (type, value) => {
      const range = [tokenIndex, tokenIndex + value.length]
      tokenIndex = range[1]
      let loc
      return {
        type,
        value,
        range,
        get loc () {
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
    const open = createToken('HTMLCommentOpen', '<!--')
    const openDecoration = openDecorationText ? createToken('HTMLCommentOpenDecoration', openDecorationText) : null
    tokenIndex += beforeSpace.length
    const value = valueText ? createToken('HTMLCommentValue', valueText) : null
    tokenIndex += afterSpace.length
    const closeDecoration = closeDecorationText ? createToken('HTMLCommentCloseDecoration', closeDecorationText) : null
    const close = createToken('HTMLCommentClose', '-->')

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
 *
 * @param {RuleContext} context The rule context.
 * @param {object} config The config.
 * @param {function} visitHTMLComment The HTML comment visitor.
 * @returns {object} HTML comment visitor.
 */
function defineVisitor (context, config, visitHTMLComment, visitorOption) {
  visitorOption = visitorOption || {}
  return {
    Program (node) {
      if (utils.hasInvalidEOF(node)) {
        return
      }
      if (!node.templateBody) {
        return
      }
      const tokenizer = defineTokenizer(context.getSourceCode(), config)

      for (const comment of node.templateBody.comments) {
        if (comment.type !== 'HTMLComment') {
          continue
        }
        if (!visitorOption.includeDirectives &&
          isCommentDirective(comment)) {
          // ignore directives
          continue
        }
        if (isIEConditionalComment(comment)) {
          // ignore IE conditional
          continue
        }

        const tokens = tokenizer(comment)
        if (tokens) {
          visitHTMLComment(tokens)
        }
      }
    }
  }
}

module.exports = {
  defineTokenizer,
  defineVisitor,
  isCommentDirective,
  isIEConditionalComment
}
