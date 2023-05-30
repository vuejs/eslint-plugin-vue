/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

const DEFAULT_OPTIONS = {
  defineProps: 'props',
  defineEmits: 'emit',
  defineSlots: 'slots',
  useSlots: 'slots',
  useAttrs: 'attrs'
}

module.exports = {
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'require a certain macro variable name',
      categories: undefined,
      url: ''
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          defineProps: {
            type: 'string'
          },
          defineEmits: {
            type: 'string'
          },
          defineSlots: {
            type: 'string'
          },
          useSlots: {
            type: 'string'
          },
          useAttrs: {
            type: 'string'
          }
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
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || DEFAULT_OPTIONS
    const relevantMacros = [...Object.keys(DEFAULT_OPTIONS), 'withDefaults']

    return utils.defineScriptSetupVisitor(context, {
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee.type === 'Identifier' &&
          relevantMacros.includes(node.init.callee.name)
        ) {
          const macroName =
            node.init.callee.name === 'withDefaults'
              ? 'defineProps'
              : node.init.callee.name

          if (
            node.id.type === 'Identifier' &&
            node.id.name !== options[macroName]
          ) {
            context.report({
              node: node.id,
              loc: node.id.loc,
              messageId: 'requireName',
              data: {
                macroName,
                variableName: options[macroName]
              },
              suggest: [
                {
                  messageId: 'changeName',
                  data: {
                    variableName: options[macroName]
                  },
                  fix(fixer) {
                    return fixer.replaceText(node.id, options[macroName])
                  }
                }
              ]
            })
          }
        }
      }
    })
  }
}
