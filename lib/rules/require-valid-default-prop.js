/**
 * @fileoverview Enforces props default values to be valid.
 * @author Armano
 */
'use strict'
const utils = require('../utils')

/**
 * @typedef {import('vue-eslint-parser').AST.ESLintObjectExpression} ObjectExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintExpression} Expression
 * @typedef {import('vue-eslint-parser').AST.ESLintProperty} Property
 * @typedef {import('vue-eslint-parser').AST.ESLintBlockStatement} BlockStatement
 * @typedef {import('vue-eslint-parser').AST.ESLintPattern} Pattern
 */
/**
 * @typedef {import('../utils').ComponentObjectProp} ComponentObjectProp
 */

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

const NATIVE_TYPES = new Set([
  'String',
  'Number',
  'Boolean',
  'Function',
  'Object',
  'Array',
  'Symbol',
  'BigInt'
])

const FUNCTION_VALUE_TYPES = new Set([
  'Function',
  'Object',
  'Array'
])

/**
 * @param {ObjectExpression} obj
 * @param {string} name
 * @returns {Property | null}
 */
function getPropertyNode (obj, name) {
  for (const p of obj.properties) {
    if (p.type === 'Property' &&
      !p.computed &&
      p.key.type === 'Identifier' &&
      p.key.name === name) {
      return p
    }
  }
  return null
}

/**
 * @param {Expression | Pattern} node
 * @returns {string[]}
 */
function getTypes (node) {
  if (node.type === 'Identifier') {
    return [node.name]
  } else if (node.type === 'ArrayExpression') {
    return node.elements
      .filter(item => item.type === 'Identifier')
      .map(item => item.name)
  }
  return []
}

function capitalize (text) {
  return text[0].toUpperCase() + text.slice(1)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce props default values to be valid',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/require-valid-default-prop.html'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    /**
     * @typedef { { type: string, function: false } } StandardValueType
     * @typedef { { type: 'Function', function: true, expression: true, functionBody: BlockStatement, returnType: string | null } } FunctionExprValueType
     * @typedef { { type: 'Function', function: true, expression: false, functionBody: BlockStatement, returnTypes: ReturnType[] } } FunctionValueType
     * @typedef { ComponentObjectProp & { value: ObjectExpression } } ComponentObjectDefineProp
     * @typedef { { prop: ComponentObjectDefineProp, type: Set<string>, default: FunctionValueType } } PropDefaultFunctionContext
     * @typedef { { type: string, node: Expression } } ReturnType
     */

    /**
     * @type {Map<ObjectExpression, PropDefaultFunctionContext[]>}
     */
    const vueObjectPropsContexts = new Map()

    /** @type { { upper: any, body: null | BlockStatement, returnTypes?: null | ReturnType[] } } */
    let scopeStack = { upper: null, body: null, returnTypes: null }
    function onFunctionEnter (node) {
      scopeStack = { upper: scopeStack, body: node.body, returnTypes: null }
    }

    function onFunctionExit () {
      scopeStack = scopeStack.upper
    }

    /**
     * @param {Expression | Pattern} node
     * @returns { StandardValueType | FunctionExprValueType | FunctionValueType | null }
     */
    function getValueType (node) {
      if (node.type === 'CallExpression') { // Symbol(), Number() ...
        if (node.callee.type === 'Identifier' && NATIVE_TYPES.has(node.callee.name)) {
          return {
            function: false,
            type: node.callee.name
          }
        }
      } else if (node.type === 'TemplateLiteral') { // String
        return {
          function: false,
          type: 'String'
        }
      } else if (node.type === 'Literal') { // String, Boolean, Number
        if (node.value === null && !node.bigint) return null
        const type = node.bigint ? 'BigInt' : capitalize(typeof node.value)
        if (NATIVE_TYPES.has(type)) {
          return {
            function: false,
            type
          }
        }
      } else if (node.type === 'ArrayExpression') { // Array
        return {
          function: false,
          type: 'Array'
        }
      } else if (node.type === 'ObjectExpression') { // Object
        return {
          function: false,
          type: 'Object'
        }
      } else if (node.type === 'FunctionExpression') {
        return {
          function: true,
          expression: false,
          type: 'Function',
          functionBody: node.body,
          returnTypes: []
        }
      } else if (node.type === 'ArrowFunctionExpression') {
        if (node.expression) {
          const valueType = getValueType(node.body)
          return {
            function: true,
            expression: true,
            type: 'Function',
            functionBody: node.body,
            returnType: valueType ? valueType.type : null
          }
        } else {
          return {
            function: true,
            expression: false,
            type: 'Function',
            functionBody: node.body,
            returnTypes: []
          }
        }
      }
      return null
    }

    /**
     * @param {*} node
     * @param {ComponentObjectProp} prop
     * @param {Iterable<string>} expectedTypeNames
     */
    function report (node, prop, expectedTypeNames) {
      const propName = prop.propName != null ? prop.propName : `[${context.getSourceCode().getText(prop.key)}]`
      context.report({
        node,
        message: "Type of the default value for '{{name}}' prop must be a {{types}}.",
        data: {
          name: propName,
          types: Array.from(expectedTypeNames)
            .join(' or ')
            .toLowerCase()
        }
      })
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.defineVueVisitor(context,
      {
        onVueObjectEnter (obj) {
          /** @type {ComponentObjectDefineProp[]} */
          const props = utils.getComponentProps(obj)
            .filter(prop => prop.key && prop.value && prop.value.type === 'ObjectExpression')
          /** @type {PropDefaultFunctionContext[]} */
          const propContexts = []
          for (const prop of props) {
            const type = getPropertyNode(prop.value, 'type')
            if (!type) continue

            const typeNames = new Set(getTypes(type.value)
              .filter(item => NATIVE_TYPES.has(item)))

            // There is no native types detected
            if (typeNames.size === 0) continue

            const def = getPropertyNode(prop.value, 'default')
            if (!def) continue

            const defType = getValueType(def.value)

            if (!defType) continue

            if (!defType.function) {
              if (typeNames.has(defType.type)) {
                if (!FUNCTION_VALUE_TYPES.has(defType.type)) {
                  continue
                }
              }
              report(
                def.value,
                prop,
                Array.from(typeNames).map(type => FUNCTION_VALUE_TYPES.has(type) ? 'Function' : type)
              )
            } else {
              if (typeNames.has('Function')) {
                continue
              }
              if (defType.expression) {
                if (!defType.returnType || typeNames.has(defType.returnType)) {
                  continue
                }
                report(
                  defType.functionBody,
                  prop,
                  typeNames
                )
              } else {
                propContexts.push({
                  prop,
                  type: typeNames,
                  default: defType
                })
              }
            }
          }
          vueObjectPropsContexts.set(obj, propContexts)
        },
        ':function' (node, { node: vueNode }) {
          onFunctionEnter(node)

          for (const { default: defType } of vueObjectPropsContexts.get(vueNode)) {
            if (node.body === defType.functionBody) {
              scopeStack.returnTypes = defType.returnTypes
            }
          }
        },
        ReturnStatement (node) {
          if (scopeStack.returnTypes && node.argument) {
            const type = getValueType(node.argument)
            if (type) {
              scopeStack.returnTypes.push({
                type: type.type,
                node: node.argument
              })
            }
          }
        },
        ':function:exit': onFunctionExit,
        onVueObjectExit (obj) {
          for (const { prop, type: typeNames, default: defType } of vueObjectPropsContexts.get(obj)) {
            for (const returnType of defType.returnTypes) {
              if (typeNames.has(returnType.type)) continue

              report(returnType.node, prop, typeNames)
            }
          }
        }
      }
    )
  }
}
