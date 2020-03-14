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
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-ref-as-operand.html'
    },
    fixable: null,
    schema: [],
    messages: {
      requireDotValue: 'Must use `.value` to read or write the value wrapped by `ref()`.'
    }
  },
  create (context) {
    const refReferenceIds = new Map()

    function reportIfRefWrapped (node) {
      if (!refReferenceIds.has(node)) {
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
          const variableDeclarator = node.parent
          if (
            !variableDeclarator ||
            variableDeclarator.type !== 'VariableDeclarator' ||
            variableDeclarator.id.type !== 'Identifier'
          ) {
            continue
          }
          const variable = findVariable(context.getScope(), variableDeclarator.id)
          if (!variable) {
            continue
          }
          const variableDeclaration = (
            variableDeclarator.parent &&
            variableDeclarator.parent.type === 'VariableDeclaration' &&
            variableDeclarator.parent
          ) || null
          for (const reference of variable.references) {
            if (!reference.isRead()) {
              continue
            }

            refReferenceIds.set(reference.identifier, {
              variableDeclarator,
              variableDeclaration
            })
          }
        }
      },
      // if (refValue)
      'IfStatement>Identifier' (node) {
        reportIfRefWrapped(node)
      },
      // switch (refValue)
      'SwitchStatement>Identifier' (node) {
        reportIfRefWrapped(node)
      },
      // -refValue, +refValue, !refValue, ~refValue, typeof refValue
      'UnaryExpression>Identifier' (node) {
        reportIfRefWrapped(node)
      },
      // refValue++, refValue--
      'UpdateExpression>Identifier' (node) {
        reportIfRefWrapped(node)
      },
      // refValue+1, refValue-1
      'BinaryExpression>Identifier' (node) {
        reportIfRefWrapped(node)
      },
      // refValue+=1, refValue-=1, foo+=refValue, foo-=refValue
      'AssignmentExpression>Identifier' (node) {
        reportIfRefWrapped(node)
      },
      // refValue || other, refValue && other. ignore: other || refValue
      'LogicalExpression>Identifier' (node) {
        if (node.parent.left !== node) {
          return
        }
        // Report only constants.
        const info = refReferenceIds.get(node)
        if (!info) {
          return
        }
        if (!info.variableDeclaration || info.variableDeclaration.kind !== 'const') {
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
