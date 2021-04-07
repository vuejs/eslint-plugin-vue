/**
 * @fileoverview Disallow undefined properties.
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const eslintUtils = require('eslint-utils')
const reserved = require('../utils/vue-reserved.json')
const { toRegExp } = require('../utils/regexp')

/**
 * @typedef {import('../utils').ComponentPropertyData} ComponentPropertyData
 * @typedef {import('../utils').VueObjectData} VueObjectData
 */
/**
 * @typedef {object} PropertyData
 * @property {boolean} hasNestProperty
 * @property { (name: string) => PropertyData | null } get
 * @property {boolean} [isProps]
 */

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
 * @callback ReferencePropertiesTracker
 * @param {RuleContext} context
 * @returns {ReferenceProperties}
 *
 * @typedef {object} CallAndParamIndex
 * @property {CallExpression} node
 * @property {number} index
 *
 * @typedef {object} Ref
 * @property {string} name
 * @property {ASTNode} node
 * @property {ReferencePropertiesTracker} tracker
 *
 * @typedef {object} ReferenceProperties
 * @property { () => IterableIterator<Ref> } iterateRefs
 * @property { ReadonlyArray<Ref> } list
 * @property { ReadonlyArray<CallAndParamIndex> } calls
 */

/**
 * Collects the property reference names.
 */
class ReferencePropertiesImpl {
  constructor() {
    /** @type {Ref[]} */
    this.list = []
    /** @type {CallAndParamIndex[]} */
    this.calls = []
  }

  /**
   * @param {string} name
   * @param {ASTNode} node
   * @param {ReferencePropertiesTracker} tracker
   */
  addReference(name, node, tracker) {
    this.list.push({
      name,
      node,
      tracker
    })
  }

  /**
   * @returns {IterableIterator<Ref>}
   */
  *iterateRefs() {
    yield* this.list
  }

  /**
   * @param {ReferenceProperties} other
   */
  merge(other) {
    this.list.push(...other.list)
    this.calls.push(...other.calls)
  }
}
/** @type { ReferenceProperties } */
const EMPTY_REFS = new ReferencePropertiesImpl()

/**
 * Collects the property reference names for parameters of the function.
 */
class ParamsReferenceProperties {
  /**
   * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} node
   * @param {RuleContext} context
   */
  constructor(node, context) {
    this.node = node
    this.context = context
    /** @type {ReferenceProperties[]} */
    this.params = []
  }

  /**
   * @param {number} index
   * @returns {ReferenceProperties | null}
   */
  getParam(index) {
    const param = this.params[index]
    if (param != null) {
      return param
    }
    if (this.node.params[index]) {
      return (this.params[index] = extractParamReferences(
        this.node.params[index],
        this.context
      ))
    }
    return null
  }
}
/**
 * Extract the property reference name from one parameter of the function.
 * @param {Pattern} node
 * @param {RuleContext} context
 * @returns {ReferenceProperties}
 */
function extractParamReferences(node, context) {
  while (node.type === 'AssignmentPattern') {
    node = node.left
  }
  if (node.type === 'RestElement' || node.type === 'ArrayPattern') {
    // cannot check
    return EMPTY_REFS
  }
  if (node.type === 'ObjectPattern') {
    return extractObjectPatternReferences(node)
  }
  if (node.type !== 'Identifier') {
    return EMPTY_REFS
  }
  const variable = findVariable(context, node)
  if (!variable) {
    return EMPTY_REFS
  }
  const result = new ReferencePropertiesImpl()
  for (const reference of variable.references) {
    const id = reference.identifier
    result.merge(extractPatternOrThisReferences(id, context, false))
  }

  return result
}

/**
 * Extract the property reference name from ObjectPattern.
 * @param {ObjectPattern} node
 * @returns {ReferenceProperties}
 */
function extractObjectPatternReferences(node) {
  const result = new ReferencePropertiesImpl()
  for (const prop of node.properties) {
    if (prop.type === 'Property') {
      const name = utils.getStaticPropertyName(prop)
      if (name) {
        let pattern = prop.value
        result.addReference(name, prop.key, (context) => {
          while (pattern.type === 'AssignmentPattern') {
            pattern = pattern.left
          }
          if (pattern.type === 'ObjectPattern') {
            return extractObjectPatternReferences(pattern)
          }
          if (pattern.type === 'Identifier') {
            return extractIdentifierReferences(pattern, context)
          }
          return EMPTY_REFS
        })
      }
    }
  }
  return result
}

/**
 * Extract the property reference name from id.
 * @param {Identifier} node
 * @param {RuleContext} context
 * @returns {ReferenceProperties}
 */
function extractIdentifierReferences(node, context) {
  const variable = findVariable(context, node)
  if (!variable) {
    return EMPTY_REFS
  }
  const result = new ReferencePropertiesImpl()
  for (const reference of variable.references) {
    const id = reference.identifier
    result.merge(extractPatternOrThisReferences(id, context, false))
  }
  return result
}
/**
 * Extract the property reference name from pattern or `this`.
 * @param {Identifier | MemberExpression | ChainExpression | ThisExpression} node
 * @param {RuleContext} context
 * @param {boolean} withInTemplate
 * @returns {ReferenceProperties}
 */
function extractPatternOrThisReferences(node, context, withInTemplate) {
  while (node.parent.type === 'ChainExpression') {
    node = node.parent
  }
  const parent = node.parent
  if (parent.type === 'AssignmentExpression') {
    if (withInTemplate) {
      return EMPTY_REFS
    }
    if (parent.right === node && parent.left.type === 'ObjectPattern') {
      // `({foo} = arg)`
      return extractObjectPatternReferences(parent.left)
    }
  } else if (parent.type === 'VariableDeclarator') {
    if (withInTemplate) {
      return EMPTY_REFS
    }
    if (parent.init === node) {
      if (parent.id.type === 'ObjectPattern') {
        // `const {foo} = arg`
        return extractObjectPatternReferences(parent.id)
      } else if (parent.id.type === 'Identifier') {
        // `const foo = arg`
        return extractIdentifierReferences(parent.id, context)
      }
    }
  } else if (parent.type === 'MemberExpression') {
    if (parent.object === node) {
      // `arg.foo`
      const name = utils.getStaticPropertyName(parent)
      if (name) {
        const result = new ReferencePropertiesImpl()
        result.addReference(name, parent.property, () =>
          extractPatternOrThisReferences(parent, context, withInTemplate)
        )
        return result
      }
    }
  } else if (parent.type === 'CallExpression') {
    if (withInTemplate) {
      return EMPTY_REFS
    }
    const argIndex = parent.arguments.indexOf(node)
    if (argIndex > -1) {
      // `foo(arg)`
      const result = new ReferencePropertiesImpl()
      result.calls.push({
        node: parent,
        index: argIndex
      })
      return result
    }
  }
  return EMPTY_REFS
}

/**
 * @param {ObjectExpression} object
 * @returns {Map<string, Property> | null}
 */
function getObjectPropertyMap(object) {
  /** @type {Map<string, Property>} */
  const props = new Map()
  for (const p of object.properties) {
    if (p.type !== 'Property') {
      return null
    }
    const name = utils.getStaticPropertyName(p)
    if (name == null) {
      return null
    }
    props.set(name, p)
  }
  return props
}

/**
 * @param {Property | undefined} property
 * @returns {PropertyData | null}
 */
function getPropertyDataFromObjectProperty(property) {
  if (property == null) {
    return null
  }
  const propertyMap =
    property.value.type === 'ObjectExpression'
      ? getObjectPropertyMap(property.value)
      : null
  return {
    hasNestProperty: Boolean(propertyMap),
    get(name) {
      if (!propertyMap) {
        return null
      }
      return getPropertyDataFromObjectProperty(propertyMap.get(name))
    }
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow undefined properties',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-undef-properties.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      undef: "'{{name}}' is not defined.",
      undefProps: "'{{name}}' is not defined in props."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const ignores = /** @type {string[]} */ (options.ignores || ['/^\\$/']).map(
      toRegExp
    )

    /** Vue component context */
    class VueComponentContext {
      constructor() {
        /** @type { Map<string, PropertyData> } */
        this.properties = new Map()

        /** @type { Set<string | ASTNode> } */
        this.reported = new Set()
      }

      /**
       * Report
       * @param {ASTNode} node
       * @param {string} name
       * @param {'undef' | 'undefProps'} messageId
       */
      report(node, name, messageId = 'undef') {
        if (
          reserved.includes(name) ||
          ignores.some((ignore) => ignore.test(name))
        ) {
          return
        }
        if (
          // Prevents reporting to the same node.
          this.reported.has(node) ||
          // Prevents reports with the same name.
          // This is so that intentional undefined properties can be resolved with
          // a single warning suppression comment (`// eslint-disable-line`).
          this.reported.has(name)
        ) {
          return
        }
        this.reported.add(node)
        this.reported.add(name)
        context.report({
          node,
          messageId,
          data: {
            name
          }
        })
      }

      /**
       * Verify reference properties
       * @param {ReferenceProperties | null} refs
       * @param {object} [options]
       * @param {boolean} [options.props]
       */
      verifyUndefProperties(refs, options) {
        const that = this
        verifyUndefProperties(this.properties, refs, null)

        /**
         * @param { { get: (name: string) => PropertyData | null | undefined } } propData
         * @param {ReferenceProperties|null} refs
         * @param {string|null} pathName
         */
        function verifyUndefProperties(propData, refs, pathName) {
          for (const ref of iterateResolvedRefs(refs)) {
            /** @type {'undef' | 'undefProps' | null} */
            let messageId = null

            const referencePathName = pathName
              ? `${pathName}.${ref.name}`
              : ref.name

            const prop = propData.get(ref.name)
            if (prop) {
              if (options && options.props) {
                if (!prop.isProps) {
                  messageId = 'undefProps'
                }
              }

              if (!messageId) {
                if (prop.hasNestProperty) {
                  verifyUndefProperties(
                    prop,
                    ref.tracker(context),
                    referencePathName
                  )
                }
                continue
              }
            } else {
              messageId = 'undef'
            }
            that.report(ref.node, referencePathName, messageId)
          }
        }
      }
    }

    /** @type {Map<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression, ParamsReferenceProperties>} */
    const paramsReferencePropertiesMap = new Map()
    /** @type {Map<ASTNode, VueComponentContext>} */
    const vueComponentContextMap = new Map()

    /**
     * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} node
     * @returns {ParamsReferenceProperties}
     */
    function getParamsReferenceProperties(node) {
      let usedProps = paramsReferencePropertiesMap.get(node)
      if (!usedProps) {
        usedProps = new ParamsReferenceProperties(node, context)
        paramsReferencePropertiesMap.set(node, usedProps)
      }
      return usedProps
    }

    /**
     * @param {ASTNode} node
     * @returns {VueComponentContext}
     */
    function getVueComponentContext(node) {
      let ctx = vueComponentContextMap.get(node)
      if (!ctx) {
        ctx = new VueComponentContext()
        vueComponentContextMap.set(node, ctx)
      }
      return ctx
    }

    /**
     * @param {ReferenceProperties|null} refs
     * @returns { IterableIterator<Ref> }
     */
    function* iterateResolvedRefs(refs) {
      const already = new Map()

      yield* iterate(refs)

      /**
       * @param {ReferenceProperties|null} refs
       * @returns {IterableIterator<Ref>}
       */
      function* iterate(refs) {
        if (!refs) {
          return
        }
        yield* refs.iterateRefs()
        for (const call of refs.calls) {
          if (call.node.callee.type !== 'Identifier') {
            continue
          }
          const fnNode = findFunction(context, call.node.callee)
          if (!fnNode) {
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
          const paramsRefs = getParamsReferenceProperties(fnNode)
          const paramRefs = paramsRefs.getParam(call.index)
          yield* iterate(paramRefs)
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
          const ctx = getVueComponentContext(node)

          for (const prop of utils.iterateProperties(
            node,
            new Set(['props', 'data', 'computed', 'setup', 'methods', 'inject'])
          )) {
            const propertyMap =
              prop.groupName === 'data' &&
              prop.type === 'object' &&
              prop.property.value.type === 'ObjectExpression'
                ? getObjectPropertyMap(prop.property.value)
                : null
            ctx.properties.set(prop.name, {
              hasNestProperty: Boolean(propertyMap),
              isProps: prop.groupName === 'props',
              get(name) {
                if (!propertyMap) {
                  return null
                }
                return getPropertyDataFromObjectProperty(propertyMap.get(name))
              }
            })
          }

          for (const watcher of utils.iterateProperties(
            node,
            new Set(['watch'])
          )) {
            // Process `watch: { foo /* <- this */ () {} }`
            const segments = watcher.name.split('.')

            const propData = ctx.properties.get(segments[0])
            if (!propData) {
              ctx.report(watcher.node, segments[0])
            } else {
              let targetPropData = propData
              let index = 1
              while (
                targetPropData.hasNestProperty &&
                index < segments.length
              ) {
                const nestPropData = targetPropData.get(segments[index])
                if (!nestPropData) {
                  ctx.report(
                    watcher.node,
                    segments.slice(0, index + 1).join('.')
                  )
                  break
                } else {
                  index++
                  targetPropData = nestPropData
                }
              }
            }

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
                    if (name != null && !ctx.properties.get(name)) {
                      ctx.report(handlerValueNode, name)
                    }
                  }
                }
              }
            }
          }
        },
        /** @param { (FunctionExpression | ArrowFunctionExpression) & { parent: Property }} node */
        'ObjectExpression > Property > :function[params.length>0]'(
          node,
          vueData
        ) {
          let props = false
          const property = getParentProperty(node)
          if (!property) {
            return
          }
          if (property.parent === vueData.node) {
            if (utils.getStaticPropertyName(property) !== 'data') {
              return
            }
            // check { data: (vm) => vm.prop }
            props = true
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

          const paramsRefs = getParamsReferenceProperties(node)
          const refs = paramsRefs.getParam(0)
          const ctx = getVueComponentContext(vueData.node)
          ctx.verifyUndefProperties(refs, { props })
        },
        onSetupFunctionEnter(node, vueData) {
          const paramsRefs = getParamsReferenceProperties(node)
          const paramRefs = paramsRefs.getParam(0)
          const ctx = getVueComponentContext(vueData.node)
          ctx.verifyUndefProperties(paramRefs, {
            props: true
          })
        },
        onRenderFunctionEnter(node, vueData) {
          const ctx = getVueComponentContext(vueData.node)

          // Check for Vue 3.x render
          const paramsRefs = getParamsReferenceProperties(node)
          const ctxRefs = paramsRefs.getParam(0)
          ctx.verifyUndefProperties(ctxRefs)

          if (vueData.functional) {
            // Check for Vue 2.x render & functional
            const propsRefs = new ReferencePropertiesImpl()
            for (const ref of iterateResolvedRefs(paramsRefs.getParam(1))) {
              if (ref.name === 'props') {
                propsRefs.merge(ref.tracker(context))
              }
            }
            ctx.verifyUndefProperties(propsRefs, {
              props: true
            })
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
          const ctx = getVueComponentContext(vueData.node)
          const usedProps = extractPatternOrThisReferences(node, context, false)
          ctx.verifyUndefProperties(usedProps)
        }
      })
    )

    const templateVisitor = {
      /**
       * @param {VExpressionContainer} node
       */
      VExpressionContainer(node) {
        const globalScope =
          context.getSourceCode().scopeManager.globalScope ||
          context.getSourceCode().scopeManager.scopes[0]

        const refs = new ReferencePropertiesImpl()
        for (const id of getReferences(node.references)) {
          if (globalScope.set.has(id.name)) {
            continue
          }
          refs.addReference(id.name, id, (context) =>
            extractPatternOrThisReferences(id, context, true)
          )
        }

        const exported = [...vueComponentContextMap.keys()].find(isExportObject)
        const ctx = exported && vueComponentContextMap.get(exported)

        if (ctx) {
          ctx.verifyUndefProperties(refs)
        }

        /**
         * @param {ASTNode} node
         */
        function isExportObject(node) {
          let parent = node.parent
          while (parent) {
            if (parent.type === 'ExportDefaultDeclaration') {
              return true
            }
            parent = parent.parent
          }
          return false
        }
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      templateVisitor,
      scriptVisitor
    )
  }
}
