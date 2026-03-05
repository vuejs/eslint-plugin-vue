/**
 * @fileoverview Requires specific casing for the Prop name in Vue components
 * @author Yu Kimura
 */
import type { ComponentProp } from '../utils/index.js'
import utils from '../utils/index.js'
import { getChecker } from '../utils/casing.ts'
import { toRegExpGroupMatcher } from '../utils/regexp.ts'

const allowedCaseOptions = ['camelCase', 'snake_case']

function create(context: RuleContext) {
  const options = context.options[0]
  const isIgnoredProp = toRegExpGroupMatcher(context.options[1]?.ignoreProps)
  const caseType = allowedCaseOptions.includes(options) ? options : 'camelCase'
  const checker = getChecker(caseType)

  function processProps(props: ComponentProp[]) {
    for (const item of props) {
      const propName = item.propName
      if (propName == null) {
        continue
      }
      if (!checker(propName) && !isIgnoredProp(propName)) {
        context.report({
          node: item.node,
          messageId: 'invalidCase',
          data: {
            name: propName,
            caseType
          }
        })
      }
    }
  }
  return utils.compositingVisitors(
    utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(_node, props) {
        processProps(props)
      }
    }),
    utils.executeOnVue(context, (obj) => {
      processProps(utils.getComponentPropsFromOptions(obj))
    })
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce specific casing for the Prop name in Vue components',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/prop-name-casing.html'
    },
    fixable: null, // null or "code" or "whitespace"
    schema: [
      {
        enum: allowedCaseOptions
      },
      {
        type: 'object',
        properties: {
          ignoreProps: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      invalidCase: 'Prop "{{name}}" is not in {{caseType}}.'
    }
  },
  create
}
