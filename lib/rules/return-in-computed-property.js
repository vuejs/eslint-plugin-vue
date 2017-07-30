/**
 * @fileoverview Enforces that a return statement is present in computed property (return-in-computed-property)
 * @author Armano
 */
'use strict'

const utils = require('../utils')

function create (context) {
  const options = context.options[0] || {}
  const treatUndefinedAsUnspecified = !(options.treatUndefinedAsUnspecified === false)

  let funcInfo = {
    funcInfo: null,
    codePath: null,
    hasReturn: false,
    hasReturnValue: false,
    node: null
  }
  const forbiddenNodes = []

  // ----------------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------------
  function isValidReturn () {
    if (!funcInfo.hasReturn) {
      return false
    }
    return !treatUndefinedAsUnspecified || funcInfo.hasReturnValue
  }

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return Object.assign({},
    {
      onCodePathStart (codePath, node) {
        funcInfo = {
          codePath,
          funcInfo: funcInfo,
          hasReturn: false,
          hasReturnValue: false,
          node
        }
      },
      onCodePathEnd () {
        funcInfo = funcInfo.funcInfo
      },
      ReturnStatement (node) {
        funcInfo.hasReturn = true
        funcInfo.hasReturnValue = Boolean(node.argument)
      },
      'FunctionExpression:exit' (node) {
        if (!isValidReturn()) {
          forbiddenNodes.push({
            hasReturn: funcInfo.hasReturn,
            node: funcInfo.node,
            type: 'return'
          })
        }
      }
    },
    utils.executeOnVue(context, properties => {
      const computedProperties = utils.getComputedProperties(properties)

      computedProperties.forEach(cp => {
        forbiddenNodes.forEach(el => {
          if (
            cp.value &&
            el.node.loc.start.line >= cp.value.loc.start.line &&
            el.node.loc.end.line <= cp.value.loc.end.line
          ) {
            context.report({
              node: el.node,
              message: 'Expected to return a value in "{{name}}" computed property.',
              data: {
                name: cp.key
              }
            })
          }
        })
      })
    })
  )
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces that a return statement is present in computed property.',
      category: 'Possible Errors',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          treatUndefinedAsUnspecified: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create
}
