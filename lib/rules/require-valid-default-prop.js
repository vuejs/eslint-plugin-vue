/**
 * @fileoverview Enforces props default values to be valid.
 * @author Armano
 */
'use strict'
const utils = require('../utils')
const { capitalize } = require('../utils/casing')

/**
 * @typedef {import('../utils').ComponentObjectProp} ComponentObjectProp
 * @typedef {import('../utils').ComponentArrayProp} ComponentArrayProp
 * @typedef {import('../utils').ComponentTypeProp} ComponentTypeProp
 * @typedef {import('../utils').VueObjectData} VueObjectData
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

const FUNCTION_VALUE_TYPES = new Set(['Function', 'Object', 'Array'])

/**
 * @param {ObjectExpression} obj
 * @param {string} name
 * @returns {Property | null}
 */
function getPropertyNode(obj, name) {
  for (const p of obj.properties) {
    if (
      p.type === 'Property' &&
      !p.computed &&
      p.key.type === 'Identifier' &&
      p.key.name === name
    ) {
      return p
    }
  }
  return null
}

/**
 * @param {Expression} targetNode
 * @returns {string[]}
 */
function getTypes(targetNode) {
  const node = utils.skipTSAsExpression(targetNode)
  if (node.type === 'Identifier') {
    return [node.name]
  } else if (node.type === 'ArrayExpression') {
    return node.elements
      .filter(
        /**
         * @param {Expression | SpreadElement | null} item
         * @returns {item is Identifier}
         */
        (item) => item != null && item.type === 'Identifier'
      )
      .map((item) => item.name)
  }
  return []
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
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @typedef {object} StandardValueType
     * @property {string} type
     * @property {false} function
     */
    /**
     * @typedef {object} FunctionExprValueType
     * @property {'Function'} type
     * @property {true} function
     * @property {true} expression
     * @property {Expression} functionBody
     * @property {string | null} returnType
     */
    /**
     * @typedef {object} FunctionValueType
     * @property {'Function'} type
     * @property {true} function
     * @property {false} expression
     * @property {BlockStatement} functionBody
     * @property {ReturnType[]} returnTypes
     */
    /**
     * @typedef { ComponentObjectProp & { value: ObjectExpression } } ComponentObjectDefineProp
     * @typedef { { type: string, node: Expression } } ReturnType
     */
    /**
     * @typedef {object} PropDefaultFunctionContext
     * @property {ComponentObjectProp | ComponentTypeProp} prop
     * @property {Set<string>} types
     * @property {FunctionValueType} default
     */

    /**
     * @type {Map<ObjectExpression, PropDefaultFunctionContext[]>}
     */
    const vueObjectPropsContexts = new Map()
    /**
     * @type { {node: CallExpression, props:PropDefaultFunctionContext[]}[] }
     */
    const scriptSetupPropsContexts = []

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {BlockStatement | Expression} body
     * @property {null | ReturnType[]} [returnTypes]
     */
    /**
     * @type {ScopeStack | null}
     */
    let scopeStack = null

    function onFunctionExit() {
      scopeStack = scopeStack && scopeStack.upper
    }

    /**
     * @param {Expression} targetNode
     * @returns { StandardValueType | FunctionExprValueType | FunctionValueType | null }
     */
    function getValueType(targetNode) {
      const node = utils.skipChainExpression(targetNode)
      if (node.type === 'CallExpression') {
        // Symbol(), Number() ...
        if (
          node.callee.type === 'Identifier' &&
          NATIVE_TYPES.has(node.callee.name)
        ) {
          return {
            function: false,
            type: node.callee.name
          }
        }
      } else if (node.type === 'TemplateLiteral') {
        // String
        return {
          function: false,
          type: 'String'
        }
      } else if (node.type === 'Literal') {
        // String, Boolean, Number
        if (node.value === null && !node.bigint) return null
        const type = node.bigint ? 'BigInt' : capitalize(typeof node.value)
        if (NATIVE_TYPES.has(type)) {
          return {
            function: false,
            type
          }
        }
      } else if (node.type === 'ArrayExpression') {
        // Array
        return {
          function: false,
          type: 'Array'
        }
      } else if (node.type === 'ObjectExpression') {
        // Object
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
     * @param {ComponentObjectProp | ComponentTypeProp} prop
     * @param {Iterable<string>} expectedTypeNames
     */
    function report(node, prop, expectedTypeNames) {
      const propName =
        prop.propName != null
          ? prop.propName
          : `[${context.getSourceCode().getText(prop.node.key)}]`
      context.report({
        node,
        message:
          "Type of the default value for '{{name}}' prop must be a {{types}}.",
        data: {
          name: propName,
          types: Array.from(expectedTypeNames).join(' or ').toLowerCase()
        }
      })
    }

    /**
     * @param {(ComponentObjectDefineProp | ComponentTypeProp)[]} props
     * @param { { [key: string]: Expression | undefined } } withDefaults
     */
    function processPropDefs(props, withDefaults) {
      /** @type {PropDefaultFunctionContext[]} */
      const propContexts = []
      for (const prop of props) {
        let typeList
        let defExpr
        if (prop.type === 'object') {
          const type = getPropertyNode(prop.value, 'type')
          if (!type) continue

          typeList = getTypes(type.value)

          const def = getPropertyNode(prop.value, 'default')
          if (!def) continue

          defExpr = def.value
        } else {
          typeList = prop.types
          defExpr = withDefaults[prop.propName]
        }
        if (!defExpr) continue

        const typeNames = new Set(
          typeList.filter((item) => NATIVE_TYPES.has(item))
        )
        // There is no native types detected
        if (typeNames.size === 0) continue

        const defType = getValueType(defExpr)

        if (!defType) continue

        if (!defType.function) {
          if (typeNames.has(defType.type)) {
            if (!FUNCTION_VALUE_TYPES.has(defType.type)) {
              continue
            }
          }
          report(
            defExpr,
            prop,
            Array.from(typeNames).map((type) =>
              FUNCTION_VALUE_TYPES.has(type) ? 'Function' : type
            )
          )
        } else {
          if (typeNames.has('Function')) {
            continue
          }
          if (defType.expression) {
            if (!defType.returnType || typeNames.has(defType.returnType)) {
              continue
            }
            report(defType.functionBody, prop, typeNames)
          } else {
            propContexts.push({
              prop,
              types: typeNames,
              default: defType
            })
          }
        }
      }
      return propContexts
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.compositingVisitors(
      {
        /**
         * @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression} node
         */
        ':function'(node) {
          scopeStack = {
            upper: scopeStack,
            body: node.body,
            returnTypes: null
          }
        },
        /**
         * @param {ReturnStatement} node
         */
        ReturnStatement(node) {
          if (!scopeStack) {
            return
          }
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
        ':function:exit': onFunctionExit
      },
      utils.defineVueVisitor(context, {
        onVueObjectEnter(obj) {
          /** @type {ComponentObjectDefineProp[]} */
          const props = utils.getComponentProps(obj).filter(
            /**
             * @param {ComponentObjectProp | ComponentArrayProp} prop
             * @returns {prop is ComponentObjectDefineProp}
             */
            (prop) =>
              Boolean(
                prop.type === 'object' && prop.value.type === 'ObjectExpression'
              )
          )
          const propContexts = processPropDefs(props, {})
          vueObjectPropsContexts.set(obj, propContexts)
        },
        /**
         * @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression} node
         * @param {VueObjectData} data
         */
        ':function'(node, { node: vueNode }) {
          const data = vueObjectPropsContexts.get(vueNode)
          if (!data || !scopeStack) {
            return
          }

          for (const { default: defType } of data) {
            if (node.body === defType.functionBody) {
              scopeStack.returnTypes = defType.returnTypes
            }
          }
        },
        onVueObjectExit(obj) {
          const data = vueObjectPropsContexts.get(obj)
          if (!data) {
            return
          }
          for (const { prop, types: typeNames, default: defType } of data) {
            for (const returnType of defType.returnTypes) {
              if (typeNames.has(returnType.type)) continue

              report(returnType.node, prop, typeNames)
            }
          }
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, baseProps) {
          /** @type {(ComponentObjectDefineProp | ComponentTypeProp)[]} */
          const props = baseProps.filter(
            /**
             * @param {ComponentObjectProp | ComponentArrayProp | ComponentTypeProp} prop
             * @returns {prop is ComponentObjectDefineProp | ComponentTypeProp}
             */
            (prop) =>
              Boolean(
                prop.type === 'type' ||
                  (prop.type === 'object' &&
                    prop.value.type === 'ObjectExpression')
              )
          )
          const defaults = utils.getWithDefaultsPropExpressions(node)
          const propContexts = processPropDefs(props, defaults)
          scriptSetupPropsContexts.push({ node, props: propContexts })
        },
        /**
         * @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression} node
         */
        ':function'(node) {
          const data =
            scriptSetupPropsContexts[scriptSetupPropsContexts.length - 1]
          if (!data || !scopeStack) {
            return
          }

          for (const { default: defType } of data.props) {
            if (node.body === defType.functionBody) {
              scopeStack.returnTypes = defType.returnTypes
            }
          }
        },
        onDefinePropsExit() {
          scriptSetupPropsContexts.pop()
        }
      })
    )
  }
}
