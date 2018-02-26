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
    docs: {
      description: 'enforce the maximum number of attributes per line',
      category: 'strongly-recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.3.0/docs/rules/max-attributes-per-line.md'
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
        }
      }
    ]
  },

  create: function (context) {
    const configuration = parseOptions(context.options[0])
    const multilineMaximum = configuration.multiline
    const singlelinemMaximum = configuration.singleline
    const canHaveFirstLine = configuration.allowFirstLine

    return utils.defineTemplateBodyVisitor(context, {
      'VStartTag' (node) {
        const numberOfAttributes = node.attributes.length

        if (!numberOfAttributes) return

        if (utils.isSingleLine(node) && numberOfAttributes > singlelinemMaximum) {
          showErrors(node.attributes.slice(singlelinemMaximum), node)
        }

        if (!utils.isSingleLine(node)) {
          if (!canHaveFirstLine && node.attributes[0].loc.start.line === node.loc.start.line) {
            showErrors([node.attributes[0]], node)
          }

          groupAttrsByLine(node.attributes)
            .filter(attrs => attrs.length > multilineMaximum)
            .forEach(attrs => showErrors(attrs.splice(multilineMaximum), node))
        }
      }
    })

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------
    function parseOptions (options) {
      const defaults = {
        singleline: 1,
        multiline: 1,
        allowFirstLine: false
      }

      if (options) {
        if (typeof options.singleline === 'number') {
          defaults.singleline = options.singleline
        } else if (options.singleline && options.singleline.max) {
          defaults.singleline = options.singleline.max
        }

        if (options.multiline) {
          if (typeof options.multiline === 'number') {
            defaults.multiline = options.multiline
          } else if (typeof options.multiline === 'object') {
            if (options.multiline.max) {
              defaults.multiline = options.multiline.max
            }

            if (options.multiline.allowFirstLine) {
              defaults.allowFirstLine = options.multiline.allowFirstLine
            }
          }
        }
      }

      return defaults
    }

    function showErrors (attributes, node) {
      attributes.forEach((prop, i) => {
        context.report({
          node: prop,
          loc: prop.loc,
          message: 'Attribute "{{propName}}" should be on a new line.',
          data: {
            propName: prop.key.name
          },
          fix: i === 0 ? (fixer) => fixer.insertTextBefore(prop, '\n') : undefined
        })
      })
    }

    function groupAttrsByLine (attributes) {
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
