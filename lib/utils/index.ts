/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import type { Rule, Scope } from 'eslint'
import { Linter } from 'eslint'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import nodeModule from 'node:module'
import path from 'node:path'
import vueEslintParser from 'vue-eslint-parser'
import { findVariable, ReferenceTracker } from '@eslint-community/eslint-utils'
import type { TYPES } from '@eslint-community/eslint-utils'
import type {
  ComponentArrayProp,
  ComponentObjectProp,
  ComponentUnknownProp,
  ComponentProp,
  ComponentArrayEmit,
  ComponentObjectEmit,
  ComponentUnknownEmit,
  ComponentEmit,
  NameWithLoc,
  ComponentSlot,
  ComponentModelName,
  ComponentModel,
  VueObjectType,
  VueObjectData,
  VueVisitor,
  ScriptSetupVisitor
} from '../../typings/eslint-plugin-vue/util-types/utils.ts'
import scopeUtils from './scope.js'
import tsUtils from './ts-utils/index.js'
import htmlElements from './html-elements.json' with { type: 'json' }
import svgElements from './svg-elements.json' with { type: 'json' }
import mathElements from './math-elements.json' with { type: 'json' }
import voidElements from './void-elements.json' with { type: 'json' }
import vue2BuiltinComponents from './vue2-builtin-components.js'
import vue3BuiltinComponents from './vue3-builtin-components.js'
import vueBuiltinElements from './vue-builtin-elements.js'

export type {
  ComponentArrayProp,
  ComponentObjectProp,
  ComponentTypeProp,
  ComponentInferTypeProp,
  ComponentUnknownProp,
  ComponentProp,
  ComponentArrayEmit,
  ComponentObjectEmit,
  ComponentTypeEmit,
  ComponentInferTypeEmit,
  ComponentUnknownEmit,
  ComponentEmit,
  NameWithLoc,
  ComponentTypeSlot,
  ComponentInferTypeSlot,
  ComponentUnknownSlot,
  ComponentSlot,
  ComponentModelName,
  ComponentModel,
  VueObjectType,
  VueObjectData,
  VueVisitor,
  ScriptSetupVisitor
} from '../../typings/eslint-plugin-vue/util-types/utils.ts'

export interface ComponentComputedProperty {
  key: string | null
  value: BlockStatement | null
}

export type GroupName =
  | 'props'
  | 'asyncData'
  | 'data'
  | 'computed'
  | 'setup'
  | 'watch'
  | 'methods'
  | 'provide'
  | 'inject'
  | 'expose'

export interface ComponentArrayPropertyData {
  type: 'array'
  name: string
  groupName: GroupName
  node: Literal | TemplateLiteral
}

export interface ComponentObjectPropertyData {
  type: 'object'
  name: string
  groupName: GroupName
  node: Identifier | Literal | TemplateLiteral
  property: Property
}

export type ComponentPropertyData =
  ComponentArrayPropertyData | ComponentObjectPropertyData

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const HTML_ELEMENT_NAMES = new Set(htmlElements)
const SVG_ELEMENT_NAMES = new Set(svgElements)
const MATH_ELEMENT_NAMES = new Set(mathElements)
const VOID_ELEMENT_NAMES = new Set(voidElements)
const VUE2_BUILTIN_COMPONENT_NAMES = new Set(vue2BuiltinComponents)
const VUE3_BUILTIN_COMPONENT_NAMES = new Set(vue3BuiltinComponents)
const VUE_BUILTIN_ELEMENT_NAMES = new Set(vueBuiltinElements)
const BUILTIN_DIRECTIVE_NAMES = new Set([
  'bind',
  'on',
  'text',
  'html',
  'show',
  'if',
  'else',
  'else-if',
  'for',
  'model',
  'slot',
  'pre',
  'cloak',
  'once',
  'memo',
  'is'
])
const { traverseNodes, getFallbackKeys, NS } = vueEslintParser.AST
const {
  getComponentPropsFromTypeDefine,
  getComponentEmitsFromTypeDefine,
  getComponentSlotsFromTypeDefine,
  isExhaustiveSwitch,
  isTypeNode
} = tsUtils
const { getScope } = scopeUtils

/**
 * @type { WeakMap<RuleContext, Token[]> }
 */
const componentComments: WeakMap<RuleContext, Token[]> = new WeakMap()

/** @type { Map<string, RuleModule> | null } */
let coreRuleMap: Map<string, RuleModule> | null = null
/** @type { Map<string, RuleModule> } */
const stylisticRuleMap: Map<string, RuleModule> = new Map()
/**
 * Get the core rule implementation from the rule name
 * @param {string} name
 * @returns {RuleModule | null}
 */
export function getCoreRule(name: string): RuleModule | null {
  try {
    // eslint-disable-next-line unicorn/no-top-level-assignment-in-function -- lazily cache the core rule map
    coreRuleMap ||= new Linter().getRules()
    return coreRuleMap.get(name) || null
  } catch {
    // getRules() is no longer available in flat config.
  }

  return (builtinRules.get(name) || null) as any
}
/**
 * Get ESLint Stylistic rule implementation from the rule name
 * @param {string} name
 * @param {'@stylistic/eslint-plugin' | '@stylistic/eslint-plugin-ts' | '@stylistic/eslint-plugin-js'} [preferModule]
 * @returns {RuleModule | null}
 */
function getStylisticRule(
  name: string,
  preferModule?:
    | '@stylistic/eslint-plugin'
    | '@stylistic/eslint-plugin-ts'
    | '@stylistic/eslint-plugin-js'
): RuleModule | null {
  if (!preferModule) {
    const cached = stylisticRuleMap.get(name)
    if (cached) {
      return cached
    }
  }
  const stylisticPluginNames = [
    '@stylistic/eslint-plugin',
    '@stylistic/eslint-plugin-ts',
    '@stylistic/eslint-plugin-js'
  ]
  if (preferModule) {
    stylisticPluginNames.unshift(preferModule)
  }
  for (const stylisticPluginName of stylisticPluginNames) {
    try {
      const plugin = nodeModule.createRequire(
        `${process.cwd()}/__placeholder__.js`
      )(stylisticPluginName)
      const rule = plugin?.rules?.[name]
      if (!preferModule) stylisticRuleMap.set(name, rule)
      return rule
    } catch {
      // ignore
    }
  }
  return null
}

/**
 * @template {object} T
 * @param {T} target
 * @param {Partial<T>[]} propsArray
 * @returns {T}
 */
function newProxy<T extends object>(target: T, ...propsArray: Partial<T>[]): T {
  const result = new Proxy(
    {},
    {
      get(_object, key) {
        for (const props of propsArray) {
          if (key in props) {
            // @ts-expect-error -- `key` is not known to be a key of `props`
            return props[key]
          }
        }
        // @ts-expect-error -- `key` is not known to be a key of `target`
        return target[key]
      },

      has(_object, key) {
        return key in target
      },
      ownKeys(_object) {
        return Reflect.ownKeys(target)
      },
      getPrototypeOf(_object) {
        return Reflect.getPrototypeOf(target)
      }
    }
  )
  return result as T
}

/**
 * Wrap the rule context object to override methods which access to tokens (such as getTokenAfter).
 * @param {RuleContext} context The rule context object.
 * @param {ParserServices.TokenStore} tokenStore The token store object for template.
 * @param {Object} options The option of this rule.
 * @param {boolean} [options.applyDocument] If `true`, apply check to document fragment.
 * @returns {RuleContext}
 */
function wrapContextToOverrideTokenMethods(
  context: RuleContext,
  tokenStore: ParserServices.TokenStore,
  options: { applyDocument?: boolean }
): RuleContext {
  const eslintSourceCode = context.sourceCode
  const rootNode = options.applyDocument
    ? eslintSourceCode.parserServices.getDocumentFragment &&
      eslintSourceCode.parserServices.getDocumentFragment()
    : eslintSourceCode.ast.templateBody
  /** @type {Token[] | null} */
  let tokensAndComments: Token[] | null = null
  function getTokensAndComments() {
    if (tokensAndComments) {
      return tokensAndComments
    }
    tokensAndComments = rootNode
      ? tokenStore.getTokens(rootNode, {
          includeComments: true
        })
      : []
    return tokensAndComments
  }

  /** @param {number} index */
  function getNodeByRangeIndex(index: number) {
    if (!rootNode) {
      return eslintSourceCode.ast
    }

    /** @type {ASTNode} */
    let result: ASTNode = eslintSourceCode.ast
    /** @type {ASTNode[]} */
    const skipNodes: ASTNode[] = []
    let shouldBreak = false

    traverseNodes(rootNode, {
      enterNode(node, parent) {
        if (shouldBreak) {
          return
        }
        if (skipNodes[0] === parent) {
          skipNodes.unshift(node)
          return
        }
        if (node.range[0] <= index && index < node.range[1]) {
          result = node
        } else {
          skipNodes.unshift(node)
        }
      },
      leaveNode(node) {
        if (shouldBreak) {
          return
        }
        if (result === node) {
          shouldBreak = true
        } else if (skipNodes[0] === node) {
          skipNodes.shift()
        }
      }
    })
    return result
  }
  const sourceCode = newProxy(
    eslintSourceCode,
    {
      get tokensAndComments() {
        return getTokensAndComments()
      },
      getNodeByRangeIndex,
      // @ts-expect-error -- Added in ESLint v8.38.0
      getDeclaredVariables
    },
    tokenStore
  )

  /** @type {WeakMap<ASTNode, import('eslint').Scope.ScopeManager>} */
  const containerScopes: WeakMap<ASTNode, Scope.ScopeManager> = new WeakMap()

  /**
   * @param {ASTNode} node
   * @returns {import('eslint').Scope.ScopeManager|null}
   */
  function getContainerScope(node: ASTNode): Scope.ScopeManager | null {
    const exprContainer = getVExpressionContainer(node)
    if (!exprContainer) {
      return null
    }
    const cache = containerScopes.get(exprContainer)
    if (cache) {
      return cache
    }
    const programNode = eslintSourceCode.ast
    const parserOptions =
      context.languageOptions?.parserOptions ?? context.parserOptions ?? {}
    const ecmaFeatures = parserOptions.ecmaFeatures || {}
    const ecmaVersion =
      context.languageOptions?.ecmaVersion ?? parserOptions.ecmaVersion ?? 2020
    const sourceType = programNode.sourceType
    try {
      const eslintScope = nodeModule.createRequire(require.resolve('eslint'))(
        'eslint-scope'
      )
      const expStmt = newProxy(exprContainer, {
        // @ts-expect-error -- the proxy turns the expression container into a statement
        type: 'ExpressionStatement'
      })
      const scopeProgram = newProxy(programNode, {
        // @ts-expect-error -- the proxy replaces the body of the program
        body: [expStmt]
      })
      const scope = eslintScope.analyze(scopeProgram, {
        ignoreEval: true,
        nodejsScope: false,
        impliedStrict: ecmaFeatures.impliedStrict,
        ecmaVersion,
        sourceType,
        fallback: getFallbackKeys
      })
      containerScopes.set(exprContainer, scope)
      return scope
    } catch {
      // ignore
      // console.log(error)
    }

    return null
  }
  return newProxy(context, {
    getSourceCode() {
      return sourceCode
    },
    get sourceCode() {
      return sourceCode
    },
    getDeclaredVariables
  })

  /**
   * @param {ESNode} node
   * @returns {Variable[]}
   */
  function getDeclaredVariables(node: ESNode): Variable[] {
    const scope = getContainerScope(node)
    return scope?.getDeclaredVariables(node) ?? []
  }
}

/**
 * Wrap the rule context object to override report method to skip the dynamic argument.
 * @param {RuleContext} context The rule context object.
 * @returns {RuleContext}
 */
function wrapContextToOverrideReportMethodToSkipDynamicArgument(
  context: RuleContext
): RuleContext {
  const sourceCode = context.sourceCode
  const templateBody = sourceCode.ast.templateBody
  if (!templateBody) {
    return context
  }
  /** @type {Range[]} */
  const directiveKeyRanges: Range[] = []
  traverseNodes(templateBody, {
    enterNode(node, parent) {
      if (
        parent &&
        parent.type === 'VDirectiveKey' &&
        node.type === 'VExpressionContainer'
      ) {
        directiveKeyRanges.push(node.range)
      }
    },
    leaveNode() {}
  })

  return newProxy(context, {
    report(descriptor, ...args) {
      let range = null
      if (descriptor.loc) {
        const startLoc = descriptor.loc.start || descriptor.loc
        const endLoc = descriptor.loc.end || startLoc
        range = [
          sourceCode.getIndexFromLoc(startLoc),
          sourceCode.getIndexFromLoc(endLoc)
        ]
      } else if (descriptor.node) {
        range = descriptor.node.range
      }
      if (range) {
        for (const directiveKeyRange of directiveKeyRanges) {
          if (
            range[0] < directiveKeyRange[1] &&
            directiveKeyRange[0] < range[1]
          ) {
            return
          }
        }
      }
      context.report(descriptor, ...args)
    }
  })
}

type WrapRuleCreate = (
  ruleContext: RuleContext,
  wrapContext: WrapRuleCreateContext
) => TemplateListener

interface WrapRuleCreateContext {
  baseHandlers: RuleListener
}

type WrapRulePreprocess = (
  ruleContext: RuleContext,
  wrapContext: WrapRulePreprocessContext
) => void

interface WrapRulePreprocessContext {
  /** Wrap the rule context object to override */
  wrapContextToOverrideProperties: (
    override: Partial<RuleContext>
  ) => RuleContext
  /** Define template body visitor */
  defineVisitor: (visitor: TemplateListener) => void
}

interface WrapRuleOptions {
  /** The categories of this rule. */
  categories?: string[]
  /** If `true`, skip validation within dynamic arguments. */
  skipDynamicArguments?: boolean
  /** If `true`, skip report within dynamic arguments. */
  skipDynamicArgumentsReport?: boolean
  /** If `true`, apply check to document fragment. */
  applyDocument?: boolean
  /** If `true`, skip base rule handlers. */
  skipBaseHandlers?: boolean
  /** Preprocess to calling create of base rule. */
  preprocess?: WrapRulePreprocess
  /** If define, extend base rule. */
  create?: WrapRuleCreate
}
/**
 * Wrap a given core rule to apply it to Vue.js template.
 * @param {string} coreRuleName The name of the core rule implementation to wrap.
 * @param {WrapRuleOptions} [options] The option of this rule.
 * @returns {RuleModule} The wrapped rule implementation.
 */
export function wrapCoreRule(
  coreRuleName: string,
  options?: WrapRuleOptions
): RuleModule {
  const coreRule = getCoreRule(coreRuleName)
  if (!coreRule) {
    return {
      meta: {
        type: 'problem',
        docs: {
          url: `https://eslint.vuejs.org/rules/${coreRuleName}.html`
        }
      },
      create(context) {
        return defineTemplateBodyVisitor(context, {
          "VElement[name='template'][parent.type='VDocumentFragment']"(node) {
            context.report({
              node,
              message: `Failed to extend ESLint core rule "${coreRuleName}". You may be able to use this rule by upgrading the version of ESLint. If you cannot upgrade it, turn off this rule.`
            })
          }
        })
      }
    }
  }
  const rule = wrapRuleModule(coreRule, coreRuleName, options)
  const meta = {
    ...rule.meta,
    docs: {
      ...rule.meta.docs,
      extensionSource: {
        url: coreRule.meta.docs.url,
        name: 'ESLint core'
      }
    }
  }
  return {
    ...rule,
    meta
  }
}
interface RuleNames {
  /** The name of the core rule implementation to wrap. */
  core: string
  /** The name of ESLint Stylistic rule implementation to wrap. */
  stylistic: string
  /** The name of the wrapped rule */
  vue: string
}
/**
 * Wrap a core rule or ESLint Stylistic rule to apply it to Vue.js template.
 * @param {RuleNames|string} ruleNames The names of the rule implementation to wrap.
 * @param {WrapRuleOptions} [options] The option of this rule.
 * @returns {RuleModule} The wrapped rule implementation.
 */
function wrapStylisticOrCoreRule(
  ruleNames: RuleNames | string,
  options?: WrapRuleOptions
): RuleModule {
  const stylisticRuleName =
    typeof ruleNames === 'string' ? ruleNames : ruleNames.stylistic
  const coreRuleName =
    typeof ruleNames === 'string' ? ruleNames : ruleNames.core
  const vueRuleName = typeof ruleNames === 'string' ? ruleNames : ruleNames.vue
  const stylisticRule = getStylisticRule(stylisticRuleName)
  const baseRule = stylisticRule || getCoreRule(coreRuleName)
  if (!baseRule) {
    return {
      meta: {
        type: 'problem',
        docs: {
          url: `https://eslint.vuejs.org/rules/${vueRuleName}.html`
        }
      },
      create(context) {
        return defineTemplateBodyVisitor(context, {
          "VElement[name='template'][parent.type='VDocumentFragment']"(node) {
            context.report({
              node,
              message: `Failed to extend ESLint Stylistic rule "${stylisticRule}". You may be able to use this rule by installing ESLint Stylistic plugin (https://eslint.style/). If you cannot install it, turn off this rule.`
            })
          }
        })
      }
    }
  }
  const rule = wrapRuleModule(baseRule, vueRuleName, options)
  const jsRule = getStylisticRule(
    stylisticRuleName,
    '@stylistic/eslint-plugin-js'
  )
  const description = stylisticRule
    ? `${jsRule?.meta.docs.description} in \`<template>\``
    : rule.meta.docs.description
  const meta = {
    ...rule.meta,
    docs: {
      ...rule.meta.docs,
      description,
      extensionSource: {
        url: baseRule.meta.docs.url,
        name: stylisticRule ? 'ESLint Stylistic' : 'ESLint core'
      }
    },
    deprecated: undefined,
    replacedBy: undefined
  }
  return {
    ...rule,
    meta
  }
}
/**
 * Wrap a given rule to apply it to Vue.js template.
 * @param {RuleModule} baseRule The rule implementation to wrap.
 * @param {string} ruleName The name of the wrapped rule.
 * @param {WrapRuleOptions} [options] The option of this rule.
 * @returns {RuleModule} The wrapped rule implementation.
 */
function wrapRuleModule(
  baseRule: RuleModule,
  ruleName: string,
  options?: WrapRuleOptions
): RuleModule {
  let description = baseRule.meta.docs.description
  if (description) {
    description += ' in `<template>`'
  }

  const {
    categories,
    skipDynamicArguments,
    skipDynamicArgumentsReport,
    skipBaseHandlers,
    applyDocument,
    preprocess,
    create
  } = options || {}
  return {
    create(context) {
      const sourceCode = context.sourceCode
      const tokenStore =
        sourceCode.parserServices.getTemplateBodyTokenStore &&
        sourceCode.parserServices.getTemplateBodyTokenStore()

      // The `context.sourceCode` cannot access the tokens of templates.
      // So override the methods which access to tokens by the `tokenStore`.
      if (tokenStore) {
        context = wrapContextToOverrideTokenMethods(context, tokenStore, {
          applyDocument
        })
      }

      if (skipDynamicArgumentsReport) {
        context =
          wrapContextToOverrideReportMethodToSkipDynamicArgument(context)
      }

      /** @type {TemplateListener} */
      const handlers: TemplateListener = {}

      if (preprocess) {
        preprocess(context, {
          wrapContextToOverrideProperties(override) {
            context = newProxy(context, override)
            return context
          },
          defineVisitor(visitor) {
            compositingVisitors(handlers, visitor)
          }
        })
      }

      const baseHandlers = baseRule.create(context)
      if (!skipBaseHandlers) {
        compositingVisitors(handlers, baseHandlers)
      }

      // Move `Program` handlers to `VElement[parent.type!='VElement']`
      if (handlers.Program) {
        handlers[
          applyDocument
            ? 'VDocumentFragment'
            : "VElement[parent.type!='VElement']"
        ] = handlers.Program as any
        delete handlers.Program
      }
      if (handlers['Program:exit']) {
        handlers[
          applyDocument
            ? 'VDocumentFragment:exit'
            : "VElement[parent.type!='VElement']:exit"
        ] = handlers['Program:exit'] as any
        delete handlers['Program:exit']
      }

      if (skipDynamicArguments) {
        let isWithinDynamicArguments = false
        for (const name of Object.keys(handlers)) {
          const original = handlers[name]
          /** @param {any[]} args */
          handlers[name] = (...args: any[]) => {
            if (isWithinDynamicArguments) return
            // @ts-expect-error -- the handlers have different signatures
            original(...args)
          }
        }
        handlers['VDirectiveKey > VExpressionContainer'] = () => {
          isWithinDynamicArguments = true
        }
        handlers['VDirectiveKey > VExpressionContainer:exit'] = () => {
          isWithinDynamicArguments = false
        }
      }

      if (create) {
        compositingVisitors(handlers, create(context, { baseHandlers }))
      }

      return applyDocument
        ? defineDocumentVisitor(context, handlers)
        : defineTemplateBodyVisitor(context, handlers)
    },

    meta: Object.assign({}, baseRule.meta, {
      docs: Object.assign({}, baseRule.meta.docs, {
        description,
        category: null,
        categories,
        url: `https://eslint.vuejs.org/rules/${ruleName}.html`
      })
    })
  }
}

// ------------------------------------------------------------------------------
// Exports
// ------------------------------------------------------------------------------

const utils = {
  /**
   * Register the given visitor to parser services.
   * If the parser service of `vue-eslint-parser` was not found,
   * this generates a warning.
   *
   * @param {RuleContext} context The rule context to use parser services.
   * @param {TemplateListener} templateBodyVisitor The visitor to traverse the template body.
   * @param {RuleListener} [scriptVisitor] The visitor to traverse the script.
   * @param { { templateBodyTriggerSelector: "Program" | "Program:exit" } } [options] The options.
   * @returns {RuleListener} The merged visitor.
   */
  defineTemplateBodyVisitor,

  /**
   * Register the given visitor to parser services.
   * If the parser service of `vue-eslint-parser` was not found,
   * this generates a warning.
   *
   * @param {RuleContext} context The rule context to use parser services.
   * @param {TemplateListener} documentVisitor The visitor to traverse the document.
   * @param { { triggerSelector: "Program" | "Program:exit" } } [options] The options.
   * @returns {RuleListener} The merged visitor.
   */
  defineDocumentVisitor,
  /**
   * Wrap a given core rule to apply it to Vue.js template.
   * @type {typeof wrapCoreRule}
   */
  wrapCoreRule,
  wrapStylisticOrCoreRule,
  getCoreRule,
  /**
   * Checks whether the given value is defined.
   * @template T
   * @param {T | null | undefined} v
   * @returns {v is T}
   */
  isDef,
  /**
   * Flattens arrays, objects and iterable objects.
   * @template T
   * @param {T | Iterable<T> | null | undefined} v
   * @returns {T[]}
   */
  flatten,
  /**
   * Get the previous sibling element of the given element.
   * @param {VElement} node The element node to get the previous sibling element.
   * @returns {VElement|null} The previous sibling element.
   */
  prevSibling(node: VElement): VElement | null {
    let prevElement = null

    const siblings = (node.parent && node.parent.children) || []
    for (const siblingNode of siblings) {
      if (siblingNode === node) {
        return prevElement
      }
      if (siblingNode.type === 'VElement') {
        prevElement = siblingNode
      }
    }

    return null
  },

  /**
   * Check whether the given directive attribute has their empty value (`=""`).
   * @param {VDirective} node The directive attribute node to check.
   * @param {RuleContext} context The rule context to use parser services.
   * @returns {boolean} `true` if the directive attribute has their empty value (`=""`).
   */
  isEmptyValueDirective(node: VDirective, context: RuleContext): boolean {
    if (node.value == null || node.value.expression != null) {
      return false
    }

    let valueText = context.sourceCode.getText(node.value)
    if (
      (valueText[0] === '"' || valueText[0] === "'") &&
      valueText[0] === valueText.at(-1)
    ) {
      // quoted
      valueText = valueText.slice(1, -1)
    }
    // empty
    return !valueText
  },

  /**
   * Check whether the given directive attribute has their empty expression value (e.g. `=" "`, `="/* &ast;/"`).
   * @param {VDirective} node The directive attribute node to check.
   * @param {RuleContext} context The rule context to use parser services.
   * @returns {boolean} `true` if the directive attribute has their empty expression value.
   */
  isEmptyExpressionValueDirective(
    node: VDirective,
    context: RuleContext
  ): boolean {
    if (node.value == null || node.value.expression != null) {
      return false
    }
    const sourceCode = context.sourceCode
    const valueNode = node.value
    const tokenStore = sourceCode.parserServices.getTemplateBodyTokenStore()
    let quote1 = null
    let quote2 = null
    // `node.value` may be only comments, so cannot get the correct tokens with `tokenStore.getTokens(node.value)`.
    for (const token of tokenStore.getTokens(node)) {
      if (token.range[1] <= valueNode.range[0]) {
        continue
      }
      if (valueNode.range[1] <= token.range[0]) {
        // empty
        return true
      }
      if (
        !quote1 &&
        token.type === 'Punctuator' &&
        (token.value === '"' || token.value === "'")
      ) {
        quote1 = token
        continue
      }
      if (
        !quote2 &&
        quote1 &&
        token.type === 'Punctuator' &&
        token.value === quote1.value
      ) {
        quote2 = token
        continue
      }
      // not empty
      return false
    }
    // empty
    return true
  },

  /**
   * Get the attribute which has the given name.
   * @param {VElement} node The start tag node to check.
   * @param {string} name The attribute name to check.
   * @param {string} [value] The attribute value to check.
   * @returns {VAttribute | null} The found attribute.
   */
  getAttribute,

  /**
   * Check whether the given start tag has specific directive.
   * @param {VElement} node The start tag node to check.
   * @param {string} name The attribute name to check.
   * @param {string} [value] The attribute value to check.
   * @returns {boolean} `true` if the start tag has the attribute.
   */
  hasAttribute,

  /**
   * Get the directive list which has the given name.
   * @param {VElement | VStartTag} node The start tag node to check.
   * @param {string} name The directive name to check.
   * @returns {VDirective[]} The array of `v-slot` directives.
   */
  getDirectives,
  /**
   * Get the directive which has the given name.
   * @param {VElement} node The start tag node to check.
   * @param {string} name The directive name to check.
   * @param {string} [argument] The directive argument to check.
   * @returns {VDirective | null} The found directive.
   */
  getDirective,

  /**
   * Check whether the given start tag has specific directive.
   * @param {VElement} node The start tag node to check.
   * @param {string} name The directive name to check.
   * @param {string} [argument] The directive argument to check.
   * @returns {boolean} `true` if the start tag has the directive.
   */
  hasDirective,

  isVBindSameNameShorthand,

  /**
   * Returns the list of all registered components
   * @param {ObjectExpression} componentObject
   * @returns { { node: Property, name: string }[] } Array of ASTNodes
   */
  getRegisteredComponents(
    componentObject: ObjectExpression
  ): { node: Property; name: string }[] {
    const componentsNode = findProperty(
      componentObject,
      'components',
      (p) => p.value.type === 'ObjectExpression'
    )

    if (!componentsNode || componentsNode.value.type !== 'ObjectExpression') {
      return []
    }

    return componentsNode.value.properties
      .filter(isProperty)
      .map((node) => {
        const name = getStaticPropertyName(node)
        return name ? { node, name } : null
      })
      .filter(isDef)
  },

  /**
   * Check whether the previous sibling element has `if` or `else-if` directive.
   * @param {VElement} node The element node to check.
   * @returns {boolean} `true` if the previous sibling element has `if` or `else-if` directive.
   */
  prevElementHasIf(node: VElement): boolean {
    const prev = this.prevSibling(node)
    return (
      prev != null &&
      prev.startTag.attributes.some(
        (a) =>
          a.directive &&
          (a.key.name.name === 'if' || a.key.name.name === 'else-if')
      )
    )
  },

  /**
   * Returns a generator with all child element v-if chains of the given element.
   * @param {VElement} node The element node to check.
   * @returns {IterableIterator<VElement[]>}
   */
  *iterateChildElementsChains(node: VElement): IterableIterator<VElement[]> {
    let isVIf = false
    /** @type {VElement[]} */
    let elementChain: VElement[] = []
    for (const childNode of node.children) {
      if (childNode.type === 'VElement') {
        let connected
        if (hasDirective(childNode, 'if')) {
          connected = false
          isVIf = true
        } else if (hasDirective(childNode, 'else-if')) {
          connected = isVIf
          isVIf = true
        } else if (hasDirective(childNode, 'else')) {
          connected = isVIf
          isVIf = false
        } else {
          connected = false
          isVIf = false
        }

        if (connected) {
          elementChain.push(childNode)
        } else {
          if (elementChain.length > 0) {
            yield elementChain
          }
          elementChain = [childNode]
        }
      } else if (childNode.type !== 'VText' || childNode.value.trim() !== '') {
        isVIf = false
      }
    }
    if (elementChain.length > 0) {
      yield elementChain
    }
  },

  isStringLiteral,

  /**
   * Check whether the given node is a custom component or not.
   * @param {VElement} node The start tag node to check.
   * @param {boolean} [shouldIgnoreElementNamespaces=false] If `true`, ignore element namespaces.
   * @returns {boolean} `true` if the node is a custom component.
   */
  isCustomComponent(
    node: VElement,
    shouldIgnoreElementNamespaces: boolean = false
  ): boolean {
    if (
      hasAttribute(node, 'is') ||
      hasDirective(node, 'bind', 'is') ||
      hasDirective(node, 'is')
    ) {
      return true
    }

    const isHtmlName = this.isHtmlWellKnownElementName(node.rawName)
    const isSvgName = this.isSvgWellKnownElementName(node.rawName)
    const isMathName = this.isMathWellKnownElementName(node.rawName)

    return shouldIgnoreElementNamespaces
      ? !isHtmlName && !isSvgName && !isMathName
      : (this.isHtmlElementNode(node) && !isHtmlName) ||
          (this.isSvgElementNode(node) && !isSvgName) ||
          (this.isMathElementNode(node) && !isMathName)
  },

  /**
   * Check whether the given node is a HTML element or not.
   * @param {VElement} node The node to check.
   * @returns {boolean} `true` if the node is a HTML element.
   */
  isHtmlElementNode(node: VElement): boolean {
    return node.namespace === NS.HTML
  },

  /**
   * Check whether the given node is a SVG element or not.
   * @param {VElement} node The node to check.
   * @returns {boolean} `true` if the name is a SVG element.
   */
  isSvgElementNode(node: VElement): boolean {
    return node.namespace === NS.SVG
  },

  /**
   * Check whether the given name is a MathML element or not.
   * @param {VElement} node The node to check.
   * @returns {boolean} `true` if the node is a MathML element.
   */
  isMathElementNode(node: VElement): boolean {
    return node.namespace === NS.MathML
  },

  VUE2_BUILTIN_COMPONENT_NAMES,
  VUE3_BUILTIN_COMPONENT_NAMES,

  /**
   * Check whether the given name is an well-known element or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is an well-known element name.
   */
  isHtmlWellKnownElementName(name: string): boolean {
    return HTML_ELEMENT_NAMES.has(name)
  },

  /**
   * Check whether the given name is an well-known SVG element or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is an well-known SVG element name.
   */
  isSvgWellKnownElementName(name: string): boolean {
    return SVG_ELEMENT_NAMES.has(name)
  },

  /**
   * Check whether the given name is a well-known MathML element or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is a well-known MathML element name.
   */
  isMathWellKnownElementName(name: string): boolean {
    return MATH_ELEMENT_NAMES.has(name)
  },

  /**
   * Check whether the given name is a void element name or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is a void element name.
   */
  isHtmlVoidElementName(name: string): boolean {
    return VOID_ELEMENT_NAMES.has(name)
  },

  /**
   * Check whether the given name is Vue builtin component name or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is a builtin component name
   */
  isBuiltInComponentName(name: string): boolean {
    return (
      VUE3_BUILTIN_COMPONENT_NAMES.has(name) ||
      VUE2_BUILTIN_COMPONENT_NAMES.has(name)
    )
  },

  /**
   * Check whether the given name is Vue builtin element name or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is a builtin Vue element name
   */
  isVueBuiltInElementName(name: string): boolean {
    return VUE_BUILTIN_ELEMENT_NAMES.has(name.toLowerCase())
  },

  /**
   * Check whether the given name is Vue builtin directive name or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is a builtin Directive name
   */
  isBuiltInDirectiveName(name: string): boolean {
    return BUILTIN_DIRECTIVE_NAMES.has(name)
  },

  /**
   * Gets the property name of a given node.
   * @param {Property|AssignmentProperty|MethodDefinition|MemberExpression} node - The node to get.
   * @return {string|null} The property name if static. Otherwise, null.
   */
  getStaticPropertyName,
  /**
   * Gets the string of a given node.
   * @param {Literal|TemplateLiteral} node - The node to get.
   * @return {string|null} The string if static. Otherwise, null.
   */
  getStringLiteralValue,
  /**
   * Gets the name parameter from the given call expression.
   * @param {CallExpression} node - The call expression to get.
   * @returns {NameWithLoc|null} The name and location if static.
   */
  getNameParamNode,
  /**
   * Get all props by looking at all component's properties
   * @param {ObjectExpression} componentObject Object with component definition
   * @return {(ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp)[]} Array of component props
   */
  getComponentPropsFromOptions,
  /**
   * Get all emits by looking at all component's properties
   * @param {ObjectExpression} componentObject Object with component definition
   * @return {(ComponentArrayEmit | ComponentObjectEmit | ComponentUnknownEmit)[]} Array of component emits
   */
  getComponentEmitsFromOptions,

  /**
   * Get all computed properties by looking at all component's properties
   * @param {ObjectExpression} componentObject Object with component definition
   * @return {ComponentComputedProperty[]} Array of computed properties in format: [{key: String, value: ASTNode}]
   */
  getComputedProperties(
    componentObject: ObjectExpression
  ): ComponentComputedProperty[] {
    const computedPropertiesNode = findProperty(
      componentObject,
      'computed',
      (p) => p.value.type === 'ObjectExpression'
    )

    if (
      !computedPropertiesNode ||
      computedPropertiesNode.value.type !== 'ObjectExpression'
    ) {
      return []
    }

    return computedPropertiesNode.value.properties
      .filter(isProperty)
      .map((cp) => {
        const key = getStaticPropertyName(cp)
        /** @type {Expression} */
        const propValue: Expression = skipTSAsExpression(cp.value)
        /** @type {BlockStatement | null} */
        let value: BlockStatement | null = null

        if (propValue.type === 'FunctionExpression') {
          value = propValue.body
        } else if (propValue.type === 'ObjectExpression') {
          const get = findProperty(
            propValue,
            'get',
            (p) => p.value.type === 'FunctionExpression'
          ) as (Property & { value: FunctionExpression }) | null
          value = get ? get.value.body : null
        }

        return { key, value }
      })
  },

  /**
   * Get getter body from computed function
   * @param {CallExpression} callExpression call of computed function
   * @return {FunctionExpression | ArrowFunctionExpression | null} getter function
   */
  getGetterBodyFromComputedFunction(
    callExpression: CallExpression
  ): FunctionExpression | ArrowFunctionExpression | null {
    if (callExpression.arguments.length === 0) {
      return null
    }

    const arg = callExpression.arguments[0]

    if (
      arg.type === 'FunctionExpression' ||
      arg.type === 'ArrowFunctionExpression'
    ) {
      return arg
    }

    if (arg.type === 'ObjectExpression') {
      const getProperty = findProperty(
        arg,
        'get',
        (p) =>
          p.value.type === 'FunctionExpression' ||
          p.value.type === 'ArrowFunctionExpression'
      ) as
        | (Property & { value: FunctionExpression | ArrowFunctionExpression })
        | null
      return getProperty ? getProperty.value : null
    }

    return null
  },

  isTypeScriptFile,

  isVueFile,

  /**
   * Checks whether the current file is uses `<script setup>`
   * @param {RuleContext} context The ESLint rule context object.
   */
  isScriptSetup,
  /**
   * Gets the element of `<script setup>`
   * @param {RuleContext} context The ESLint rule context object.
   * @returns {VElement | null} the element of `<script setup>`
   */
  getScriptSetupElement,

  /**
   * Check if current file is a Vue instance or component and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param { (node: ObjectExpression, type: VueObjectType) => void } cb Callback function
   */
  executeOnVue(
    context: RuleContext,
    cb: (node: ObjectExpression, type: VueObjectType) => void
  ) {
    return compositingVisitors(
      this.executeOnVueComponent(context, cb),
      this.executeOnVueInstance(context, cb)
    )
  },

  /**
   * Define handlers to traverse the Vue Objects.
   * Some special events are available to visitor.
   *
   * - `onVueObjectEnter` ... Event when Vue Object is found.
   * - `onVueObjectExit` ... Event when Vue Object visit ends.
   * - `onSetupFunctionEnter` ... Event when setup function found.
   * - `onRenderFunctionEnter` ... Event when render function found.
   *
   * @param {RuleContext} context The ESLint rule context object.
   * @param {VueVisitor} visitor The visitor to traverse the Vue Objects.
   */
  defineVueVisitor(context: RuleContext, visitor: VueVisitor) {
    /** @type {VueObjectData | null} */
    let vueStack: VueObjectData | null = null

    /**
     * @param {string} key
     * @param {ESNode} node
     */
    function callVisitor(key: string, node: ESNode) {
      if (vueStack && visitor[key]) {
        // @ts-expect-error -- the visitor key is not narrowed to a listener
        visitor[key](node, vueStack)
      }
    }

    /** @type {NodeListener} */
    const vueVisitor: NodeListener = {}
    for (const key in visitor) {
      vueVisitor[key] = (node) => callVisitor(key, node)
    }

    /**
     * @param {ObjectExpression} node
     */
    vueVisitor.ObjectExpression = (node: ObjectExpression) => {
      const type = getVueObjectType(context, node)
      if (type) {
        vueStack = {
          node,
          type,
          parent: vueStack,
          get functional() {
            const functional = findProperty(node, 'functional')
            return (
              functional !== null &&
              (functional.value.type !== 'Literal' ||
                functional.value.value !== false)
            )
          }
        }
        callVisitor('onVueObjectEnter', node)
      }
      callVisitor('ObjectExpression', node)
    }
    vueVisitor['ObjectExpression:exit'] = (node) => {
      callVisitor('ObjectExpression:exit', node)
      if (!vueStack || vueStack.node !== node) {
        return
      }
      callVisitor('onVueObjectExit', node)
      vueStack = vueStack.parent
    }
    if (
      visitor.onSetupFunctionEnter ||
      visitor.onSetupFunctionExit ||
      visitor.onRenderFunctionEnter
    ) {
      const setups = new Set()
      /** @param { (FunctionExpression | ArrowFunctionExpression) & { parent: Property } } node */
      vueVisitor[
        'Property[value.type=/^(Arrow)?FunctionExpression$/] > :function'
      ] = (
        node: (FunctionExpression | ArrowFunctionExpression) & {
          parent: Property
        }
      ) => {
        /** @type {Property} */
        const prop: Property = node.parent
        if (vueStack && prop.parent === vueStack.node && prop.value === node) {
          const name = getStaticPropertyName(prop)
          if (name === 'setup') {
            callVisitor('onSetupFunctionEnter', node)
            setups.add(node)
          } else if (name === 'render') {
            callVisitor('onRenderFunctionEnter', node)
          }
        }
        callVisitor(
          'Property[value.type=/^(Arrow)?FunctionExpression$/] > :function',
          node
        )
      }
      if (visitor.onSetupFunctionExit) {
        /** @param { (FunctionExpression | ArrowFunctionExpression) & { parent: Property } } node */
        vueVisitor[
          'Property[value.type=/^(Arrow)?FunctionExpression$/] > :function:exit'
        ] = (
          node: (FunctionExpression | ArrowFunctionExpression) & {
            parent: Property
          }
        ) => {
          if (!setups.has(node)) {
            return
          }

          callVisitor('onSetupFunctionExit', node)
          setups.delete(node)
        }
      }
    }

    return vueVisitor
  },

  /**
   * Define handlers to traverse the AST nodes in `<script setup>`.
   * Some special events are available to visitor.
   *
   * - `onDefinePropsEnter` ... Event when defineProps is found.
   * - `onDefinePropsExit` ... Event when defineProps visit ends.
   * - `onDefineEmitsEnter` ... Event when defineEmits is found.
   * - `onDefineEmitsExit` ... Event when defineEmits visit ends.
   * - `onDefineOptionsEnter` ... Event when defineOptions is found.
   * - `onDefineOptionsExit` ... Event when defineOptions visit ends.
   * - `onDefineSlotsEnter` ... Event when defineSlots is found.
   * - `onDefineSlotsExit` ... Event when defineSlots visit ends.
   * - `onDefineExposeEnter` ... Event when defineExpose is found.
   * - `onDefineExposeExit` ... Event when defineExpose visit ends.
   * - `onDefineModelEnter` ... Event when defineModel is found.
   * - `onDefineModelExit` ... Event when defineModel visit ends.
   *
   * @param {RuleContext} context The ESLint rule context object.
   * @param {ScriptSetupVisitor} visitor The visitor to traverse the AST nodes.
   */
  defineScriptSetupVisitor(context: RuleContext, visitor: ScriptSetupVisitor) {
    const scriptSetup = getScriptSetupElement(context)
    if (scriptSetup == null) {
      return {}
    }
    const scriptSetupRange = scriptSetup.range

    /**
     * @param {ESNode} node
     */
    function isInScriptSetup(node: ESNode) {
      return (
        scriptSetupRange[0] <= node.range[0] &&
        node.range[1] <= scriptSetupRange[1]
      )
    }
    /**
     * @param {string} key
     * @param {ESNode} node
     * @param {any[]} args
     */
    function callVisitor(key: string, node: ESNode, ...args: any[]) {
      if (visitor[key] && (node.type === 'Program' || isInScriptSetup(node))) {
        // @ts-expect-error -- the visitor key is not narrowed to a listener
        visitor[key](node, ...args)
      }
    }

    /** @type {NodeListener} */
    const scriptSetupVisitor: NodeListener = {}
    for (const key in visitor) {
      scriptSetupVisitor[key] = (node) => callVisitor(key, node)
    }

    class MacroListener {
      name: string
      enterName: string
      exitName: string
      isMacroNode: (
        candidateMacro: Expression | null,
        node: CallExpression
      ) => boolean
      buildParam: (context: RuleContext, node: CallExpression) => unknown
      hasListener: boolean
      paramsMap: Map<CallExpression, unknown>

      /**
       * @param {string} name
       * @param {string} enterName
       * @param {string} exitName
       * @param {(candidateMacro: Expression | null, node: CallExpression) => boolean} isMacroNode
       * @param {(context: RuleContext, node: CallExpression) => unknown} buildParam
       */
      constructor(
        name: string,
        enterName: string,
        exitName: string,
        isMacroNode: (
          candidateMacro: Expression | null,
          node: CallExpression
        ) => boolean,
        buildParam: (context: RuleContext, node: CallExpression) => unknown
      ) {
        this.name = name
        this.enterName = enterName
        this.exitName = exitName
        this.isMacroNode = isMacroNode
        this.buildParam = buildParam
        this.hasListener = Boolean(
          visitor[this.enterName] || visitor[this.exitName]
        )
        this.paramsMap = new Map()
      }
    }
    const macroListenerList = [
      new MacroListener(
        'defineProps',
        'onDefinePropsEnter',
        'onDefinePropsExit',
        (candidateMacro, node) =>
          candidateMacro === node || candidateMacro === getWithDefaults(node),
        getComponentPropsFromDefineProps
      ),
      new MacroListener(
        'defineEmits',
        'onDefineEmitsEnter',
        'onDefineEmitsExit',
        (candidateMacro, node) => candidateMacro === node,
        getComponentEmitsFromDefineEmits
      ),
      new MacroListener(
        'defineOptions',
        'onDefineOptionsEnter',
        'onDefineOptionsExit',
        (candidateMacro, node) => candidateMacro === node,
        () => undefined
      ),
      new MacroListener(
        'defineSlots',
        'onDefineSlotsEnter',
        'onDefineSlotsExit',
        (candidateMacro, node) => candidateMacro === node,
        getComponentSlotsFromDefineSlots
      ),
      new MacroListener(
        'defineExpose',
        'onDefineExposeEnter',
        'onDefineExposeExit',
        (candidateMacro, node) => candidateMacro === node,
        () => undefined
      ),
      new MacroListener(
        'defineModel',
        'onDefineModelEnter',
        'onDefineModelExit',
        (candidateMacro, node) => candidateMacro === node,
        getComponentModelFromDefineModel
      )
    ].filter((m) => m.hasListener)
    if (macroListenerList.length > 0) {
      /** @type {Expression | null} */
      let candidateMacro: Expression | null = null
      /** @param {VariableDeclarator|ExpressionStatement} node */
      scriptSetupVisitor[
        'Program > VariableDeclaration > VariableDeclarator, Program > ExpressionStatement'
      ] = (node: VariableDeclarator | ExpressionStatement) => {
        if (!candidateMacro) {
          candidateMacro =
            node.type === 'VariableDeclarator' ? node.init : node.expression
        }
      }
      /** @param {VariableDeclarator|ExpressionStatement} node */
      scriptSetupVisitor[
        'Program > VariableDeclaration > VariableDeclarator, Program > ExpressionStatement:exit'
      ] = (node: VariableDeclarator | ExpressionStatement) => {
        if (
          candidateMacro ===
          (node.type === 'VariableDeclarator' ? node.init : node.expression)
        ) {
          candidateMacro = null
        }
      }
      /**
       * @param {CallExpression} node
       */
      scriptSetupVisitor.CallExpression = (node: CallExpression) => {
        if (
          candidateMacro &&
          isInScriptSetup(node) &&
          node.callee.type === 'Identifier'
        ) {
          for (const macroListener of macroListenerList) {
            if (
              node.callee.name !== macroListener.name ||
              !macroListener.isMacroNode(candidateMacro, node)
            ) {
              continue
            }
            const param = macroListener.buildParam(context, node)
            callVisitor(macroListener.enterName, node, param)
            macroListener.paramsMap.set(node, param)
            break
          }
        }
        callVisitor('CallExpression', node)
      }
      scriptSetupVisitor['CallExpression:exit'] = (node) => {
        callVisitor('CallExpression:exit', node)
        for (const macroListener of macroListenerList) {
          if (!macroListener.paramsMap.has(node)) {
            continue
          }

          callVisitor(
            macroListener.exitName,
            node,
            macroListener.paramsMap.get(node)
          )
          macroListener.paramsMap.delete(node)
        }
      }
    }

    return scriptSetupVisitor
  },

  /**
   * Checks whether given defineProps call node has withDefaults.
   * @param {CallExpression} node The node of defineProps
   * @returns {node is CallExpression & { parent: CallExpression }}
   */
  hasWithDefaults,

  /**
   * Gets a map of the expressions defined in withDefaults.
   * `withDefaults()` accepts any expression as its defaults argument: the SFC
   * compiler inlines an object literal and falls back to the `mergeDefaults()`
   * runtime helper for everything else. References to a `const` object and
   * spread elements are resolved, but anything that cannot be determined
   * statically sets `hasUnknown`, which means that props missing from `props`
   * may still have a default value.
   * @param {RuleContext} context The rule context object.
   * @param {CallExpression} node The node of defineProps
   * @returns { { props: { [key: string]: Expression | undefined }, hasUnknown: boolean } }
   */
  getWithDefaultsPropExpressions,
  /**
   * Gets a map of the property nodes defined in withDefaults.
   * Only an inline object literal is looked at, because the returned nodes are
   * used as edit targets by fixers.
   * @param {CallExpression} node The node of defineProps
   * @returns { { [key: string]: Property | undefined } }
   */
  getWithDefaultsProps,
  /**
   * Gets the default definition nodes for defineProp
   * using the props destructure with assignment pattern.
   * @param {CallExpression} node The node of defineProps
   * @returns { Record<string, {prop: AssignmentProperty , expression: Expression} | undefined> }
   */
  getDefaultPropExpressionsForPropsDestructure,
  getLeftOfDefineProps,
  /**
   * Checks whether the given defineProps node is using Props Destructure.
   * @param {CallExpression} node The node of defineProps
   * @returns {boolean}
   */
  isUsingPropsDestructure(node: CallExpression): boolean {
    const left = getLeftOfDefineProps(node)
    return left?.type === 'ObjectPattern'
  },
  /**
   * Gets the props destructure property nodes for defineProp.
   * @param {CallExpression} node The node of defineProps
   * @returns { Record<string, AssignmentProperty | undefined> }
   */
  getPropsDestructure,

  getVueObjectType,

  getVueComponentDefinitionType,
  /**
   * Checks whether the given object is an SFC definition.
   * @param {RuleContext} context The ESLint rule context object.
   * @param {ObjectExpression} node Node to check
   * @returns { boolean } `true`, the given object is an SFC definition.
   */
  isSFCObject,
  compositingVisitors,

  /**
   * Check if current file is a Vue instance (new Vue) and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param { (node: ObjectExpression, type: VueObjectType) => void } cb Callback function
   */
  executeOnVueInstance(
    context: RuleContext,
    cb: (node: ObjectExpression, type: VueObjectType) => void
  ) {
    return {
      /** @param {ObjectExpression} node */
      'ObjectExpression:exit'(node: ObjectExpression) {
        const type = getVueObjectType(context, node)
        if (!type || type !== 'instance') return
        cb(node, type)
      }
    }
  },

  /**
   * Check if current file is a Vue component and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param { (node: ObjectExpression, type: VueObjectType) => void } cb Callback function
   */
  executeOnVueComponent(
    context: RuleContext,
    cb: (node: ObjectExpression, type: VueObjectType) => void
  ) {
    const types = new Set(['mark', 'export', 'definition'])
    return {
      /** @param {ObjectExpression} node */
      'ObjectExpression:exit'(node: ObjectExpression) {
        const type = getVueObjectType(context, node)
        if (type && types.has(type)) {
          cb(node, type)
        }
      }
    }
  },

  /**
   * Check call `Vue.component` and call callback.
   * @param {RuleContext} _context The ESLint rule context object.
   * @param { (node: CallExpression) => void } cb Callback function
   */
  executeOnCallVueComponent(
    _context: RuleContext,
    cb: (node: CallExpression) => void
  ) {
    return {
      /** @param {Identifier & { parent: MemberExpression & { parent: CallExpression } } } node */
      "CallExpression > MemberExpression > Identifier[name='component']": (
        node: Identifier & {
          parent: MemberExpression & { parent: CallExpression }
        }
      ) => {
        const callExpr = node.parent.parent
        const callee = callExpr.callee

        if (callee.type !== 'MemberExpression') {
          return
        }

        const calleeObject = skipTSAsExpression(callee.object)

        if (
          calleeObject.type === 'Identifier' &&
          // calleeObject.name === 'Vue' && // Any names can be used in Vue.js 3.x. e.g. app.component()
          callee.property === node &&
          callExpr.arguments.length > 0
        ) {
          cb(callExpr)
        }
      }
    }
  },
  /**
   * Return generator with all properties
   * @param {ObjectExpression} node Node to check
   * @param {Set<GroupName>} groups Name of parent group
   * @returns {IterableIterator<ComponentPropertyData>}
   */
  *iterateProperties(
    node: ObjectExpression,
    groups: Set<GroupName>
  ): IterableIterator<ComponentPropertyData> {
    for (const item of node.properties) {
      if (item.type !== 'Property') {
        continue
      }

      const name = getStaticPropertyName(item) as GroupName | null
      if (!name || !groups.has(name)) continue

      yield* this.iteratePropertyValue(item.value, name)
    }
  },
  /**
   * Return generator with all properties defined by the given property value.
   * @param {Expression} value Property value node to check
   * @param {GroupName} groupName Name of parent group
   * @returns {IterableIterator<ComponentPropertyData>}
   */
  *iteratePropertyValue(
    value: Expression,
    groupName: GroupName
  ): IterableIterator<ComponentPropertyData> {
    switch (value.type) {
      case 'ArrayExpression': {
        yield* this.iterateArrayExpression(value, groupName)
        break
      }
      case 'ObjectExpression': {
        yield* this.iterateObjectExpression(value, groupName)
        break
      }
      case 'FunctionExpression': {
        yield* this.iterateFunctionExpression(value, groupName)
        break
      }
      case 'ArrowFunctionExpression': {
        yield* this.iterateArrowFunctionExpression(value, groupName)
        break
      }
    }
  },

  /**
   * Return generator with all elements inside ArrayExpression
   * @param {ArrayExpression} node Node to check
   * @param {GroupName} groupName Name of parent group
   * @returns {IterableIterator<ComponentArrayPropertyData>}
   */
  *iterateArrayExpression(
    node: ArrayExpression,
    groupName: GroupName
  ): IterableIterator<ComponentArrayPropertyData> {
    for (const item of node.elements) {
      if (
        !item ||
        (item.type !== 'Literal' && item.type !== 'TemplateLiteral')
      ) {
        continue
      }

      const name = getStringLiteralValue(item)
      if (name) {
        yield { type: 'array', name, groupName, node: item }
      }
    }
  },

  /**
   * Return generator with all elements inside ObjectExpression
   * @param {ObjectExpression} node Node to check
   * @param {GroupName} groupName Name of parent group
   * @returns {IterableIterator<ComponentObjectPropertyData>}
   */
  *iterateObjectExpression(
    node: ObjectExpression,
    groupName: GroupName
  ): IterableIterator<ComponentObjectPropertyData> {
    /** @type {Set<Property> | undefined} */
    let usedGetter: Set<Property> | undefined
    for (const item of node.properties) {
      if (item.type !== 'Property') {
        continue
      }

      const key = item.key
      if (
        // eslint-disable-next-line unicorn/prefer-includes-over-repeated-comparisons -- needed for type narrowing
        key.type !== 'Identifier' &&
        key.type !== 'Literal' &&
        key.type !== 'TemplateLiteral'
      ) {
        continue
      }
      const name = getStaticPropertyName(item)
      if (!name) {
        continue
      }

      const hasGetterPair =
        item.kind === 'set' &&
        node.properties.some((item2) => {
          if (item2.type === 'Property' && item2.kind === 'get') {
            if (!usedGetter) {
              usedGetter = new Set()
            }
            if (usedGetter.has(item2)) {
              return false
            }
            const getterName = getStaticPropertyName(item2)
            if (getterName === name) {
              usedGetter.add(item2)
              return true
            }
          }
          return false
        })
      if (hasGetterPair) {
        continue
      }
      yield {
        type: 'object',
        name,
        groupName,
        node: key,
        property: item
      }
    }
  },

  /**
   * Return generator with all elements inside FunctionExpression
   * @param {FunctionExpression} node Node to check
   * @param {GroupName} groupName Name of parent group
   * @returns {IterableIterator<ComponentObjectPropertyData>}
   */
  *iterateFunctionExpression(
    node: FunctionExpression,
    groupName: GroupName
  ): IterableIterator<ComponentObjectPropertyData> {
    if (node.body.type === 'BlockStatement') {
      for (const item of node.body.body) {
        if (
          item.type === 'ReturnStatement' &&
          item.argument &&
          item.argument.type === 'ObjectExpression'
        ) {
          yield* this.iterateObjectExpression(item.argument, groupName)
        }
      }
    }
  },

  /**
   * Return generator with all elements inside ArrowFunctionExpression
   * @param {ArrowFunctionExpression} node Node to check
   * @param {GroupName} groupName Name of parent group
   * @returns {IterableIterator<ComponentObjectPropertyData>}
   */
  *iterateArrowFunctionExpression(
    node: ArrowFunctionExpression,
    groupName: GroupName
  ): IterableIterator<ComponentObjectPropertyData> {
    const body = node.body
    if (body.type === 'BlockStatement') {
      for (const item of body.body) {
        if (
          item.type === 'ReturnStatement' &&
          item.argument &&
          item.argument.type === 'ObjectExpression'
        ) {
          yield* this.iterateObjectExpression(item.argument, groupName)
        }
      }
    } else if (body.type === 'ObjectExpression') {
      yield* this.iterateObjectExpression(body, groupName)
    }
  },

  /**
   * Find all functions which do not always return values
   * @param {RuleContext} context The ESLint rule context object.
   * @param {boolean} shouldTreatUndefinedAsUnspecified
   * @param { (node: ArrowFunctionExpression | FunctionExpression | FunctionDeclaration) => void } cb Callback function
   * @returns {RuleListener}
   */
  executeOnFunctionsWithoutReturn(
    context: RuleContext,
    shouldTreatUndefinedAsUnspecified: boolean,
    cb: (
      node: ArrowFunctionExpression | FunctionExpression | FunctionDeclaration
    ) => void
  ): RuleListener {
    type CodePath = Rule.CodePath
    type CodePathSegment = Rule.CodePathSegment

    interface FuncInfo {
      funcInfo: FuncInfo | null
      codePath: CodePath
      hasReturn: boolean
      hasReturnValue: boolean
      node: ArrowFunctionExpression | FunctionExpression | FunctionDeclaration
      currentSegments: CodePathSegment[]
    }

    /** @type {FuncInfo | null} */
    let funcInfo: FuncInfo | null = null

    // "Spurious" = ESLint sees the segment as reachable, but TypeScript proves
    // it can't actually execute (the phantom no-match edge of a type-exhaustive
    // switch with no default).
    /** @type {WeakSet<CodePathSegment>} */
    const spuriousSegments: WeakSet<CodePathSegment> = new WeakSet()

    // Segments started inside a switch case body. Lets us distinguish post-switch
    // reachability via a real path (break, fall-through) from the phantom no-match
    // path. Depth is a counter to support nested switches.
    /** @type {WeakSet<CodePathSegment>} */
    const caseBodySegments: WeakSet<CodePathSegment> = new WeakSet()
    let caseBodyDepth = 0

    /**
     * Treat spurious segments the same as unreachable.
     * @param {CodePathSegment} segment
     */
    function isEffectivelyUnreachable(segment: CodePathSegment) {
      return !segment.reachable || spuriousSegments.has(segment)
    }

    function isValidReturn() {
      return (
        !funcInfo ||
        (funcInfo.currentSegments.every((segment) =>
          isEffectivelyUnreachable(segment)
        ) &&
          (!shouldTreatUndefinedAsUnspecified || funcInfo.hasReturnValue))
      )
    }

    return {
      /**
       * @param {CodePath} codePath
       * @param {ESNode} node
       */
      onCodePathStart(codePath: CodePath, node: ESNode) {
        if (
          // eslint-disable-next-line unicorn/prefer-includes-over-repeated-comparisons -- narrows `node`'s type for `funcInfo` below
          node.type === 'ArrowFunctionExpression' ||
          node.type === 'FunctionExpression' ||
          node.type === 'FunctionDeclaration'
        ) {
          funcInfo = {
            codePath,
            currentSegments: [],
            funcInfo,
            hasReturn: false,
            hasReturnValue: false,
            node
          }
        }
      },
      /** @param {CodePathSegment} segment */
      onCodePathSegmentStart(segment: CodePathSegment) {
        funcInfo?.currentSegments.push(segment)
        // Spurious propagates: if every reachable predecessor is spurious, so is this segment.
        if (
          segment.prevSegments.length > 0 &&
          segment.prevSegments.every(isEffectivelyUnreachable)
        ) {
          spuriousSegments.add(segment)
        }
        if (caseBodyDepth > 0) {
          caseBodySegments.add(segment)
        }
      },
      onCodePathSegmentEnd() {
        funcInfo?.currentSegments.pop()
      },
      onCodePathEnd() {
        funcInfo &&= funcInfo.funcInfo
      },
      /** @param {ReturnStatement} node */
      ReturnStatement(node: ReturnStatement) {
        if (!funcInfo) {
          return
        }

        funcInfo.hasReturn = true
        funcInfo.hasReturnValue = Boolean(node.argument)
      },
      SwitchCase() {
        caseBodyDepth++
      },
      'SwitchCase:exit'() {
        caseBodyDepth--
      },
      /** @param {SwitchStatement} node */
      'SwitchStatement:exit'(node: SwitchStatement) {
        if (
          !funcInfo ||
          node.cases.some((switchCase) => switchCase.test === null) ||
          !isExhaustiveSwitch(context, node)
        ) {
          // Switches with `default` are handled correctly by ESLint already.
          return
        }

        // If any reachable predecessor came from inside a case body, the switch
        // genuinely falls through (break or fall-through). Otherwise the only
        // incoming edge is the phantom no-match path — safe to mark spurious.
        const fromCaseBody = funcInfo.currentSegments.some((post) =>
          post.prevSegments.some(
            (prev) =>
              !isEffectivelyUnreachable(prev) && caseBodySegments.has(prev)
          )
        )
        if (fromCaseBody) return

        for (const segment of funcInfo.currentSegments) {
          spuriousSegments.add(segment)
        }
      },
      /** @param {ArrowFunctionExpression} node */
      'ArrowFunctionExpression:exit'(node: ArrowFunctionExpression) {
        if (funcInfo && !isValidReturn() && !node.expression) {
          cb(funcInfo.node)
        }
      },
      'FunctionExpression:exit'() {
        if (funcInfo && !isValidReturn()) {
          cb(funcInfo.node)
        }
      }
    }
  },

  /**
   * Check whether the component is declared in a single line or not.
   * @param {ASTNode} node
   * @returns {boolean}
   */
  isSingleLine(node: ASTNode): boolean {
    return node.loc.start.line === node.loc.end.line
  },

  /**
   * Check whether the templateBody of the program has invalid EOF or not.
   * @param {Program} node The program node to check.
   * @returns {boolean} `true` if it has invalid EOF.
   */
  hasInvalidEOF(node: Program): boolean {
    const body = node.templateBody
    return (
      body != null &&
      body.errors != null &&
      body.errors.some(
        (error) =>
          typeof error.code === 'string' && error.code.startsWith('eof-')
      )
    )
  },

  /**
   * Get the chaining nodes of MemberExpression.
   *
   * @param  {ESNode} node The node to parse
   * @return {[ESNode, ...MemberExpression[]]} The chaining nodes
   */
  getMemberChaining(node: ESNode): [ESNode, ...MemberExpression[]] {
    /** @type {MemberExpression[]} */
    const nodes: MemberExpression[] = []
    let n = skipChainExpression(node)

    while (n.type === 'MemberExpression') {
      nodes.push(n)
      n = skipChainExpression(n.object)
    }

    return [n, ...nodes.reverse()]
  },
  /**
   * return two string editdistance
   * @param {string} a string a to compare
   * @param {string} b string b to compare
   * @returns {number}
   */
  editDistance(a: string, b: string): number {
    if (a === b) {
      return 0
    }
    const alen = a.length
    const blen = b.length
    const dp = Array.from({ length: alen + 1 }, () =>
      Array.from({ length: blen + 1 }, () => 0)
    )
    for (let i = 0; i <= alen; i++) {
      dp[i][0] = i
    }
    for (let j = 0; j <= blen; j++) {
      dp[0][j] = j
    }
    for (let i = 1; i <= alen; i++) {
      for (let j = 1; j <= blen; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
      }
    }
    return dp[alen][blen]
  },
  /**
   * Checks whether the target node is within the given range.
   * @param { [number, number] | ASTNode | Token } rangeOrNode
   * @param {ASTNode | Token} target
   */
  isInRange(
    rangeOrNode: [number, number] | ASTNode | Token,
    target: ASTNode | Token
  ) {
    const range = Array.isArray(rangeOrNode) ? rangeOrNode : rangeOrNode.range
    return range[0] <= target.range[0] && target.range[1] <= range[1]
  },
  /**
   * Checks whether the given node is Property.
   */
  isProperty,
  /**
   * Checks whether the given node is AssignmentProperty.
   */
  isAssignmentProperty,
  /**
   * Checks whether the given node is VElement.
   */
  isVElement,
  /**
   * Finds the property with the given name from the given ObjectExpression node.
   */
  findProperty,
  /**
   * Finds the assignment property with the given name from the given ObjectPattern node.
   */
  findAssignmentProperty,
  /**
   * Checks if the given node is a property value.
   * @param {Property} prop
   * @param {Expression} node
   */
  isPropertyChain,
  /**
   * Retrieve `TSAsExpression#expression` value if the given node a `TSAsExpression` node. Otherwise, pass through it.
   */
  skipTSAsExpression,
  /**
   * Retrieve `AssignmentPattern#left` value if the given node a `AssignmentPattern` node. Otherwise, pass through it.
   */
  skipDefaultParamValue,
  /**
   * Retrieve `ChainExpression#expression` value if the given node a `ChainExpression` node. Otherwise, pass through it.
   */
  skipChainExpression,
  /**
   * Checks whether the given node is in a type annotation.
   */
  isWithinTypeNode,
  findVariableByIdentifier,
  getScope,
  /**
   * Checks whether the given node is in export default.
   * @param {ASTNode} node
   * @returns {boolean}
   */
  isInExportDefault,

  /**
   * Check whether the given node is `this` or variable that stores `this`.
   * @param  {ESNode} node The node to check
   * @param {RuleContext} context The rule context to use parser services.
   * @returns {boolean} `true` if the given node is `this`.
   */
  isThis(node: ESNode, context: RuleContext): boolean {
    if (node.type === 'ThisExpression') {
      return true
    }
    if (node.type !== 'Identifier') {
      return false
    }
    const parent = node.parent
    if (
      (parent.type === 'MemberExpression' && parent.property === node) ||
      (parent.type === 'Property' && parent.key === node && !parent.computed)
    ) {
      return false
    }

    const variable = findVariable(getScope(context, node), node)

    if (variable != null && variable.defs.length === 1) {
      const def = variable.defs[0]
      if (
        def.type === 'Variable' &&
        def.parent.kind === 'const' &&
        def.node.id.type === 'Identifier'
      ) {
        return Boolean(
          def.node && def.node.init && def.node.init.type === 'ThisExpression'
        )
      }
    }
    return false
  },

  /**
   * Check if a call expression is Object.assign with the given node as first argument
   * @param {CallExpression} callExpr
   * @param {ASTNode} targetNode
   * @returns {boolean}
   */
  isObjectAssignCall(callExpr: CallExpression, targetNode: ASTNode): boolean {
    const { callee, arguments: args } = callExpr

    return (
      args.length > 0 &&
      args[0] === targetNode &&
      callee?.type === 'MemberExpression' &&
      callee.object?.type === 'Identifier' &&
      callee.object.name === 'Object' &&
      callee.property?.type === 'Identifier' &&
      callee.property.name === 'assign'
    )
  },

  /**
   * @param {MemberExpression|Identifier} props
   * @returns { { kind: 'assignment' | 'update' | 'call' , node: ESNode, pathNodes: MemberExpression[] } | null }
   */
  findMutating(props: MemberExpression | Identifier): {
    kind: 'assignment' | 'update' | 'call'
    node: ESNode
    pathNodes: MemberExpression[]
  } | null {
    /** @type {MemberExpression[]} */
    const pathNodes: MemberExpression[] = []
    /** @type {MemberExpression | Identifier | ChainExpression} */
    let node: MemberExpression | Identifier | ChainExpression = props
    let target = node.parent
    while (true) {
      const step = this.findMutatingStep(node, target, pathNodes)
      if (step.done) {
        return step.result
      }
      node = step.node
      target = step.target
    }
  },

  /**
   * Resolve a single step of the parent chain walk in `findMutating`.
   * @param {MemberExpression | Identifier | ChainExpression} node
   * @param {ASTNode} target
   * @param {MemberExpression[]} pathNodes
   * @returns {{ done: true, result: { kind: 'assignment' | 'update' | 'call', node: ESNode, pathNodes: MemberExpression[] } | null } | { done: false, node: MemberExpression | ChainExpression, target: ASTNode }}
   */
  findMutatingStep(
    node: MemberExpression | Identifier | ChainExpression,
    target: ASTNode,
    pathNodes: MemberExpression[]
  ):
    | {
        done: true
        result: {
          kind: 'assignment' | 'update' | 'call'
          node: ESNode
          pathNodes: MemberExpression[]
        } | null
      }
    | {
        done: false
        node: MemberExpression | ChainExpression
        target: ASTNode
      } {
    switch (target.type) {
      case 'AssignmentExpression': {
        if (target.left === node) {
          // this.xxx <=|+=|-=>
          return {
            done: true,
            result: { kind: 'assignment', node: target, pathNodes }
          }
        }
        return { done: true, result: null }
      }
      case 'UpdateExpression': {
        // this.xxx <++|-->
        return {
          done: true,
          result: { kind: 'update', node: target, pathNodes }
        }
      }
      case 'UnaryExpression': {
        if (target.operator === 'delete') {
          return {
            done: true,
            result: { kind: 'update', node: target, pathNodes }
          }
        }
        return { done: true, result: null }
      }
      case 'CallExpression': {
        const mem = pathNodes.at(-1)
        if (mem && target.callee === node) {
          const callName = getStaticPropertyName(mem)
          if (
            callName &&
            /^(?:push|pop|shift|unshift|reverse|splice|sort|copyWithin|fill)$/u.test(
              callName
            )
          ) {
            // this.xxx.push()
            pathNodes.pop()
            return {
              done: true,
              result: { kind: 'call', node: target, pathNodes }
            }
          }
        }
        if (this.isObjectAssignCall(target, node)) {
          // Object.assign(xxx, {})
          return {
            done: true,
            result: { kind: 'call', node: target, pathNodes }
          }
        }
        return { done: true, result: null }
      }
      case 'MemberExpression': {
        if (target.object === node) {
          pathNodes.push(target)
          return { done: false, node: target, target: target.parent }
        }
        return { done: true, result: null }
      }
      case 'ChainExpression': {
        return { done: false, node: target, target: target.parent }
      }
      default: {
        return { done: true, result: null }
      }
    }
  },

  /**
   * Return generator with the all handler nodes defined in the given watcher property.
   * @param {Property|Expression} property
   * @returns {IterableIterator<Expression>}
   */
  iterateWatchHandlerValues,

  /**
   * Wraps composition API trace map in 'vue', '@vue/composition-api' and '@nuxtjs/composition-api' imports, or '#imports' from unimport
   * @param {import('@eslint-community/eslint-utils').TYPES.TraceMap} map
   */
  createCompositionApiTraceMap,

  /**
   * Iterates all references in the given trace map.
   * Take the third argument option to detect auto-imported references.
   *
   * @param {import('@eslint-community/eslint-utils').ReferenceTracker} tracker
   * @param {import('@eslint-community/eslint-utils').TYPES.TraceMap} map
   * @returns {ReturnType<import('@eslint-community/eslint-utils').ReferenceTracker['iterateEsmReferences']>}
   */
  *iterateReferencesTraceMap(
    tracker: ReferenceTracker,
    map: TYPES.TraceMap
  ): ReturnType<ReferenceTracker['iterateEsmReferences']> {
    const esmTraceMap = this.createCompositionApiTraceMap({
      ...map,
      [ReferenceTracker.ESM]: true
    })

    for (const ref of tracker.iterateEsmReferences(esmTraceMap)) {
      yield ref
    }

    for (const ref of tracker.iterateGlobalReferences(map)) {
      yield ref
    }
  },

  /**
   * Checks whether or not the tokens of two given nodes are same.
   * @param {ASTNode} left A node 1 to compare.
   * @param {ASTNode} right A node 2 to compare.
   * @param {ParserServices.TokenStore | SourceCode} sourceCode The ESLint source code object.
   * @returns {boolean} the source code for the given node.
   */
  equalTokens(
    left: ASTNode,
    right: ASTNode,
    sourceCode: ParserServices.TokenStore | SourceCode
  ): boolean {
    const tokensL = sourceCode.getTokens(left)
    const tokensR = sourceCode.getTokens(right)

    return (
      tokensL.length === tokensR.length &&
      tokensL.every(
        (token, i) =>
          token.type === tokensR[i].type && token.value === tokensR[i].value
      )
    )
  }
}

export default utils

export const {
  defineScriptSetupVisitor,
  editDistance,
  executeOnVueComponent,
  getComputedProperties,
  getMemberChaining,
  getRegisteredComponents
} = utils

// ------------------------------------------------------------------------------
// Standard Helpers
// ------------------------------------------------------------------------------

/**
 * Checks whether the given value is defined.
 * @template T
 * @param {T | null | undefined} v
 * @returns {v is T}
 */
function isDef<T>(v: T | null | undefined): v is T {
  return v != null
}

/**
 * Flattens arrays, objects and iterable objects.
 * @template T
 * @param {T | Iterable<T> | null | undefined} v
 * @returns {T[]}
 */
function flatten<T>(v: T | Iterable<T> | null | undefined): T[] {
  /** @type {T[]} */
  const result: T[] = []
  if (v) {
    if (isIterable(v)) {
      result.push(...v)
    } else {
      result.push(v)
    }
  }
  return result
}

/**
 * @param {*} v
 * @returns {v is Iterable<any>}
 */
function isIterable(v: any): v is Iterable<any> {
  return v && Symbol.iterator in v
}

// ------------------------------------------------------------------------------
// Rule Helpers
// ------------------------------------------------------------------------------

/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param {RuleContext} context The rule context to use parser services.
 * @param {TemplateListener} templateBodyVisitor The visitor to traverse the template body.
 * @param {RuleListener} [scriptVisitor] The visitor to traverse the script.
 * @param { { templateBodyTriggerSelector: "Program" | "Program:exit" } } [options] The options.
 * @returns {RuleListener} The merged visitor.
 */
function defineTemplateBodyVisitor(
  context: RuleContext,
  templateBodyVisitor: TemplateListener,
  scriptVisitor?: RuleListener,
  options?: { templateBodyTriggerSelector: 'Program' | 'Program:exit' }
): RuleListener {
  const sourceCode = context.sourceCode
  if (sourceCode.parserServices.defineTemplateBodyVisitor == null) {
    const filename = context.filename
    if (path.extname(filename) === '.vue') {
      context.report({
        loc: { line: 1, column: 0 },
        message:
          'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
      })
    }
    return {}
  }
  return sourceCode.parserServices.defineTemplateBodyVisitor(
    templateBodyVisitor,
    scriptVisitor,
    options
  )
}
/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param {RuleContext} context The rule context to use parser services.
 * @param {TemplateListener} documentVisitor The visitor to traverse the document.
 * @param { { triggerSelector: "Program" | "Program:exit" } } [options] The options.
 * @returns {RuleListener} The merged visitor.
 */
export function defineDocumentVisitor(
  context: RuleContext,
  documentVisitor: TemplateListener,
  options?: { triggerSelector: 'Program' | 'Program:exit' }
): RuleListener {
  const sourceCode = context.sourceCode
  if (sourceCode.parserServices.defineDocumentVisitor == null) {
    const filename = context.filename
    if (path.extname(filename) === '.vue') {
      context.report({
        loc: { line: 1, column: 0 },
        message:
          'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
      })
    }
    return {}
  }
  return sourceCode.parserServices.defineDocumentVisitor(
    documentVisitor,
    options
  )
}

/**
 * @template T
 * @param {T} visitor
 * @param {...(TemplateListener | RuleListener | NodeListener)} visitors
 * @returns {T}
 */
function compositingVisitors<T>(
  visitor: T,
  ...visitors: (TemplateListener | RuleListener | NodeListener)[]
): T {
  for (const v of visitors) {
    for (const key in v) {
      // @ts-expect-error -- the visitors are indexed by arbitrary keys
      if (visitor[key]) {
        // @ts-expect-error -- the visitors are indexed by arbitrary keys
        const o = visitor[key]
        // @ts-expect-error -- the visitors are indexed by arbitrary keys
        visitor[key] = (...args) => {
          o(...args)
          // @ts-expect-error -- the visitors are indexed by arbitrary keys
          v[key](...args)
        }
      } else {
        // @ts-expect-error -- the visitors are indexed by arbitrary keys
        visitor[key] = v[key]
      }
    }
  }
  return visitor
}

// ------------------------------------------------------------------------------
// AST Helpers
// ------------------------------------------------------------------------------

/**
 * Find the variable of a given identifier.
 * @param {RuleContext} context The rule context
 * @param {Identifier} node The variable name to find.
 * @returns {Variable|null} The found variable or null.
 */
function findVariableByIdentifier(
  context: RuleContext,
  node: Identifier
): Variable | null {
  return findVariable(getScope(context, node), node)
}

/**
 * Finds the property with the given name from the given ObjectExpression node.
 * @param {ObjectExpression} node
 * @param {string} name
 * @param { (p: Property) => boolean } [isMatching]
 * @returns { (Property) | null}
 */
function findProperty(
  node: ObjectExpression,
  name: string,
  isMatching?: (p: Property) => boolean
): Property | null {
  return (
    node.properties.find(
      /**
       * @param {Property | SpreadElement} prop
       * @returns {prop is Property}
       */
      (prop: Property | SpreadElement): prop is Property =>
        isProperty(prop) &&
        getStaticPropertyName(prop) === name &&
        (isMatching?.(prop) ?? true)
    ) ?? null
  )
}

/**
 * Finds the assignment property with the given name from the given ObjectPattern node.
 * @param {ObjectPattern} node
 * @param {string} name
 * @param { (p: AssignmentProperty) => boolean } [isMatching]
 * @returns { (AssignmentProperty) | null}
 */
function findAssignmentProperty(
  node: ObjectPattern,
  name: string,
  isMatching?: (p: AssignmentProperty) => boolean
): AssignmentProperty | null {
  return (
    node.properties.find(
      /**
       * @param {AssignmentProperty | RestElement} prop
       * @returns {prop is AssignmentProperty}
       */
      (prop: AssignmentProperty | RestElement): prop is AssignmentProperty =>
        isAssignmentProperty(prop) &&
        getStaticPropertyName(prop) === name &&
        (isMatching?.(prop) ?? true)
    ) ?? null
  )
}

/**
 * Checks whether the given node is Property.
 * @param {Property | SpreadElement | AssignmentProperty} node
 * @returns {node is Property}
 */
function isProperty(
  node: Property | SpreadElement | AssignmentProperty
): node is Property {
  return (
    node.type === 'Property' &&
    (!node.parent || node.parent.type === 'ObjectExpression')
  )
}
/**
 * Checks whether the given node is AssignmentProperty.
 * @param {AssignmentProperty | RestElement} node
 * @returns {node is AssignmentProperty}
 */
function isAssignmentProperty(
  node: AssignmentProperty | RestElement
): node is AssignmentProperty {
  return node.type === 'Property'
}
/**
 * Checks whether the given node is VElement.
 * @param {VElement | VExpressionContainer | VText | VDocumentFragment} node
 * @returns {node is VElement}
 */
function isVElement(
  node: VElement | VExpressionContainer | VText | VDocumentFragment
): node is VElement {
  return node.type === 'VElement'
}

/**
 * Checks whether the given node is in export default.
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isInExportDefault(node: ASTNode): boolean {
  /** @type {ASTNode | null} */
  let parent: ASTNode | null = node.parent
  while (parent) {
    if (parent.type === 'ExportDefaultDeclaration') {
      return true
    }
    parent = parent.parent
  }
  return false
}

/**
 * Retrieve `TSAsExpression#expression` value if the given node a `TSAsExpression` node. Otherwise, pass through it.
 * @template T Node type
 * @param {T | TSAsExpression} node The node to address.
 * @returns {T} The `TSAsExpression#expression` value if the node is a `TSAsExpression` node. Otherwise, the node.
 */
function skipTSAsExpression<T>(node: T | TSAsExpression): T {
  if (!node) {
    return node
  }
  // @ts-expect-error -- `node` is not narrowed to `T`
  return node.type === 'TSAsExpression'
    ? // @ts-expect-error -- `node` is not narrowed to `T`
      skipTSAsExpression(node.expression)
    : // @ts-expect-error -- `node` is not narrowed to `T`
      node
}

/**
 * Gets the parent node of the given node. This method returns a value ignoring `X as F`.
 * @param {Expression} node
 * @returns {ASTNode}
 */
function getParent(node: Expression): ASTNode {
  let parent = node.parent
  while (parent.type === 'TSAsExpression') {
    parent = parent.parent
  }
  return parent
}

/**
 * Checks if the given node is a property value.
 * @param {Property} prop
 * @param {Expression} node
 */
function isPropertyChain(prop: Property, node: Expression) {
  let value = node
  while (value.parent.type === 'TSAsExpression') {
    value = value.parent
  }
  return prop === value.parent && prop.value === value
}

/**
 * Retrieve `AssignmentPattern#left` value if the given node a `AssignmentPattern` node. Otherwise, pass through it.
 * @template T Node type
 * @param {T | AssignmentPattern} node The node to address.
 * @return {T} The `AssignmentPattern#left` value if the node is a `AssignmentPattern` node. Otherwise, the node.
 */
function skipDefaultParamValue<T>(node: T | AssignmentPattern): T {
  if (!node) {
    return node
  }
  // @ts-expect-error -- `node` is not narrowed to `T`
  return node.type === 'AssignmentPattern'
    ? // @ts-expect-error -- `node` is not narrowed to `T`
      skipDefaultParamValue(node.left)
    : // @ts-expect-error -- `node` is not narrowed to `T`
      node
}

/**
 * Retrieve `ChainExpression#expression` value if the given node a `ChainExpression` node. Otherwise, pass through it.
 * @template T Node type
 * @param {T | ChainExpression} node The node to address.
 * @returns {T} The `ChainExpression#expression` value if the node is a `ChainExpression` node. Otherwise, the node.
 */
function skipChainExpression<T>(node: T | ChainExpression): T {
  if (!node) {
    return node
  }
  // @ts-expect-error -- `node` is not narrowed to `T`
  return node.type === 'ChainExpression'
    ? // @ts-expect-error -- `node` is not narrowed to `T`
      skipChainExpression(node.expression)
    : // @ts-expect-error -- `node` is not narrowed to `T`
      node
}

/**
 * Checks whether the given node is in a type annotation.
 * @param {ESNode} node
 * @returns {boolean}
 */
function isWithinTypeNode(node: ESNode): boolean {
  /** @type {ASTNode | null} */
  let target: ASTNode | null = node
  while (target) {
    if (isTypeNode(target)) {
      return true
    }
    target = target.parent
  }
  return false
}

/**
 * Gets the property name of a given node.
 * @param {Property|AssignmentProperty|MethodDefinition|MemberExpression} node - The node to get.
 * @return {string|null} The property name if static. Otherwise, null.
 */
export function getStaticPropertyName(
  node: Property | AssignmentProperty | MethodDefinition | MemberExpression
): string | null {
  if (node.type === 'Property' || node.type === 'MethodDefinition') {
    if (!node.computed) {
      const key = node.key
      if (key.type === 'Identifier') {
        return key.name
      }
    }
    const key = node.key
    // @ts-expect-error -- other key nodes make `getStringLiteralValue` return `null`
    return getStringLiteralValue(key)
  }
  if (node.type === 'MemberExpression') {
    if (!node.computed) {
      const property = node.property
      return property.type === 'Identifier' ? property.name : null
    }
    const property = node.property
    // @ts-expect-error -- other property nodes make `getStringLiteralValue` return `null`
    return getStringLiteralValue(property)
  }
  return null
}

/**
 * Gets the string of a given node.
 * @param {Literal|TemplateLiteral} node - The node to get.
 * @param {boolean} [isStringOnly]
 * @return {string|null} The string if static. Otherwise, null.
 */
export function getStringLiteralValue(
  node: Literal | TemplateLiteral,
  shouldOnlyAcceptStrings = false
): string | null {
  if (node.type === 'Literal') {
    if (node.value == null) {
      return shouldOnlyAcceptStrings || node.bigint == null ? null : node.bigint
    }
    if (typeof node.value === 'string') {
      return node.value
    }
    return shouldOnlyAcceptStrings ? null : String(node.value)
  }
  return node.type === 'TemplateLiteral' &&
    node.expressions.length === 0 &&
    node.quasis.length === 1
    ? node.quasis[0].value.cooked
    : null
}

/**
 * Gets the name parameter from the given call expression.
 * @param {CallExpression} node - The call expression to get.
 * @returns {NameWithLoc|null} The name and location if static.
 */
function getNameParamNode(node: CallExpression): NameWithLoc | null {
  const nameLiteralNode = node.arguments[0]
  if (nameLiteralNode && isStringLiteral(nameLiteralNode)) {
    const name = getStringLiteralValue(nameLiteralNode)
    if (name != null) {
      return { name, loc: nameLiteralNode.loc, range: nameLiteralNode.range }
    }
  }
  return null
}
/**
 * Gets the VExpressionContainer of a given node.
 * @param {ASTNode} node - The node to get.
 * @return {VExpressionContainer|null}
 */
function getVExpressionContainer(node: ASTNode): VExpressionContainer | null {
  /** @type {ASTNode | null} */
  let n: ASTNode | null = node
  while (n && n.type !== 'VExpressionContainer') {
    n = n.parent
  }
  return n
}

/**
 * @param {string} path
 */
function isTypeScriptFile(path: string) {
  return path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.mts')
}

// ------------------------------------------------------------------------------
// Vue Helpers
// ------------------------------------------------------------------------------

/**
 * @param {string} path
 */
function isVueFile(path: string) {
  return path.endsWith('.vue') || path.endsWith('.jsx') || path.endsWith('.tsx')
}

/**
 * Checks whether the current file is uses `<script setup>`
 * @param {RuleContext} context The ESLint rule context object.
 */
function isScriptSetup(context: RuleContext) {
  return Boolean(getScriptSetupElement(context))
}
/**
 * Gets the element of `<script setup>`
 * @param {RuleContext} context The ESLint rule context object.
 * @returns {VElement | null} the element of `<script setup>`
 */
function getScriptSetupElement(context: RuleContext): VElement | null {
  const sourceCode = context.sourceCode
  const df =
    sourceCode.parserServices.getDocumentFragment &&
    sourceCode.parserServices.getDocumentFragment()
  if (!df) {
    return null
  }
  const scripts = df.children.filter(
    /** @returns {e is VElement} */
    (e): e is VElement => isVElement(e) && e.name === 'script'
  )
  if (scripts.length === 2) {
    return scripts.find((e) => hasAttribute(e, 'setup')) || null
  }
  const script = scripts[0]
  return script && hasAttribute(script, 'setup') ? script : null
}

/**
 * Check whether the given node is a Vue component based
 * on the filename and default export type
 * export default {} in .vue || .jsx
 * @param {ESNode} node Node to check
 * @param {string} path File name with extension
 * @returns {boolean}
 */
function isVueComponentFile(node: ESNode, path: string): boolean {
  return (
    isVueFile(path) &&
    node.type === 'ExportDefaultDeclaration' &&
    node.declaration.type === 'ObjectExpression'
  )
}

/**
 * Whether the given callee refers to a symbol exported by Vue.
 * @param {Identifier} callee Node to check.
 * @param {RuleContext} context The rule context to use parser services.
 * @returns {boolean}
 */
function isGlobalOrImportedFromVue(
  callee: Identifier,
  context: RuleContext
): boolean {
  const globalScope = context.sourceCode.scopeManager.globalScope

  if (globalScope === null) {
    return true
  }

  const tracker = new ReferenceTracker(globalScope)

  const globalTraceMap = {
    [callee.name]: {
      [ReferenceTracker.CALL]: true
    }
  }
  const cjsTraceMap = createCompositionApiTraceMap(globalTraceMap)
  const esmTraceMap = createCompositionApiTraceMap({
    [ReferenceTracker.ESM]: true,
    [callee.name]: {
      [ReferenceTracker.CALL]: true
    }
  })

  function* allReferences() {
    yield* tracker.iterateGlobalReferences(globalTraceMap)
    yield* tracker.iterateEsmReferences(esmTraceMap)
    yield* tracker.iterateCjsReferences(cjsTraceMap)
  }

  for (const { node } of allReferences()) {
    if (node === callee.parent) {
      return true
    }
  }

  // No references found
  // The callee is either from a different source, or it is injected
  // (e.g., <script>defineComponent({})</script>).

  const variable = findVariable(getScope(context, callee), callee)

  if (variable !== null && variable.defs.length === 1) {
    const def = variable.defs[0]
    /** @type {Set<string | null>} */
    const vueLikePackageNames: Set<string | null> = new Set([
      'vue',
      '@vue/composition-api',
      '@nuxtjs/composition-api'
    ])

    // import { name } from 'not-vue'
    if (
      def.type === 'ImportBinding' &&
      def.node.type === 'ImportSpecifier' &&
      def.node.imported.type === 'Identifier' &&
      def.node.parent.type === 'ImportDeclaration'
    ) {
      return vueLikePackageNames.has(def.node.parent.source.value)
    }

    // const { name } = ...
    if (
      def.type === 'Variable' &&
      def.node.id.type === 'ObjectPattern' &&
      def.node.init !== null
    ) {
      const init = def.node.init

      // const { name } = require('something')
      if (init.type === 'CallExpression') {
        const firstArg = init.arguments[0]

        if (
          init.callee.type === 'Identifier' &&
          init.callee.name === 'require'
        ) {
          const source = isStringLiteral(firstArg)
            ? getStringLiteralValue(firstArg)
            : null

          return vueLikePackageNames.has(source)
        }
      }
    }

    // try {} catch (name) {}
    // class name {}
    // function name() {}
    // name(); let name = ...
    if (
      ['CatchClause', 'ClassName', 'FunctionName', 'TDZ'].includes(def.type)
    ) {
      return false
    }
  }

  // Can't determine the source, default to true.
  return true
}

/**
 * Get the Vue component definition type from given node
 * Vue.component('xxx', {}) || component('xxx', {})
 * @param {RuleContext} context The rule context to use parser services.
 * @param {ObjectExpression} node Node to check
 * @returns {'component' | 'mixin' | 'extend' | 'createApp' | 'defineComponent' | 'defineNuxtComponent' | null}
 */
function getVueComponentDefinitionType(
  context: RuleContext,
  node: ObjectExpression
):
  | 'component'
  | 'mixin'
  | 'extend'
  | 'createApp'
  | 'defineComponent'
  | 'defineNuxtComponent'
  | null {
  const parent = getParent(node)
  if (parent.type === 'CallExpression') {
    const callee = parent.callee

    if (callee.type === 'MemberExpression') {
      const calleeObject = skipTSAsExpression(callee.object)

      if (calleeObject.type === 'Identifier') {
        const propName = getStaticPropertyName(callee)
        if (calleeObject.name === 'Vue') {
          // for Vue.js 2.x
          // Vue.component('xxx', {}) || Vue.mixin({}) || Vue.extend('xxx', {})
          const maybeFullVueComponentForVue2 =
            propName && isObjectArgument(parent)

          return maybeFullVueComponentForVue2 &&
            // eslint-disable-next-line unicorn/prefer-includes-over-repeated-comparisons -- narrows `propName` for the returned value
            (propName === 'component' ||
              propName === 'mixin' ||
              propName === 'extend')
            ? propName
            : null
        }

        // for Vue.js 3.x
        // app.component('xxx', {}) || app.mixin({})
        const maybeFullVueComponent = propName && isObjectArgument(parent)

        return maybeFullVueComponent &&
          (propName === 'component' || propName === 'mixin')
          ? propName
          : null
      }
    } else if (callee.type === 'Identifier') {
      if (callee.name === 'defineNuxtComponent') {
        // for Nuxt 3.x
        // defineNuxtComponent({})
        const isDestructedVueComponent = isObjectArgument(parent)
        return isDestructedVueComponent ? 'defineNuxtComponent' : null
      }

      if (
        // for Vue.js 2.x
        // component('xxx', {})
        // eslint-disable-next-line unicorn/prefer-includes-over-repeated-comparisons -- narrows `callee.name` for the returned value
        (callee.name === 'component' ||
          // for Vue.js 3.x
          // createApp({})
          callee.name === 'createApp' ||
          // for Vue.js 3.x
          // defineComponent({})
          callee.name === 'defineComponent') &&
        isGlobalOrImportedFromVue(callee, context)
      ) {
        return isObjectArgument(parent) ? callee.name : null
      }
    }
  }

  return null
}

/** @param {CallExpression} node */
function isObjectArgument(node: CallExpression) {
  const lastArgument = node.arguments.at(-1)
  return (
    lastArgument && skipTSAsExpression(lastArgument).type === 'ObjectExpression'
  )
}

/**
 * Check whether given node is new Vue instance
 * new Vue({})
 * @param {NewExpression} node Node to check
 * @returns {boolean}
 */
function isVueInstance(node: NewExpression): boolean {
  const callee = node.callee
  return (
    node.type === 'NewExpression' &&
    callee.type === 'Identifier' &&
    callee.name === 'Vue' &&
    node.arguments.length > 0 &&
    skipTSAsExpression(node.arguments[0]).type === 'ObjectExpression'
  )
}

/**
 * If the given object is a Vue component or instance, returns the Vue definition type.
 * @param {RuleContext} context The ESLint rule context object.
 * @param {ObjectExpression} node Node to check
 * @returns { VueObjectType | null } The Vue definition type.
 */
function getVueObjectType(
  context: RuleContext,
  node: ObjectExpression
): VueObjectType | null {
  if (node.type !== 'ObjectExpression') {
    return null
  }
  const parent = getParent(node)
  switch (parent.type) {
    case 'ExportDefaultDeclaration': {
      // export default {} in .vue || .jsx
      const filePath = context.filename
      if (
        isVueComponentFile(parent, filePath) &&
        skipTSAsExpression(parent.declaration) === node
      ) {
        const scriptSetup = getScriptSetupElement(context)
        return scriptSetup &&
          scriptSetup.range[0] <= parent.range[0] &&
          parent.range[1] <= scriptSetup.range[1]
          ? null // `export default` in `<script setup>`
          : 'export'
      }

      break
    }
    case 'CallExpression': {
      // Vue.component('xxx', {}) || component('xxx', {})
      if (
        getVueComponentDefinitionType(context, node) != null &&
        skipTSAsExpression(parent.arguments.at(-1)) === node
      ) {
        return 'definition'
      }

      break
    }
    case 'NewExpression': {
      // new Vue({})
      if (
        isVueInstance(parent) &&
        skipTSAsExpression(parent.arguments[0]) === node
      ) {
        return 'instance'
      }

      break
    }
    // No default
  }
  return getComponentComments(context).some(
    (el) => el.loc.end.line === node.loc.start.line - 1
  )
    ? 'mark'
    : null
}

/**
 * Checks whether the given object is an SFC definition.
 * @param {RuleContext} context The ESLint rule context object.
 * @param {ObjectExpression} node Node to check
 * @returns { boolean } `true`, the given object is an SFC definition.
 */
function isSFCObject(context: RuleContext, node: ObjectExpression): boolean {
  if (node.type !== 'ObjectExpression') {
    return false
  }
  const filePath = context.filename
  const ext = path.extname(filePath)
  return (ext === '.vue' || !ext) && isSFC(node)

  /**
   * @param {Expression} node
   * @returns {boolean}
   */
  function isSFC(node: Expression): boolean {
    const parent = getParent(node)
    switch (parent.type) {
      case 'ExportDefaultDeclaration': {
        // export default {}
        if (skipTSAsExpression(parent.declaration) !== node) {
          return false
        }
        const scriptSetup = getScriptSetupElement(context)
        // `false` for `export default` in `<script setup>`
        return (
          !scriptSetup ||
          scriptSetup.range[0] > parent.range[0] ||
          parent.range[1] > scriptSetup.range[1]
        )
      }
      case 'CallExpression': {
        if (parent.arguments.every((arg) => skipTSAsExpression(arg) !== node)) {
          return false
        }
        const { callee } = parent
        return (
          ((callee.type === 'Identifier' &&
            (callee.name === 'defineComponent' ||
              callee.name === 'defineNuxtComponent')) ||
            (callee.type === 'MemberExpression' &&
              callee.object.type === 'Identifier' &&
              callee.object.name === 'Vue' &&
              callee.property.type === 'Identifier' &&
              callee.property.name === 'extend')) &&
          isSFC(parent)
        )
      }
      case 'VariableDeclarator': {
        if (
          skipTSAsExpression(parent.init) !== node ||
          parent.id.type !== 'Identifier'
        ) {
          return false
        }
        const variable = findVariable(getScope(context, node), parent.id)
        return Boolean(
          variable?.references.some((ref) => isSFC(ref.identifier))
        )
      }
      // No default
    }
    return false
  }
}

/**
 * Gets the component comments of a given context.
 * @param {RuleContext} context The ESLint rule context object.
 * @return {Token[]} The the component comments.
 */
function getComponentComments(context: RuleContext): Token[] {
  let tokens = componentComments.get(context)
  if (tokens) {
    return tokens
  }
  const sourceCode = context.sourceCode
  tokens = sourceCode
    .getAllComments()
    .filter((comment) => /@vue\/component/g.test(comment.value))
  componentComments.set(context, tokens)
  return tokens
}

/**
 * Return generator with the all handler nodes defined in the given watcher property.
 * @param {Property|Expression} property
 * @returns {IterableIterator<Expression>}
 */
function* iterateWatchHandlerValues(
  property: Property | Expression
): IterableIterator<Expression> {
  const value = property.type === 'Property' ? property.value : property
  if (value.type === 'ObjectExpression') {
    const handler = findProperty(value, 'handler')
    if (handler) {
      yield handler.value
    }
  } else if (value.type === 'ArrayExpression') {
    for (const element of value.elements) {
      if (isDef(element) && element.type !== 'SpreadElement') {
        yield* iterateWatchHandlerValues(element)
      }
    }
  } else {
    yield value
  }
}

/**
 * Wraps composition API trace map in 'vue', '@vue/composition-api' and '@nuxtjs/composition-api' imports, or '#imports' from unimport
 * @param {import('@eslint-community/eslint-utils').TYPES.TraceMap} map
 */
function createCompositionApiTraceMap(map: TYPES.TraceMap) {
  return {
    vue: map,
    '@vue/composition-api': map,
    '@nuxtjs/composition-api': map,
    '#imports': map
  }
}

/**
 * Get the attribute which has the given name.
 * @param {VElement} node The start tag node to check.
 * @param {string} name The attribute name to check.
 * @param {string} [value] The attribute value to check.
 * @returns {VAttribute | null} The found attribute.
 */
function getAttribute(
  node: VElement,
  name: string,
  value?: string
): VAttribute | null {
  return (
    node.startTag.attributes.find(
      /**
       * @param {VAttribute | VDirective} node
       * @returns {node is VAttribute}
       */
      (node: VAttribute | VDirective): node is VAttribute =>
        !node.directive &&
        node.key.name === name &&
        (value === undefined ||
          (node.value != null && node.value.value === value))
    ) || null
  )
}

/**
 * Get the directive list which has the given name.
 * @param {VElement | VStartTag} node The start tag node to check.
 * @param {string} name The directive name to check.
 * @returns {VDirective[]} The array of `v-slot` directives.
 */
function getDirectives(node: VElement | VStartTag, name: string): VDirective[] {
  const attributes = (node.type === 'VElement' ? node.startTag : node)
    .attributes
  return attributes.filter(
    /**
     * @param {VAttribute | VDirective} node
     * @returns {node is VDirective}
     */
    (node: VAttribute | VDirective): node is VDirective =>
      node.directive && node.key.name.name === name
  )
}
/**
 * Get the directive which has the given name.
 * @param {VElement} node The start tag node to check.
 * @param {string} name The directive name to check.
 * @param {string} [argument] The directive argument to check.
 * @returns {VDirective | null} The found directive.
 */
function getDirective(
  node: VElement,
  name: string,
  argument?: string
): VDirective | null {
  return (
    node.startTag.attributes.find(
      /**
       * @param {VAttribute | VDirective} node
       * @returns {node is VDirective}
       */
      (node: VAttribute | VDirective): node is VDirective =>
        node.directive &&
        node.key.name.name === name &&
        (argument === undefined ||
          (node.key.argument &&
            node.key.argument.type === 'VIdentifier' &&
            node.key.argument.name) === argument)
    ) || null
  )
}

/**
 * Check whether the given start tag has specific directive.
 * @param {VElement} node The start tag node to check.
 * @param {string} name The attribute name to check.
 * @param {string} [value] The attribute value to check.
 * @returns {boolean} `true` if the start tag has the attribute.
 */
function hasAttribute(node: VElement, name: string, value?: string): boolean {
  return Boolean(getAttribute(node, name, value))
}

/**
 * Check whether the given start tag has specific directive.
 * @param {VElement} node The start tag node to check.
 * @param {string} name The directive name to check.
 * @param {string} [argument] The directive argument to check.
 * @returns {boolean} `true` if the start tag has the directive.
 */
function hasDirective(
  node: VElement,
  name: string,
  argument?: string
): boolean {
  return Boolean(getDirective(node, name, argument))
}

/**
 * Check whether the given directive node is v-bind same-name shorthand.
 * @param {VAttribute | VDirective} node The directive node to check.
 * @returns {node is VDirective & { value: VExpressionContainer & { expression: Identifier } }} `true` if the directive node is v-bind same-name shorthand.
 */
function isVBindSameNameShorthand(
  node: VAttribute | VDirective
): node is VDirective & {
  value: VExpressionContainer & { expression: Identifier }
} {
  return (
    node.directive &&
    node.key.name.name === 'bind' &&
    node.value?.expression?.type === 'Identifier' &&
    node.key.range[0] <= node.value.range[0] &&
    node.value.range[1] <= node.key.range[1]
  )
}

/**
 * @param {ASTNode} node
 * @returns {node is Literal | TemplateLiteral}
 */
function isStringLiteral(node: ASTNode): node is Literal | TemplateLiteral {
  return (
    (node.type === 'Literal' && typeof node.value === 'string') ||
    (node.type === 'TemplateLiteral' && node.expressions.length === 0)
  )
}

/**
 * Checks whether given defineProps call node has withDefaults.
 * @param {CallExpression} node The node of defineProps
 * @returns {node is CallExpression & { parent: CallExpression }}
 */
function hasWithDefaults(
  node: CallExpression
): node is CallExpression & { parent: CallExpression } {
  return (
    node.parent &&
    node.parent.type === 'CallExpression' &&
    node.parent.arguments[0] === node &&
    node.parent.callee.type === 'Identifier' &&
    node.parent.callee.name === 'withDefaults'
  )
}

/**
 * Get the withDefaults call node from given defineProps call node.
 * @param {CallExpression} node The node of defineProps
 * @returns {CallExpression | null}
 */
function getWithDefaults(node: CallExpression): CallExpression | null {
  return hasWithDefaults(node) ? node.parent : null
}

/**
 * Gets a map of the property nodes defined in withDefaults.
 * @param {CallExpression} node The node of defineProps
 * @returns { { [key: string]: Property | undefined } }
 */
function getWithDefaultsProps(node: CallExpression): {
  [key: string]: Property | undefined
} {
  if (!hasWithDefaults(node)) {
    return {}
  }
  const param = node.parent.arguments[1]
  if (!param || param.type !== 'ObjectExpression') {
    return {}
  }

  /** @type {Record<string, Property>} */
  const result: Record<string, Property> = {}

  for (const prop of param.properties) {
    if (prop.type !== 'Property') {
      continue
    }
    const name = getStaticPropertyName(prop)
    if (name != null) {
      result[name] = prop
    }
  }

  return result
}

/**
 * Collects the property expressions of the object that the given node refers
 * to, following `const` references and spread elements. Properties are
 * collected in source order, so a later definition overrides an earlier one.
 * @param {RuleContext} context The rule context object.
 * @param {ESNode} node
 * @param {Record<string, Expression | undefined>} result
 * @param {Set<ObjectExpression>} visited
 * @returns {boolean} `false` if the object cannot be determined statically.
 */
// eslint-disable-next-line unicorn/consistent-boolean-name -- returning a boolean is not the primary purpose
function collectPropExpressions(
  context: RuleContext,
  node: ESNode,
  result: Record<string, Expression | undefined>,
  visited: Set<ObjectExpression>
): boolean {
  const object = getObjectOrArray(context, node)
  if (object?.type !== 'ObjectExpression') {
    return false
  }
  if (visited.has(object)) {
    return true
  }
  visited.add(object)

  let isResolved = true
  for (const property of object.properties) {
    if (property.type === 'SpreadElement') {
      // The spread source may itself be resolvable, so follow it as well.
      if (
        !collectPropExpressions(context, property.argument, result, visited)
      ) {
        isResolved = false
      }
      continue
    }
    const name = getStaticPropertyName(property)
    if (name == null) {
      isResolved = false
      continue
    }
    result[name] = property.value
  }

  return isResolved
}

/**
 * Gets a map of the expressions defined in withDefaults.
 * @param {RuleContext} context The rule context object.
 * @param {CallExpression} node The node of defineProps
 * @returns { { props: { [key: string]: Expression | undefined }, hasUnknown: boolean } }
 */
function getWithDefaultsPropExpressions(
  context: RuleContext,
  node: CallExpression
): { props: { [key: string]: Expression | undefined }; hasUnknown: boolean } {
  /** @type {Record<string, Expression | undefined>} */
  const props: Record<string, Expression | undefined> = {}
  if (!hasWithDefaults(node)) {
    return { props, hasUnknown: false }
  }
  const defaults = node.parent.arguments[1]
  if (!defaults) {
    return { props, hasUnknown: false }
  }

  return {
    props,
    hasUnknown: !collectPropExpressions(context, defaults, props, new Set())
  }
}

/**
 * Gets the props destructure property nodes for defineProp.
 * @param {CallExpression} node The node of defineProps
 * @returns { Record<string, AssignmentProperty | undefined> }
 */
function getPropsDestructure(
  node: CallExpression
): Record<string, AssignmentProperty | undefined> {
  /** @type {ReturnType<typeof getPropsDestructure>} */
  const result: ReturnType<typeof getPropsDestructure> = Object.create(null)
  const left = getLeftOfDefineProps(node)
  if (!left || left.type !== 'ObjectPattern') {
    return result
  }
  for (const prop of left.properties) {
    if (prop.type !== 'Property') continue
    const name = getStaticPropertyName(prop)
    if (name != null) {
      result[name] = prop
    }
  }
  return result
}

/**
 * Gets the default definition nodes for defineProp
 * using the props destructure with assignment pattern.
 * @param {CallExpression} node The node of defineProps
 * @returns { Record<string, {prop: AssignmentProperty , expression: Expression} | undefined> }
 */
function getDefaultPropExpressionsForPropsDestructure(
  node: CallExpression
): Record<
  string,
  { prop: AssignmentProperty; expression: Expression } | undefined
> {
  /** @type {ReturnType<typeof getDefaultPropExpressionsForPropsDestructure>} */
  const result: ReturnType<
    typeof getDefaultPropExpressionsForPropsDestructure
  > = Object.create(null)
  const propsDestructureEntries = Object.entries(getPropsDestructure(node))
  for (const [name, prop] of propsDestructureEntries) {
    if (!prop) continue
    const value = prop.value
    if (value.type !== 'AssignmentPattern') continue
    result[name] = { prop, expression: value.right }
  }
  return result
}

/**
 * Gets the pattern of the left operand of defineProps.
 * @param {CallExpression} node The node of defineProps
 * @returns {Pattern | null} The pattern of the left operand of defineProps
 */
function getLeftOfDefineProps(node: CallExpression): Pattern | null {
  let target = node
  if (hasWithDefaults(target)) {
    target = target.parent
  }
  if (!target.parent) {
    return null
  }
  return target.parent.type === 'VariableDeclarator' &&
    target.parent.init === target
    ? target.parent.id
    : null
}

/**
 * Get all props from component options object.
 * @param {ObjectExpression} componentObject Object with component definition
 * @return {(ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp)[]} Array of component props
 */
export function getComponentPropsFromOptions(
  componentObject: ObjectExpression
): (ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp)[] {
  const propsNode = findProperty(componentObject, 'props')

  if (!propsNode) {
    return []
  }
  if (
    propsNode.value.type !== 'ObjectExpression' &&
    propsNode.value.type !== 'ArrayExpression'
  ) {
    return [
      {
        type: 'unknown',
        propName: null,
        node: propsNode.value
      }
    ]
  }

  return getComponentPropsFromDefine(propsNode.value)
}

/**
 * Get all emits from component options object.
 * @param {ObjectExpression} componentObject Object with component definition
 * @return {(ComponentArrayEmit | ComponentObjectEmit | ComponentUnknownEmit)[]} Array of component emits
 */
function getComponentEmitsFromOptions(
  componentObject: ObjectExpression
): (ComponentArrayEmit | ComponentObjectEmit | ComponentUnknownEmit)[] {
  const emitsNode = findProperty(componentObject, 'emits')

  if (!emitsNode) {
    return []
  }
  if (
    emitsNode.value.type !== 'ObjectExpression' &&
    emitsNode.value.type !== 'ArrayExpression'
  ) {
    return [
      {
        type: 'unknown',
        emitName: null,
        node: emitsNode.value
      }
    ]
  }

  return getComponentEmitsFromDefine(emitsNode.value)
}

/**
 * Get all props from `defineProps` call expression.
 * @param {RuleContext} context The rule context object.
 * @param {CallExpression} node `defineProps` call expression
 * @return {ComponentProp[]} Array of component props
 */
function getComponentPropsFromDefineProps(
  context: RuleContext,
  node: CallExpression
): ComponentProp[] {
  if (node.arguments.length > 0) {
    const defNode = getObjectOrArray(context, node.arguments[0])
    if (defNode) {
      return getComponentPropsFromDefine(defNode)
    }
    return [
      {
        type: 'unknown',
        propName: null,
        node: node.arguments[0]
      }
    ]
  }
  const typeArguments =
    'typeArguments' in node ? node.typeArguments : node.typeParameters
  if (typeArguments && typeArguments.params.length > 0) {
    return getComponentPropsFromTypeDefine(context, typeArguments.params[0])
  }
  return [
    {
      type: 'unknown',
      propName: null,
      node: null
    }
  ]
}

/**
 * Get all emits from `defineEmits` call expression.
 * @param {RuleContext} context The rule context object.
 * @param {CallExpression} node `defineEmits` call expression
 * @return {ComponentEmit[]} Array of component emits
 */
function getComponentEmitsFromDefineEmits(
  context: RuleContext,
  node: CallExpression
): ComponentEmit[] {
  if (node.arguments.length > 0) {
    const defNode = getObjectOrArray(context, node.arguments[0])
    if (defNode) {
      return getComponentEmitsFromDefine(defNode)
    }
    return [
      {
        type: 'unknown',
        emitName: null,
        node: node.arguments[0]
      }
    ]
  }
  const typeArguments =
    'typeArguments' in node ? node.typeArguments : node.typeParameters
  if (typeArguments && typeArguments.params.length > 0) {
    return getComponentEmitsFromTypeDefine(context, typeArguments.params[0])
  }
  return [
    {
      type: 'unknown',
      emitName: null,
      node: null
    }
  ]
}

/**
 * Get all slots from `defineSlots` call expression.
 * @param {RuleContext} context The rule context object.
 * @param {CallExpression} node `defineSlots` call expression
 * @return {ComponentSlot[]} Array of component slots
 */
function getComponentSlotsFromDefineSlots(
  context: RuleContext,
  node: CallExpression
): ComponentSlot[] {
  const typeArguments =
    'typeArguments' in node ? node.typeArguments : node.typeParameters
  if (typeArguments && typeArguments.params.length > 0) {
    return getComponentSlotsFromTypeDefine(context, typeArguments.params[0])
  }
  return [
    {
      type: 'unknown',
      slotName: null,
      node: null
    }
  ]
}

/**
 * Get model info from `defineModel` call expression.
 * @param {RuleContext} _context The rule context object.
 * @param {CallExpression} node `defineModel` call expression
 * @return {ComponentModel} Object of component model
 */
function getComponentModelFromDefineModel(
  _context: RuleContext,
  node: CallExpression
): ComponentModel {
  /** @type {ComponentModelName} */
  let name: ComponentModelName = {
    modelName: 'modelValue',
    node: null
  }
  /** @type {Expression|null} */
  let options: Expression | null =
    node.arguments[0]?.type === 'SpreadElement' ? null : node.arguments[0]
  if (node.arguments.length > 0) {
    const nameNodeCandidate = skipTSAsExpression(node.arguments[0])
    if (nameNodeCandidate.type === 'Literal') {
      name = {
        modelName: String(nameNodeCandidate.value),
        node: nameNodeCandidate
      }
      options =
        node.arguments[1]?.type === 'SpreadElement' ? null : node.arguments[1]
    }
  }

  const typeArguments =
    'typeArguments' in node ? node.typeArguments : node.typeParameters
  if (typeArguments && typeArguments.params.length > 0) {
    return {
      name,
      options,
      typeNode: typeArguments.params[0]
    }
  }
  return {
    name,
    options,
    typeNode: null
  }
}

/**
 * Get all props by looking at all component's properties
 * @param {ObjectExpression|ArrayExpression} propsNode Object with props definition
 * @return {(ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp)[]} Array of component props
 */
function getComponentPropsFromDefine(
  propsNode: ObjectExpression | ArrayExpression
): (ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp)[] {
  if (propsNode.type === 'ObjectExpression') {
    return propsNode.properties.map(
      /** @returns {ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp} */
      (
        prop
      ): ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp => {
        if (!isProperty(prop)) {
          return {
            type: 'unknown',
            propName: null,
            node: prop
          }
        }
        const propName = getStaticPropertyName(prop)
        if (propName != null) {
          return {
            type: 'object',
            key: prop.key,
            propName,
            value: skipTSAsExpression(prop.value),
            node: prop
          }
        }
        return {
          type: 'object',
          key: null,
          propName: null,
          value: skipTSAsExpression(prop.value),
          node: prop
        }
      }
    )
  }

  return propsNode.elements.filter(isDef).map((prop) => {
    if (prop.type === 'Literal' || prop.type === 'TemplateLiteral') {
      const propName = getStringLiteralValue(prop)
      if (propName != null) {
        return {
          type: 'array',
          key: prop,
          propName,
          value: null,
          node: prop
        }
      }
    }
    return {
      type: 'array',
      key: null,
      propName: null,
      value: null,
      node: prop
    }
  })
}

/**
 * Get all emits by looking at all component's properties
 * @param {ObjectExpression|ArrayExpression} emitsNode Object with emits definition
 * @return {(ComponentArrayEmit | ComponentObjectEmit | ComponentUnknownEmit)[]} Array of component emits.
 */
function getComponentEmitsFromDefine(
  emitsNode: ObjectExpression | ArrayExpression
): (ComponentArrayEmit | ComponentObjectEmit | ComponentUnknownEmit)[] {
  if (emitsNode.type === 'ObjectExpression') {
    return emitsNode.properties.map((prop) => {
      if (!isProperty(prop)) {
        return {
          type: 'unknown',
          key: null,
          emitName: null,
          value: null,
          node: prop
        }
      }
      const emitName = getStaticPropertyName(prop)
      if (emitName != null) {
        return {
          type: 'object',
          key: prop.key,
          emitName,
          value: skipTSAsExpression(prop.value),
          node: prop
        }
      }
      return {
        type: 'object',
        key: null,
        emitName: null,
        value: skipTSAsExpression(prop.value),
        node: prop
      }
    })
  }

  return emitsNode.elements.filter(isDef).map((emit) => {
    if (emit.type === 'Literal' || emit.type === 'TemplateLiteral') {
      const emitName = getStringLiteralValue(emit)
      if (emitName != null) {
        return {
          type: 'array',
          key: emit,
          emitName,
          value: null,
          node: emit
        }
      }
    }
    return {
      type: 'array',
      key: null,
      emitName: null,
      value: null,
      node: emit
    }
  })
}

/**
 * @param {RuleContext} context The rule context object.
 * @param {ESNode} node
 * @returns {ObjectExpression | ArrayExpression | null}
 */
function getObjectOrArray(
  context: RuleContext,
  node: ESNode
): ObjectExpression | ArrayExpression | null {
  if (node.type === 'ObjectExpression' || node.type === 'ArrayExpression') {
    return node
  }
  if (node.type === 'Identifier') {
    const variable = findVariable(getScope(context, node), node)

    if (variable != null && variable.defs.length === 1) {
      const def = variable.defs[0]
      if (
        def.type === 'Variable' &&
        def.parent.kind === 'const' &&
        def.node.id.type === 'Identifier' &&
        def.node.init
      ) {
        return getObjectOrArray(context, def.node.init)
      }
    }
  }
  return null
}
