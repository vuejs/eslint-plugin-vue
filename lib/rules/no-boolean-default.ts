/**
 * @fileoverview Prevents boolean defaults from being set
 * @author Hiroki Osame
 */
import utils from '../utils/index.js'
import type { ComponentProp, ComponentObjectProp } from '../utils/index.js'

function isBooleanIdentifier(node: Expression | undefined) {
  return Boolean(node && node.type === 'Identifier' && node.name === 'Boolean')
}

/**
 * Detects whether given prop node is a Boolean
 */
function isBooleanProp(prop: ComponentObjectProp): boolean {
  const value = utils.skipTSAsExpression(prop.value)
  return (
    isBooleanIdentifier(value) ||
    (value.type === 'ObjectExpression' &&
      isBooleanIdentifier(utils.findProperty(value, 'type')?.value))
  )
}

function getDefaultNode(propDefValue: ObjectExpression) {
  return utils.findProperty(propDefValue, 'default')
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow boolean defaults',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-boolean-default.html'
    },
    fixable: null,
    schema: [
      {
        enum: ['default-false', 'no-default']
      }
    ],
    messages: {
      noBooleanDefault:
        'Boolean prop should not set a default (Vue defaults it to false).',
      defaultFalse: 'Boolean prop should only be defaulted to false.'
    }
  },
  create(context: RuleContext) {
    const booleanType = context.options[0] || 'no-default'
    function processProp(
      prop: ComponentProp,
      otherDefaultProvider: (propName: string) => Expression[]
    ) {
      if (prop.type === 'object') {
        if (!isBooleanProp(prop)) {
          return
        }
        if (prop.value.type === 'ObjectExpression') {
          const defaultNode = getDefaultNode(prop.value)
          if (defaultNode) {
            verifyDefaultExpression(defaultNode.value)
          }
        }
        if (prop.propName != null) {
          for (const defaultNode of otherDefaultProvider(prop.propName)) {
            verifyDefaultExpression(defaultNode)
          }
        }
      } else if (prop.type === 'type') {
        if (prop.types.length !== 1 || prop.types[0] !== 'Boolean') {
          return
        }
        for (const defaultNode of otherDefaultProvider(prop.propName)) {
          verifyDefaultExpression(defaultNode)
        }
      }
    }
    function processProps(
      props: ComponentProp[],
      otherDefaultProvider: (propName: string) => Expression[]
    ) {
      for (const prop of props) {
        processProp(prop, otherDefaultProvider)
      }
    }

    function verifyDefaultExpression(defaultNode: Expression) {
      switch (booleanType) {
        case 'no-default': {
          context.report({
            node: defaultNode,
            messageId: 'noBooleanDefault'
          })
          break
        }

        case 'default-false': {
          if (defaultNode.type !== 'Literal' || defaultNode.value !== false) {
            context.report({
              node: defaultNode,
              messageId: 'defaultFalse'
            })
          }
          break
        }
      }
    }
    return utils.compositingVisitors(
      utils.executeOnVueComponent(context, (obj) => {
        processProps(utils.getComponentPropsFromOptions(obj), () => [])
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          const { props: defaultsByWithDefaults } =
            utils.getWithDefaultsPropExpressions(context, node)
          const defaultsByAssignmentPatterns =
            utils.getDefaultPropExpressionsForPropsDestructure(node)
          processProps(props, (propName) =>
            [
              defaultsByWithDefaults[propName],
              defaultsByAssignmentPatterns[propName]?.expression
            ].filter(utils.isDef)
          )
        }
      })
    )
  }
}
