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
      { enum: ['jsx', 'both'] }
    ]
  },

  create (context) {
    return utils.executeOnVueComponent(context, (object) => {
      const nameProperty = object.properties
        .find(p =>
          p.type === 'Property' &&
          p.key.type === 'Identifier' &&
          p.key.name === 'name' &&
          (
            p.value.type === 'Literal' || (
              p.value.type === 'TemplateLiteral' &&
              p.value.expressions.length === 0 &&
              p.value.quasis.length === 1
            )
          )
        )

      if (!nameProperty) {
        return
      }

      const allowedExtensions = context.options[0] || 'jsx'
      const name = nameProperty.value.type === 'TemplateLiteral'
        ? nameProperty.quasis[0].value.cooked
        : nameProperty.value.value
      const [, filename, extension] = /^(.+?)\.(.*)$/g.exec(path.basename(context.getFilename()))

      if (extension === 'vue' && allowedExtensions !== 'both') {
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
