/**
 * @fileoverview Define a style for the props casing in templates.
 * @author Armano
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce attribute naming style in template',
      category: 'strongly-recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.4.0/docs/rules/attribute-hyphenation.md'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['always', 'never']
      },
      {
        type: 'object',
        properties: {
          'ignore': {
            type: 'array',
            items: {
              allOf: [
                { type: 'string' },
                { not: { type: 'string', pattern: ':exit$' }},
                { not: { type: 'string', pattern: '^\\s*$' }}
              ]
            },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ]
  },

  create (context) {
    const sourceCode = context.getSourceCode()
    const [option, optionsPayload] = context.options
    const useHyphenated = option !== 'never'
    let ignoredAttributes = []

    if (optionsPayload && optionsPayload.ignore) {
      ignoredAttributes = optionsPayload.ignore
    } else {
      ignoredAttributes = ['data-', 'aria-', 'slot-scope']
    }

    const caseConverter = casing.getConverter(useHyphenated ? 'kebab-case' : 'camelCase')

    function reportIssue (node, name) {
      const text = sourceCode.getText(node.key)

      context.report({
        node: node.key,
        loc: node.loc,
        message: useHyphenated ? "Attribute '{{text}}' must be hyphenated." : "Attribute '{{text}}' cann't be hyphenated.",
        data: {
          text
        },
        fix: fixer => fixer.replaceText(node.key, text.replace(name, caseConverter(name)))
      })
    }

    function isIgnoredAttribute (value) {
      const isIgnored = !ignoredAttributes.every(function (attr) {
        return value.indexOf(attr) === -1
      })

      if (isIgnored) {
        return true
      }

      return useHyphenated ? value.toLowerCase() === value : !/-/.test(value)
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.defineTemplateBodyVisitor(context, {
      VAttribute (node) {
        if (!utils.isCustomComponent(node.parent.parent)) return

        const name = !node.directive ? node.key.rawName : node.key.name === 'bind' ? node.key.raw.argument : false
        if (!name || isIgnoredAttribute(name)) return

        reportIssue(node, name)
      }
    })
  }
}
