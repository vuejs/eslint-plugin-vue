/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
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

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce the casing of component name in `components` options',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/component-options-name-casing.html'
    },
    fixable: 'code',
    schema: [{ enum: casing.allowedCaseOptions }],
    messages: {
      caseNotMatched: 'Component name "{{component}}" is not {{caseType}}.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const caseType = context.options[0] || 'PascalCase'

    const checkCase = casing.getChecker(caseType)
    const convert = casing.getConverter(caseType)

    return utils.executeOnVue(context, (obj) => {
      const node = utils.findProperty(obj, 'components')
      if (!node || node.value.type !== 'ObjectExpression') {
        return
      }

      node.value.properties.forEach((property) => {
        if (
          property.type === 'Property' &&
          property.key.type === 'Identifier'
        ) {
          const { name } = property.key
          if (checkCase(name)) {
            return
          }

          context.report({
            node: property.key,
            messageId: 'caseNotMatched',
            data: {
              component: name,
              caseType
            },
            fix: (fixer) => {
              const converted = convert(name)
              if (caseType === 'kebab-case') {
                return property.shorthand
                  ? fixer.replaceText(property, `'${converted}': ${name}`)
                  : fixer.replaceText(property.key, `'${converted}'`)
              }
              return fixer.replaceText(property.key, converted)
            }
          })
        }
      })
    })
  }
}
