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
 * @typedef {import('../utils').ComponentPropertyData} ComponentPropertyData
 * @typedef {import('../utils').VueObjectData} VueObjectData
 */
/**
 * @typedef {object} TemplatePropertiesContainer
 * @property {UsedProperties} usedProperties
 * @property {Set<string>} refNames
 * @typedef {object} VueComponentPropertiesContainer
 * @property {ComponentPropertyData[]} properties
 * @property {UsedProperties} usedProperties
 * @property {UsedProperties} usedPropertiesForProps
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
  props: 'property',
  data: 'data',
  computed: 'computed property',
  methods: 'method',
  setup: 'property returned from `setup()`',
  watch: 'watch'
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Find the variable of a given name.
 * @param {RuleContext} context The rule context
 * @param {Identifier} node The variable name to find.
 * @returns {Variable|null} The found variable or null.
 */
function findVariable(context, node) {
  return eslintUtils.findVariable(getScope(context, node), node)
}
/**
 * Gets the scope for the current node
 * @param {RuleContext} context The rule context
 * @param {ESNode} currentNode The node to get the scope of
 * @returns { import('eslint').Scope.Scope } The scope information for this node
 */
function getScope(context, currentNode) {
  // On Program node, get the outermost scope to avoid return Node.js special function scope or ES modules scope.
  const inner = currentNode.type !== 'Program'
  const scopeManager = context.getSourceCode().scopeManager

  /** @type {ESNode | null} */
  let node = currentNode
  for (; node; node = /** @type {ESNode | null} */ (node.parent)) {
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
 * @param {VReference[]} references
 */
function getReferences(references) {
  return references.filter((ref) => ref.variable == null).map((ref) => ref.id)
}

/**
 * @param {RuleContext} context
 * @param {Identifier} id
 * @returns {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration | null}
 */
function findFunction(context, id) {
  const calleeVariable = findVariable(context, id)
  if (!calleeVariable) {
    return null
  }
  if (calleeVariable.defs.length === 1) {
    const def = calleeVariable.defs[0]
    if (def.node.type === 'FunctionDeclaration') {
      return def.node
    }
    if (
      def.type === 'Variable' &&
      def.parent.kind === 'const' &&
      def.node.init
    ) {
      if (
        def.node.init.type === 'FunctionExpression' ||
        def.node.init.type === 'ArrowFunctionExpression'
      ) {
        return def.node.init
      }
      if (def.node.init.type === 'Identifier') {
        return findFunction(context, def.node.init)
      }
    }
  }
  return null
}

/**
 * @param {RuleContext} context
 * @param {Identifier} id
 * @returns {Expression}
 */
function findExpression(context, id) {
  const variable = findVariable(context, id)
  if (!variable) {
    return id
  }
  if (variable.defs.length === 1) {
    const def = variable.defs[0]
    if (
      def.type === 'Variable' &&
      def.parent.kind === 'const' &&
      def.node.init
    ) {
      if (def.node.init.type === 'Identifier') {
        return findExpression(context, def.node.init)
      }
      return def.node.init
    }
  }
  return id
}

/**
 * @typedef { (context: RuleContext) => UsedProperties } UsedPropertiesTracker
 * @typedef { { node: CallExpression, index: number } } CallAndParamIndex
 */

/**
 * Collects the used property names.
 */
class UsedProperties {
  /**
   * @param {object} [option]
   * @param {boolean} [option.unknown]
   */
  constructor(option) {
    /** @type {Record<string, UsedPropertiesTracker[]>} */
    this.map = Object.create(null)
    /** @type {CallAndParamIndex[]} */
    this.calls = []
    this.unknown = (option && option.unknown) || false
  }

  /**
   * @param {string} name
   */
  isUsed(name) {
    if (this.unknown) {
      // If it is unknown, it is considered used.
      return true
    }
    return Boolean(this.map[name])
  }

  /**
   * @param {string} name
   * @param {UsedPropertiesTracker | null} tracker
   */
  addUsed(name, tracker) {
    const trackers = this.map[name] || (this.map[name] = [])
    if (tracker) trackers.push(tracker)
  }

  /**
   * @param {string} name
   * @returns {UsedPropertiesTracker}
   */
  getPropsTracker(name) {
    if (this.unknown) {
      return () => new UsedProperties({ unknown: true })
    }
    const trackers = this.map[name] || []
    return (context) => {
      const result = new UsedProperties()
      for (const tracker of trackers) {
        result.merge(tracker(context))
      }
      return result
    }
  }

  /**
   * @param {UsedProperties | null} other
   */
  merge(other) {
    if (!other) {
      return
    }
    this.unknown = this.unknown || other.unknown
    if (this.unknown) {
      return
    }
    for (const [name, otherTrackers] of Object.entries(other.map)) {
      const trackers = this.map[name] || (this.map[name] = [])
      trackers.push(...otherTrackers)
    }
    this.calls.push(...other.calls)
  }
}

/**
 * Collects the used property names for parameters of the function.
 */
class ParamsUsedProperties {
  /**
   * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} node
   * @param {RuleContext} context
   */
  constructor(node, context) {
    this.node = node
    this.context = context
    /** @type {UsedProperties[]} */
    this.params = []
  }

  /**
   * @param {number} index
   * @returns {UsedProperties | null}
   */
  getParam(index) {
    const param = this.params[index]
    if (param != null) {
      return param
    }
    if (this.node.params[index]) {
      return (this.params[index] = extractParamProperties(
        this.node.params[index],
        this.context
      ))
    }
    return null
  }
}
/**
 * Extract the used property name from one parameter of the function.
 * @param {Pattern} node
 * @param {RuleContext} context
 * @returns {UsedProperties}
 */
function extractParamProperties(node, context) {
  const result = new UsedProperties()

  while (node.type === 'AssignmentPattern') {
    node = node.left
  }
  if (node.type === 'RestElement' || node.type === 'ArrayPattern') {
    // cannot check
    return result
  }
  if (node.type === 'ObjectPattern') {
    result.merge(extractObjectPatternProperties(node))
    return result
  }
  if (node.type !== 'Identifier') {
    return result
  }
  const variable = findVariable(context, node)
  if (!variable) {
    return result
  }
  for (const reference of variable.references) {
    const id = reference.identifier
    result.merge(extractPatternOrThisProperties(id, context, false))
  }

  return result
}

/**
 * Extract the used property name from ObjectPattern.
 * @param {ObjectPattern} node
 * @returns {UsedProperties}
 */
function extractObjectPatternProperties(node) {
  const result = new UsedProperties()
  for (const prop of node.properties) {
    if (prop.type === 'Property') {
      const name = utils.getStaticPropertyName(prop)
      if (name) {
        result.addUsed(name, getObjectPatternPropertyPatternTracker(prop.value))
      } else {
        // If cannot trace name, everything is used!
        result.unknown = true
        return result
      }
    } else {
      // If use RestElement, everything is used!
      result.unknown = true
      return result
    }
  }
  return result
}

/**
 * Extract the used property name from id.
 * @param {Identifier} node
 * @param {RuleContext} context
 * @returns {UsedProperties}
 */
function extractIdentifierProperties(node, context) {
  const result = new UsedProperties()
  const variable = findVariable(context, node)
  if (!variable) {
    return result
  }
  for (const reference of variable.references) {
    const id = reference.identifier
    result.merge(extractPatternOrThisProperties(id, context, false))
  }
  return result
}
/**
 * Extract the used property name from pattern or `this`.
 * @param {Identifier | MemberExpression | ChainExpression | ThisExpression} node
 * @param {RuleContext} context
 * @param {boolean} withInTemplate
 * @returns {UsedProperties}
 */
function extractPatternOrThisProperties(node, context, withInTemplate) {
  const result = new UsedProperties()
  const parent = node.parent
  if (parent.type === 'AssignmentExpression') {
    if (withInTemplate) {
      return result
    }
    if (parent.right === node && parent.left.type === 'ObjectPattern') {
      // `({foo} = arg)`
      result.merge(extractObjectPatternProperties(parent.left))
    }
    return result
  } else if (parent.type === 'VariableDeclarator') {
    if (withInTemplate) {
      return result
    }
    if (parent.init === node) {
      if (parent.id.type === 'ObjectPattern') {
        // `const {foo} = arg`
        result.merge(extractObjectPatternProperties(parent.id))
      } else if (parent.id.type === 'Identifier') {
        // `const foo = arg`
        result.merge(extractIdentifierProperties(parent.id, context))
      }
    }
    return result
  } else if (parent.type === 'MemberExpression') {
    if (parent.object === node) {
      // `arg.foo`
      const name = utils.getStaticPropertyName(parent)
      if (name) {
        result.addUsed(name, () =>
          extractPatternOrThisProperties(parent, context, withInTemplate)
        )
      } else {
        result.unknown = true
      }
    }
    return result
  } else if (parent.type === 'CallExpression') {
    if (withInTemplate) {
      return result
    }
    const argIndex = parent.arguments.indexOf(node)
    if (argIndex > -1) {
      // `foo(arg)`
      result.calls.push({
        node: parent,
        index: argIndex
      })
    }
  } else if (parent.type === 'ChainExpression') {
    result.merge(
      extractPatternOrThisProperties(parent, context, withInTemplate)
    )
  } else if (
    parent.type === 'ArrowFunctionExpression' ||
    parent.type === 'ReturnStatement' ||
    parent.type === 'VExpressionContainer' ||
    parent.type === 'Property' ||
    parent.type === 'ArrayExpression'
  ) {
    // Maybe used externally.
    if (maybeExternalUsed(parent)) {
      result.unknown = true
    }
  }
  return result

  /**
   * @param {ASTNode} parentTarget
   * @returns {boolean}
   */
  function maybeExternalUsed(parentTarget) {
    if (
      parentTarget.type === 'ReturnStatement' ||
      parentTarget.type === 'VExpressionContainer'
    ) {
      return true
    }
    if (parentTarget.type === 'ArrayExpression') {
      return maybeExternalUsed(parentTarget.parent)
    }
    if (parentTarget.type === 'Property') {
      return maybeExternalUsed(parentTarget.parent.parent)
    }
    if (parentTarget.type === 'ArrowFunctionExpression') {
      return parentTarget.body === node
    }
    return false
  }
}

/**
 * @param {Pattern} pattern
 * @returns {UsedPropertiesTracker}
 */
function getObjectPatternPropertyPatternTracker(pattern) {
  if (pattern.type === 'ObjectPattern') {
    return () => extractObjectPatternProperties(pattern)
  }
  if (pattern.type === 'Identifier') {
    return (context) => extractIdentifierProperties(pattern, context)
  } else if (pattern.type === 'AssignmentPattern') {
    return getObjectPatternPropertyPatternTracker(pattern.left)
  }
  return () => new UsedProperties({ unknown: true })
}

/**
 * Check if the given component property is marked as `@public` in JSDoc comments.
 * @param {ComponentPropertyData} property
 * @param {SourceCode} sourceCode
 */
function isPublicMember(property, sourceCode) {
  if (
    property.type === 'object' &&
    // Props do not support @public.
    property.groupName !== 'props'
  ) {
    return isPublicProperty(property.property, sourceCode)
  }
  return false
}

/**
 * Check if the given property node is marked as `@public` in JSDoc comments.
 * @param {Property} node
 * @param {SourceCode} sourceCode
 */
function isPublicProperty(node, sourceCode) {
  const jsdoc = getJSDocFromProperty(node, sourceCode)
  if (jsdoc) {
    return /(?:^|\s|\*)@public\b/u.test(jsdoc.value)
  }
  return false
}

/**
 * Get the JSDoc comment for a given property node.
 * @param {Property} node
 * @param {SourceCode} sourceCode
 */
function getJSDocFromProperty(node, sourceCode) {
  const jsdoc = findJSDocComment(node, sourceCode)
  if (jsdoc) {
    return jsdoc
  }
  if (
    node.value.type === 'FunctionExpression' ||
    node.value.type === 'ArrowFunctionExpression'
  ) {
    return findJSDocComment(node.value, sourceCode)
  }

  return null
}

/**
 * Finds a JSDoc comment for the given node.
 * @param {ASTNode} node
 * @param {SourceCode} sourceCode
 * @returns {Comment | null}
 */
function findJSDocComment(node, sourceCode) {
  /** @type {ASTNode | Token} */
  let currentNode = node
  let tokenBefore = null

  while (currentNode) {
    tokenBefore = sourceCode.getTokenBefore(currentNode, {
      includeComments: true
    })
    if (!tokenBefore || !eslintUtils.isCommentToken(tokenBefore)) {
      return null
    }
    if (tokenBefore.type === 'Line') {
      currentNode = tokenBefore
      continue
    }
    break
  }

  if (
    tokenBefore &&
    tokenBefore.type === 'Block' &&
    tokenBefore.value.charAt(0) === '*'
  ) {
    return tokenBefore
  }

  return null
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
          },
          deepData: { type: 'boolean' },
          ignorePublicMembers: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unused: "'{{name}}' of {{group}} found, but never used."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const groups = new Set(options.groups || [GROUP_PROPERTY])
    const deepData = Boolean(options.deepData)
    const ignorePublicMembers = Boolean(options.ignorePublicMembers)

    /** @type {Map<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression, ParamsUsedProperties>} */
    const paramsUsedPropertiesMap = new Map()
    /** @type {TemplatePropertiesContainer} */
    const templatePropertiesContainer = {
      usedProperties: new UsedProperties(),
      refNames: new Set()
    }
    /** @type {Map<ASTNode, VueComponentPropertiesContainer>} */
    const vueComponentPropertiesContainerMap = new Map()

    /**
     * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} node
     * @returns {ParamsUsedProperties}
     */
    function getParamsUsedProperties(node) {
      let usedProps = paramsUsedPropertiesMap.get(node)
      if (!usedProps) {
        usedProps = new ParamsUsedProperties(node, context)
        paramsUsedPropertiesMap.set(node, usedProps)
      }
      return usedProps
    }

    /**
     * @param {ASTNode} node
     * @returns {VueComponentPropertiesContainer}
     */
    function getVueComponentPropertiesContainer(node) {
      let container = vueComponentPropertiesContainerMap.get(node)
      if (!container) {
        container = {
          properties: [],
          usedProperties: new UsedProperties(),
          usedPropertiesForProps: new UsedProperties()
        }
        vueComponentPropertiesContainerMap.set(node, container)
      }
      return container
    }
    /**
     * @param {string[]} segments
     * @param {Expression} propertyValue
     * @param {UsedProperties} baseUsedProperties
     */
    function verifyDataOptionDeepProperties(
      segments,
      propertyValue,
      baseUsedProperties
    ) {
      let targetExpr = propertyValue
      if (targetExpr.type === 'Identifier') {
        targetExpr = findExpression(context, targetExpr)
      }
      if (targetExpr.type === 'ObjectExpression') {
        const usedProperties = resolvedUsedProperties(baseUsedProperties, {
          allowUnknownCall: true
        })
        if (usedProperties.unknown) {
          return
        }

        for (const prop of targetExpr.properties) {
          if (prop.type !== 'Property') {
            continue
          }
          const name = utils.getStaticPropertyName(prop)
          if (name == null) {
            continue
          }
          if (!usedProperties.isUsed(name)) {
            // report
            context.report({
              node: prop.key,
              messageId: 'unused',
              data: {
                group: PROPERTY_LABEL.data,
                name: [...segments, name].join('.')
              }
            })
            continue
          }
          // next
          verifyDataOptionDeepProperties(
            [...segments, name],
            prop.value,
            usedProperties.getPropsTracker(name)(context)
          )
        }
      }
    }

    /**
     * Report all unused properties.
     */
    function reportUnusedProperties() {
      for (const container of vueComponentPropertiesContainerMap.values()) {
        const usedProperties = resolvedUsedProperties(container.usedProperties)
        usedProperties.merge(templatePropertiesContainer.usedProperties)
        if (usedProperties.unknown) {
          continue
        }

        const usedPropertiesForProps = resolvedUsedProperties(
          container.usedPropertiesForProps
        )

        for (const property of container.properties) {
          if (
            property.groupName === 'props' &&
            usedPropertiesForProps.isUsed(property.name)
          ) {
            // used props
            continue
          }
          if (
            property.groupName === 'setup' &&
            templatePropertiesContainer.refNames.has(property.name)
          ) {
            // used template refs
            continue
          }
          if (
            ignorePublicMembers &&
            isPublicMember(property, context.getSourceCode())
          ) {
            continue
          }
          if (usedProperties.isUsed(property.name)) {
            // used
            if (
              deepData &&
              property.groupName === 'data' &&
              property.type === 'object'
            ) {
              // Check the deep properties of the data option.
              verifyDataOptionDeepProperties(
                [property.name],
                property.property.value,
                usedProperties.getPropsTracker(property.name)(context)
              )
            }
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
     * @param {UsedProperties | null} usedProps
     * @param {object} [options]
     * @param {boolean} [options.allowUnknownCall]
     * @returns {UsedProperties}
     */
    function resolvedUsedProperties(usedProps, options) {
      const allowUnknownCall = options && options.allowUnknownCall
      const already = new Map()

      const result = new UsedProperties()
      for (const up of iterate(usedProps)) {
        result.merge(up)
        if (result.unknown) {
          break
        }
      }
      return result

      /**
       * @param {UsedProperties | null} usedProps
       * @returns {IterableIterator<UsedProperties>}
       */
      function* iterate(usedProps) {
        if (!usedProps) {
          return
        }
        yield usedProps
        for (const call of usedProps.calls) {
          if (call.node.callee.type !== 'Identifier') {
            if (allowUnknownCall) {
              yield new UsedProperties({ unknown: true })
            }
            continue
          }
          const fnNode = findFunction(context, call.node.callee)
          if (!fnNode) {
            if (allowUnknownCall) {
              yield new UsedProperties({ unknown: true })
            }
            continue
          }

          let alreadyIndexes = already.get(fnNode)
          if (!alreadyIndexes) {
            alreadyIndexes = new Set()
            already.set(fnNode, alreadyIndexes)
          }
          if (alreadyIndexes.has(call.index)) {
            continue
          }
          alreadyIndexes.add(call.index)
          const paramsUsedProps = getParamsUsedProperties(fnNode)
          const paramUsedProps = paramsUsedProps.getParam(call.index)
          yield* iterate(paramUsedProps)
        }
      }
    }

    /**
     * @param {Expression} node
     * @returns {Property|null}
     */
    function getParentProperty(node) {
      if (
        !node.parent ||
        node.parent.type !== 'Property' ||
        node.parent.value !== node
      ) {
        return null
      }
      const property = node.parent
      if (!utils.isProperty(property)) {
        return null
      }
      return property
    }

    const scriptVisitor = utils.compositingVisitors(
      {},
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          const container = getVueComponentPropertiesContainer(node)

          for (const watcher of utils.iterateProperties(
            node,
            new Set([GROUP_WATCHER])
          )) {
            // Process `watch: { foo /* <- this */ () {} }`
            const segments = watcher.name.split('.')
            container.usedProperties.addUsed(segments[0], (context) => {
              return buildChainTracker(segments)(context)
              /**
               * @param {string[]} baseSegments
               * @returns {UsedPropertiesTracker}
               */
              function buildChainTracker(baseSegments) {
                return () => {
                  const subSegments = baseSegments.slice(1)
                  const usedProps = new UsedProperties()
                  if (subSegments.length) {
                    usedProps.addUsed(
                      subSegments[0],
                      buildChainTracker(subSegments)
                    )
                  }
                  return usedProps
                }
              }
            })

            // Process `watch: { x: 'foo' /* <- this */  }`
            if (watcher.type === 'object') {
              const property = watcher.property
              if (property.kind === 'init') {
                for (const handlerValueNode of utils.iterateWatchHandlerValues(
                  property
                )) {
                  if (
                    handlerValueNode.type === 'Literal' ||
                    handlerValueNode.type === 'TemplateLiteral'
                  ) {
                    const name = utils.getStringLiteralValue(handlerValueNode)
                    if (name != null) {
                      container.usedProperties.addUsed(name, null)
                    }
                  }
                }
              }
            }
          }
          container.properties.push(...utils.iterateProperties(node, groups))
        },
        /** @param { (FunctionExpression | ArrowFunctionExpression) & { parent: Property }} node */
        'ObjectExpression > Property > :function[params.length>0]'(
          node,
          vueData
        ) {
          const property = getParentProperty(node)
          if (!property) {
            return
          }
          if (property.parent === vueData.node) {
            if (utils.getStaticPropertyName(property) !== 'data') {
              return
            }
            // check { data: (vm) => vm.prop }
          } else {
            const parentProperty = getParentProperty(property.parent)
            if (!parentProperty) {
              return
            }
            if (parentProperty.parent === vueData.node) {
              if (utils.getStaticPropertyName(parentProperty) !== 'computed') {
                return
              }
              // check { computed: { foo: (vm) => vm.prop } }
            } else {
              const parentParentProperty = getParentProperty(
                parentProperty.parent
              )
              if (!parentParentProperty) {
                return
              }
              if (parentParentProperty.parent === vueData.node) {
                if (
                  utils.getStaticPropertyName(parentParentProperty) !==
                    'computed' ||
                  utils.getStaticPropertyName(property) !== 'get'
                ) {
                  return
                }
                // check { computed: { foo: { get: (vm) => vm.prop } } }
              } else {
                return
              }
            }
          }

          const paramsUsedProps = getParamsUsedProperties(node)
          const usedProps = paramsUsedProps.getParam(0)
          const container = getVueComponentPropertiesContainer(vueData.node)
          container.usedProperties.merge(usedProps)
        },
        onSetupFunctionEnter(node, vueData) {
          const container = getVueComponentPropertiesContainer(vueData.node)
          const paramsUsedProps = getParamsUsedProperties(node)
          const paramUsedProps = paramsUsedProps.getParam(0)
          container.usedPropertiesForProps.merge(paramUsedProps)
        },
        onRenderFunctionEnter(node, vueData) {
          const container = getVueComponentPropertiesContainer(vueData.node)

          // Check for Vue 3.x render
          const paramsUsedProps = getParamsUsedProperties(node)
          const ctxUsedProps = paramsUsedProps.getParam(0)

          container.usedPropertiesForProps.merge(ctxUsedProps)
          if (container.usedPropertiesForProps.unknown) {
            return
          }

          if (vueData.functional) {
            // Check for Vue 2.x render & functional
            const contextUsedProps = resolvedUsedProperties(
              paramsUsedProps.getParam(1)
            )
            const tracker = contextUsedProps.getPropsTracker('props')
            const propUsedProps = tracker(context)
            container.usedPropertiesForProps.merge(propUsedProps)
          }
        },
        /**
         * @param {ThisExpression | Identifier} node
         * @param {VueObjectData} vueData
         */
        'ThisExpression, Identifier'(node, vueData) {
          if (!utils.isThis(node, context)) {
            return
          }
          const container = getVueComponentPropertiesContainer(vueData.node)
          const usedProps = extractPatternOrThisProperties(node, context, false)
          container.usedProperties.merge(usedProps)
        }
      }),
      {
        /** @param {Program} node */
        'Program:exit'(node) {
          if (!node.templateBody) {
            reportUnusedProperties()
          }
        }
      }
    )

    const templateVisitor = {
      /**
       * @param {VExpressionContainer} node
       */
      VExpressionContainer(node) {
        for (const id of getReferences(node.references)) {
          templatePropertiesContainer.usedProperties.addUsed(
            id.name,
            (context) => extractPatternOrThisProperties(id, context, true)
          )
        }
      },
      /**
       * @param {VAttribute} node
       */
      'VAttribute[directive=false]'(node) {
        if (node.key.name === 'ref' && node.value != null) {
          templatePropertiesContainer.refNames.add(node.value.value)
        }
      },
      "VElement[parent.type!='VElement']:exit"() {
        reportUnusedProperties()
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      templateVisitor,
      scriptVisitor
    )
  }
}
