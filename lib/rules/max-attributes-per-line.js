/**
 * @fileoverview Define the number of attributes allows per line
 * @author Filipa Lacerda
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce the maximum number of attributes per line',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/max-attributes-per-line.html'
    },
    fixable: 'whitespace', // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          singleline: {
            anyOf: [
              {
                type: 'number',
                minimum: 1
              },
              {
                type: 'object',
                properties: {
                  max: {
                    type: 'number',
                    minimum: 1
                  },
                  allowFirstLine: {
                    type: 'boolean'
                  }
                },
                additionalProperties: false
              }
            ]
          },
          multiline: {
            anyOf: [
              {
                type: 'number',
                minimum: 1
              },
              {
                type: 'object',
                properties: {
                  max: {
                    type: 'number',
                    minimum: 1
                  },
                  allowFirstLine: {
                    type: 'boolean'
                  }
                },
                additionalProperties: false
              }
            ]
          }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()
    const configuration = parseOptions(context.options[0])
    const multilineMaximum = configuration.multiline
    const singlelinemMaximum = configuration.singleline
    const canHaveSinglelineFirstLine = configuration.singlelineAllowFirstLine
    const canHaveMultilineFirstLine = configuration.multilineAllowFirstLine
    const template =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore()

    return utils.defineTemplateBodyVisitor(context, {
      VStartTag(node) {
        const numberOfAttributes = node.attributes.length

        if (!numberOfAttributes) return

        if (utils.isSingleLine(node)) {
          if (
            !canHaveSinglelineFirstLine &&
            node.attributes[0].loc.start.line === node.loc.start.line
          ) {
            showErrors([node.attributes[0]])
          }

          if (numberOfAttributes > singlelinemMaximum) {
            showErrors(node.attributes.slice(singlelinemMaximum))
          }
        }

        if (!utils.isSingleLine(node)) {
          if (
            !canHaveMultilineFirstLine &&
            node.attributes[0].loc.start.line === node.loc.start.line
          ) {
            showErrors([node.attributes[0]])
          }

          groupAttrsByLine(node.attributes)
            .filter((attrs) => attrs.length > multilineMaximum)
            .forEach((attrs) => showErrors(attrs.splice(multilineMaximum)))
        }
      }
    })

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------
    /**
     * @param {any} options
     */
    function parseOptions(options) {
      const defaults = {
        singleline: 1,
        singlelineAllowFirstLine: true,
        multiline: 1,
        multilineAllowFirstLine: false
      }

      if (options) {
        if (typeof options.singleline === 'number') {
          defaults.singleline = options.singleline
        } else if (typeof options.singleline === 'object') {
          if (typeof options.singleline.max === 'number') {
            defaults.singleline = options.singleline.max
          }

          if (typeof options.singleline.allowFirstLine === 'boolean') {
            defaults.singlelineAllowFirstLine =
              options.singleline.allowFirstLine
          }
        }

        if (options.multiline) {
          if (typeof options.multiline === 'number') {
            defaults.multiline = options.multiline
          } else if (typeof options.multiline === 'object') {
            if (typeof options.multiline.max === 'number') {
              defaults.multiline = options.multiline.max
            }

            if (typeof options.multiline.allowFirstLine === 'boolean') {
              defaults.multilineAllowFirstLine =
                options.multiline.allowFirstLine
            }
          }
        }
      }

      return defaults
    }

    /**
     * @param {(VDirective | VAttribute)[]} attributes
     */
    function showErrors(attributes) {
      attributes.forEach((prop, i) => {
        context.report({
          node: prop,
          loc: prop.loc,
          message: "'{{name}}' should be on a new line.",
          data: { name: sourceCode.getText(prop.key) },
          fix(fixer) {
            if (i !== 0) return null

            // Find the closest token before the current prop
            // that is not a white space
            const prevToken = /** @type {Token} */ (
              template.getTokenBefore(prop, {
                filter: (token) => token.type !== 'HTMLWhitespace'
              })
            )

            /** @type {Range} */
            const range = [prevToken.range[1], prop.range[0]]

            return fixer.replaceTextRange(range, '\n')
          }
        })
      })
    }

    /**
     * @param {(VDirective | VAttribute)[]} attributes
     */
    function groupAttrsByLine(attributes) {
      const propsPerLine = [[attributes[0]]]

      attributes.reduce((previous, current) => {
        if (previous.loc.end.line === current.loc.start.line) {
          propsPerLine[propsPerLine.length - 1].push(current)
        } else {
          propsPerLine.push([current])
        }
        return current
      })

      return propsPerLine
    }
  }
}
