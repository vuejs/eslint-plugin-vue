/**
 * @author Yosuke Ota
 * issue https://github.com/vuejs/eslint-plugin-vue/issues/499
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const casing = require('../utils/casing')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const kebabConverter = casing.getConverter('kebab-case')

module.exports = {
  meta: {
    docs: {
      description: 'enforce the tag name of the Vue component and HTML element to be `kebab-case`',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.5.0/docs/rules/html-element-name-kebab-casing.md'
    },
    fixable: 'code',
    schema: []
  },

  create (context) {
    const tokens = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore()
    const sourceCode = context.getSourceCode()

    let hasInvalidEOF = false

    return utils.defineTemplateBodyVisitor(context, {
      'VElement' (node) {
        if (hasInvalidEOF) {
          return
        }

        if (utils.isSvgElementNode(node) || utils.isMathMLElementNode(node)) {
          return
        }

        const name = node.rawName
        const casingName = kebabConverter(name)
        if (casingName !== name) {
          const startTag = node.startTag
          const open = tokens.getFirstToken(startTag)

          context.report({
            node: open,
            loc: open.loc,
            message: 'Element name "{{name}}" is not kebab-case.',
            data: {
              name
            },
            fix: fixer => {
              const endTag = node.endTag
              if (!endTag) {
                return fixer.replaceText(open, `<${casingName}`)
              }
              const endTagOpen = tokens.getFirstToken(endTag)
              // If we can upgrade requirements to `eslint@>4.1.0`, this code can be replaced by:
              // return [
              //   fixer.replaceText(open, `<${casingName}`),
              //   fixer.replaceText(endTagOpen, `</${casingName}`)
              // ]
              const code = `<${casingName}${sourceCode.text.slice(open.range[1], endTagOpen.range[0])}</${casingName}`
              return fixer.replaceTextRange([open.range[0], endTagOpen.range[1]], code)
            }
          })
        }
      }
    }, {
      Program (node) {
        hasInvalidEOF = utils.hasInvalidEOF(node)
      }
    })
  }
}
