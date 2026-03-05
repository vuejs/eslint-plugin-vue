/**
 * @fileoverview enforce specific casing for component definition name
 * @author Armano
 */
import utils from '../utils'
import { getChecker, getExactConverter } from '../utils/casing.ts'

const allowedCaseOptions = ['PascalCase', 'kebab-case']

function canConvert(
  node: Expression | SpreadElement
): node is Literal | TemplateLiteral {
  return (
    node.type === 'Literal' ||
    (node.type === 'TemplateLiteral' &&
      node.expressions.length === 0 &&
      node.quasis.length === 1)
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce specific casing for component definition name',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/component-definition-name-casing.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: allowedCaseOptions
      }
    ],
    messages: {
      incorrectCase: 'Property name "{{value}}" is not {{caseType}}.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0]
    const caseType = allowedCaseOptions.includes(options)
      ? options
      : 'PascalCase'

    function convertName(node: Literal | TemplateLiteral) {
      let nodeValue: string
      let range: Range
      if (node.type === 'TemplateLiteral') {
        const quasis = node.quasis[0]
        nodeValue = quasis.value.cooked
        range = quasis.range
      } else {
        nodeValue = `${node.value}`
        range = node.range
      }

      if (!getChecker(caseType)(nodeValue)) {
        context.report({
          node,
          messageId: 'incorrectCase',
          data: {
            value: nodeValue,
            caseType
          },
          fix: (fixer) =>
            fixer.replaceTextRange(
              [range[0] + 1, range[1] - 1],
              getExactConverter(caseType)(nodeValue)
            )
        })
      }
    }

    return utils.compositingVisitors(
      utils.executeOnCallVueComponent(context, (node) => {
        if (node.arguments.length === 2) {
          const argument = node.arguments[0]

          if (canConvert(argument)) {
            convertName(argument)
          }
        }
      }),
      utils.executeOnVue(context, (obj) => {
        const node = utils.findProperty(obj, 'name')

        if (!node) return
        if (!canConvert(node.value)) return
        convertName(node.value)
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefineOptionsEnter(node) {
          if (node.arguments.length === 0) return
          const define = node.arguments[0]
          if (define.type !== 'ObjectExpression') return
          const nameNode = utils.findProperty(define, 'name')
          if (!nameNode) return
          if (!canConvert(nameNode.value)) return
          convertName(nameNode.value)
        }
      })
    )
  }
}
