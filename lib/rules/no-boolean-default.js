/**
 * @fileoverview Prevents boolean defaults from being set
 * @author Hiroki Osame
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow boolean defaults',
      category: undefined,
      recommended: false,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/no-boolean-default.md'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['default-false', 'no-default', 'constructor']
      }
    ]
  },

  create (context) {
    function getPropsDef (vueComp) {
      return vueComp.properties.find(p =>
        p.type === 'Property' &&
            p.key.type === 'Identifier' &&
            p.key.name === 'props' &&
            p.value.type === 'ObjectExpression'
      )
    }

    function getBooleanProps (propsDef) {
      return propsDef.value.properties
        .filter(p => {
          return (p.type === 'Property') && (p.value.type === 'ObjectExpression') && p.value.properties.find(p =>
            (
              p.type === 'Property' &&
              p.key.type === 'Identifier' &&
              p.key.name === 'type' &&
              p.value.type === 'Identifier' &&
              p.value.name === 'Boolean'
            )
          )
        })
    }

    function getDefaultNode (propDef) {
      return propDef.value.properties.find(p => {
        return (p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'default')
      })
    }

    return utils.executeOnVueComponent(context, (obj) => {
      const propsDef = getPropsDef(obj)

      if (!propsDef) { return }

      const booleanProps = getBooleanProps(propsDef)

      if (!booleanProps.length) { return }

      const booleanType = context.options[0] || 'constructor'

      booleanProps.forEach((propDef) => {
        const defaultNode = getDefaultNode(propDef)

        switch (booleanType) {
          case 'no-default':
            if (defaultNode) {
              context.report({
                node: defaultNode,
                message: 'Boolean prop should not set a default (Vue defaults it to false).'
              })
            }
            break

          case 'default-false':
            if (defaultNode.value.value !== false) {
              context.report({
                node: defaultNode,
                message: 'Boolean prop should be defaulted to false.'
              })
            }
            break

          default:
            const nonConstProperties = propDef.value.properties.filter(p => (p.type === 'Property' && p.key.name !== 'type'))

            let fix
            if (
              nonConstProperties.length === 0 ||
              (nonConstProperties.length === 1 && (nonConstProperties[0].key.name === 'default' && nonConstProperties[0].value.value === false))
            ) {
              fix = fixer => fixer.replaceText(propDef.value, 'Boolean')
            }

            context.report({
              node: propDef,
              message: 'Boolean prop should use a constructor.',
              fix
            })
        }
      })
    })
  }
}
