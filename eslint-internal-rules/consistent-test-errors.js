'use strict'

const ORDER = [
  'messageId',
  'data',
  'message',
  'type',
  'line',
  'column',
  'endLine',
  'endColumn',
  'suggestions'
]
const REQUIRED_PROPERTIES = ['line', 'column', 'endLine', 'endColumn']

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce consistent structure of test error objects',
      categories: ['Internal']
    },
    fixable: 'code',
    schema: [],
    messages: {
      stringError:
        'String error should be replaced with an object: { message: {{error}} }.',
      wrongOrder: 'Error object properties should be ordered: {{expected}}.',
      missingPositions:
        'Error object is missing required position properties: {{missing}}.'
    }
  },

  create(context) {
    const sourceCode = context.sourceCode

    return {
      'Property[key.name="errors"] > ArrayExpression > :matches(Literal, TemplateLiteral)'(
        node
      ) {
        if (node.type === 'Literal' && typeof node.value !== 'string') {
          return
        }
        const error = sourceCode.getText(node)

        context.report({
          node,
          messageId: 'stringError',
          data: { error },
          fix(fixer) {
            return fixer.replaceText(node, `{ message: ${error} }`)
          }
        })
      },

      'Property[key.name="errors"] > ArrayExpression > ObjectExpression'(node) {
        // Skip objects containing spread elements or computed properties
        if (node.properties.some((p) => p.type !== 'Property' || p.computed)) {
          return
        }

        const props = /** @type {import('eslint').Rule.Node[]} */ (
          node.properties
        )

        const names = props.map((prop) =>
          prop.key.type === 'Identifier'
            ? prop.key.name
            : String(prop.key.value)
        )

        // Report missing required position properties
        const missing = REQUIRED_PROPERTIES.filter(
          (prop) => !names.includes(prop)
        )
        if (missing.length > 0) {
          context.report({
            node,
            messageId: 'missingPositions',
            data: { missing: missing.join(', ') }
          })
        }

        // Report wrong property order
        const newOrder = names
          .map((_, index) => index)
          .sort((a, b) => {
            const indexA = ORDER.indexOf(names[a])
            const indexB = ORDER.indexOf(names[b])
            if (indexA === -1 && indexB === -1) {
              return 0
            }
            if (indexA === -1) {
              return 1
            }
            if (indexB === -1) {
              return -1
            }
            return indexA - indexB
          })

        if (newOrder.every((v, i) => v === i)) {
          return
        }

        const desiredTargetOrder = newOrder
          .map((i) => names[i])
          .filter((n) => ORDER.includes(n))

        context.report({
          node,
          messageId: 'wrongOrder',
          data: { expected: desiredTargetOrder.join(', ') },
          fix(fixer) {
            const src = sourceCode.getText()
            const objStart = node.range[0]
            const objEnd = node.range[1]

            const gapBeforeFirst = src.slice(objStart + 1, props[0].range[0])
            const sep = src.slice(props[0].range[1], props[1].range[0])
            const tail = src.slice(props.at(-1).range[1], objEnd - 1)
            const propTexts = props.map((prop) =>
              src.slice(prop.range[0], prop.range[1])
            )

            let newText = `{${gapBeforeFirst}`
            for (let i = 0; i < newOrder.length; i++) {
              newText += propTexts[newOrder[i]]
              if (i < newOrder.length - 1) {
                newText += sep
              }
            }
            newText += `${tail}}`

            return fixer.replaceTextRange([objStart, objEnd], newText)
          }
        })
      }
    }
  }
}
