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
const defaultCase = 'PascalCase'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce specific casing for the component naming style in template',
      category: 'strongly-recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0/docs/rules/component-name-in-template-casing.md'
    },
    fixable: 'code',
    schema: [
      {
        enum: allowedCaseOptions
      },
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          },
          registeredComponentsOnly: {
            type: 'boolean'
          },
          globalRegisteredComponents: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          },
          globalRegisteredComponentPatterns: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ]
  },

  create (context) {
    const caseOption = context.options[0]
    const options = context.options[1] || {}
    const caseType = allowedCaseOptions.indexOf(caseOption) !== -1 ? caseOption : defaultCase
    const ignores = options.ignores || []
    const registeredComponentsOnly = options.registeredComponentsOnly !== false
    const registeredComponents = options.globalRegisteredComponents || []
    const globalRegisteredComponentPatterns = (options.globalRegisteredComponentPatterns || []).map(s => new RegExp(s))
    const tokens = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore()

    /**
     * Checks whether the given node is the verification target node.
     * @param {VElement} node element node
     * @returns {boolean} `true` if the given node is the verification target node.
     */
    function isVerifyTarget (node) {
      if (ignores.indexOf(node.rawName) >= 0) {
        // ignore
        return false
      }

      if (!registeredComponentsOnly) {
        // If the user specifies registeredComponentsOnly as false, it checks all component tags.
        if ((!utils.isHtmlElementNode(node) && !utils.isSvgElementNode(node)) ||
          utils.isHtmlWellKnownElementName(node.rawName) ||
          utils.isSvgWellKnownElementName(node.rawName)
        ) {
          return false
        }
        return true
      }

      // We only verify the components registered in the component.
      if (registeredComponents
        .filter(name => casing.pascalCase(name) === name) // When defining a component with PascalCase, you can use either case
        .some(name => node.rawName === name || casing.pascalCase(node.rawName) === name)) {
        return true
      }

      if (globalRegisteredComponentPatterns
        .some(re => node.rawName.match(re) || casing.pascalCase(node.rawName).match(re))) {
        return true
      }
      return false
    }

    let hasInvalidEOF = false

    return utils.defineTemplateBodyVisitor(context, {
      'VElement' (node) {
        if (hasInvalidEOF) {
          return
        }

        if (!isVerifyTarget(node)) {
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
              caseType
            },
            fix: fixer => {
              const endTag = node.endTag
              if (!endTag) {
                return fixer.replaceText(open, `<${casingName}`)
              }
              const endTagOpen = tokens.getFirstToken(endTag)
              return [
                fixer.replaceText(open, `<${casingName}`),
                fixer.replaceText(endTagOpen, `</${casingName}`)
              ]
            }
          })
        }
      }
    },
    Object.assign(
      {
        Program (node) {
          hasInvalidEOF = utils.hasInvalidEOF(node)
        }
      },
      registeredComponentsOnly
        ? utils.executeOnVue(context, (obj) => {
          registeredComponents.push(...utils.getRegisteredComponents(obj).map(n => n.name))
        })
        : {}
    ))
  }
}
