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
const DEFAULT_ORDER = [MACROS_EMITS, MACROS_PROPS]

/**
 * Get an index of the first statement after imports in order to place
 * defineEmits and defineProps before this statement
 * @param {Program} program
 */
function getStatementAfterImportsIndex(program) {
  let index = -1

  program.body.some((item, i) => {
    index = i
    return item.type !== 'ImportDeclaration'
  })

  return index
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
    throw new Error('Macros has parent')
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
        const firstStatementIndex = getStatementAfterImportsIndex(program)
        const firstStatement = program.body[firstStatementIndex]

        // have both defineEmits and defineProps
        if (shouldFirstNode && shouldSecondNode) {
          const secondStatement = program.body[firstStatementIndex + 1]

          // need move only first
          if (firstStatement === shouldSecondNode) {
            reportNotOnTop(order[1], shouldFirstNode, firstStatement)
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
   * Move one newline with "node" to before the "beforeNode"
   * @param {RuleFixer} fixer
   * @param {ASTNode} node
   * @param {ASTNode} beforeNode
   */
  function moveNodeBefore(fixer, node, beforeNode) {
    const beforeNodeToken = sourceCode.getTokenBefore(node, {
      includeComments: true
    })
    const beforeNodeIndex = getNewLineIndex(node)
    const textNode = sourceCode.getText(node, node.range[0] - beforeNodeIndex)
    /** @type {[number, number]} */
    const removeRange = [beforeNodeToken.range[1], node.range[1]]
    const index = getNewLineIndex(beforeNode)

    return [
      fixer.insertTextAfterRange([index, index], textNode),
      fixer.removeRange(removeRange)
    ]
  }

  /**
   * Get index of first new line before the "node"
   * @param {ASTNode} node
   * @return {number}
   */
  function getNewLineIndex(node) {
    const after = sourceCode.getTokenBefore(node, { includeComments: true })
    const hasWhitespace = node.loc.start.line - after.loc.end.line > 1

    if (!hasWhitespace) {
      return after.range[1]
    }

    return sourceCode.getIndexFromLoc({
      line: node.loc.start.line - 1,
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
