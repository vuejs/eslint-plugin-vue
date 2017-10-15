/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const assert = require('assert')
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const KNOWN_NODES = new Set(['ArrayExpression', 'ArrayPattern', 'ArrowFunctionExpression', 'AssignmentExpression', 'AssignmentPattern', 'AwaitExpression', 'BinaryExpression', 'BlockStatement', 'BreakStatement', 'CallExpression', 'CatchClause', 'ClassBody', 'ClassDeclaration', 'ClassExpression', 'ConditionalExpression', 'ContinueStatement', 'DebuggerStatement', 'DoWhileStatement', 'EmptyStatement', 'ExperimentalRestProperty', 'ExperimentalSpreadProperty', 'ExpressionStatement', 'ForInStatement', 'ForOfStatement', 'ForStatement', 'FunctionDeclaration', 'FunctionExpression', 'Identifier', 'IfStatement', 'LabeledStatement', 'Literal', 'LogicalExpression', 'MemberExpression', 'MetaProperty', 'MethodDefinition', 'NewExpression', 'ObjectExpression', 'ObjectPattern', 'Program', 'Property', 'RestElement', 'ReturnStatement', 'SequenceExpression', 'SpreadElement', 'Super', 'SwitchCase', 'SwitchStatement', 'TaggedTemplateExpression', 'TemplateElement', 'TemplateLiteral', 'ThisExpression', 'ThrowStatement', 'TryStatement', 'UnaryExpression', 'UpdateExpression', 'VariableDeclaration', 'VariableDeclarator', 'WhileStatement', 'WithStatement', 'YieldExpression', 'VAttribute', 'VDirectiveKey', 'VDocumentFragment', 'VElement', 'VEndTag', 'VExpressionContainer', 'VForExpression', 'VIdentifier', 'VLiteral', 'VOnExpression', 'VStartTag', 'VText'])
const LT_CHAR = /[\r\n\u2028\u2029]/
const LINES = /[^\r\n\u2028\u2029]+(?:$|\r\n|[\r\n\u2028\u2029])/g
const BLOCK_COMMENT_PREFIX = /^\s*\*/

/**
 * Normalize options.
 * @param {number|"tab"|undefined} type The type of indentation.
 * @param {Object} options Other options.
 * @returns {{indentChar:" "|"\t",indentSize:number,attribute:number,closeBracket:number,switchCase:number,ignores:string[]}} Normalized options.
 */
function parseOptions (type, options) {
  const ret = {
    indentChar: ' ',
    indentSize: 4,
    attribute: 1,
    closeBracket: 0,
    switchCase: 0,
    ignores: []
  }

  if (Number.isSafeInteger(type)) {
    ret.indentSize = type
  } else if (type === 'tab') {
    ret.indentChar = '\t'
    ret.indentSize = 1
  }

  if (Number.isSafeInteger(options.attribute)) {
    ret.attribute = options.attribute
  }
  if (Number.isSafeInteger(options.closeBracket)) {
    ret.closeBracket = options.closeBracket
  }
  if (Number.isSafeInteger(options.switchCase)) {
    ret.switchCase = options.switchCase
  }
  if (options.ignores != null) {
    ret.ignores = options.ignores
  }

  return ret
}

/**
 * Check whether the given token is an arrow.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is an arrow.
 */
function isArrow (token) {
  return token != null && token.type === 'Punctuator' && token.value === '=>'
}

/**
 * Check whether the given token is a left parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left parenthesis.
 */
function isLeftParen (token) {
  return token != null && token.type === 'Punctuator' && token.value === '('
}

/**
 * Check whether the given token is a left parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `false` if the token is a left parenthesis.
 */
function isNotLeftParen (token) {
  return token != null && (token.type !== 'Punctuator' || token.value !== '(')
}

/**
 * Check whether the given token is a right parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right parenthesis.
 */
function isRightParen (token) {
  return token != null && token.type === 'Punctuator' && token.value === ')'
}

/**
 * Check whether the given token is a right parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `false` if the token is a right parenthesis.
 */
function isNotRightParen (token) {
  return token != null && (token.type !== 'Punctuator' || token.value !== ')')
}

/**
 * Check whether the given token is a left brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left brace.
 */
function isLeftBrace (token) {
  return token != null && token.type === 'Punctuator' && token.value === '{'
}

/**
 * Check whether the given token is a left bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left bracket.
 */
function isLeftBracket (token) {
  return token != null && token.type === 'Punctuator' && token.value === '['
}

/**
 * Check whether the given token is a right bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right bracket.
 */
function isRightBracket (token) {
  return token != null && token.type === 'Punctuator' && token.value === ']'
}

/**
 * Check whether the given token is a semicolon.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a semicolon.
 */
function isSemicolon (token) {
  return token != null && token.type === 'Punctuator' && token.value === ';'
}

/**
 * Check whether the given token is a whitespace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a whitespace.
 */
function isNotWhitespace (token) {
  return token != null && token.type !== 'HTMLWhitespace'
}

/**
 * Check whether the given token is a comment.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a comment.
 */
function isComment (token) {
  return token != null && (token.type === 'Block' || token.type === 'Line' || token.type === 'Shebang' || token.type.endsWith('Comment'))
}

/**
 * Check whether the given token is a comment.
 * @param {Token} token The token to check.
 * @returns {boolean} `false` if the token is a comment.
 */
function isNotComment (token) {
  return token != null && token.type !== 'Block' && token.type !== 'Line' && token.type !== 'Shebang' && !token.type.endsWith('Comment')
}

/**
 * Get the last element.
 * @param {Array} xs The array to get the last element.
 * @returns {any|undefined} The last element or undefined.
 */
function last (xs) {
  return xs.length === 0 ? undefined : xs[xs.length - 1]
}

/**
 * Check whether the node is at the beginning of line.
 * @param {Node} node The node to check.
 * @param {number} index The index of the node in the nodes.
 * @param {Node[]} nodes The array of nodes.
 * @returns {boolean} `true` if the node is at the beginning of line.
 */
function isBeginningOfLine (node, index, nodes) {
  if (node != null) {
    for (let i = index - 1; i >= 0; --i) {
      const prevNode = nodes[i]
      if (prevNode == null) {
        continue
      }

      return node.loc.start.line !== prevNode.loc.end.line
    }
  }
  return false
}

/**
 * Creates AST event handlers for html-indent.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create (context) {
  const options = parseOptions(context.options[0], context.options[1] || {})
  const sourceCode = context.getSourceCode()
  const template = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore()
  const offsets = new Map()

  /**
   * Set offset to the given tokens.
   * @param {Token|Token[]} token The token to set.
   * @param {number} offset The offset of the tokens.
   * @param {Token} baseToken The token of the base offset.
   * @returns {void}
   */
  function setOffset (token, offset, baseToken) {
    assert(baseToken != null, "'baseToken' should not be null or undefined.")

    if (Array.isArray(token)) {
      for (const t of token) {
        offsets.set(t, {
          baseToken,
          offset,
          baseline: false,
          expectedIndent: undefined
        })
      }
    } else {
      offsets.set(token, {
        baseToken,
        offset,
        baseline: false,
        expectedIndent: undefined
      })
    }
  }

  /**
   * Set baseline flag to the given token.
   * @param {Token} token The token to set.
   * @returns {void}
   */
  function setBaseline (token, hardTabAdditional) {
    const offsetInfo = offsets.get(token)
    if (offsetInfo != null) {
      offsetInfo.baseline = true
    }
  }

  /**
   * Get the first and last tokens of the given node.
   * If the node is parenthesized, this gets the outermost parentheses.
   * @param {Node} node The node to get.
   * @param {number} [borderOffset] The least offset of the first token. Defailt is 0. This value is used to prevent false positive in the following case: `(a) => {}` The parentheses are enclosing the whole parameter part rather than the first parameter, but this offset parameter is needed to distinguish.
   * @returns {{firstToken:Token,lastToken:Token}} The gotten tokens.
   */
  function getFirstAndLastTokens (node, borderOffset) {
    borderOffset |= 0

    let firstToken = template.getFirstToken(node)
    let lastToken = template.getLastToken(node)

    // Get the outermost left parenthesis if it's parenthesized.
    let t, u
    while ((t = template.getTokenBefore(firstToken)) != null && (u = template.getTokenAfter(lastToken)) != null && isLeftParen(t) && isRightParen(u) && t.range[0] >= borderOffset) {
      firstToken = t
      lastToken = u
    }

    return { firstToken, lastToken }
  }

  /**
   * Process the given node list.
   * The first node is offsetted from the given left token.
   * Rest nodes are adjusted to the first node.
   * @param {Node[]} nodeList The node to process.
   * @param {Node|null} leftToken The left parenthesis token.
   * @param {Node|null} rightToken The right parenthesis token.
   * @param {number} offset The offset to set.
   * @returns {void}
   */
  function processNodeList (nodeList, leftToken, rightToken, offset) {
    let t

    if (nodeList.length >= 1) {
      let lastToken = leftToken
      const alignTokens = []

      for (let i = 0; i < nodeList.length; ++i) {
        const node = nodeList[i]
        if (node == null) {
          // Holes of an array.
          continue
        }
        const elementTokens = getFirstAndLastTokens(node, lastToken != null ? lastToken.range[1] : 0)

        // Collect related tokens.
        // Commas between this and the previous, and the first token of this node.
        if (lastToken != null) {
          t = lastToken
          while ((t = template.getTokenAfter(t)) != null && t.range[1] <= elementTokens.firstToken.range[0]) {
            alignTokens.push(t)
          }
        }
        alignTokens.push(elementTokens.firstToken)

        // Save the last token to find tokens between the next token.
        lastToken = elementTokens.lastToken
      }

      // Check trailing commas.
      if (rightToken != null && lastToken != null) {
        t = lastToken
        while ((t = template.getTokenAfter(t)) != null && t.range[1] <= rightToken.range[0]) {
          alignTokens.push(t)
        }
      }

      // Set offsets.
      const baseToken = alignTokens.shift()
      if (baseToken != null) {
        // Set offset to the first token.
        if (leftToken != null) {
          setOffset(baseToken, offset, leftToken)
        }

        // Align the rest tokens to the first token.
        if (nodeList.some(isBeginningOfLine)) {
          setBaseline(baseToken)
        }
        setOffset(alignTokens, 0, baseToken)
      }
    }

    if (rightToken != null) {
      setOffset(rightToken, 0, leftToken)
    }
  }

  /**
   * Process the given node as body.
   * The body node maybe a block statement or an expression node.
   * @param {Node} node The body node to process.
   * @param {Token} baseToken The base token.
   * @returns {void}
   */
  function processMaybeBlock (node, baseToken) {
    const firstToken = getFirstAndLastTokens(node).firstToken
    setOffset(firstToken, isLeftBrace(firstToken) ? 0 : 1, baseToken)
  }

  /**
   * Collect prefix tokens of the given property.
   * The prefix includes `async`, `get`, `set`, `static`, and `*`.
   * @param {Property|MethodDefinition} node The property node to collect prefix tokens.
   */
  function getPrefixTokens (node) {
    const prefixes = []

    let token = template.getFirstToken(node)
    while (token != null && token.range[1] <= node.key.range[0]) {
      prefixes.push(token)
      token = template.getTokenAfter(token)
    }
    while (isLeftParen(last(prefixes)) || isLeftBracket(last(prefixes))) {
      prefixes.pop()
    }

    return prefixes
  }

  /**
   * Find the head of chaining nodes.
   * @param {Node} node The start node to find the head.
   * @returns {Token} The head token of the chain.
   */
  function getChainHeadToken (node) {
    const type = node.type
    while (node.parent.type === type) {
      node = node.parent
    }
    return template.getFirstToken(node)
  }

  /**
   * Ignore all tokens of the given node.
   * @param {Node} node The node to ignore.
   * @returns {void}
   */
  function ignore (node) {
    for (const token of template.getTokens(node)) {
      offsets.delete(token)
    }
  }

  /**
   * Define functions to ignore nodes into the given visitor.
   * @param {Object} visitor The visitor to define functions to ignore nodes.
   * @returns {Object} The visitor.
   */
  function processIgnores (visitor) {
    for (const ignorePattern of options.ignores) {
      const key = `${ignorePattern}:exit`

      if (visitor.hasOwnProperty(key)) {
        const handler = visitor[key]
        visitor[key] = function (node) {
          const ret = handler.apply(this, arguments)
          ignore(node)
          return ret
        }
      } else {
        visitor[key] = ignore
      }
    }

    return visitor
  }

  /**
   * Calculate correct indentation of the line of the given tokens.
   * @param {Token[]} tokens Tokens which are on the same line.
   * @returns {number} Correct indentation. If it failed to calculate then `Number.MAX_SAFE_INTEGER`.
   */
  function getExpectedIndent (tokens) {
    let expectedIndent = Number.MAX_SAFE_INTEGER

    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i]
      const offsetInfo = offsets.get(token)

      if (offsetInfo != null) {
        if (offsetInfo.expectedIndent != null) {
          expectedIndent = Math.min(expectedIndent, offsetInfo.expectedIndent)
        } else {
          const baseOffsetInfo = offsets.get(offsetInfo.baseToken)
          if (baseOffsetInfo != null && baseOffsetInfo.expectedIndent != null && (i === 0 || !baseOffsetInfo.baseline)) {
            expectedIndent = Math.min(expectedIndent, baseOffsetInfo.expectedIndent + offsetInfo.offset * options.indentSize)
            if (baseOffsetInfo.baseline) {
              break
            }
          }
        }
      }
    }

    return expectedIndent
  }

  /**
   * Get the text of the indentation part of the line which the given token is on.
   * @param {Token} firstToken The first token on a line.
   * @returns {string} The text of indentation part.
   */
  function getIndentText (firstToken) {
    const text = sourceCode.text
    let i = firstToken.range[0] - 1

    while (i >= 0 && !LT_CHAR.test(text[i])) {
      i -= 1
    }

    return text.slice(i + 1, firstToken.range[0])
  }

  /**
   * Define the function which fixes the problem.
   * @param {Token} token The token to fix.
   * @param {number} actualIndent The number of actual indentaion.
   * @param {number} expectedIndent The number of expected indentation.
   * @returns {Function} The defined function.
   */
  function defineFix (token, actualIndent, expectedIndent) {
    if (token.type === 'Block' && token.loc.start.line !== token.loc.end.line) {
      // Fix indentation in multiline block comments.
      const lines = sourceCode.getText(token).match(LINES)
      const firstLine = lines.shift()
      if (lines.every(l => BLOCK_COMMENT_PREFIX.test(l))) {
        return fixer => {
          const range = [token.range[0] - actualIndent, token.range[1]]
          const indent = options.indentChar.repeat(expectedIndent)

          return fixer.replaceTextRange(
            range,
            `${indent}${firstLine}${lines.map(l => l.replace(BLOCK_COMMENT_PREFIX, `${indent} *`)).join('')}`
          )
        }
      }
    }

    return fixer => {
      const range = [token.range[0] - actualIndent, token.range[0]]
      const indent = options.indentChar.repeat(expectedIndent)
      return fixer.replaceTextRange(range, indent)
    }
  }

  /**
   * Validate the given token with the pre-calculated expected indentation.
   * @param {Token} token The token to validate.
   * @param {number} expectedIndent The expected indentation.
   * @returns {void}
   */
  function validateCore (token, expectedIndent) {
    const line = token.loc.start.line
    const actualIndent = token.loc.start.column
    const indentText = getIndentText(token)
    const unit = (options.indentChar === '\t' ? 'tab' : 'space')

    for (let i = 0; i < indentText.length; ++i) {
      if (indentText[i] !== options.indentChar) {
        context.report({
          loc: {
            start: { line, column: i },
            end: { line, column: i + 1 }
          },
          message: 'Expected {{expected}} character, but found {{actual}} character.',
          data: {
            expected: JSON.stringify(options.indentChar),
            actual: JSON.stringify(indentText[i])
          },
          fix: defineFix(token, actualIndent, expectedIndent)
        })
        return
      }
    }

    if (actualIndent !== expectedIndent) {
      context.report({
        loc: {
          start: { line, column: 0 },
          end: { line, column: actualIndent }
        },
        message: 'Expected indentation of {{expectedIndent}} {{unit}}{{expectedIndentPlural}} but found {{actualIndent}} {{unit}}{{actualIndentPlural}}.',
        data: {
          expectedIndent,
          actualIndent,
          unit,
          expectedIndentPlural: (expectedIndent === 1) ? '' : 's',
          actualIndentPlural: (actualIndent === 1) ? '' : 's'
        },
        fix: defineFix(token, actualIndent, expectedIndent)
      })
    }
  }

  /**
   * Validate indentation of the line that the given tokens are on.
   * @param {Token[]} tokens The tokens on the same line to validate.
   * @param {Token[]} comments The comments which are on the immediately previous lines of the tokens.
   * @returns {void}
   */
  function validate (tokens, comments) {
    // Calculate and save expected indentation.
    const firstToken = tokens[0]
    const actualIndent = firstToken.loc.start.column
    const expectedIndent = getExpectedIndent(tokens)
    if (expectedIndent === Number.MAX_SAFE_INTEGER) {
      return
    }

    // Debug log
    // console.log('line', firstToken.loc.start.line, '=', { actualIndent, expectedIndent }, 'from:')
    // for (const token of tokens) {
    //   const offsetInfo = offsets.get(token)
    //   if (offsetInfo == null) {
    //     console.log('    ', JSON.stringify(sourceCode.getText(token)), 'is unknown.')
    //   } else if (offsetInfo.expectedIndent != null) {
    //     console.log('    ', JSON.stringify(sourceCode.getText(token)), 'is fixed at', offsetInfo.expectedIndent, '.')
    //   } else {
    //     const baseOffsetInfo = offsets.get(offsetInfo.baseToken)
    //     console.log('    ', JSON.stringify(sourceCode.getText(token)), 'is', offsetInfo.offset, 'offset from ', JSON.stringify(sourceCode.getText(offsetInfo.baseToken)), '( line:', offsetInfo.baseToken && offsetInfo.baseToken.loc.start.line, ', indent:', baseOffsetInfo && baseOffsetInfo.expectedIndent, ', baseline:', baseOffsetInfo && baseOffsetInfo.baseline, ')')
    //   }
    // }

    // Save.
    const baseline = new Set()
    for (const token of tokens) {
      const offsetInfo = offsets.get(token)
      if (offsetInfo != null) {
        if (offsetInfo.baseline) {
          // This is a baseline token, so the expected indent is the column of this token.
          if (options.indentChar === ' ') {
            offsetInfo.expectedIndent = Math.max(0, token.loc.start.column + expectedIndent - actualIndent)
          } else {
            // In hard-tabs mode, it cannot align tokens strictly, so use one additional offset.
            // But the additional offset isn't needed if it's at the beginning of the line.
            offsetInfo.expectedIndent = expectedIndent + (token === tokens[0] ? 0 : 1)
          }
          baseline.add(token)
        } else if (baseline.has(offsetInfo.baseToken)) {
          // The base token is a baseline token on this line, so inherit it.
          offsetInfo.expectedIndent = offsets.get(offsetInfo.baseToken).expectedIndent
          baseline.add(token)
        } else {
          // Otherwise, set the expected indent of this line.
          offsetInfo.expectedIndent = expectedIndent
        }
      }
    }

    // Validate.
    for (const comment of comments) {
      validateCore(comment, expectedIndent)
    }
    validateCore(firstToken, expectedIndent)
  }

  // ------------------------------------------------------------------------------
  // Main
  // ------------------------------------------------------------------------------

  return utils.defineTemplateBodyVisitor(context, processIgnores({
    VAttribute (node) {
      const keyToken = template.getFirstToken(node)
      const eqToken = template.getFirstToken(node, 1)

      if (eqToken != null) {
        setOffset(eqToken, 1, keyToken)

        const valueToken = template.getFirstToken(node, 2)
        if (valueToken != null) {
          setOffset(valueToken, 1, keyToken)
        }
      }
    },

    VElement (node) {
      const startTagToken = template.getFirstToken(node)
      const childTokens = node.children.map(n => template.getFirstToken(n))
      const endTagToken = node.endTag && template.getFirstToken(node.endTag)

      setOffset(childTokens, 1, startTagToken)
      setOffset(endTagToken, 0, startTagToken)
    },

    VEndTag (node) {
      const openToken = template.getFirstToken(node)
      const closeToken = template.getLastToken(node)

      if (closeToken.type.endsWith('TagClose')) {
        setOffset(closeToken, options.closeBracket, openToken)
      }
    },

    VExpressionContainer (node) {
      if (node.expression != null && node.range[0] !== node.expression.range[0]) {
        const startQuoteToken = template.getFirstToken(node)
        const endQuoteToken = template.getLastToken(node)
        const childToken = template.getFirstToken(node.expression)

        setOffset(childToken, 1, startQuoteToken)
        setOffset(endQuoteToken, 0, startQuoteToken)
      }
    },

    VForExpression (node) {
      const firstToken = template.getFirstToken(node)
      const lastOfLeft = last(node.left) || firstToken
      const inToken = template.getTokenAfter(lastOfLeft, isNotRightParen)
      const rightToken = template.getFirstToken(node.right)

      if (isLeftParen(firstToken)) {
        const rightToken = template.getTokenAfter(lastOfLeft, isRightParen)
        processNodeList(node.left, firstToken, rightToken, 1)
      }
      setOffset(inToken, 1, firstToken)
      setOffset(rightToken, 1, inToken)
    },

    VOnExpression (node) {
      processNodeList(node.body, null, null, 0)
    },

    VStartTag (node) {
      const openToken = template.getFirstToken(node)
      const closeToken = template.getLastToken(node)

      processNodeList(node.attributes, openToken, null, options.attribute)
      if (closeToken != null && closeToken.type.endsWith('TagClose')) {
        setOffset(closeToken, options.closeBracket, openToken)
      }
    },

    VText (node) {
      const tokens = template.getTokens(node, isNotWhitespace)
      const firstTokenInfo = offsets.get(template.getFirstToken(node))

      for (const token of tokens) {
        offsets.set(token, firstTokenInfo)
      }
    },

    'ArrayExpression, ArrayPattern' (node) {
      processNodeList(node.elements, template.getFirstToken(node), template.getLastToken(node), 1)
    },

    ArrowFunctionExpression (node) {
      const firstToken = template.getFirstToken(node)
      const secondToken = template.getTokenAfter(firstToken)
      const leftToken = node.async ? secondToken : firstToken
      const arrowToken = template.getTokenBefore(node.body, isArrow)

      if (node.async) {
        setOffset(secondToken, 1, firstToken)
      }
      if (isLeftParen(leftToken)) {
        const rightToken = template.getTokenAfter(last(node.params) || leftToken, isRightParen)
        processNodeList(node.params, leftToken, rightToken, 1)
      }

      setOffset(arrowToken, 1, firstToken)
      processMaybeBlock(node.body, firstToken)
    },

    'AssignmentExpression, AssignmentPattern, BinaryExpression, LogicalExpression' (node) {
      const leftToken = getChainHeadToken(node)
      const opToken = template.getTokenAfter(node.left, isNotRightParen)
      const rightToken = template.getTokenAfter(opToken)

      setOffset([opToken, rightToken], 1, leftToken)
    },

    'AwaitExpression, RestElement, SpreadElement, UnaryExpression' (node) {
      const firstToken = template.getFirstToken(node)
      const nextToken = template.getTokenAfter(firstToken)

      setOffset(nextToken, 1, firstToken)
    },

    'BlockStatement, ClassBody' (node) {
      processNodeList(node.body, template.getFirstToken(node), template.getLastToken(node), 1)
    },

    'BreakStatement, ContinueStatement, ReturnStatement, ThrowStatement' (node) {
      if (node.argument != null || node.label != null) {
        const firstToken = template.getFirstToken(node)
        const nextToken = template.getTokenAfter(firstToken)

        setOffset(nextToken, 1, firstToken)
      }
    },

    CallExpression (node) {
      const firstToken = template.getFirstToken(node)
      const rightToken = template.getLastToken(node)
      const leftToken = template.getTokenAfter(node.callee, isLeftParen)

      setOffset(leftToken, 1, firstToken)
      processNodeList(node.arguments, leftToken, rightToken, 1)
    },

    CatchClause (node) {
      const firstToken = template.getFirstToken(node)
      const bodyToken = template.getFirstToken(node.body)

      if (node.param != null) {
        const leftToken = template.getTokenAfter(firstToken)
        const rightToken = template.getTokenAfter(node.param)

        setOffset(leftToken, 1, firstToken)
        processNodeList([node.param], leftToken, rightToken, 1)
      }
      setOffset(bodyToken, 0, firstToken)
    },

    'ClassDeclaration, ClassExpression' (node) {
      const firstToken = template.getFirstToken(node)
      const bodyToken = template.getFirstToken(node.body)

      if (node.id != null) {
        setOffset(template.getFirstToken(node.id), 1, firstToken)
      }
      if (node.superClass != null) {
        const extendsToken = template.getTokenAfter(node.id || firstToken)
        const superClassToken = template.getTokenAfter(extendsToken)
        setOffset(extendsToken, 1, firstToken)
        setOffset(superClassToken, 1, extendsToken)
      }
      setOffset(bodyToken, 0, firstToken)
    },

    ConditionalExpression (node) {
      const firstToken = template.getFirstToken(node)
      const questionToken = template.getTokenAfter(node.test, isNotRightParen)
      const consequentToken = template.getTokenAfter(questionToken)
      const colonToken = template.getTokenAfter(node.consequent, isNotRightParen)
      const alternateToken = template.getTokenAfter(colonToken)
      const isFlat = (node.test.loc.end.line === node.consequent.loc.start.line)

      if (isFlat) {
        setOffset([questionToken, consequentToken, colonToken, alternateToken], 0, firstToken)
      } else {
        setOffset([questionToken, colonToken], 1, firstToken)
        setOffset([consequentToken, alternateToken], 1, questionToken)
      }
    },

    DoWhileStatement (node) {
      const doToken = template.getFirstToken(node)
      const whileToken = template.getTokenAfter(node.body, isNotRightParen)
      const leftToken = template.getTokenAfter(whileToken)
      const testToken = template.getTokenAfter(leftToken)
      const lastToken = template.getLastToken(node)
      const rightToken = isSemicolon(lastToken) ? template.getTokenBefore(lastToken) : lastToken

      processMaybeBlock(node.body, doToken)
      setOffset(whileToken, 0, doToken)
      setOffset(leftToken, 1, whileToken)
      setOffset(testToken, 1, leftToken)
      setOffset(rightToken, 0, leftToken)
    },

    'ForInStatement, ForOfStatement' (node) {
      const forToken = template.getFirstToken(node)
      const leftParenToken = template.getTokenAfter(forToken)
      const leftToken = template.getTokenAfter(leftParenToken)
      const inToken = template.getTokenAfter(leftToken, isNotRightParen)
      const rightToken = template.getTokenAfter(inToken)
      const rightParenToken = template.getTokenBefore(node.body, isNotLeftParen)

      setOffset(leftParenToken, 1, forToken)
      setOffset(leftToken, 1, leftParenToken)
      setOffset(inToken, 1, leftToken)
      setOffset(rightToken, 1, leftToken)
      setOffset(rightParenToken, 0, leftParenToken)
      processMaybeBlock(node.body, forToken)
    },

    ForStatement (node) {
      const forToken = template.getFirstToken(node)
      const leftParenToken = template.getTokenAfter(forToken)
      const rightParenToken = template.getTokenBefore(node.body, isNotLeftParen)

      setOffset(leftParenToken, 1, forToken)
      processNodeList([node.init, node.test, node.update], leftParenToken, rightParenToken, 1)
      setOffset(rightParenToken, 0, leftParenToken)
      processMaybeBlock(node.body, forToken)
    },

    'FunctionDeclaration, FunctionExpression' (node) {
      const firstToken = template.getFirstToken(node)
      if (isLeftParen(firstToken)) {
        // Methods.
        const leftToken = firstToken
        const rightToken = template.getTokenAfter(last(node.params) || leftToken, isRightParen)
        const bodyToken = template.getFirstToken(node.body)

        processNodeList(node.params, leftToken, rightToken, 1)
        setOffset(bodyToken, 0, template.getFirstToken(node.parent))
      } else {
        // Normal functions.
        const functionToken = node.async ? template.getTokenAfter(firstToken) : firstToken
        const starToken = node.generator ? template.getTokenAfter(functionToken) : null
        const idToken = node.id && template.getFirstToken(node.id)
        const leftToken = template.getTokenAfter(idToken || starToken || functionToken)
        const rightToken = template.getTokenAfter(last(node.params) || leftToken, isRightParen)
        const bodyToken = template.getFirstToken(node.body)

        if (node.async) {
          setOffset(functionToken, 0, firstToken)
        }
        if (node.generator) {
          setOffset(starToken, 1, firstToken)
        }
        if (node.id != null) {
          setOffset(idToken, 1, firstToken)
        }
        setOffset(leftToken, 1, firstToken)
        processNodeList(node.params, leftToken, rightToken, 1)
        setOffset(bodyToken, 0, firstToken)
      }
    },

    IfStatement (node) {
      const ifToken = template.getFirstToken(node)
      const ifLeftParenToken = template.getTokenAfter(ifToken)
      const ifRightParenToken = template.getTokenBefore(node.consequent, isRightParen)

      setOffset(ifLeftParenToken, 1, ifToken)
      setOffset(ifRightParenToken, 0, ifLeftParenToken)
      processMaybeBlock(node.consequent, ifToken)

      if (node.alternate != null) {
        const elseToken = template.getTokenAfter(node.consequent, isNotRightParen)

        setOffset(elseToken, 0, ifToken)
        processMaybeBlock(node.alternate, elseToken)
      }
    },

    LabeledStatement (node) {
      const labelToken = template.getFirstToken(node)
      const colonToken = template.getTokenAfter(labelToken)
      const bodyToken = template.getTokenAfter(colonToken)

      setOffset([colonToken, bodyToken], 1, labelToken)
    },

    'MemberExpression, MetaProperty' (node) {
      const objectToken = template.getFirstToken(node)
      if (node.computed) {
        const leftBracketToken = template.getTokenBefore(node.property, isLeftBracket)
        const propertyToken = template.getTokenAfter(leftBracketToken)
        const rightBracketToken = template.getTokenAfter(node.property, isRightBracket)

        setOffset(leftBracketToken, 1, objectToken)
        setOffset(propertyToken, 1, leftBracketToken)
        setOffset(rightBracketToken, 0, leftBracketToken)
      } else {
        const dotToken = template.getTokenBefore(node.property)
        const propertyToken = template.getTokenAfter(dotToken)

        setOffset([dotToken, propertyToken], 1, objectToken)
      }
    },

    'MethodDefinition, Property' (node) {
      const isMethod = (node.type === 'MethodDefinition' || node.method === true)
      const prefixTokens = getPrefixTokens(node)
      const hasPrefix = prefixTokens.length >= 1

      for (let i = 1; i < prefixTokens.length; ++i) {
        setOffset(prefixTokens[i], 0, prefixTokens[i - 1])
      }

      let lastKeyToken = null
      if (node.computed) {
        const keyLeftToken = template.getFirstToken(node, isLeftBracket)
        const keyToken = template.getTokenAfter(keyLeftToken)
        const keyRightToken = lastKeyToken = template.getTokenAfter(node.key, isRightBracket)

        if (hasPrefix) {
          setOffset(keyLeftToken, 0, last(prefixTokens))
        }
        setOffset(keyToken, 1, keyLeftToken)
        setOffset(keyRightToken, 0, keyLeftToken)
      } else {
        const idToken = lastKeyToken = template.getFirstToken(node.key)

        if (hasPrefix) {
          setOffset(idToken, 0, last(prefixTokens))
        }
      }

      if (isMethod) {
        const leftParenToken = template.getTokenAfter(lastKeyToken)

        setOffset(leftParenToken, 1, lastKeyToken)
      } else {
        const colonToken = template.getTokenAfter(lastKeyToken)
        const valueToken = template.getTokenAfter(colonToken)

        setOffset([colonToken, valueToken], 1, lastKeyToken)
      }
    },

    NewExpression (node) {
      const newToken = template.getFirstToken(node)
      const calleeToken = template.getTokenAfter(newToken)
      const rightToken = template.getLastToken(node)
      const leftToken = isRightParen(rightToken)
        ? template.getFirstTokenBetween(node.callee, rightToken, isLeftParen)
        : null

      setOffset(calleeToken, 1, newToken)
      if (leftToken != null) {
        setOffset(leftToken, 1, calleeToken)
        processNodeList(node.arguments, leftToken, rightToken, 1)
      }
    },

    'ObjectExpression, ObjectPattern' (node) {
      processNodeList(node.properties, template.getFirstToken(node), template.getLastToken(node), 1)
    },

    SequenceExpression (node) {
      processNodeList(node.expressions, null, null, 0)
    },

    SwitchCase (node) {
      const caseToken = template.getFirstToken(node)

      if (node.test != null) {
        const testToken = template.getTokenAfter(caseToken)
        const colonToken = template.getTokenAfter(node.test, isNotRightParen)

        setOffset([testToken, colonToken], 1, caseToken)
      } else {
        const colonToken = template.getTokenAfter(caseToken)

        setOffset(colonToken, 1, caseToken)
      }

      if (node.consequent.length === 1 && node.consequent[0].type === 'BlockStatement') {
        setOffset(template.getFirstToken(node.consequent[0]), 0, caseToken)
      } else if (node.consequent.length >= 1) {
        setOffset(template.getFirstToken(node.consequent[0]), 1, caseToken)
        processNodeList(node.consequent, null, null, 0)
      }
    },

    SwitchStatement (node) {
      const switchToken = template.getFirstToken(node)
      const leftParenToken = template.getTokenAfter(switchToken)
      const discriminantToken = template.getTokenAfter(leftParenToken)
      const leftBraceToken = template.getTokenAfter(node.discriminant, isLeftBrace)
      const rightParenToken = template.getTokenBefore(leftBraceToken)
      const rightBraceToken = template.getLastToken(node)

      setOffset(leftParenToken, 1, switchToken)
      setOffset(discriminantToken, 1, leftParenToken)
      setOffset(rightParenToken, 0, leftParenToken)
      setOffset(leftBraceToken, 0, switchToken)
      processNodeList(node.cases, leftBraceToken, rightBraceToken, options.switchCase)
    },

    TaggedTemplateExpression (node) {
      const tagTokens = getFirstAndLastTokens(node.tag, node.range[0])
      const quasiToken = template.getTokenAfter(tagTokens.lastToken)

      setOffset(quasiToken, 1, tagTokens.firstToken)
    },

    TemplateLiteral (node) {
      const firstToken = template.getFirstToken(node)
      const quasiTokens = node.quasis.slice(1).map(n => template.getFirstToken(n))
      const expressionToken = node.quasis.slice(0, -1).map(n => template.getTokenAfter(n))

      setOffset(quasiTokens, 0, firstToken)
      setOffset(expressionToken, 1, firstToken)
    },

    TryStatement (node) {
      const tryToken = template.getFirstToken(node)
      const tryBlockToken = template.getFirstToken(node.block)

      setOffset(tryBlockToken, 0, tryToken)

      if (node.handler != null) {
        const catchToken = template.getFirstToken(node.handler)

        setOffset(catchToken, 0, tryToken)
      }

      if (node.finalizer != null) {
        const finallyToken = template.getTokenBefore(node.finalizer)
        const finallyBlockToken = template.getFirstToken(node.finalizer)

        setOffset([finallyToken, finallyBlockToken], 0, tryToken)
      }
    },

    UpdateExpression (node) {
      const firstToken = template.getFirstToken(node)
      const nextToken = template.getTokenAfter(firstToken)

      setOffset(nextToken, 1, firstToken)
    },

    VariableDeclaration (node) {
      processNodeList(node.declarations, template.getFirstToken(node), null, 1)
    },

    VariableDeclarator (node) {
      if (node.init != null) {
        const idToken = template.getFirstToken(node)
        const eqToken = template.getTokenAfter(node.id)
        const initToken = template.getTokenAfter(eqToken)

        setOffset([eqToken, initToken], 1, idToken)
      }
    },

    'WhileStatement, WithStatement' (node) {
      const firstToken = template.getFirstToken(node)
      const leftParenToken = template.getTokenAfter(firstToken)
      const rightParenToken = template.getTokenBefore(node.body, isRightParen)

      setOffset(leftParenToken, 1, firstToken)
      setOffset(rightParenToken, 0, leftParenToken)
      processMaybeBlock(node.body, firstToken)
    },

    YieldExpression (node) {
      if (node.argument != null) {
        const yieldToken = template.getFirstToken(node)

        setOffset(template.getTokenAfter(yieldToken), 1, yieldToken)
        if (node.delegate) {
          setOffset(template.getTokenAfter(yieldToken, 1), 1, yieldToken)
        }
      }
    },

    // Process semicolons.
    ':statement' (node) {
      const info = offsets.get(template.getFirstToken(node))
      const prevToken = template.getTokenBefore(node)
      const lastToken = template.getLastToken(node)

      if (info != null && isSemicolon(prevToken)) {
        offsets.set(prevToken, info)
      }
      if (info != null && isSemicolon(lastToken)) {
        offsets.set(lastToken, info)
      }
    },

    // Process parentheses.
    // `:expression` does not match with MetaProperty and TemplateLiteral as a bug: https://github.com/estools/esquery/pull/59
    ':expression, MetaProperty, TemplateLiteral' (node) {
      let leftToken = template.getTokenBefore(node)
      let rightToken = template.getTokenAfter(node)
      let firstToken = template.getFirstToken(node)

      while (isLeftParen(leftToken) && isRightParen(rightToken)) {
        setOffset(firstToken, 1, leftToken)
        setOffset(rightToken, 0, leftToken)

        firstToken = leftToken
        leftToken = template.getTokenBefore(leftToken)
        rightToken = template.getTokenAfter(rightToken)
      }
    },

    // Ignore tokens of unknown nodes.
    '*:exit' (node) {
      if (!KNOWN_NODES.has(node.type)) {
        ignore(node)
      }
    },

    // Do validation.
    "VElement[parent.type='VDocumentFragment']:exit" (node) {
      let comments = []
      let tokensOnSameLine = []
      let isBesideMultilineToken = false
      let first = true

      // Validate indentation of tokens.
      for (const token of template.getTokens(node, { includeComments: true, filter: isNotWhitespace })) {
        if (tokensOnSameLine.length === 0 || tokensOnSameLine[0].loc.start.line === token.loc.start.line) {
          // This is on the same line (or the first token).
          tokensOnSameLine.push(token)
        } else if (tokensOnSameLine.every(isComment)) {
          // New line is detected, but the all tokens of the previous line are comment.
          // Comment lines are adjusted to the next code line.
          comments.push(tokensOnSameLine[0])
          isBesideMultilineToken = last(tokensOnSameLine).loc.end.line === token.loc.start.line
          tokensOnSameLine = [token]
        } else {
          // New line is detected, so validate the tokens.
          if (!isBesideMultilineToken) {
            if (first) {
              // Set zero as expected.
              first = false
              const offsetInfo = offsets.get(tokensOnSameLine[0])
              if (offsetInfo != null) {
                offsetInfo.expectedIndent = 0
              } else {
                offsets.set(tokensOnSameLine[0], { baseToken: null, offset: 0, baseline: false, expectedIndent: 0 })
              }
            }

            validate(tokensOnSameLine, comments)
          }
          isBesideMultilineToken = last(tokensOnSameLine).loc.end.line === token.loc.start.line
          tokensOnSameLine = [token]
          comments = []
        }
      }
      if (tokensOnSameLine.length >= 1 && tokensOnSameLine.some(isNotComment)) {
        validate(tokensOnSameLine, comments)
      }
    }
  }))
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'enforce consistent indentation in `<template>`',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'whitespace',
    schema: [
      {
        anyOf: [
          { type: 'integer', minimum: 1 },
          { enum: ['tab'] }
        ]
      },
      {
        type: 'object',
        properties: {
          'attribute': { type: 'integer', minimum: 0 },
          'closeBracket': { type: 'integer', minimum: 0 },
          'switchCase': { type: 'integer', minimum: 0 },
          'ignores': {
            type: 'array',
            items: {
              allOf: [
                { type: 'string' },
                { not: { type: 'string', pattern: ':exit$' }},
                { not: { type: 'string', pattern: '^\\s*$' }}
              ]
            },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ]
  }
}
