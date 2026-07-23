/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
import { pascalCase } from '../utils/casing.ts'
import utils from '../utils/index.js'

interface Options {
  /** The style for the default slot at a custom component directly. */
  atComponent: 'shorthand' | 'longform' | 'v-slot'
  /** The style for the default slot at a template wrapper. */
  default: 'shorthand' | 'longform' | 'v-slot'
  /** The style for named slots at a template wrapper. */
  named: 'shorthand' | 'longform'
}

function normalizeOptions(options: any): Options {
  const normalized: Options = {
    atComponent: 'v-slot',
    default: 'shorthand',
    named: 'shorthand'
  }

  if (typeof options === 'string') {
    normalized.atComponent =
      normalized.default =
      normalized.named =
        options as 'shorthand' | 'longform'
  } else if (options != null) {
    const keys: (keyof Options)[] = ['atComponent', 'default', 'named']
    for (const key of keys) {
      if (options[key] != null) {
        normalized[key] = options[key]
      }
    }
  }

  return normalized
}

/**
 * Get the expected style.
 */
function getExpectedStyle(
  options: Options,
  node: VDirective
): 'shorthand' | 'longform' | 'v-slot' {
  const { argument } = node.key

  if (
    argument == null ||
    (argument.type === 'VIdentifier' && argument.name === 'default')
  ) {
    const element = node.parent.parent
    return element.name === 'template' ? options.default : options.atComponent
  }
  return options.named
}

/**
 * Get the expected style.
 */
function getActualStyle(node: VDirective): 'shorthand' | 'longform' | 'v-slot' {
  const { name, argument } = node.key

  if (name.rawName === '#') {
    return 'shorthand'
  }
  if (argument != null) {
    return 'longform'
  }
  return 'v-slot'
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce `v-slot` directive style',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/v-slot-style.html'
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [
          { enum: ['shorthand', 'longform'] },
          {
            type: 'object',
            properties: {
              atComponent: { enum: ['shorthand', 'longform', 'v-slot'] },
              default: { enum: ['shorthand', 'longform', 'v-slot'] },
              named: { enum: ['shorthand', 'longform'] }
            },
            additionalProperties: false
          }
        ]
      }
    ],
    messages: {
      expectedShorthand: "Expected '#{{argument}}' instead of '{{actual}}'.",
      expectedLongform:
        "Expected 'v-slot:{{argument}}' instead of '{{actual}}'.",
      expectedVSlot: "Expected 'v-slot' instead of '{{actual}}'."
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const options = normalizeOptions(context.options[0])

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='slot']"(node) {
        const expected = getExpectedStyle(options, node)
        const actual = getActualStyle(node)
        if (actual === expected) {
          return
        }

        const { name, argument } = node.key
        const range: Range = [name.range[0], (argument || name).range[1]]
        const argumentText = argument ? sourceCode.getText(argument) : 'default'
        context.report({
          node,
          messageId: `expected${pascalCase(expected)}`,
          data: {
            actual: sourceCode.text.slice(range[0], range[1]),
            argument: argumentText
          },

          fix(fixer) {
            switch (expected) {
              case 'shorthand': {
                return fixer.replaceTextRange(range, `#${argumentText}`)
              }
              case 'longform': {
                return fixer.replaceTextRange(range, `v-slot:${argumentText}`)
              }
              case 'v-slot': {
                return fixer.replaceTextRange(range, 'v-slot')
              }
              default: {
                return null
              }
            }
          }
        })
      }
    })
  }
}
