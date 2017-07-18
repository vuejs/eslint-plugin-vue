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
      description: 'Define the number of attributes allows per line',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: null,
    schema: [{
      type: 'object',
      properties: {
        'singleline': {
          type: 'number',
          minimum: 1
        },
        'multiline': {
          type: 'object',
          properties: {
            'max': {
              type: 'number',
              minimum: 1
            },
            'allowFirstLine': {
              type: 'boolean'
            }
          }
        }
      }
    }]
  },

  create: function (context) {
    const configuration = context.options[0] || { singleline: 3, multiline: { max: 1, allowFirstLine: false }}
    const multilineMaximum = configuration.multiline.max
    const singlelinemMaximum = configuration.singleline
    const canHaveFirstLine = configuration.multiline.allowFirstLine

    utils.registerTemplateBodyVisitor(context, {
      'VStartTag' (node) {
        const numberOfAttributes = node.attributes.length

        if (!numberOfAttributes) return

        if (isSingleLine(node) && numberOfAttributes > singlelinemMaximum) {
          context.report({
            node,
            loc: node.loc,
            message: 'There are {{numberOfAttributes}} in this line, but the maximum is {{singlelinemMaximum}}.',
            data: {
              numberOfAttributes,
              singlelinemMaximum
            }
          })
        }

        if (!isSingleLine(node)) {
          if (!canHaveFirstLine && node.attributes[0].loc.start.line === node.loc.start.line) {
            context.report({
              node,
              loc: node.loc,
              message: 'Attribute {{propName}} should be on a new line.',
              data: {
                propName: node.attributes[0].key.name
              }
            })
          }

          const propsPerLine = [[node.attributes[0]]]

          node.attributes.reduce(function (previous, current) {
            if (previous.loc.end.line === current.loc.start.line) {
              propsPerLine[propsPerLine.length - 1].push(current)
            } else {
              propsPerLine.push([current])
            }
            return current
          })

          propsPerLine.forEach(function (attributes) {
            if (attributes.length > multilineMaximum) {
              const prop = attributes[multilineMaximum]

              context.report({
                node,
                loc: node.loc,
                message: 'Attribute {{propName}} should be on a new line.',
                data: {
                  propName: prop.key.name
                }
              })
            }
          })
        }
      }
    })

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------
    function isSingleLine (node) {
      return node.loc.start.line === node.loc.end.line
    }
    return {}
  }
}
