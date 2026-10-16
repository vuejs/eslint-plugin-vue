/**
 * @fileoverview Require default value for props
 * @author Michał Sajnóg <msajnog93@gmail.com> (https://github.com/michalsnik)
 */
'use strict'

/**
 * @typedef {import('../utils').ComponentProp} ComponentProp
 * @typedef {import('../utils').ComponentObjectProp} ComponentObjectProp
 * @typedef {import('../utils').ComponentTypeProp} ComponentTypeProp
 * @typedef {ComponentObjectProp & { value: ObjectExpression} } ComponentObjectPropObject
 */

const utils = require('../utils')
const { isDef } = require('../utils')

const NATIVE_TYPES = new Set([
  'String',
  'Number',
  'Boolean',
  'Function',
  'Object',
  'Array',
  'Symbol'
])

/**
 * Detects whether given value node is a Boolean type
 * @param {Expression} value
 * @return {boolean}
 */
function isValueNodeOfBooleanType(value) {
  if (value.type === 'Identifier' && value.name === 'Boolean') {
    return true
  }
  if (value.type === 'ArrayExpression') {
    const elements = value.elements.filter(isDef)
    return (
      elements.length === 1 &&
      elements[0].type === 'Identifier' &&
      elements[0].name === 'Boolean'
    )
  }
  return false
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require default value for props',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/require-default-prop.html'
    },
    fixable: null,
    schema: [],
    messages: {
      missingDefault: `Prop '{{propName}}' requires default value to be set.`
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * Checks if the passed prop is required
     * @param {ObjectExpression} propValue - ObjectExpression AST node for a single prop
     * @return {boolean}
     */
    function propIsRequired(propValue) {
      return propValue.properties.some(
        (p) =>
          p.type === 'Property' &&
          utils.getStaticPropertyName(p) === 'required' &&
          p.value.type === 'Literal' &&
          p.value.value === true
      )
    }

    /**
     * Checks if the passed prop has a default value
     * @param {ObjectExpression} propValue - ObjectExpression AST node for a single prop
     * @return {boolean}
     */
    function propHasDefault(propValue) {
      return propValue.properties.some(
        (p) =>
          p.type === 'Property' && utils.getStaticPropertyName(p) === 'default'
      )
    }

    /**
     * Checks whether the given props that don't have a default value
     * @param {ComponentObjectProp} prop Vue component's "props" node
     * @return {boolean}
     */
    function isWithoutDefaultValue(prop) {
      switch (prop.value.type) {
        case 'ObjectExpression': {
          return !propIsRequired(prop.value) && !propHasDefault(prop.value)
        }
        case 'Identifier': {
          return NATIVE_TYPES.has(prop.value.name)
        }
        case 'CallExpression':
        case 'MemberExpression': {
          return false
        }
        default: {
          return true
        }
      }
    }

    /**
     * Detects whether given prop node is a Boolean
     * @param {ComponentObjectProp} prop
     * @return {Boolean}
     */
    function isBooleanProp(prop) {
      const value = utils.skipTSAsExpression(prop.value)

      return (
        isValueNodeOfBooleanType(value) ||
        (value.type === 'ObjectExpression' &&
          value.properties.some(
            (p) =>
              p.type === 'Property' &&
              p.key.type === 'Identifier' &&
              p.key.name === 'type' &&
              isValueNodeOfBooleanType(p.value)
          ))
      )
    }

    /**
     * @param {ComponentProp[]} props
     * @param {(prop: ComponentObjectProp|ComponentTypeProp)=>boolean} [ignore]
     */
    function processProps(props, ignore) {
      for (const prop of props) {
        if (prop.type === 'object') {
          if (
            prop.node.shorthand ||
            !isWithoutDefaultValue(prop) ||
            isBooleanProp(prop) ||
            ignore?.(prop)
          ) {
            continue
          }
          const propName =
            prop.propName ?? `[${context.sourceCode.getText(prop.node.key)}]`

          context.report({
            node: prop.node,
            messageId: `missingDefault`,
            data: {
              propName
            }
          })
        } else if (prop.type === 'type') {
          if (
            prop.required ||
            (prop.types.length === 1 && prop.types[0] === 'Boolean') ||
            ignore?.(prop)
          ) {
            continue
          }
          context.report({
            node: prop.node,
            messageId: `missingDefault`,
            data: {
              propName: prop.propName
            }
          })
        }
      }
    }

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          const hasWithDefaults = utils.hasWithDefaults(node)
          const defaultsByWithDefaults = utils.getWithDefaultsPropExpressions(
            context,
            node
          )
          const isUsingPropsDestructure = utils.isUsingPropsDestructure(node)
          const defaultsByAssignmentPatterns =
            utils.getDefaultPropExpressionsForPropsDestructure(node)

          processProps(
            props,
            (prop) =>
              (prop.type === 'type' &&
                ((!hasWithDefaults && !isUsingPropsDestructure) ||
                  defaultsByWithDefaults.hasUnknown ||
                  Boolean(defaultsByWithDefaults.props[prop.propName]))) ||
              // If using Props Destructure but the property name cannot be determined,
              // it will be ignored.
              (isUsingPropsDestructure &&
                (prop.propName == null ||
                  Boolean(defaultsByAssignmentPatterns[prop.propName])))
          )
        }
      }),
      utils.executeOnVue(context, (obj) => {
        processProps(utils.getComponentPropsFromOptions(obj))
      })
    )
  }
}
