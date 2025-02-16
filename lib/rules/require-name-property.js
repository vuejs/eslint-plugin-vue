/**
 * @fileoverview Require a name property in Vue components
 * @author LukeeeeBennett
 */
'use strict'

const path = require('path')
const utils = require('../utils')
const { getVueComponentDefinitionType } = require('../utils')
/**
 * Get the text of the empty indentation part of the line which the given token is on.
 * @param {SourceCode} sourceCode the source code object
 * @param {Token} token the token to get the indentation text of the line which the token is on
 * @returns {string} The text of indentation part.
 */
function getLineEmptyIndent(sourceCode, token) {
  const LT_CHAR = /[\n\r\u2028\u2029]/
  const EMPTY_CHAR = /\s/
  const text = sourceCode.text
  let i = token.range[0] - 1

  while (i >= 0 && !LT_CHAR.test(text[i])) {
    i -= 1
  }
  let j = i
  while (EMPTY_CHAR.test(text[j])) {
    j += 1
  }

  return text.slice(i + 1, j)
}
/**
 * @param {Property | SpreadElement} node
 * @returns {node is ObjectExpressionProperty}
 */
function isNameProperty(node) {
  return (
    node.type === 'Property' &&
    utils.getStaticPropertyName(node) === 'name' &&
    !node.computed
  )
}

/**
 * Report error if there has no name property
 * @param {RuleContext} context
 * @param {CallExpression | ObjectExpression} node
 * @param {ObjectExpression} expression
 */
function report(context, node, expression) {
  context.report({
    node,
    messageId: 'missingName',
    suggest: [
      {
        messageId: 'addName',
        fix(fixer) {
          const extension = path.extname(context.getFilename())
          const filename = path.basename(context.getFilename(), extension)
          const sourceCode = context.getSourceCode()

          if (expression.properties.length > 0) {
            const firstToken = sourceCode.getFirstToken(
              expression.properties[0]
            )
            const indentText = getLineEmptyIndent(sourceCode, firstToken)
            // insert name property before the first property
            return fixer.insertTextBefore(
              expression.properties[0],
              `name: '${filename}',\n${indentText}`
            )
          }

          const firstToken = sourceCode.getFirstToken(expression)
          const lastToken = sourceCode.getLastToken(expression)
          // if the component is empty, insert name property and indent
          if (firstToken.value === '{' && lastToken.value === '}') {
            const indentText = getLineEmptyIndent(sourceCode, firstToken)
            return fixer.replaceTextRange(
              [firstToken.range[1], lastToken.range[0]],
              `\n${indentText}  name: '${filename}'\n${indentText}`
            )
          }

          return null
        }
      }
    ]
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require a name property in Vue components',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-name-property.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          checkScriptSetup: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missingName: 'Required name property is not set.',
      addName: 'Add name property to component.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const option = context.options[1] || {}
    const checkScriptSetup = !!option.checkScriptSetup

    return utils.compositingVisitors(
      checkScriptSetup
        ? utils.defineScriptSetupVisitor(context, {
            onDefineOptionsEnter(node) {
              if (node.arguments.length === 0) return
              const define = node.arguments[0]
              if (define.type !== 'ObjectExpression') return
              const nameNode = utils.findProperty(define, 'name')
              if (nameNode) return

              report(context, node, define)
            }
          })
        : {},
      utils.executeOnVue(context, (component, type) => {
        if (type === 'definition') {
          const defType = getVueComponentDefinitionType(component)
          if (defType === 'mixin') {
            return
          }
        }

        if (component.properties.some(isNameProperty)) return

        report(context, component, component)
      })
    )
  }
}
