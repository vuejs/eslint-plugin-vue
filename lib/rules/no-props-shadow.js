/**
 * @author XWBX
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
// https://github.com/vuejs/core/blob/caeb8a68811a1b0f799632582289fcf169fb673c/packages/shared/src/globalsAllowList.ts
const GLOBALS_WHITE_LISTED = new Set(
  (
    'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
    'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
    'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error'
  ).split(',')
)
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow shadowing a prop',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-props-shadow.html'
    },
    fixable: null,
    schema: [],
    messages: {
      shadowedProp: 'This binding will shadow `{{ key }}` prop in template.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Set<string>} */
    let propSet = new Set()
    return utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(_, props) {
        propSet = new Set(
          props
            .map((p) => p.propName)
            .filter(
              /**
               * @returns {propName is string}
               */
              (propName) =>
                utils.isDef(propName) && !GLOBALS_WHITE_LISTED.has(propName)
            )
        )
      },
      'Program:exit': (program) => {
        for (const node of program.body) {
          if (
            node.type === 'ImportDeclaration' ||
            node.type === 'ClassDeclaration' ||
            node.type === 'FunctionDeclaration' ||
            node.type === 'VariableDeclaration'
          ) {
            const vars = context
              .getSourceCode()
              .scopeManager?.getDeclaredVariables?.(node)
            if (vars) {
              for (const variable of vars) {
                const name = variable.name
                if (propSet.has(name)) {
                  context.report({
                    node,
                    messageId: 'shadowedProp',
                    data: { key: name }
                  })
                }
              }
            }
          }
        }
      }
    })
  }
}
