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

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const allowedCaseOptions = ['PascalCase', 'kebab-case']
const defaultCase = 'PascalCase'

const RE_REGEXP_STR = /^\/(.+)\/(.*)$/u
const RE_REGEXP_CHAR = /[\\^$.*+?()[\]{}|]/g
const RE_HAS_REGEXP_CHAR = new RegExp(RE_REGEXP_CHAR.source)

function escapeRegExp (string) {
  return (string && RE_HAS_REGEXP_CHAR.test(string))
    ? string.replace(RE_REGEXP_CHAR, '\\$&')
    : string
}

function toRegExpList (array) {
  return array.map(str => {
    const parts = RE_REGEXP_STR.exec(str)
    if (parts) {
      return new RegExp(parts[1], parts[2])
    }
    return new RegExp(`^${escapeRegExp(str)}$`)
  })
}

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
    const ignores = toRegExpList(options.ignores || [])
    const registeredComponentsOnly = options.registeredComponentsOnly !== false
    const tokens = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore()

    const registeredComponents = []

    /**
     * Checks whether the given node is the verification target node.
     * @param {VElement} node element node
     * @returns {boolean} `true` if the given node is the verification target node.
     */
    function isVerifyTarget (node) {
      if (ignores.some(re => re.test(node.rawName))) {
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
