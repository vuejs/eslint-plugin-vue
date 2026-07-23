/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
import type { CaseChecker } from '../utils/casing.ts'
import utils from '../utils/index.js'
import { getChecker } from '../utils/casing.ts'

type OptionType = 'camelCase' | 'kebab-case' | 'singleword'

/**
 * Checks whether the given string is a single word.
 */
function isSingleWord(str: string): boolean {
  return /^[a-z]+$/u.test(str)
}

const allowedCaseOptions: OptionType[] = [
  'camelCase',
  'kebab-case',
  'singleword'
]

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce specific casing for slot names',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/slot-name-casing.html'
    },
    fixable: null,
    schema: [
      {
        enum: allowedCaseOptions
      }
    ],
    messages: {
      invalidCase: 'Slot name "{{name}}" is not {{caseType}}.'
    }
  },
  create(context: RuleContext) {
    const option = context.options[0]

    const caseType: OptionType = allowedCaseOptions.includes(option)
      ? option
      : 'camelCase'

    const checker: CaseChecker =
      caseType === 'singleword' ? isSingleWord : getChecker(caseType)

    function processSlotNode(node: VAttribute) {
      const name = node.value?.value
      if (name && !checker(name)) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'invalidCase',
          data: {
            name,
            caseType
          }
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='slot']"(node: VElement) {
        const slotName = utils.getAttribute(node, 'name')
        if (slotName) {
          processSlotNode(slotName)
        }
      }
    })
  }
}
