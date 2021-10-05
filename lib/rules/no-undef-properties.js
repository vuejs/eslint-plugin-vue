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
const { getStyleVariablesContext } = require('../utils/style-variables')
const {
  definePropertyReferenceExtractor
} = require('../utils/property-references')

/**
 * @typedef {import('../utils').VueObjectData} VueObjectData
 * @typedef {import('../utils/property-references').IPropertyReferences} IPropertyReferences
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

const GROUP_PROPERTY = 'props'
const GROUP_DATA = 'data'
const GROUP_COMPUTED_PROPERTY = 'computed'
const GROUP_METHODS = 'methods'
const GROUP_SETUP = 'setup'
const GROUP_WATCHER = 'watch'
const GROUP_EXPOSE = 'expose'
const GROUP_INJECT = 'inject'

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
    const propertyReferenceExtractor = definePropertyReferenceExtractor(context)
    const programNode = context.getSourceCode().ast

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
       * @param {IPropertyReferences} references
       * @param {object} [options]
       * @param {boolean} [options.props]
       */
      verifyReferences(references, options) {
        const that = this
        verifyUndefProperties(this.properties, references, null)

        /**
         * @param { { get: (name: string) => PropertyData | null | undefined } } propData
         * @param {IPropertyReferences|null} references
         * @param {string|null} pathName
         */
        function verifyUndefProperties(propData, references, pathName) {
          if (!references) {
            return
          }
          for (const [refName, { nodes }] of references.allProperties()) {
            /** @type {'undef' | 'undefProps' | null} */
            let messageId = null

            const referencePathName = pathName
              ? `${pathName}.${refName}`
              : refName

            const prop = propData.get(refName)
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
                    references.getNest(refName),
                    referencePathName
                  )
                }
                continue
              }
            } else {
              messageId = 'undef'
            }
            that.report(nodes[0], referencePathName, messageId)
          }
        }
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
    }

    /** @type {Map<ASTNode, VueComponentContext>} */
    const vueComponentContextMap = new Map()

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
     * @returns {VueComponentContext|void}
     */
    function getVueComponentContextForTemplate() {
      const keys = [...vueComponentContextMap.keys()]
      const exported =
        keys.find(isScriptSetupProgram) || keys.find(isExportObject)
      return exported && vueComponentContextMap.get(exported)

      /**
       * @param {ASTNode} node
       */
      function isScriptSetupProgram(node) {
        return node === programNode
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
      {
        /** @param {Program} node */
        Program() {
          if (!utils.isScriptSetup(context)) {
            return
          }

          const ctx = getVueComponentContext(programNode)
          const globalScope = context.getSourceCode().scopeManager.globalScope
          if (globalScope) {
            for (const variable of globalScope.variables) {
              ctx.properties.set(variable.name, {
                hasNestProperty: false,
                get: () => null
              })
            }
            const moduleScope = globalScope.childScopes.find(
              (scope) => scope.type === 'module'
            )
            for (const variable of (moduleScope && moduleScope.variables) ||
              []) {
              ctx.properties.set(variable.name, {
                hasNestProperty: false,
                get: () => null
              })
            }
          }
        }
      },
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          const ctx = getVueComponentContext(programNode)

          for (const prop of props) {
            if (!prop.propName) {
              continue
            }
            ctx.properties.set(prop.propName, {
              hasNestProperty: false,
              isProps: true,
              get: () => null
            })
          }
          let target = node
          if (
            target.parent &&
            target.parent.type === 'CallExpression' &&
            target.parent.arguments[0] === target &&
            target.parent.callee.type === 'Identifier' &&
            target.parent.callee.name === 'withDefaults'
          ) {
            target = target.parent
          }

          if (
            !target.parent ||
            target.parent.type !== 'VariableDeclarator' ||
            target.parent.init !== target
          ) {
            return
          }

          const pattern = target.parent.id
          const propertyReferences =
            propertyReferenceExtractor.extractFromPattern(pattern)
          ctx.verifyReferences(propertyReferences)
        }
      }),
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          const ctx = getVueComponentContext(node)

          for (const prop of utils.iterateProperties(
            node,
            new Set([
              GROUP_PROPERTY,
              GROUP_DATA,
              GROUP_COMPUTED_PROPERTY,
              GROUP_SETUP,
              GROUP_METHODS,
              GROUP_INJECT
            ])
          )) {
            const propertyMap =
              prop.groupName === GROUP_DATA &&
              prop.type === 'object' &&
              prop.property.value.type === 'ObjectExpression'
                ? getObjectPropertyMap(prop.property.value)
                : null
            ctx.properties.set(prop.name, {
              hasNestProperty: Boolean(propertyMap),
              isProps: prop.groupName === GROUP_PROPERTY,
              get(name) {
                if (!propertyMap) {
                  return null
                }
                return getPropertyDataFromObjectProperty(propertyMap.get(name))
              }
            })
          }

          for (const watcherOrExpose of utils.iterateProperties(
            node,
            new Set([GROUP_WATCHER, GROUP_EXPOSE])
          )) {
            if (watcherOrExpose.groupName === GROUP_WATCHER) {
              const watcher = watcherOrExpose
              // Process `watch: { foo /* <- this */ () {} }`
              ctx.verifyReferences(
                propertyReferenceExtractor.extractFromPath(
                  watcher.name,
                  watcher.node
                )
              )
              // Process `watch: { x: 'foo' /* <- this */  }`
              if (watcher.type === 'object') {
                const property = watcher.property
                if (property.kind === 'init') {
                  for (const handlerValueNode of utils.iterateWatchHandlerValues(
                    property
                  )) {
                    ctx.verifyReferences(
                      propertyReferenceExtractor.extractFromNameLiteral(
                        handlerValueNode
                      )
                    )
                  }
                }
              }
            } else if (watcherOrExpose.groupName === GROUP_EXPOSE) {
              const expose = watcherOrExpose
              ctx.verifyReferences(
                propertyReferenceExtractor.extractFromName(
                  expose.name,
                  expose.node
                )
              )
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

          const propertyReferences =
            propertyReferenceExtractor.extractFromFunctionParam(node, 0)
          const ctx = getVueComponentContext(vueData.node)
          ctx.verifyReferences(propertyReferences, { props })
        },
        onSetupFunctionEnter(node, vueData) {
          const propertyReferences =
            propertyReferenceExtractor.extractFromFunctionParam(node, 0)
          const ctx = getVueComponentContext(vueData.node)
          ctx.verifyReferences(propertyReferences, {
            props: true
          })
        },
        onRenderFunctionEnter(node, vueData) {
          const ctx = getVueComponentContext(vueData.node)

          // Check for Vue 3.x render
          const propertyReferences =
            propertyReferenceExtractor.extractFromFunctionParam(node, 0)
          ctx.verifyReferences(propertyReferences)

          if (vueData.functional) {
            // Check for Vue 2.x render & functional
            const propertyReferencesForV2 =
              propertyReferenceExtractor.extractFromFunctionParam(node, 1)

            ctx.verifyReferences(propertyReferencesForV2.getNest('props'), {
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
          const propertyReferences =
            propertyReferenceExtractor.extractFromExpression(node, false)
          ctx.verifyReferences(propertyReferences)
        }
      }),
      {
        'Program:exit'() {
          const ctx = getVueComponentContextForTemplate()
          if (!ctx) {
            return
          }
          const styleVars = getStyleVariablesContext(context)
          if (styleVars) {
            ctx.verifyReferences(
              propertyReferenceExtractor.extractFromStyleVariablesContext(
                styleVars
              )
            )
          }
        }
      }
    )

    const templateVisitor = {
      /**
       * @param {VExpressionContainer} node
       */
      VExpressionContainer(node) {
        const ctx = getVueComponentContextForTemplate()
        if (!ctx) {
          return
        }
        ctx.verifyReferences(
          propertyReferenceExtractor.extractFromVExpressionContainer(node, {
            ignoreGlobals: true
          })
        )
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      templateVisitor,
      scriptVisitor
    )
  }
}
