/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

const DEFAULT_OPTIONS = {
  defineModel: 'modelValue',
  defineProps: 'props',
  defineEmits: 'emit',
  defineSlots: 'slots',
  useSlots: 'slots',
  useAttrs: 'attrs'
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require a certain macro variable name',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-macro-variable-name.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          defineModel: { type: 'string' },
          defineProps: { type: 'string' },
          defineEmits: { type: 'string' },
          defineSlots: { type: 'string' },
          useSlots: { type: 'string' },
          useAttrs: { type: 'string' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      requireName:
        'The variable name of "{{macroName}}" must be "{{variableName}}".',
      changeName: 'Change the variable name to "{{variableName}}".'
    }
  },
  create(context: RuleContext) {
    const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0])
    const relevantMacros = new Set([
      ...Object.keys(DEFAULT_OPTIONS),
      'withDefaults'
    ])

    return utils.defineScriptSetupVisitor(context, {
      VariableDeclarator(node) {
        if (
          !node.init ||
          node.init.type !== 'CallExpression' ||
          node.init.callee.type !== 'Identifier' ||
          !relevantMacros.has(node.init.callee.name) ||
          node.id.type !== 'Identifier'
        ) {
          return
        }

        const macroName =
          node.init.callee.name === 'withDefaults'
            ? 'defineProps'
            : node.init.callee.name

        let variableName: string = options[macroName]
        if (macroName === 'defineModel') {
          const [firstArg] = node.init.arguments
          if (firstArg && firstArg.type !== 'ObjectExpression') {
            // `defineModel('name')` must be assigned to a variable called `name`
            if (
              firstArg.type !== 'Literal' ||
              typeof firstArg.value !== 'string'
            ) {
              return
            }
            variableName = firstArg.value
          }
        }

        if (node.id.name !== variableName) {
          context.report({
            node: node.id,
            loc: node.id.loc,
            messageId: 'requireName',
            data: {
              macroName,
              variableName
            },
            suggest: [
              {
                messageId: 'changeName',
                data: {
                  variableName
                },
                fix(fixer) {
                  return fixer.replaceText(node.id, variableName)
                }
              }
            ]
          })
        }
      }
    })
  }
}
