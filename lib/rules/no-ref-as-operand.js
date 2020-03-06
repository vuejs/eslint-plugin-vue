/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { ReferenceTracker, findVariable } = require('eslint-utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of value wrapped by `ref()` (Composition API) as an operand',
      category: undefined,
      url: 'https://eslint.vuejs.org/rules/no-ref-as-operand.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      requireDotValue: 'Must use `.value` to read or write the value wrapped with `ref()`.'
    }
  },
  create (context) {
    const refCallNodes = new Set()

    const refReferences = new Set()

    function reportIfRefWrapped (node) {
      if (!refReferences.has(node)) {
        return
      }
      context.report({
        node,
        messageId: 'requireDotValue'
      })
    }
    return {
      'Program' () {
        const tracker = new ReferenceTracker(context.getScope())
        const traceMap = {
          vue: {
            [ReferenceTracker.ESM]: true,
            ref: {
              [ReferenceTracker.CALL]: true
            }
          }
        }

        for (const { node } of tracker.iterateEsmReferences(traceMap)) {
          refCallNodes.add(node)
        }
      },
      'VariableDeclarator>CallExpression' (node) {
        const varDecl = node.parent
        if (varDecl.id.type !== 'Identifier') {
          return
        }
        if (!refCallNodes.has(node)) {
          return
        }
        const variable = findVariable(context.getScope(), varDecl.id)
        if (!variable) {
          return
        }
        for (const reference of variable.references) {
          if (!reference.isRead()) {
            continue
          }
          refReferences.add(reference.identifier)
        }
      },
      // if (refValue)
      'IfStatement>Identifier' (node) {
        if (node.parent.test !== node) {
          return
        }
        reportIfRefWrapped(node)
      },
      // switch (refValue)
      'SwitchStatement>Identifier' (node) {
        if (node.parent.discriminant !== node) {
          return
        }
        reportIfRefWrapped(node)
      },
      // -refValue, +refValue, !refValue, ~refValue, typeof refValue
      'UnaryExpression>Identifier' (node) {
        if (node.parent.argument !== node) {
          return
        }
        reportIfRefWrapped(node)
      },
      // refValue++, refValue--
      'UpdateExpression>Identifier' (node) {
        if (node.parent.argument !== node) {
          return
        }
        reportIfRefWrapped(node)
      },
      // refValue+1, refValue-1
      'BinaryExpression>Identifier' (node) {
        reportIfRefWrapped(node)
      },
      // refValue+=1, refValue-=1
      'AssignmentExpression>Identifier' (node) {
        if (node.parent.left !== node) {
          return
        }
        reportIfRefWrapped(node)
      },
      // refValue || other, refValue && other. ignore: other || refValue
      'LogicalExpression>Identifier' (node) {
        if (node.parent.left !== node) {
          return
        }
        reportIfRefWrapped(node)
      },
      // refValue ? x : y
      'ConditionalExpression>Identifier' (node) {
        if (node.parent.test !== node) {
          return
        }
        reportIfRefWrapped(node)
      }
    }
  }
}
