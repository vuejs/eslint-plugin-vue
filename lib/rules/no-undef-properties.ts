/**
 * @fileoverview Disallow undefined properties.
 * @author Yosuke Ota
 */
import type { IPropertyReferences } from '../utils/property-references.ts'
import utils from '../utils/index.js'
import reserved from '../utils/vue-reserved.json' with { type: 'json' }
import regexp from '../utils/regexp.js'
import { getStyleVariablesContext } from '../utils/style-variables/index.ts'
import { definePropertyReferenceExtractor } from '../utils/property-references.ts'

interface PropertyData {
  hasNestProperty?: boolean
  get?: (name: string) => PropertyData | null
  isProps?: boolean
}

const GROUP_PROPERTY = 'props'
const GROUP_ASYNC_DATA = 'asyncData' // Nuxt.js
const GROUP_DATA = 'data'
const GROUP_COMPUTED_PROPERTY = 'computed'
const GROUP_METHODS = 'methods'
const GROUP_SETUP = 'setup'
const GROUP_WATCHER = 'watch'
const GROUP_EXPOSE = 'expose'
const GROUP_INJECT = 'inject'

function getObjectPropertyMap(
  object: ObjectExpression
): Map<string, Property> | null {
  const props = new Map<string, Property>()
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

function getPropertyDataFromObjectProperty(
  property: Property | undefined
): PropertyData | null {
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

export default {
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
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const { ignores = [String.raw`/^\$/`] } = options
    const isIgnored = regexp.toRegExpGroupMatcher(ignores)
    const propertyReferenceExtractor = definePropertyReferenceExtractor(context)
    const programNode = context.sourceCode.ast
    /**
     * Property names identified as defined via a Vuex or Pinia helpers
     */
    const propertiesDefinedByStoreHelpers = new Set<string>()

    function isScriptSetupProgram(node: ASTNode) {
      return node === programNode
    }

    /** Vue component context */
    class VueComponentContext {
      defineProperties = new Map<string, PropertyData>()
      reported = new Set<string | ASTNode>()
      hasUnknownProperty = false

      /**
       * Report
       */
      verifyReferences(
        references: IPropertyReferences,
        options?: { props?: boolean }
      ) {
        if (this.hasUnknownProperty) return
        const report = this.report.bind(this)
        verifyUndefProperties(this.defineProperties, references, null)

        function verifyUndefProperties(
          defineProperties: {
            get?: (name: string) => PropertyData | null | undefined
          },
          references: IPropertyReferences | null,
          pathName: string | null
        ) {
          if (!references) {
            return
          }
          for (const [refName, { nodes }] of references.allProperties()) {
            const referencePathName = pathName
              ? `${pathName}.${refName}`
              : refName

            const prop = defineProperties.get && defineProperties.get(refName)
            if (prop) {
              if (options && options.props && !prop.isProps) {
                report(nodes[0], referencePathName, 'undefProps')
                continue
              }
            } else {
              report(nodes[0], referencePathName, 'undef')
              continue
            }

            if (prop.hasNestProperty) {
              verifyUndefProperties(
                prop,
                references.getNest(refName),
                referencePathName
              )
            }
          }
        }
      }
      /**
       * Report
       */
      report(
        node: ASTNode,
        name: string,
        messageId: 'undef' | 'undefProps' = 'undef'
      ) {
        if (
          reserved.includes(name) ||
          isIgnored(name) ||
          propertiesDefinedByStoreHelpers.has(name)
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

      markAsHasUnknownProperty() {
        this.hasUnknownProperty = true
      }
    }

    const vueComponentContextMap = new Map<ASTNode, VueComponentContext>()

    function getVueComponentContext(node: ASTNode): VueComponentContext {
      let ctx = vueComponentContextMap.get(node)
      if (!ctx) {
        ctx = new VueComponentContext()
        vueComponentContextMap.set(node, ctx)
      }
      return ctx
    }
    function getVueComponentContextForTemplate():
      | VueComponentContext
      | undefined {
      const keys = [...vueComponentContextMap.keys()]
      const exported =
        keys.find(isScriptSetupProgram) || keys.find(utils.isInExportDefault)
      return exported && vueComponentContextMap.get(exported)
    }

    function getParentProperty(node: Expression): Property | null {
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
        Program() {
          if (!utils.isScriptSetup(context)) {
            return
          }

          const ctx = getVueComponentContext(programNode)
          const globalScope = context.sourceCode.scopeManager.globalScope
          if (globalScope) {
            for (const variable of globalScope.variables) {
              ctx.defineProperties.set(variable.name, {})
            }
            const moduleScope = globalScope.childScopes.find(
              (scope) => scope.type === 'module'
            )
            for (const variable of (moduleScope && moduleScope.variables) ||
              []) {
              ctx.defineProperties.set(variable.name, {})
            }
          }
        }
      },
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          const ctx = getVueComponentContext(programNode)

          for (const prop of props) {
            if (prop.type === 'unknown') {
              ctx.markAsHasUnknownProperty()
              return
            }
            if (!prop.propName) {
              continue
            }
            ctx.defineProperties.set(prop.propName, {
              isProps: true
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
        },
        onDefineModelEnter(_node, model) {
          const ctx = getVueComponentContext(programNode)

          ctx.defineProperties.set(model.name.modelName, {
            isProps: true
          })
        }
      }),
      utils.defineVueVisitor(context, {
        CallExpression(node) {
          if (node.callee.type !== 'Identifier') return
          let groupName: 'methods' | 'computed' | null = null
          if (/^mapMutations|mapActions$/u.test(node.callee.name)) {
            groupName = GROUP_METHODS
          } else if (
            /^mapState|mapGetters|mapWritableState$/u.test(node.callee.name)
          ) {
            groupName = GROUP_COMPUTED_PROPERTY
          }

          if (!groupName || node.arguments.length === 0) return
          // On Pinia the store is always the first argument
          const arg =
            node.arguments.length === 2 ? node.arguments[1] : node.arguments[0]
          if (arg.type === 'ObjectExpression') {
            // e.g.
            // `mapMutations({ add: 'increment' })`
            // `mapState({ count: state => state.todosCount })`
            for (const prop of arg.properties) {
              const name =
                prop.type === 'SpreadElement'
                  ? null
                  : utils.getStaticPropertyName(prop)
              if (name) {
                propertiesDefinedByStoreHelpers.add(name)
              }
            }
          } else if (arg.type === 'ArrayExpression') {
            // e.g. `mapMutations(['add'])`
            for (const element of arg.elements) {
              if (!element || !utils.isStringLiteral(element)) {
                continue
              }
              const name = utils.getStringLiteralValue(element)
              if (name) {
                propertiesDefinedByStoreHelpers.add(name)
              }
            }
          }
        },
        onVueObjectEnter(node) {
          const ctx = getVueComponentContext(node)

          for (const prop of utils.iterateProperties(
            node,
            new Set([
              GROUP_PROPERTY,
              GROUP_ASYNC_DATA,
              GROUP_DATA,
              GROUP_COMPUTED_PROPERTY,
              GROUP_SETUP,
              GROUP_METHODS,
              GROUP_INJECT
            ])
          )) {
            const propertyMap =
              (prop.groupName === GROUP_DATA ||
                prop.groupName === GROUP_ASYNC_DATA) &&
              prop.type === 'object' &&
              prop.property.value.type === 'ObjectExpression'
                ? getObjectPropertyMap(prop.property.value)
                : null
            ctx.defineProperties.set(prop.name, {
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
        'ObjectExpression > Property > :function[params.length>0]'(
          node: (FunctionExpression | ArrowFunctionExpression) & {
            parent: Property
          },
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
        'ThisExpression, Identifier'(
          node: ThisExpression | Identifier,
          vueData
        ) {
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
      VExpressionContainer(node: VExpressionContainer) {
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
