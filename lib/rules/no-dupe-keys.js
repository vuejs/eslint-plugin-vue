/**
 * @fileoverview Prevents duplication of field names.
 * @author Armano
 */
'use strict'

const { findVariable } = require('@eslint-community/eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('../utils').GroupName} GroupName
 * @typedef {import('eslint').Scope.Variable} Variable
 * @typedef {import('../utils').ComponentProp} ComponentProp
 */

/** @type {GroupName[]} */
const GROUP_NAMES = ['props', 'computed', 'data', 'methods', 'setup']

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplication of field names',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-dupe-keys.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array'
          }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const groups = new Set([...GROUP_NAMES, ...(options.groups || [])])

    return utils.compositingVisitors(
      utils.executeOnVue(context, (obj) => {
        const properties = utils.iterateProperties(obj, groups)
        /** @type {Set<string>} */
        const usedNames = new Set()
        for (const o of properties) {
          if (usedNames.has(o.name)) {
            context.report({
              node: o.node,
              message: "Duplicated key '{{name}}'.",
              data: {
                name: o.name
              }
            })
          }

          usedNames.add(o.name)
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          for (const prop of props) {
            if (!prop.propName) continue

            const variable = findVariable(context.getScope(), prop.propName)
            if (!variable || variable.defs.length === 0) continue

            context.report({
              node: variable.defs[0].node,
              message: "Duplicated key '{{name}}'.",
              data: {
                name: prop.propName
              }
            })
          }
        }
      })
    )
  }
}
