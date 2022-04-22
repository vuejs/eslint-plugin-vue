/**
 * @author Eduard Deisling
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const MACROS_EMITS = 'defineEmits'
const MACROS_PROPS = 'defineProps'
const ORDER = [MACROS_EMITS, MACROS_PROPS]
const DEFAULT_ORDER = [MACROS_PROPS, MACROS_EMITS]

/**
 * @param {VElement} scriptSetup
 * @param {ASTNode} node
 */
function inScriptSetup(scriptSetup, node) {
  return (
    scriptSetup.range[0] <= node.range[0] &&
    node.range[1] <= scriptSetup.range[1]
  )
}

/**
 * @param {ASTNode} node
 */
function isUseStrictStatement(node) {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'Literal' &&
    node.expression.value === 'use strict'
  )
}

/**
 * Get an index of the first statement after imports and interfaces in order
 * to place defineEmits and defineProps before this statement
 * @param {VElement} scriptSetup
 * @param {Program} program
 */
function getTargetStatementPosition(scriptSetup, program) {
  const skipStatements = new Set([
    'ImportDeclaration',
    'TSInterfaceDeclaration',
    'TSTypeAliasDeclaration',
    'DebuggerStatement',
    'EmptyStatement'
  ])

  for (const [index, item] of program.body.entries()) {
    if (
      inScriptSetup(scriptSetup, item) &&
      !skipStatements.has(item.type) &&
      !isUseStrictStatement(item)
    ) {
      return index
    }
  }

  return -1
}

/**
 * We need to handle cases like "const props = defineProps(...)"
 * Define macros must be used only on top, so we can look for "Program" type
 * inside node.parent.type
 * @param {CallExpression|ASTNode} node
 * @return {ASTNode}
 */
function getDefineMacrosStatement(node) {
  if (!node.parent) {
    throw new Error('Node has no parent')
  }

  if (node.parent.type === 'Program') {
    return node
  }

  return getDefineMacrosStatement(node.parent)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @param {RuleContext} context */
function create(context) {
  const scriptSetup = utils.getScriptSetupElement(context)

  if (!scriptSetup) {
    return {}
  }

  const sourceCode = context.getSourceCode()
  const options = context.options
  /** @type {[string, string]} */
  const order = (options[0] && options[0].order) || DEFAULT_ORDER
  /** @type {Map<string, ASTNode>} */
  const macrosNodes = new Map()

  return utils.compositingVisitors(
    utils.defineScriptSetupVisitor(context, {
      onDefinePropsExit(node) {
        macrosNodes.set(MACROS_PROPS, getDefineMacrosStatement(node))
      },
      onDefineEmitsExit(node) {
        macrosNodes.set(MACROS_EMITS, getDefineMacrosStatement(node))
      }
    }),
    {
      'Program:exit'(program) {
        const shouldFirstNode = macrosNodes.get(order[0])
        const shouldSecondNode = macrosNodes.get(order[1])
        const firstStatementIndex = getTargetStatementPosition(
          scriptSetup,
          program
        )
        const firstStatement = program.body[firstStatementIndex]

        // have both defineEmits and defineProps
        if (shouldFirstNode && shouldSecondNode) {
          const secondStatement = program.body[firstStatementIndex + 1]

          // need move only first
          if (firstStatement === shouldSecondNode) {
            reportNotOnTop(order[0], shouldFirstNode, firstStatement)
            return
          }

          // need move both defineEmits and defineProps
          if (firstStatement !== shouldFirstNode) {
            reportBothNotOnTop(
              shouldFirstNode,
              shouldSecondNode,
              firstStatement
            )
            return
          }

          // need move only second
          if (secondStatement !== shouldSecondNode) {
            reportNotOnTop(order[1], shouldSecondNode, shouldFirstNode)
          }

          return
        }

        // have only first and need to move it
        if (shouldFirstNode && firstStatement !== shouldFirstNode) {
          reportNotOnTop(order[0], shouldFirstNode, firstStatement)
          return
        }

        // have only second and need to move it
        if (shouldSecondNode && firstStatement !== shouldSecondNode) {
          reportNotOnTop(order[1], shouldSecondNode, firstStatement)
        }
      }
    }
  )

  /**
   * @param {ASTNode} shouldFirstNode
   * @param {ASTNode} shouldSecondNode
   * @param {ASTNode} before
   */
  function reportBothNotOnTop(shouldFirstNode, shouldSecondNode, before) {
    context.report({
      node: shouldFirstNode,
      loc: shouldFirstNode.loc,
      messageId: 'macrosNotOnTop',
      data: {
        macro: order[0]
      },
      fix(fixer) {
        return [
          ...moveNodeBefore(fixer, shouldFirstNode, before),
          ...moveNodeBefore(fixer, shouldSecondNode, before)
        ]
      }
    })
  }

  /**
   * @param {string} macro
   * @param {ASTNode} node
   * @param {ASTNode} before
   */
  function reportNotOnTop(macro, node, before) {
    context.report({
      node,
      loc: node.loc,
      messageId: 'macrosNotOnTop',
      data: {
        macro
      },
      fix(fixer) {
        return moveNodeBefore(fixer, node, before)
      }
    })
  }

  /**
   * Move all lines of "node" with its comments to before the "target"
   * @param {RuleFixer} fixer
   * @param {ASTNode} node
   * @param {ASTNode} target
   */
  function moveNodeBefore(fixer, node, target) {
    // get comments under tokens(if any)
    const beforeNodeToken = sourceCode.getTokenBefore(node)
    const nodeComment = sourceCode.getTokenAfter(beforeNodeToken, {
      includeComments: true
    })
    const nextNodeComment = sourceCode.getTokenAfter(node, {
      includeComments: true
    })
    // get positions of what we need to remove
    const cutStart = getLineStartIndex(nodeComment, beforeNodeToken)
    const cutEnd = getLineStartIndex(nextNodeComment, node)
    // get space before target
    const beforeTargetToken = sourceCode.getTokenBefore(target)
    const targetComment = sourceCode.getTokenAfter(beforeTargetToken, {
      includeComments: true
    })
    const textSpace = getTextBetweenTokens(beforeTargetToken, targetComment)
    // make insert text: comments + node + space before target
    const textNode = sourceCode.getText(
      node,
      node.range[0] - nodeComment.range[0]
    )
    const insertText = textNode + textSpace

    return [
      fixer.insertTextBefore(targetComment, insertText),
      fixer.removeRange([cutStart, cutEnd])
    ]
  }

  /**
   * @param {ASTNode} tokenBefore
   * @param {ASTNode} tokenAfter
   */
  function getTextBetweenTokens(tokenBefore, tokenAfter) {
    return sourceCode.text.slice(tokenBefore.range[1], tokenAfter.range[0])
  }

  /**
   * Get position of the beginning of the token's line(or prevToken end if no line)
   * @param {ASTNode} token
   * @param {ASTNode} prevToken
   */
  function getLineStartIndex(token, prevToken) {
    // if we have next token on the same line - get index right before that token
    if (token.loc.start.line === prevToken.loc.end.line) {
      return prevToken.range[1]
    }

    return sourceCode.getIndexFromLoc({
      line: token.loc.start.line,
      column: 0
    })
  }
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce order of `defineEmits` and `defineProps` compiler macros',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-macros-order.html'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              enum: Object.values(ORDER)
            },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      macrosNotOnTop:
        '{{macro}} should be the first statement in `<script setup>` (after any potential import statements or type definitions).'
    }
  },
  create
}
