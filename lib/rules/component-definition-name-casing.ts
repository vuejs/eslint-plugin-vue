/**
 * @fileoverview enforce specific casing for component definition name
 * @author Armano
 */
import utils from '../utils/index.js'
import { getChecker, getExactConverter } from '../utils/casing.ts'

const allowedCaseOptions = ['PascalCase', 'kebab-case']

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
      const nodeValue = utils.getStringLiteralValue(node)
      if (nodeValue === null || getChecker(caseType)(nodeValue)) return

      context.report({
        node,
        messageId: 'incorrectCase',
        data: {
          value: nodeValue,
          caseType
        },
        fix: (fixer) =>
          fixer.replaceTextRange(
            [node.range[0] + 1, node.range[1] - 1],
            getExactConverter(caseType)(nodeValue)
          )
      })
    }

    return utils.compositingVisitors(
      utils.executeOnCallVueComponent(context, (node) => {
        if (node.arguments.length !== 2) {
          return
        }

        const argument = node.arguments[0]

        if (utils.isStringLiteral(argument)) {
          convertName(argument)
        }
      }),
      utils.executeOnVue(context, (obj) => {
        const node = utils.findProperty(obj, 'name')

        if (!node || !utils.isStringLiteral(node.value)) return
        convertName(node.value)
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefineOptionsEnter(node) {
          if (node.arguments.length === 0) return
          const define = node.arguments[0]
          if (define.type !== 'ObjectExpression') return
          const nameNode = utils.findProperty(define, 'name')
          if (!nameNode || !utils.isStringLiteral(nameNode.value)) return
          convertName(nameNode.value)
        }
      })
    )
  }
}
