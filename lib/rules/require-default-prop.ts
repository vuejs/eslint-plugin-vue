/**
 * @fileoverview Require default value for props
 * @author Michał Sajnóg <msajnog93@gmail.com> (https://github.com/michalsnik)
 */
import type {
  ComponentProp,
  ComponentObjectProp,
  ComponentTypeProp
} from '../utils/index.js'
import utils from '../utils/index.js'

const NATIVE_TYPES = new Set([
  'String',
  'Number',
  'Boolean',
  'Function',
  'Object',
  'Array',
  'Symbol'
])

function hasBooleanCasting(types: (string | null)[]): boolean {
  const booleanIndex = types.indexOf('Boolean')
  const stringIndex = types.indexOf('String')
  return (
    booleanIndex !== -1 && (stringIndex === -1 || booleanIndex < stringIndex)
  )
}

/**
 * Detects whether given value node is a Boolean type
 */
function isValueNodeOfBooleanType(value: Expression): boolean {
  return (
    (value.type === 'Identifier' && value.name === 'Boolean') ||
    (value.type === 'ArrayExpression' &&
      hasBooleanCasting(
        value.elements.map((element) =>
          element != null && element.type === 'Identifier' ? element.name : null
        )
      ))
  )
}

export default {
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
  create(context: RuleContext) {
    /**
     * Checks if the passed prop is required
     */
    function propIsRequired(propValue: ObjectExpression) {
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
     */
    function propHasDefault(propValue: ObjectExpression) {
      return propValue.properties.some(
        (p) =>
          p.type === 'Property' && utils.getStaticPropertyName(p) === 'default'
      )
    }

    /**
     * Checks whether the given props that don't have a default value
     */
    function isWithoutDefaultValue(prop: ComponentObjectProp): boolean {
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
     */
    function isBooleanProp(prop: ComponentObjectProp): boolean {
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

    function processProps(
      props: ComponentProp[],
      shouldIgnore?: (prop: ComponentObjectProp | ComponentTypeProp) => boolean
    ) {
      for (const prop of props) {
        if (prop.type === 'object') {
          if (
            prop.node.shorthand ||
            !isWithoutDefaultValue(prop) ||
            isBooleanProp(prop) ||
            shouldIgnore?.(prop)
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
            hasBooleanCasting(prop.types) ||
            shouldIgnore?.(prop)
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
