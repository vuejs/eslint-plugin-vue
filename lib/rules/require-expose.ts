/**
 * @fileoverview Require `expose` in Vue components
 * @author Yosuke Ota <https://github.com/ota-meshi>
 */
import type {} from '../utils/index.js'
import {
  findVariable,
  isOpeningBraceToken,
  isClosingBraceToken
} from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'

const FIX_EXPOSE_BEFORE_OPTIONS = new Set([
  'name',
  'components',
  'directives',
  'extends',
  'mixins',
  'provide',
  'inject',
  'inheritAttrs',
  'props',
  'emits'
])

function isExposeProperty(node: Property | SpreadElement) {
  return (
    node.type === 'Property' &&
    utils.getStaticPropertyName(node) === 'expose' &&
    !node.computed
  )
}

/**
 * Get the callee member node from the given CallExpression
 */
function getCalleeMemberNode(node: CallExpression) {
  const callee = utils.skipChainExpression(node.callee)

  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    if (name) {
      return { name, member: callee }
    }
  }
  return null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require declare public properties using `expose`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-expose.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      requireExpose:
        'The public properties of the component must be explicitly declared using `expose`. If the component does not have public properties, declare it empty.',
      addExposeOptionForEmpty:
        'Add the `expose` option to give an empty array.',
      addExposeOptionForAll:
        'Add the `expose` option to declare all properties.'
    }
  },
  create(context: RuleContext) {
    if (utils.isScriptSetup(context)) {
      return {}
    }

    interface SetupContext {
      exposeReferenceIds: Set<Identifier>
      contextReferenceIds: Set<Identifier>
    }

    const setupContexts = new Map<ObjectExpression, SetupContext>()
    const calledExpose = new Set<ObjectExpression>()

    type FunctionNode =
      | FunctionExpression
      | FunctionDeclaration
      | ArrowFunctionExpression

    interface ScopeStack {
      upper: ScopeStack | null
      functionNode: FunctionNode
      returnFunction: boolean
    }

    let scopeStack: ScopeStack | null = null
    const setupFunctions = new Map<FunctionNode, ObjectExpression>()
    const setupRender = new Set<ObjectExpression>()

    function isFunction(node: Expression): boolean {
      if (
        node.type === 'ArrowFunctionExpression' ||
        node.type === 'FunctionExpression'
      ) {
        return true
      }
      if (node.type === 'Identifier') {
        const variable = findVariable(getScope(context, node), node)
        if (variable) {
          for (const def of variable.defs) {
            if (def.type === 'FunctionName') {
              return true
            }
            if (def.type === 'Variable' && def.node.init) {
              return isFunction(def.node.init)
            }
          }
        }
      }
      return false
    }
    return utils.defineVueVisitor(context, {
      onSetupFunctionEnter(node, { node: vueNode }) {
        setupFunctions.set(node, vueNode)
        const contextParam = node.params[1]
        if (!contextParam) {
          // no arguments
          return
        }
        if (contextParam.type === 'RestElement') {
          // cannot check
          return
        }
        if (contextParam.type === 'ArrayPattern') {
          // cannot check
          return
        }
        const contextReferenceIds = new Set<Identifier>()
        const exposeReferenceIds = new Set<Identifier>()
        if (contextParam.type === 'ObjectPattern') {
          const exposeProperty = utils.findAssignmentProperty(
            contextParam,
            'expose'
          )
          if (!exposeProperty) {
            return
          }
          const exposeParam = exposeProperty.value
          // `setup(props, {emit})`
          const variable =
            exposeParam.type === 'Identifier'
              ? findVariable(getScope(context, exposeParam), exposeParam)
              : null
          if (!variable) {
            return
          }
          for (const reference of variable.references) {
            if (!reference.isRead()) {
              continue
            }
            exposeReferenceIds.add(reference.identifier)
          }
        } else if (contextParam.type === 'Identifier') {
          // `setup(props, context)`
          const variable = findVariable(
            getScope(context, contextParam),
            contextParam
          )
          if (!variable) {
            return
          }
          for (const reference of variable.references) {
            if (!reference.isRead()) {
              continue
            }
            contextReferenceIds.add(reference.identifier)
          }
        }
        setupContexts.set(vueNode, {
          contextReferenceIds,
          exposeReferenceIds
        })
      },
      CallExpression(node, { node: vueNode }) {
        if (calledExpose.has(vueNode)) {
          // already called
          return
        }
        // find setup context
        const setupContext = setupContexts.get(vueNode)
        if (setupContext) {
          const { contextReferenceIds, exposeReferenceIds } = setupContext
          if (
            node.callee.type === 'Identifier' &&
            exposeReferenceIds.has(node.callee)
          ) {
            // setup(props,{expose}) {expose()}
            calledExpose.add(vueNode)
          } else {
            const expose = getCalleeMemberNode(node)
            if (
              expose &&
              expose.name === 'expose' &&
              expose.member.object.type === 'Identifier' &&
              contextReferenceIds.has(expose.member.object)
            ) {
              // setup(props,context) {context.emit()}
              calledExpose.add(vueNode)
            }
          }
        }
      },
      ':function'(node) {
        scopeStack = {
          upper: scopeStack,
          functionNode: node,
          returnFunction: false
        }

        if (
          node.type === 'ArrowFunctionExpression' &&
          node.expression &&
          isFunction(node.body)
        ) {
          scopeStack.returnFunction = true
        }
      },
      ReturnStatement(node) {
        if (!scopeStack) {
          return
        }
        if (
          !scopeStack.returnFunction &&
          node.argument &&
          isFunction(node.argument)
        ) {
          scopeStack.returnFunction = true
        }
      },
      ':function:exit'(node) {
        if (scopeStack && scopeStack.returnFunction) {
          const vueNode = setupFunctions.get(node)
          if (vueNode) {
            setupRender.add(vueNode)
          }
        }
        scopeStack = scopeStack && scopeStack.upper
      },
      onVueObjectExit(component, { type }) {
        if (calledExpose.has(component)) {
          // `expose` function is called
          return
        }
        if (setupRender.has(component)) {
          // `setup` function is render function
          return
        }
        if (type === 'definition') {
          const defType = utils.getVueComponentDefinitionType(component)
          if (defType === 'mixin') {
            return
          }
        }

        if (component.properties.some(isExposeProperty)) {
          // has `expose`
          return
        }

        context.report({
          node: component,
          messageId: 'requireExpose',
          suggest: buildSuggest(component, context)
        })
      }
    })
  }
}

function buildSuggest(
  object: ObjectExpression,
  context: RuleContext
): Rule.SuggestionReportDescriptor[] {
  const propertyNodes = object.properties.filter(utils.isProperty)

  const sourceCode = context.sourceCode
  const beforeOptionNode = propertyNodes.find((p) =>
    FIX_EXPOSE_BEFORE_OPTIONS.has(utils.getStaticPropertyName(p) || '')
  )
  const allProps = [
    ...new Set(
      utils.iterateProperties(
        object,
        new Set(['props', 'data', 'computed', 'setup', 'methods', 'watch'])
      )
    )
  ]
  return [
    {
      messageId: 'addExposeOptionForEmpty',
      fix: buildFix('expose: []')
    },
    ...(allProps.length > 0
      ? [
          {
            messageId: 'addExposeOptionForAll',
            fix: buildFix(
              `expose: [${allProps
                .map((p) => JSON.stringify(p.name))
                .join(', ')}]`
            )
          }
        ]
      : [])
  ]

  function buildFix(text: string) {
    return (fixer: RuleFixer) => {
      if (beforeOptionNode) {
        return fixer.insertTextAfter(beforeOptionNode, `,\n${text}`)
      } else if (object.properties.length > 0) {
        const after = propertyNodes[0] || object.properties[0]
        return fixer.insertTextAfter(
          sourceCode.getTokenBefore(after),
          `\n${text},`
        )
      } else {
        const objectLeftBrace = sourceCode.getFirstToken(
          object,
          isOpeningBraceToken
        )!
        const objectRightBrace = sourceCode.getLastToken(
          object,
          isClosingBraceToken
        )!
        return fixer.insertTextAfter(
          objectLeftBrace,
          `\n${text}${
            objectLeftBrace.loc.end.line < objectRightBrace.loc.start.line
              ? ''
              : '\n'
          }`
        )
      }
    }
  }
}
