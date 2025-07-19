/**
 * @author 2nofa11
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { findVariable } = require('@eslint-community/eslint-utils')
const utils = require('../utils')

/**
 * Check TypeScript type node for MaybeRef/MaybeRefOrGetter
 * @param {import('@typescript-eslint/types').TSESTree.TypeNode | undefined} typeNode
 * @returns {boolean}
 */
function isMaybeRefTypeNode(typeNode) {
  if (!typeNode) return false
  if (
    typeNode.type === 'TSTypeReference' &&
    typeNode.typeName &&
    typeNode.typeName.type === 'Identifier'
  ) {
    return (
      typeNode.typeName.name === 'MaybeRef' ||
      typeNode.typeName.name === 'MaybeRefOrGetter'
    )
  }
  if (typeNode.type === 'TSUnionType') {
    return typeNode.types.some((t) => isMaybeRefTypeNode(t))
  }
  return false
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require `MaybeRef` values to be unwrapped with `unref()` before using in conditions',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-mayberef-unwrap.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      requireUnref:
        'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref({{name}})` instead.',
      wrapWithUnref: 'Wrap with unref().'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * Determine if identifier should be considered MaybeRef
     * @param {Identifier} node
     */
    function isMaybeRef(node) {
      const variable = findVariable(utils.getScope(context, node), node)
      const id = variable?.defs[0]?.node?.id
      if (id?.type === 'Identifier' && id.typeAnnotation) {
        return isMaybeRefTypeNode(id.typeAnnotation.typeAnnotation)
      }
      return false
    }

    /**
     * Reports if the identifier is a MaybeRef type
     * @param {Identifier} node
     */
    function reportIfMaybeRef(node) {
      if (!isMaybeRef(node)) return

      const sourceCode = context.getSourceCode()
      context.report({
        node,
        messageId: 'requireUnref',
        data: { name: node.name },
        suggest: [
          {
            messageId: 'wrapWithUnref',
            /** @param {*} fixer */
            fix(fixer) {
              return fixer.replaceText(
                node,
                `unref(${sourceCode.getText(node)})`
              )
            }
          }
        ]
      })
    }

    return {
      // if (maybeRef)
      /** @param {Identifier} node */
      'IfStatement>Identifier'(node) {
        reportIfMaybeRef(node)
      },
      // maybeRef ? x : y
      /** @param {Identifier & {parent: ConditionalExpression}} node */
      'ConditionalExpression>Identifier'(node) {
        if (node.parent.test === node) {
          reportIfMaybeRef(node)
        }
      },
      // !maybeRef, +maybeRef, -maybeRef, ~maybeRef, typeof maybeRef
      /** @param {Identifier} node */
      'UnaryExpression>Identifier'(node) {
        reportIfMaybeRef(node)
      },
      // maybeRef || other, maybeRef && other, maybeRef ?? other
      /** @param {Identifier & {parent: LogicalExpression}} node */
      'LogicalExpression>Identifier'(node) {
        reportIfMaybeRef(node)
      },
      // maybeRef == x, maybeRef != x, maybeRef === x, maybeRef !== x
      /** @param {Identifier} node */
      'BinaryExpression>Identifier'(node) {
        reportIfMaybeRef(node)
      },
      // Boolean(maybeRef), String(maybeRef)
      /** @param {Identifier} node */
      'CallExpression>Identifier'(node) {
        if (
          node.parent &&
          node.parent.type === 'CallExpression' &&
          node.parent.callee &&
          node.parent.callee.type === 'Identifier' &&
          ['Boolean', 'String'].includes(node.parent.callee.name) &&
          node.parent.arguments[0] === node
        ) {
          reportIfMaybeRef(node)
        }
      }
    }
  }
}
