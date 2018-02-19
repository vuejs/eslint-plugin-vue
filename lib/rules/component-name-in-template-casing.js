/**
 * @author Yosuke Ota
 * issue https://github.com/vuejs/eslint-plugin-vue/issues/250
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const casing = require('../utils/casing')

const allowedCaseOptions = ['PascalCase', 'kebab-case']

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce specific casing for the component name in tamplates',
      category: 'strongly-recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.2.2/docs/rules/component-name-in-template-casing.md'
    },
    fixable: 'code',
    schema: [
      {
        enum: allowedCaseOptions
      }
    ]
  },

  create (context) {
    const options = context.options[0]
    const caseType = allowedCaseOptions.indexOf(options) !== -1 ? options : 'PascalCase'
    const tokens = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore()
    const sourceCode = context.getSourceCode()

    let hasInvalidEOF = false

    return utils.defineTemplateBodyVisitor(context, {
      'VElement' (node) {
        if (hasInvalidEOF) {
          return
        }

        if (!utils.isCustomComponent(node)) {
          return
        }

        const name = node.rawName
        const casingName = casing.getConverter(caseType)(name)
        if (casingName !== name) {
          const startTag = node.startTag
          const open = tokens.getFirstToken(startTag)
          context.report({
            node: open,
            loc: open.loc,
            message: 'Component name "{{name}}" is not {{caseType}}.',
            data: {
              name,
              caseType: caseType
            },
            fix: fixer => {
              const endTag = node.endTag
              if (!endTag) {
                return fixer.replaceText(open, `<${casingName}`)
              }
              // If we can upgrade requirements to `eslint@>4.1.0`, this code can be replaced by:
              // return [
              //   fixer.replaceText(open, `<${casingName}`),
              //   fixer.replaceText(endTag, `</${casingName}>`)
              // ]
              const code = `<${casingName}${sourceCode.text.slice(open.range[1], endTag.range[0])}</${casingName}>`
              return fixer.replaceTextRange([open.range[0], endTag.range[1]], code)
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
