/**
 * @fileoverview Require component name property to match its file name
 * @author Rodrigo Pedra Brum <rodrigo.pedra@gmail.com>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const path = require('path')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'require component name property to match its file name',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.4/docs/rules/match-component-file-name.md'
    },
    fixable: null,
    schema: [
      {
        type: 'array',
        items: {
          type: 'string'
        },
        uniqueItems: true,
        additionalItems: false
      }
    ]
  },

  create (context) {
    const options = context.options[0]
    const allowedExtensions = Array.isArray(options) ? options : ['jsx']

    return utils.executeOnVue(context, (object) => {
      const nameProperty = object.properties
        .find(item =>
          item.type === 'Property' &&
          item.key.name === 'name' &&
          item.key.type === 'Identifier' &&
          (
            item.value.type === 'Literal' || (
              item.value.type === 'TemplateLiteral' &&
              item.value.expressions.length === 0 &&
              item.value.quasis.length === 1
            )
          )
        )

      if (!nameProperty) {
        return
      }

      const name = nameProperty.value.type === 'TemplateLiteral'
        ? nameProperty.quasis[0].value.cooked
        : nameProperty.value.value
      const [, filename, extension] = /^(.+?)\.(.+)$/g.exec(path.basename(context.getFilename()))

      if (!allowedExtensions.includes(extension)) {
        return
      }

      if (name !== filename) {
        context.report({
          obj: object,
          loc: object.loc,
          message: 'Component name `{{name}}` should match file name {{filename}}.',
          data: { filename, name }
        })
      }
    })
  }
}
