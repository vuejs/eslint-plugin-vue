/**
 * @fileoverview Disallow unused properties, data and computed properties.
 * @author Learning Equality
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const eslintUtils = require('eslint-utils')

/**
 * @typedef {import('vue-eslint-parser').AST.Node} Node
 * @typedef {import('vue-eslint-parser').AST.ESLintNode} ASTNode
 * @typedef {import('vue-eslint-parser').AST.ESLintObjectPattern} ObjectPattern
 * @typedef {import('vue-eslint-parser').AST.ESLintIdentifier} Identifier
 * @typedef {import('vue-eslint-parser').AST.ESLintThisExpression} ThisExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintFunctionExpression} FunctionExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintFunctionDeclaration} FunctionDeclaration
 * @typedef {import('eslint').Scope.Variable} Variable
 * @typedef {import('eslint').Rule.RuleContext} RuleContext
 */
/**
 * @typedef { { name: string, groupName: string, node: ASTNode } } PropertyData
 * @typedef { { usedNames: Set<string> } } TemplatePropertiesContainer
 * @typedef { { properties: Array<PropertyData>, usedNames: Set<string>, unknown: boolean, usedPropsNames: Set<string>, unknownProps: boolean } } VueComponentPropertiesContainer
 * @typedef { { node: FunctionExpression | ArrowFunctionExpression | FunctionDeclaration, index: number } } CallIdAndParamIndex
 * @typedef { { usedNames: Set<string>, unknown: boolean } } UsedProperties
 */

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const GROUP_PROPERTY = 'props'
const GROUP_DATA = 'data'
const GROUP_COMPUTED_PROPERTY = 'computed'
const GROUP_METHODS = 'methods'
const GROUP_SETUP = 'setup'
const GROUP_WATCHER = 'watch'

const PROPERTY_LABEL = {
  [GROUP_PROPERTY]: 'property',
  [GROUP_DATA]: 'data',
  [GROUP_COMPUTED_PROPERTY]: 'computed property',
  [GROUP_METHODS]: 'method',
  [GROUP_SETUP]: 'property returned from `setup()`'
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Find the variable of a given name.
 * @param {RuleContext} context The rule context
 * @param {ASTNode} node The variable name to find.
 * @returns {Variable|null} The found variable or null.
 */
function findVariable (context, node) {
  // @ts-ignore
  return eslintUtils.findVariable(getScope(context, node), node)
}
/**
 * Gets the scope for the current node
 * @param {RuleContext} context The rule context
 * @param {ASTNode} currentNode The node to get the scope of
 * @returns { import('eslint-scope').Scope } The scope information for this node
 */
function getScope (context, currentNode) {
  // On Program node, get the outermost scope to avoid return Node.js special function scope or ES modules scope.
  const inner = currentNode.type !== 'Program'
  const scopeManager = context.getSourceCode().scopeManager

  // @ts-ignore
  for (let node = currentNode; node; node = node.parent) {
    // @ts-ignore
    const scope = scopeManager.acquire(node, inner)

    if (scope) {
      if (scope.type === 'function-expression-name') {
        return scope.childScopes[0]
      }
      return scope
    }
  }

  return scopeManager.scopes[0]
}

/**
 * Extract names from references objects.
 */
function getReferencesNames (references) {
  return references
    .filter(ref => ref.variable == null)
    .map(ref => ref.id.name)
}

/**
 * @param {ObjectPattern} node
 * @returns {UsedProperties}
 */
function extractObjectPatternProperties (node) {
  const usedNames = new Set()
  for (const prop of node.properties) {
    if (prop.type === 'Property') {
      usedNames.add(utils.getStaticPropertyName(prop))
    } else {
      // If use RestElement, everything is used!
      return {
        usedNames,
        unknown: true
      }
    }
  }
  return {
    usedNames,
    unknown: false
  }
}

/**
 * @param {Identifier | ThisExpression} node
 * @param {RuleContext} context
 * @returns {UsedProps}
 */
function extractIdOrThisProperties (node, context) {
  /** @type {UsedProps} */
  const result = new UsedProps()
  const parent = node.parent
  if (parent.type === 'AssignmentExpression') {
    if (parent.right === node && parent.left.type === 'ObjectPattern') {
      // `({foo} = arg)`
      const { usedNames, unknown } = extractObjectPatternProperties(parent.left)
      usedNames.forEach(name => result.usedNames.add(name))
      result.unknown = result.unknown || unknown
    }
  } else if (parent.type === 'VariableDeclarator') {
    if (parent.init === node && parent.id.type === 'ObjectPattern') {
      // `const {foo} = arg`
      const { usedNames, unknown } = extractObjectPatternProperties(parent.id)
      usedNames.forEach(name => result.usedNames.add(name))
      result.unknown = result.unknown || unknown
    }
  } else if (parent.type === 'MemberExpression') {
    if (parent.object === node) {
      // `arg.foo`
      const name = utils.getStaticPropertyName(parent)
      if (name) {
        result.usedNames.add(name)
      } else {
        result.unknown = true
      }
    }
  } else if (parent.type === 'CallExpression') {
    const argIndex = parent.arguments.indexOf(node)
    if (argIndex > -1 && parent.callee.type === 'Identifier') {
      // `foo(arg)`
      const calleeVariable = findVariable(context, parent.callee)
      if (!calleeVariable) {
        return result
      }
      if (calleeVariable.defs.length === 1) {
        const def = calleeVariable.defs[0]
        if (
          def.type === 'Variable' &&
              def.parent &&
              def.parent.kind === 'const' &&
              (def.node.init.type === 'FunctionExpression' || def.node.init.type === 'ArrowFunctionExpression')
        ) {
          result.calls.push({
            // @ts-ignore
            node: def.node.init,
            index: argIndex
          })
        } else if (def.node.type === 'FunctionDeclaration') {
          result.calls.push({
            node: def.node,
            index: argIndex
          })
        }
      }
    }
  }
  return result
}

/**
 * Collects the property names used.
 */
class UsedProps {
  constructor () {
    /** @type {Set<string>} */
    this.usedNames = new Set()
    /** @type {CallIdAndParamIndex[]} */
    this.calls = []
    this.unknown = false
  }
}

/**
 * Collects the property names used for one parameter of the function.
 */
class ParamUsedProps extends UsedProps {
  /**
   * @param {ASTNode} paramNode
   * @param {RuleContext} context
   */
  constructor (paramNode, context) {
    super()

    if (paramNode.type === 'RestElement' || paramNode.type === 'ArrayPattern') {
      // cannot check
      return
    }
    if (paramNode.type === 'ObjectPattern') {
      const { usedNames, unknown } = extractObjectPatternProperties(paramNode)
      usedNames.forEach(name => this.usedNames.add(name))
      this.unknown = this.unknown || unknown
      return
    }
    const variable = findVariable(context, paramNode)
    if (!variable) {
      return
    }
    for (const reference of variable.references) {
      /** @type {Identifier} */
      // @ts-ignore
      const id = reference.identifier
      const { usedNames, unknown, calls } = extractIdOrThisProperties(id, context)
      usedNames.forEach(name => this.usedNames.add(name))
      this.unknown = this.unknown || unknown
      this.calls.push(...calls)
    }
  }
}

/**
 * Collects the property names used for parameters of the function.
 */
class ParamsUsedProps {
  /**
   * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} node
   * @param {RuleContext} context
   */
  constructor (node, context) {
    this.node = node
    this.context = context
    /** @type {ParamUsedProps[]} */
    this.params = []
  }

  /**
   * @param {number} index
   * @returns {ParamUsedProps}
   */
  getParam (index) {
    const param = this.params[index]
    if (param != null) {
      return param
    }
    if (this.node.params[index]) {
      return (this.params[index] = new ParamUsedProps(this.node.params[index], this.context))
    }
    return null
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused properties',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-unused-properties.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
            items: {
              enum: [
                GROUP_PROPERTY,
                GROUP_DATA,
                GROUP_COMPUTED_PROPERTY,
                GROUP_METHODS,
                GROUP_SETUP
              ]
            },
            additionalItems: false,
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unused: "'{{name}}' of {{group}} found, but never used."
    }
  },

  create (context) {
    const options = context.options[0] || {}
    const groups = new Set(options.groups || [GROUP_PROPERTY])

    /** @type {Map<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression, ParamsUsedProps>} */
    const paramsUsedPropsMap = new Map()
    /** @type {TemplatePropertiesContainer} */
    const templatePropertiesContainer = {
      usedNames: new Set()
    }
    /** @type {Map<ASTNode, VueComponentPropertiesContainer>} */
    const vueComponentPropertiesContainerMap = new Map()

    /**
     * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} node
     * @returns {ParamsUsedProps}
     */
    function getParamsUsedProps (node) {
      let usedProps = paramsUsedPropsMap.get(node)
      if (!usedProps) {
        usedProps = new ParamsUsedProps(node, context)
        paramsUsedPropsMap.set(node, usedProps)
      }
      return usedProps
    }

    /**
     * @param {ASTNode} node
     * @returns {VueComponentPropertiesContainer}
     */
    function getVueComponentPropertiesContainer (node) {
      let container = vueComponentPropertiesContainerMap.get(node)
      if (!container) {
        container = {
          properties: [],
          usedNames: new Set(),
          usedPropsNames: new Set(),
          unknown: false,
          unknownProps: false
        }
        vueComponentPropertiesContainerMap.set(node, container)
      }
      return container
    }

    /**
     * Report all unused properties.
     */
    function reportUnusedProperties () {
      for (const container of vueComponentPropertiesContainerMap.values()) {
        if (container.unknown) {
          continue
        }
        for (const property of container.properties) {
          if (container.usedNames.has(property.name) || templatePropertiesContainer.usedNames.has(property.name)) {
            continue
          }
          if (property.groupName === 'props' && (container.unknownProps || container.usedPropsNames.has(property.name))) {
            continue
          }
          context.report({
            node: property.node,
            messageId: 'unused',
            data: {
              group: PROPERTY_LABEL[property.groupName],
              name: property.name
            }
          })
        }
      }
    }

    /**
     * @param {UsedProps} usedProps
     * @param {Map<ASTNode,Set<number>>} already
     * @returns {Generator<UsedProps>}
     */
    function * iterateUsedProps (usedProps, already = new Map()) {
      yield usedProps
      for (const call of usedProps.calls) {
        let alreadyIndexes = already.get(call.node)
        if (!alreadyIndexes) {
          alreadyIndexes = new Set()
          already.set(call.node, alreadyIndexes)
        }
        if (alreadyIndexes.has(call.index)) {
          continue
        }
        alreadyIndexes.add(call.index)
        const paramsUsedProps = getParamsUsedProps(call.node)
        const paramUsedProps = paramsUsedProps.getParam(call.index)
        if (!paramUsedProps) {
          continue
        }
        yield paramUsedProps
        yield * iterateUsedProps(paramUsedProps, already)
      }
    }

    const scriptVisitor = Object.assign(
      {},
      utils.defineVueVisitor(context, {
        onVueObjectEnter (node) {
          const container = getVueComponentPropertiesContainer(node)
          const watcherNames = new Set()
          for (const watcher of utils.iterateProperties(node, new Set([GROUP_WATCHER]))) {
            watcherNames.add(watcher.name)
          }
          for (const prop of utils.iterateProperties(node, groups)) {
            if (watcherNames.has(prop.name)) {
              continue
            }
            container.properties.push(prop)
          }
        },
        onSetupFunctionEnter (node, vueData) {
          const container = getVueComponentPropertiesContainer(vueData.node)
          const propsParam = node.params[0]
          if (!propsParam) {
            // no arguments
            return
          }
          const paramsUsedProps = getParamsUsedProps(node)
          const paramUsedProps = paramsUsedProps.getParam(0)

          for (const { usedNames, unknown } of iterateUsedProps(paramUsedProps)) {
            if (unknown) {
              container.unknownProps = true
              return
            }
            for (const name of usedNames) {
              container.usedPropsNames.add(name)
            }
          }
        },
        'ThisExpression, Identifier' (node, vueData) {
          if (!utils.isThis(node, context)) {
            return
          }
          const container = getVueComponentPropertiesContainer(vueData.node)
          const usedProps = extractIdOrThisProperties(node, context)

          for (const { usedNames, unknown } of iterateUsedProps(usedProps)) {
            if (unknown) {
              container.unknown = true
              return
            }
            for (const name of usedNames) {
              container.usedNames.add(name)
            }
          }
        }
      }),
      {
        'Program:exit' (node) {
          if (!node.templateBody) {
            reportUnusedProperties()
          }
        }
      },
    )

    const templateVisitor = {
      'VExpressionContainer' (node) {
        for (const name of getReferencesNames(node.references)) {
          templatePropertiesContainer.usedNames.add(name)
        }
      },
      "VElement[parent.type!='VElement']:exit" () {
        reportUnusedProperties()
      }
    }

    return utils.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor)
  }
}
