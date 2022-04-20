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
 * @param {Program} program
 */
function getTargetStatementPosition(program) {
  const skipStatements = new Set([
    'ImportDeclaration',
    'TSInterfaceDeclaration',
    'TSTypeAliasDeclaration',
    'DebuggerStatement',
    'EmptyStatement'
  ])

  for (const [index, item] of program.body.entries()) {
    if (!skipStatements.has(item.type) && !isUseStrictStatement(item)) {
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
        const firstStatementIndex = getTargetStatementPosition(program)
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
   * Move all lines of "node" with its comments to before the "beforeNode"
   * @param {RuleFixer} fixer
   * @param {ASTNode} node
   * @param {ASTNode} beforeNode
   */
  function moveNodeBefore(fixer, node, beforeNode) {
    const insertIndex = getLineStartIndex(beforeNode)
    const moveRange = getMoveRange(node)
    const textNode = sourceCode.getText(
      node,
      node.range[0] - moveRange[0],
      moveRange[1] - node.range[1]
    )

    return [
      fixer.insertTextAfterRange([insertIndex, insertIndex], textNode),
      fixer.removeRange(moveRange)
    ]
  }

  /**
   * Get [start, end] range before/after node which we need to move
   * @param {ASTNode} node
   * @return {[number, number]}
   */
  function getMoveRange(node) {
    const afterCutToken = sourceCode.getTokenBefore(node)
    const startCutToken = sourceCode.getTokenAfter(afterCutToken, {
      includeComments: true
    })
    // start is the beginning of line of first comment before node
    const start = getLineStartIndex(startCutToken)
    // end is the position of new line after node
    const end = getNextLineStartIndex(node)

    return [start, end]
  }

  /**
   * Get position of the beginning of next empty line
   * @param {ASTNode} token
   */
  function getNextLineStartIndex(token) {
    const nextToken = sourceCode.getTokenAfter(token, {
      includeComments: true
    })

    // if we have next token on the same line - get index right before that token
    if (nextToken.loc.start.line === token.loc.end.line) {
      return nextToken.range[0]
    }

    return sourceCode.getIndexFromLoc({
      line: token.loc.end.line + 1,
      column: 0
    })
  }

  /**
   * Get position of the beginning of token's line
   * @param {ASTNode | Token} token
   */
  function getLineStartIndex(token) {
    const prevIndex = sourceCode.getTokenBefore(token, {
      includeComments: true
    })

    // if we have prev token on the same line - get index right after that token
    if (prevIndex.loc.end.line === token.loc.start.line) {
      return prevIndex.range[1]
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
