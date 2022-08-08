/**
 * @author @neferqiqi
 * See LICENSE file in root directory for full license.
 */
'use strict'
// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
/**
 * @typedef {import('../utils').ComponentTypeProp} ComponentTypeProp
 */

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// ...

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce props with default values ​​to be optional',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-optional-props-using-with-defaults.html'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          autofix: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      // ...
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @param {ComponentTypeProp} prop
     * @param {Token[]} tokens
     * */
    const findKeyToken = (prop, tokens) =>
      tokens.find((token) => {
        const isKeyIdentifierEqual =
          prop.key.type === 'Identifier' && token.value === prop.key.name
        const isKeyLiteralEqual =
          prop.key.type === 'Literal' && token.value === prop.key.raw
        return isKeyIdentifierEqual || isKeyLiteralEqual
      })

    let canAutoFix = false
    const option = context.options[0]
    if (option) {
      canAutoFix = option.autofix
    }

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          utils.getComponentPropsFromOptions(node).map((prop) => {
            if (
              prop.type === 'object' &&
              prop.propName &&
              prop.value.type === 'ObjectExpression' &&
              utils.findProperty(prop.value, 'default')
            ) {
              const requiredProperty = utils.findProperty(
                prop.value,
                'required'
              )
              if (!requiredProperty) return
              const requiredNode = requiredProperty.value
              if (
                requiredNode &&
                requiredNode.type === 'Literal' &&
                !!requiredNode.value
              ) {
                context.report({
                  node: prop.node,
                  loc: prop.node.loc,
                  data: {
                    key: prop.propName
                  },
                  message: `Prop "{{ key }}" should be optional.`,
                  fix: canAutoFix
                    ? (fixer) => fixer.replaceText(requiredNode, 'false')
                    : null
                })
              }
            }
          })
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          if (!utils.hasWithDefaults(node)) {
            return
          }
          const withDefaultsProps = Object.keys(
            utils.getWithDefaultsPropExpressions(node)
          )
          const requiredProps = props.flatMap((item) =>
            item.type === 'type' && item.required ? [item] : []
          )

          for (const prop of requiredProps) {
            if (withDefaultsProps.includes(prop.propName)) {
              const firstToken = context
                .getSourceCode()
                .getFirstToken(prop.node)
              // skip setter & getter case
              if (firstToken.value === 'get' || firstToken.value === 'set') {
                return
              }
              // skip computed
              if (prop.node.computed) {
                return
              }
              const keyToken = findKeyToken(
                prop,
                context.getSourceCode().getTokens(prop.node)
              )
              if (!keyToken) return
              context.report({
                node: prop.node,
                loc: prop.node.loc,
                data: {
                  key: prop.propName
                },
                message: `Prop "{{ key }}" should be optional.`,
                fix: canAutoFix
                  ? (fixer) => fixer.insertTextAfter(keyToken, '?')
                  : null
              })
            }
          }
        }
      })
    )
  }
}
