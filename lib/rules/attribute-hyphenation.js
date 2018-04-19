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
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.5.0/docs/rules/attribute-hyphenation.md'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['always', 'never']
      }
    ]
  },

  create (context) {
    const sourceCode = context.getSourceCode()
    const options = context.options[0]
    const useHyphenated = options !== 'never'

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
      if (value.indexOf('data-') !== -1 || value.indexOf('aria-') !== -1) {
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
