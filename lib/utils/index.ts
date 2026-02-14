/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import type { Rule, Scope } from 'eslint'
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
  ComponentSlot,
  ComponentModelName,
  ComponentModel,
  VueObjectType,
  VueObjectData,
  VueVisitor,
  ScriptSetupVisitor
} from '../../typings/eslint-plugin-vue/util-types/utils.ts'
import { createRequire } from 'node:module'
import path from 'node:path'
import { Linter } from 'eslint'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import { findVariable, ReferenceTracker } from '@eslint-community/eslint-utils'
import vueEslintParser from 'vue-eslint-parser'
import { getScope } from './scope.ts'
import {
  getComponentPropsFromTypeDefine,
  getComponentEmitsFromTypeDefine,
  getComponentSlotsFromTypeDefine,
  isTypeNode
} from './ts-utils/index.ts'
import htmlElements from './html-elements.json' with { type: 'json' }
import svgElements from './svg-elements.json' with { type: 'json' }
import mathElements from './math-elements.json' with { type: 'json' }
import voidElements from './void-elements.json' with { type: 'json' }
import vue2BuiltinComponents from './vue2-builtin-components.ts'
import vue3BuiltinComponents from './vue3-builtin-components.ts'
import vueBuiltinElements from './vue-builtin-elements.ts'

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

type GroupName =
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

interface ComponentArrayPropertyData {
  type: 'array'
  name: string
  groupName: GroupName
  node: Literal | TemplateLiteral
}

interface ComponentObjectPropertyData {
  type: 'object'
  name: string
  groupName: GroupName
  node: Identifier | Literal | TemplateLiteral
  property: Property
}

type ComponentPropertyData =
  | ComponentArrayPropertyData
  | ComponentObjectPropertyData

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

const { traverseNodes, getFallbackKeys, NS } = vueEslintParser.AST

const componentComments = new WeakMap<RuleContext, Token[]>()

let coreRuleMap: Map<string, RuleModule> | null = null
const stylisticRuleMap = new Map<string, RuleModule>()
/**
 * Get the core rule implementation from the rule name
 */
export function getCoreRule(name: string): RuleModule | null {
  try {
    const map = coreRuleMap || (coreRuleMap = new Linter().getRules())
    return map.get(name) || null
  } catch {
    // getRules() is no longer available in flat config.
  }

  return (builtinRules.get(name) as any) || null
}
/**
 * Get ESLint Stylistic rule implementation from the rule name
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
      const plugin = createRequire(`${process.cwd()}/__placeholder__.js`)(
        stylisticPluginName
      )
      const rule = plugin?.rules?.[name]
      if (!preferModule) stylisticRuleMap.set(name, rule)
      return rule
    } catch {
      // ignore
    }
  }
  return null
}

function newProxy<T extends object>(target: T, ...propsArray: Partial<T>[]): T {
  const result = new Proxy(
    {},
    {
      get(_object, key) {
        for (const props of propsArray) {
          if (key in props) {
            // @ts-expect-error
            return props[key]
          }
        }
        // @ts-expect-error
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

  function getNodeByRangeIndex(index: number) {
    if (!rootNode) {
      return eslintSourceCode.ast
    }

    let result: ASTNode = eslintSourceCode.ast
    const skipNodes: ASTNode[] = []
    let breakFlag = false

    traverseNodes(rootNode, {
      enterNode(node, parent) {
        if (breakFlag) {
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
        if (breakFlag) {
          return
        }
        if (result === node) {
          breakFlag = true
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

  const containerScopes = new WeakMap<ASTNode, Scope.ScopeManager>()

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
      const eslintScope = createRequire(require.resolve('eslint'))(
        'eslint-scope'
      )
      const expStmt = newProxy(exprContainer, {
        // @ts-expect-error
        type: 'ExpressionStatement'
      })
      const scopeProgram = newProxy(programNode, {
        // @ts-expect-error
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

  function getDeclaredVariables(node: ESNode): Variable[] {
    const scope = getContainerScope(node)
    return scope?.getDeclaredVariables(node) ?? []
  }
}

/**
 * Wrap the rule context object to override report method to skip the dynamic argument.
 */
function wrapContextToOverrideReportMethodToSkipDynamicArgument(
  context: RuleContext
): RuleContext {
  const sourceCode = context.sourceCode
  const templateBody = sourceCode.ast.templateBody
  if (!templateBody) {
    return context
  }
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

interface WrapRuleCreateContext {
  baseHandlers: RuleListener
}

type WrapRuleCreate = (
  ruleContext: RuleContext,
  wrapContext: WrapRuleCreateContext
) => TemplateListener

interface WrapRulePreprocessContext {
  wrapContextToOverrideProperties: (
    override: Partial<RuleContext>
  ) => RuleContext
  defineVisitor: (visitor: TemplateListener) => void
}

type WrapRulePreprocess = (
  ruleContext: RuleContext,
  wrapContext: WrapRulePreprocessContext
) => void

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
 */
export function wrapStylisticOrCoreRule(
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
        ] = handlers.Program
        delete handlers.Program
      }
      if (handlers['Program:exit']) {
        handlers[
          applyDocument
            ? 'VDocumentFragment:exit'
            : "VElement[parent.type!='VElement']:exit"
        ] = handlers['Program:exit']
        delete handlers['Program:exit']
      }

      if (skipDynamicArguments) {
        let withinDynamicArguments = false
        for (const name of Object.keys(handlers)) {
          const original = handlers[name]
          handlers[name] = (...args) => {
            if (withinDynamicArguments) return
            // @ts-expect-error
            original(...args)
          }
        }
        handlers['VDirectiveKey > VExpressionContainer'] = () => {
          withinDynamicArguments = true
        }
        handlers['VDirectiveKey > VExpressionContainer:exit'] = () => {
          withinDynamicArguments = false
        }
      }

      if (create) {
        compositingVisitors(handlers, create(context, { baseHandlers }))
      }

      if (applyDocument) {
        // Apply the handlers to document.
        return defineDocumentVisitor(context, handlers)
      }
      // Apply the handlers to templates.
      return defineTemplateBodyVisitor(context, handlers)
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

/**
 * Get the previous sibling element of the given element.
 */
export function prevSibling(node: VElement): VElement | null {
  let prevElement = null

  for (const siblingNode of (node.parent && node.parent.children) || []) {
    if (siblingNode === node) {
      return prevElement
    }
    if (siblingNode.type === 'VElement') {
      prevElement = siblingNode
    }
  }

  return null
}

/**
 * Check whether the given directive attribute has their empty value (`=""`).
 */
export function isEmptyValueDirective(
  node: VDirective,
  context: RuleContext
): boolean {
  if (node.value == null) {
    return false
  }
  if (node.value.expression != null) {
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
  if (!valueText) {
    // empty
    return true
  }
  return false
}

/**
 * Check whether the given directive attribute has their empty expression value (e.g. `=" "`, `="/* &ast;/"`).
 */
export function isEmptyExpressionValueDirective(
  node: VDirective,
  context: RuleContext
): boolean {
  if (node.value == null) {
    return false
  }
  if (node.value.expression != null) {
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
}

/**
 * Returns the list of all registered components
 */
export function getRegisteredComponents(
  componentObject: ObjectExpression
): { node: Property; name: string }[] {
  const componentsNode = componentObject.properties.find(
    (
      p
    ): p is Property & {
      key: Identifier & { name: 'components' }
      value: ObjectExpression
    } =>
      p.type === 'Property' &&
      getStaticPropertyName(p) === 'components' &&
      p.value.type === 'ObjectExpression'
  )

  if (!componentsNode) {
    return []
  }

  return componentsNode.value.properties
    .filter(isProperty)
    .map((node) => {
      const name = getStaticPropertyName(node)
      return name ? { node, name } : null
    })
    .filter(isDef)
}

/**
 * Check whether the previous sibling element has `if` or `else-if` directive.
 */
export function prevElementHasIf(node: VElement): boolean {
  const prev = prevSibling(node)
  return (
    prev != null &&
    prev.startTag.attributes.some(
      (a) =>
        a.directive &&
        (a.key.name.name === 'if' || a.key.name.name === 'else-if')
    )
  )
}

/**
 * Returns a generator with all child element v-if chains of the given element.
 */
export function* iterateChildElementsChains(
  node: VElement
): IterableIterator<VElement[]> {
  let vIf = false
  let elementChain: VElement[] = []
  for (const childNode of node.children) {
    if (childNode.type === 'VElement') {
      let connected
      if (hasDirective(childNode, 'if')) {
        connected = false
        vIf = true
      } else if (hasDirective(childNode, 'else-if')) {
        connected = vIf
        vIf = true
      } else if (hasDirective(childNode, 'else')) {
        connected = vIf
        vIf = false
      } else {
        connected = false
        vIf = false
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
      vIf = false
    }
  }
  if (elementChain.length > 0) {
    yield elementChain
  }
}

export function isStringLiteral(
  node: ASTNode
): node is Literal | TemplateLiteral {
  return (
    (node.type === 'Literal' && typeof node.value === 'string') ||
    (node.type === 'TemplateLiteral' && node.expressions.length === 0)
  )
}

/**
 * Check whether the given node is a custom component or not.
 */
export function isCustomComponent(
  node: VElement,
  ignoreElementNamespaces: boolean = false
): boolean {
  if (
    hasAttribute(node, 'is') ||
    hasDirective(node, 'bind', 'is') ||
    hasDirective(node, 'is')
  ) {
    return true
  }

  const isHtmlName = isHtmlWellKnownElementName(node.rawName)
  const isSvgName = isSvgWellKnownElementName(node.rawName)
  const isMathName = isMathWellKnownElementName(node.rawName)

  if (ignoreElementNamespaces) {
    return !isHtmlName && !isSvgName && !isMathName
  }

  return (
    (isHtmlElementNode(node) && !isHtmlName) ||
    (isSvgElementNode(node) && !isSvgName) ||
    (isMathElementNode(node) && !isMathName)
  )
}

/**
 * Check whether the given node is a HTML element or not.
 */
export function isHtmlElementNode(node: VElement): boolean {
  return node.namespace === NS.HTML
}

/**
 * Check whether the given node is a SVG element or not.
 */
export function isSvgElementNode(node: VElement): boolean {
  return node.namespace === NS.SVG
}

/**
 * Check whether the given name is a MathML element or not.
 */
export function isMathElementNode(node: VElement): boolean {
  return node.namespace === NS.MathML
}

/**
 * Check whether the given name is an well-known element or not.
 */
export function isHtmlWellKnownElementName(name: string): boolean {
  return HTML_ELEMENT_NAMES.has(name)
}

/**
 * Check whether the given name is an well-known SVG element or not.
 */
export function isSvgWellKnownElementName(name: string): boolean {
  return SVG_ELEMENT_NAMES.has(name)
}

/**
 * Check whether the given name is a well-known MathML element or not.
 */
export function isMathWellKnownElementName(name: string): boolean {
  return MATH_ELEMENT_NAMES.has(name)
}

/**
 * Check whether the given name is a void element name or not.
 */
export function isHtmlVoidElementName(name: string): boolean {
  return VOID_ELEMENT_NAMES.has(name)
}

/**
 * Check whether the given name is Vue builtin component name or not.
 */
export function isBuiltInComponentName(name: string): boolean {
  return (
    VUE3_BUILTIN_COMPONENT_NAMES.has(name) ||
    VUE2_BUILTIN_COMPONENT_NAMES.has(name)
  )
}

/**
 * Check whether the given name is Vue builtin element name or not.
 */
export function isVueBuiltInElementName(name: string): boolean {
  return VUE_BUILTIN_ELEMENT_NAMES.has(name.toLowerCase())
}

/**
 * Check whether the given name is Vue builtin directive name or not.
 */
export function isBuiltInDirectiveName(name: string): boolean {
  return (
    name === 'bind' ||
    name === 'on' ||
    name === 'text' ||
    name === 'html' ||
    name === 'show' ||
    name === 'if' ||
    name === 'else' ||
    name === 'else-if' ||
    name === 'for' ||
    name === 'model' ||
    name === 'slot' ||
    name === 'pre' ||
    name === 'cloak' ||
    name === 'once' ||
    name === 'memo' ||
    name === 'is'
  )
}

/**
 * Get all computed properties by looking at all component's properties
 */
export function getComputedProperties(
  componentObject: ObjectExpression
): ComponentComputedProperty[] {
  const computedPropertiesNode = componentObject.properties.find(
    (
      p
    ): p is Property & {
      key: Identifier & { name: 'computed' }
      value: ObjectExpression
    } =>
      p.type === 'Property' &&
      getStaticPropertyName(p) === 'computed' &&
      p.value.type === 'ObjectExpression'
  )

  if (!computedPropertiesNode) {
    return []
  }

  return computedPropertiesNode.value.properties
    .filter(isProperty)
    .map((cp) => {
      const key = getStaticPropertyName(cp)
      const propValue: Expression = skipTSAsExpression(cp.value)
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
}

/**
 * Get getter body from computed function
 */
export function getGetterBodyFromComputedFunction(
  callExpression: CallExpression
): FunctionExpression | ArrowFunctionExpression | null {
  if (callExpression.arguments.length <= 0) {
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
}

/**
 * Check if current file is a Vue instance or component and call callback
 */
export function executeOnVue(
  context: RuleContext,
  cb: (node: ObjectExpression, type: VueObjectType) => void
) {
  return compositingVisitors(
    executeOnVueComponent(context, cb),
    executeOnVueInstance(context, cb)
  )
}

/**
 * Define handlers to traverse the Vue Objects.
 * Some special events are available to visitor.
 *
 * - `onVueObjectEnter` ... Event when Vue Object is found.
 * - `onVueObjectExit` ... Event when Vue Object visit ends.
 * - `onSetupFunctionEnter` ... Event when setup function found.
 * - `onRenderFunctionEnter` ... Event when render function found.
 */
export function defineVueVisitor(context: RuleContext, visitor: VueVisitor) {
  let vueStack: VueObjectData | null = null

  function callVisitor(key: string, node: ESNode) {
    if (visitor[key] && vueStack) {
      // @ts-expect-error
      visitor[key](node, vueStack)
    }
  }

  const vueVisitor: NodeListener = {}
  for (const key in visitor) {
    vueVisitor[key] = (node) => callVisitor(key, node)
  }

  vueVisitor.ObjectExpression = (node: ObjectExpression) => {
    const type = getVueObjectType(context, node)
    if (type) {
      vueStack = {
        node,
        type,
        parent: vueStack,
        get functional() {
          const functional = node.properties.find(
            (p): p is Property =>
              p.type === 'Property' && getStaticPropertyName(p) === 'functional'
          )
          if (!functional) {
            return false
          }
          if (
            functional.value.type === 'Literal' &&
            functional.value.value === false
          ) {
            return false
          }
          return true
        }
      }
      callVisitor('onVueObjectEnter', node)
    }
    callVisitor('ObjectExpression', node)
  }
  vueVisitor['ObjectExpression:exit'] = (node) => {
    callVisitor('ObjectExpression:exit', node)
    if (vueStack && vueStack.node === node) {
      callVisitor('onVueObjectExit', node)
      vueStack = vueStack.parent
    }
  }
  if (
    visitor.onSetupFunctionEnter ||
    visitor.onSetupFunctionExit ||
    visitor.onRenderFunctionEnter
  ) {
    const setups = new Set<ASTNode>()
    vueVisitor[
      'Property[value.type=/^(Arrow)?FunctionExpression$/] > :function'
    ] = (
      node: (FunctionExpression | ArrowFunctionExpression) & {
        parent: Property
      }
    ) => {
      const prop = node.parent
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
      vueVisitor[
        'Property[value.type=/^(Arrow)?FunctionExpression$/] > :function:exit'
      ] = (
        node: (FunctionExpression | ArrowFunctionExpression) & {
          parent: Property
        }
      ) => {
        if (setups.has(node)) {
          callVisitor('onSetupFunctionExit', node)
          setups.delete(node)
        }
      }
    }
  }

  return vueVisitor
}
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
 */
export function defineScriptSetupVisitor(
  context: RuleContext,
  visitor: ScriptSetupVisitor
) {
  const scriptSetup = getScriptSetupElement(context)
  if (scriptSetup == null) {
    return {}
  }
  const scriptSetupRange = scriptSetup.range

  function inScriptSetup(node: ESNode) {
    return (
      scriptSetupRange[0] <= node.range[0] &&
      node.range[1] <= scriptSetupRange[1]
    )
  }

  function callVisitor(key: string, node: ESNode, ...args: any[]) {
    if (visitor[key] && (node.type === 'Program' || inScriptSetup(node))) {
      // @ts-expect-error
      visitor[key](node, ...args)
    }
  }

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
    paramsMap: Map<ASTNode, unknown>

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
    let candidateMacro: Expression | null = null
    scriptSetupVisitor[
      'Program > VariableDeclaration > VariableDeclarator, Program > ExpressionStatement'
    ] = (node: VariableDeclarator | ExpressionStatement) => {
      if (!candidateMacro) {
        candidateMacro =
          node.type === 'VariableDeclarator' ? node.init : node.expression
      }
    }
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
    scriptSetupVisitor.CallExpression = (node: CallExpression) => {
      if (
        candidateMacro &&
        inScriptSetup(node) &&
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
        if (macroListener.paramsMap.has(node)) {
          callVisitor(
            macroListener.exitName,
            node,
            macroListener.paramsMap.get(node)
          )
          macroListener.paramsMap.delete(node)
        }
      }
    }
  }

  return scriptSetupVisitor
}

/**
 * Gets a map of the expressions defined in withDefaults.
 */
export function getWithDefaultsPropExpressions(node: CallExpression): {
  [key: string]: Expression | undefined
} {
  const map = getWithDefaultsProps(node)

  const result: Record<string, Expression | undefined> = {}

  for (const key of Object.keys(map)) {
    const prop = map[key]
    result[key] = prop && prop.value
  }

  return result
}

/**
 * Checks whether the given defineProps node is using Props Destructure.
 */
export function isUsingPropsDestructure(node: CallExpression): boolean {
  const left = getLeftOfDefineProps(node)
  return left?.type === 'ObjectPattern'
}

/**
 * Check if current file is a Vue instance (new Vue) and call callback
 */
export function executeOnVueInstance(
  context: RuleContext,
  cb: (node: ObjectExpression, type: VueObjectType) => void
) {
  return {
    'ObjectExpression:exit'(node: ObjectExpression) {
      const type = getVueObjectType(context, node)
      if (!type || type !== 'instance') return
      cb(node, type)
    }
  }
}

/**
 * Check if current file is a Vue component and call callback
 */
export function executeOnVueComponent(
  context: RuleContext,
  cb: (node: ObjectExpression, type: VueObjectType) => void
) {
  return {
    'ObjectExpression:exit'(node: ObjectExpression) {
      const type = getVueObjectType(context, node)
      if (
        !type ||
        (type !== 'mark' && type !== 'export' && type !== 'definition')
      )
        return
      cb(node, type)
    }
  }
}

/**
 * Check call `Vue.component` and call callback.
 */
export function executeOnCallVueComponent(
  _context: RuleContext,
  cb: (node: CallExpression) => void
) {
  return {
    "CallExpression > MemberExpression > Identifier[name='component']": (
      node: Identifier & {
        parent: MemberExpression & { parent: CallExpression }
      }
    ) => {
      const callExpr = node.parent.parent
      const callee = callExpr.callee

      if (callee.type === 'MemberExpression') {
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
  }
}
/**
 * Return generator with all properties
 */
export function* iterateProperties(
  node: ObjectExpression,
  groups: Set<GroupName>
): IterableIterator<ComponentPropertyData> {
  for (const item of node.properties) {
    if (item.type !== 'Property') {
      continue
    }

    const name = getStaticPropertyName(item) as GroupName | null
    if (!name || !groups.has(name)) continue

    switch (item.value.type) {
      case 'ArrayExpression': {
        yield* iterateArrayExpression(item.value, name)
        break
      }
      case 'ObjectExpression': {
        yield* iterateObjectExpression(item.value, name)
        break
      }
      case 'FunctionExpression': {
        yield* iterateFunctionExpression(item.value, name)
        break
      }
      case 'ArrowFunctionExpression': {
        yield* iterateArrowFunctionExpression(item.value, name)
        break
      }
    }
  }
}

/**
 * Return generator with all elements inside ArrayExpression
 */
export function* iterateArrayExpression(
  node: ArrayExpression,
  groupName: GroupName
): IterableIterator<ComponentArrayPropertyData> {
  for (const item of node.elements) {
    if (item && (item.type === 'Literal' || item.type === 'TemplateLiteral')) {
      const name = getStringLiteralValue(item)
      if (name) {
        yield { type: 'array', name, groupName, node: item }
      }
    }
  }
}

/**
 * Return generator with all elements inside ObjectExpression
 */
export function* iterateObjectExpression(
  node: ObjectExpression,
  groupName: GroupName
): IterableIterator<ComponentObjectPropertyData> {
  let usedGetter: Set<Property> | undefined
  for (const item of node.properties) {
    if (item.type === 'Property') {
      const key = item.key
      if (
        key.type === 'Identifier' ||
        key.type === 'Literal' ||
        key.type === 'TemplateLiteral'
      ) {
        const name = getStaticPropertyName(item)
        if (name) {
          // find getter pair
          if (
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
          ) {
            // has getter pair
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
      }
    }
  }
}

/**
 * Return generator with all elements inside FunctionExpression
 */
export function* iterateFunctionExpression(
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
        yield* iterateObjectExpression(item.argument, groupName)
      }
    }
  }
}

/**
 * Return generator with all elements inside ArrowFunctionExpression
 */
export function* iterateArrowFunctionExpression(
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
        yield* iterateObjectExpression(item.argument, groupName)
      }
    }
  } else if (body.type === 'ObjectExpression') {
    yield* iterateObjectExpression(body, groupName)
  }
}

/**
 * Find all functions which do not always return values
 */
export function executeOnFunctionsWithoutReturn(
  treatUndefinedAsUnspecified: boolean,
  cb: (
    node: ArrowFunctionExpression | FunctionExpression | FunctionDeclaration
  ) => void
): RuleListener {
  interface FuncInfo {
    funcInfo: FuncInfo | null
    codePath: Rule.CodePath | null
    hasReturn: boolean
    hasReturnValue: boolean
    node: ArrowFunctionExpression | FunctionExpression | FunctionDeclaration
    currentSegments: Rule.CodePathSegment[]
  }

  let funcInfo: FuncInfo | null = null

  function isValidReturn() {
    if (!funcInfo) {
      return true
    }
    if (funcInfo.currentSegments.some((segment) => segment.reachable)) {
      return false
    }
    return !treatUndefinedAsUnspecified || funcInfo.hasReturnValue
  }

  return {
    onCodePathStart(codePath: Rule.CodePath, node: ESNode) {
      if (
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
    onCodePathSegmentStart(segment) {
      funcInfo?.currentSegments.push(segment)
    },
    onCodePathSegmentEnd() {
      funcInfo?.currentSegments.pop()
    },
    onCodePathEnd() {
      funcInfo = funcInfo && funcInfo.funcInfo
    },
    ReturnStatement(node: ReturnStatement) {
      if (funcInfo) {
        funcInfo.hasReturn = true
        funcInfo.hasReturnValue = Boolean(node.argument)
      }
    },
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
}

/**
 * Check whether the component is declared in a single line or not.
 */
export function isSingleLine(node: ASTNode): boolean {
  return node.loc.start.line === node.loc.end.line
}

/**
 * Check whether the templateBody of the program has invalid EOF or not.
 */
export function hasInvalidEOF(node: Program): boolean {
  const body = node.templateBody
  if (body == null || body.errors == null) {
    return false
  }
  return body.errors.some(
    (error) => typeof error.code === 'string' && error.code.startsWith('eof-')
  )
}

/**
 * Get the chaining nodes of MemberExpression.
 */
export function getMemberChaining(
  node: ESNode
): [ESNode, ...MemberExpression[]] {
  const nodes: MemberExpression[] = []
  let n = skipChainExpression(node)

  while (n.type === 'MemberExpression') {
    nodes.push(n)
    n = skipChainExpression(n.object)
  }

  return [n, ...nodes.reverse()]
}

/**
 * return two string editdistance
 */
export function editDistance(a: string, b: string): number {
  if (a === b) {
    return 0
  }
  const alen = a.length
  const blen = b.length
  const dp = Array.from({ length: alen + 1 }).map((_) =>
    Array.from({ length: blen + 1 }).fill(0)
  ) as number[][]
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
}

/**
 * Checks whether the target node is within the given range.
 */
export function inRange(
  rangeOrNode: Range | ASTNode | Token,
  target: ASTNode | Token
): boolean {
  const range = Array.isArray(rangeOrNode) ? rangeOrNode : rangeOrNode.range
  return range[0] <= target.range[0] && target.range[1] <= range[1]
}

/**
 * Check whether the given node is `this` or variable that stores `this`.
 */
export function isThis(node: ESNode, context: RuleContext): boolean {
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
}

/**
 * Check if a call expression is Object.assign with the given node as first argument
 */
export function isObjectAssignCall(
  callExpr: CallExpression,
  targetNode: ASTNode
): boolean {
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
}

export function findMutating(props: MemberExpression | Identifier): {
  kind: 'assignment' | 'update' | 'call'
  node: ESNode
  pathNodes: MemberExpression[]
} | null {
  const pathNodes: MemberExpression[] = []
  let node: MemberExpression | Identifier | ChainExpression = props
  let target = node.parent
  while (true) {
    switch (target.type) {
      case 'AssignmentExpression': {
        if (target.left === node) {
          // this.xxx <=|+=|-=>
          return {
            kind: 'assignment',
            node: target,
            pathNodes
          }
        }
        break
      }
      case 'UpdateExpression': {
        // this.xxx <++|-->
        return {
          kind: 'update',
          node: target,
          pathNodes
        }
      }
      case 'UnaryExpression': {
        if (target.operator === 'delete') {
          return {
            kind: 'update',
            node: target,
            pathNodes
          }
        }
        break
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
              kind: 'call',
              node: target,
              pathNodes
            }
          }
        }
        if (isObjectAssignCall(target, node)) {
          // Object.assign(xxx, {})
          return {
            kind: 'call',
            node: target,
            pathNodes
          }
        }
        break
      }
      case 'MemberExpression': {
        if (target.object === node) {
          pathNodes.push(target)
          node = target
          target = target.parent
          continue // loop
        }
        break
      }
      case 'ChainExpression': {
        node = target
        target = target.parent
        continue // loop
      }
    }

    return null
  }
}

/**
 * Wraps composition API trace map in both 'vue' and '@vue/composition-api' imports, or '#imports' from unimport
 */
export const createCompositionApiTraceMap = (map: TYPES.TraceMap) => ({
  vue: map,
  '@vue/composition-api': map,
  '#imports': map
})

/**
 * Iterates all references in the given trace map.
 * Take the third argument option to detect auto-imported references.
 */
export function* iterateReferencesTraceMap(
  tracker: ReferenceTracker,
  map: TYPES.TraceMap
): ReturnType<ReferenceTracker['iterateEsmReferences']> {
  const esmTraceMap = createCompositionApiTraceMap({
    ...map,
    [ReferenceTracker.ESM]: true
  })

  for (const ref of tracker.iterateEsmReferences(esmTraceMap)) {
    yield ref
  }

  for (const ref of tracker.iterateGlobalReferences(map)) {
    yield ref
  }
}

/**
 * Checks whether or not the tokens of two given nodes are same.
 */
export function equalTokens(
  left: ASTNode,
  right: ASTNode,
  sourceCode: ParserServices.TokenStore | SourceCode
): boolean {
  const tokensL = sourceCode.getTokens(left)
  const tokensR = sourceCode.getTokens(right)

  if (tokensL.length !== tokensR.length) {
    return false
  }

  return tokensL.every(
    (token, i) =>
      token.type === tokensR[i].type && token.value === tokensR[i].value
  )
}

// ------------------------------------------------------------------------------
// Standard Helpers
// ------------------------------------------------------------------------------

/**
 * Checks whether the given value is defined.
 */
export function isDef<T>(v: T | null | undefined): v is T {
  return v != null
}

/**
 * Flattens arrays, objects and iterable objects.
 */
export function flatten<T>(v: T | Iterable<T> | null | undefined): T[] {
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
 */
export function defineTemplateBodyVisitor(
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

export function compositingVisitors<T>(
  visitor: T,
  ...visitors: (TemplateListener | RuleListener | NodeListener)[]
): T {
  for (const v of visitors) {
    for (const key in v) {
      // @ts-expect-error
      if (visitor[key]) {
        // @ts-expect-error
        const o = visitor[key]
        // @ts-expect-error
        visitor[key] = (...args) => {
          o(...args)
          // @ts-expect-error
          v[key](...args)
        }
      } else {
        // @ts-expect-error
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
 */
export function findVariableByIdentifier(
  context: RuleContext,
  node: Identifier
): Variable | null {
  return findVariable(getScope(context, node), node)
}

/**
 * Finds the property with the given name from the given ObjectExpression node.
 */
export function findProperty(
  node: ObjectExpression,
  name: string,
  filter?: (p: Property) => boolean
): Property | null {
  const predicate: (p: Property | SpreadElement) => p is Property = filter
    ? (prop): prop is Property =>
        isProperty(prop) && getStaticPropertyName(prop) === name && filter(prop)
    : (prop): prop is Property =>
        isProperty(prop) && getStaticPropertyName(prop) === name
  return node.properties.find(predicate) || null
}

/**
 * Finds the assignment property with the given name from the given ObjectPattern node.
 */
export function findAssignmentProperty(
  node: ObjectPattern,
  name: string,
  filter?: (p: AssignmentProperty) => boolean
): AssignmentProperty | null {
  const predicate: (
    p: AssignmentProperty | RestElement
  ) => p is AssignmentProperty = filter
    ? (prop): prop is AssignmentProperty =>
        isAssignmentProperty(prop) &&
        getStaticPropertyName(prop) === name &&
        filter(prop)
    : (prop): prop is AssignmentProperty =>
        isAssignmentProperty(prop) && getStaticPropertyName(prop) === name
  return node.properties.find(predicate) || null
}

/**
 * Checks whether the given node is Property.
 */
export function isProperty(
  node: Property | SpreadElement | AssignmentProperty
): node is Property {
  if (node.type !== 'Property') {
    return false
  }
  return !node.parent || node.parent.type === 'ObjectExpression'
}
/**
 * Checks whether the given node is AssignmentProperty.
 */
export function isAssignmentProperty(
  node: AssignmentProperty | RestElement
): node is AssignmentProperty {
  return node.type === 'Property'
}
/**
 * Checks whether the given node is VElement.
 */
export function isVElement(
  node: VElement | VExpressionContainer | VText | VDocumentFragment
): node is VElement {
  return node.type === 'VElement'
}

/**
 * Checks whether the given node is in export default.
 */
export function isInExportDefault(node: ASTNode): boolean {
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
 */
export function skipTSAsExpression<T>(node: T | TSAsExpression): T {
  if (!node) {
    return node
  }
  // @ts-expect-error
  if (node.type === 'TSAsExpression') {
    // @ts-expect-error
    return skipTSAsExpression(node.expression)
  }
  // @ts-expect-error
  return node
}

/**
 * Gets the parent node of the given node. This method returns a value ignoring `X as F`.
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
 */
export function isPropertyChain(prop: Property, node: Expression) {
  let value = node
  while (value.parent.type === 'TSAsExpression') {
    value = value.parent
  }
  return prop === value.parent && prop.value === value
}

/**
 * Retrieve `AssignmentPattern#left` value if the given node a `AssignmentPattern` node. Otherwise, pass through it.
 */
export function skipDefaultParamValue<T>(node: T | AssignmentPattern): T {
  if (!node) {
    return node
  }
  // @ts-expect-error
  if (node.type === 'AssignmentPattern') {
    // @ts-expect-error
    return skipDefaultParamValue(node.left)
  }
  // @ts-expect-error
  return node
}

/**
 * Retrieve `ChainExpression#expression` value if the given node a `ChainExpression` node. Otherwise, pass through it.
 */
export function skipChainExpression<T>(node: T | ChainExpression): T {
  if (!node) {
    return node
  }
  // @ts-expect-error
  if (node.type === 'ChainExpression') {
    // @ts-expect-error
    return skipChainExpression(node.expression)
  }
  // @ts-expect-error
  return node
}

/**
 * Checks whether the given node is in a type annotation.
 */
export function withinTypeNode(node: ESNode): boolean {
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
    // @ts-expect-error
    return getStringLiteralValue(key)
  } else if (node.type === 'MemberExpression') {
    if (!node.computed) {
      const property = node.property
      if (property.type === 'Identifier') {
        return property.name
      }
      return null
    }
    const property = node.property
    // @ts-expect-error
    return getStringLiteralValue(property)
  }
  return null
}

/**
 * Gets the string of a given node.
 */
export function getStringLiteralValue(
  node: Literal | TemplateLiteral,
  stringOnly?: boolean
): string | null {
  if (node.type === 'Literal') {
    if (node.value == null) {
      if (!stringOnly && node.bigint != null) {
        return node.bigint
      }
      return null
    }
    if (typeof node.value === 'string') {
      return node.value
    }
    if (!stringOnly) {
      return String(node.value)
    }
    return null
  }
  if (
    node.type === 'TemplateLiteral' &&
    node.expressions.length === 0 &&
    node.quasis.length === 1
  ) {
    return node.quasis[0].value.cooked
  }
  return null
}
/**
 * Gets the VExpressionContainer of a given node.
 */
function getVExpressionContainer(node: ASTNode): VExpressionContainer | null {
  let n: ASTNode | null = node
  while (n && n.type !== 'VExpressionContainer') {
    n = n.parent
  }
  return n
}

export function isTypeScriptFile(path: string): boolean {
  return path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.mts')
}

// ------------------------------------------------------------------------------
// Vue Helpers
// ------------------------------------------------------------------------------

export function isVueFile(path: string): boolean {
  return path.endsWith('.vue') || path.endsWith('.jsx') || path.endsWith('.tsx')
}

/**
 * Checks whether the current file is uses `<script setup>`
 */
export function isScriptSetup(context: RuleContext) {
  return Boolean(getScriptSetupElement(context))
}
/**
 * Gets the element of `<script setup>`
 */
export function getScriptSetupElement(context: RuleContext): VElement | null {
  const sourceCode = context.sourceCode
  const df =
    sourceCode.parserServices.getDocumentFragment &&
    sourceCode.parserServices.getDocumentFragment()
  if (!df) {
    return null
  }
  const scripts = df.children.filter(
    (e): e is VElement => isVElement(e) && e.name === 'script'
  )
  if (scripts.length === 2) {
    return scripts.find((e) => hasAttribute(e, 'setup')) || null
  } else {
    const script = scripts[0]
    if (script && hasAttribute(script, 'setup')) {
      return script
    }
  }
  return null
}

/**
 * Check whether the given node is a Vue component based
 * on the filename and default export type
 * export default {} in .vue || .jsx
 */
function isVueComponentFile(node: ESNode, path: string): boolean {
  return (
    isVueFile(path) &&
    node.type === 'ExportDefaultDeclaration' &&
    node.declaration.type === 'ObjectExpression'
  )
}

/**
 * Get the Vue component definition type from given node
 * Vue.component('xxx', {}) || component('xxx', {})
 */
export function getVueComponentDefinitionType(
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
    }

    if (callee.type === 'Identifier') {
      if (callee.name === 'component') {
        // for Vue.js 2.x
        // component('xxx', {})
        const isDestructedVueComponent = isObjectArgument(parent)
        return isDestructedVueComponent ? 'component' : null
      }
      if (callee.name === 'createApp') {
        // for Vue.js 3.x
        // createApp({})
        const isAppVueComponent = isObjectArgument(parent)
        return isAppVueComponent ? 'createApp' : null
      }
      if (callee.name === 'defineComponent') {
        // for Vue.js 3.x
        // defineComponent({})
        const isDestructedVueComponent = isObjectArgument(parent)
        return isDestructedVueComponent ? 'defineComponent' : null
      }
      if (callee.name === 'defineNuxtComponent') {
        // for Nuxt 3.x
        // defineNuxtComponent({})
        const isDestructedVueComponent = isObjectArgument(parent)
        return isDestructedVueComponent ? 'defineNuxtComponent' : null
      }
    }
  }

  return null
}

function isObjectArgument(node: CallExpression) {
  const lastArgument = node.arguments.at(-1)
  return (
    lastArgument && skipTSAsExpression(lastArgument).type === 'ObjectExpression'
  )
}

/**
 * Check whether given node is new Vue instance
 * new Vue({})
 */
function isVueInstance(node: NewExpression): boolean {
  const callee = node.callee
  return Boolean(
    node.type === 'NewExpression' &&
    callee.type === 'Identifier' &&
    callee.name === 'Vue' &&
    node.arguments.length > 0 &&
    skipTSAsExpression(node.arguments[0]).type === 'ObjectExpression'
  )
}

/**
 * If the given object is a Vue component or instance, returns the Vue definition type.
 */
export function getVueObjectType(
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
        if (
          scriptSetup &&
          scriptSetup.range[0] <= parent.range[0] &&
          parent.range[1] <= scriptSetup.range[1]
        ) {
          // `export default` in `<script setup>`
          return null
        }
        return 'export'
      }

      break
    }
    case 'CallExpression': {
      // Vue.component('xxx', {}) || component('xxx', {})
      if (
        getVueComponentDefinitionType(node) != null &&
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
  if (
    getComponentComments(context).some(
      (el) => el.loc.end.line === node.loc.start.line - 1
    )
  ) {
    return 'mark'
  }
  return null
}

/**
 * Checks whether the given object is an SFC definition.
 */
export function isSFCObject(
  context: RuleContext,
  node: ObjectExpression
): boolean {
  if (node.type !== 'ObjectExpression') {
    return false
  }
  const filePath = context.filename
  const ext = path.extname(filePath)
  if (ext !== '.vue' && ext) {
    return false
  }
  return isSFC(node)

  function isSFC(node: Expression): boolean {
    const parent = getParent(node)
    switch (parent.type) {
      case 'ExportDefaultDeclaration': {
        // export default {}
        if (skipTSAsExpression(parent.declaration) !== node) {
          return false
        }
        const scriptSetup = getScriptSetupElement(context)
        if (
          scriptSetup &&
          scriptSetup.range[0] <= parent.range[0] &&
          parent.range[1] <= scriptSetup.range[1]
        ) {
          // `export default` in `<script setup>`
          return false
        }
        return true
      }
      case 'CallExpression': {
        if (parent.arguments.every((arg) => skipTSAsExpression(arg) !== node)) {
          return false
        }
        const { callee } = parent
        if (
          (callee.type === 'Identifier' &&
            (callee.name === 'defineComponent' ||
              callee.name === 'defineNuxtComponent')) ||
          (callee.type === 'MemberExpression' &&
            callee.object.type === 'Identifier' &&
            callee.object.name === 'Vue' &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 'extend')
        ) {
          return isSFC(parent)
        }
        return false
      }
      case 'VariableDeclarator': {
        if (
          skipTSAsExpression(parent.init) !== node ||
          parent.id.type !== 'Identifier'
        ) {
          return false
        }
        const variable = findVariable(getScope(context, node), parent.id)
        if (!variable) {
          return false
        }
        return variable.references.some((ref) => isSFC(ref.identifier))
      }
      // No default
    }
    return false
  }
}

/**
 * Gets the component comments of a given context.
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
 */
export function* iterateWatchHandlerValues(
  property: Property | Expression
): IterableIterator<Expression> {
  const value = property.type === 'Property' ? property.value : property
  if (value.type === 'ObjectExpression') {
    const handler = findProperty(value, 'handler')
    if (handler) {
      yield handler.value
    }
  } else if (value.type === 'ArrayExpression') {
    for (const element of value.elements.filter(isDef)) {
      if (element.type !== 'SpreadElement') {
        yield* iterateWatchHandlerValues(element)
      }
    }
  } else {
    yield value
  }
}

/**
 * Get the attribute which has the given name.
 */
export function getAttribute(
  node: VElement,
  name: string,
  value?: string
): VAttribute | null {
  return (
    node.startTag.attributes.find(
      (node): node is VAttribute =>
        !node.directive &&
        node.key.name === name &&
        (value === undefined ||
          (node.value != null && node.value.value === value))
    ) || null
  )
}

/**
 * Get the directive list which has the given name.
 */
export function getDirectives(
  node: VElement | VStartTag,
  name: string
): VDirective[] {
  const attributes =
    node.type === 'VElement' ? node.startTag.attributes : node.attributes
  return attributes.filter(
    (node): node is VDirective => node.directive && node.key.name.name === name
  )
}
/**
 * Get the directive which has the given name.
 */
export function getDirective(
  node: VElement,
  name: string,
  argument?: string
): VDirective | null {
  return (
    node.startTag.attributes.find(
      (node): node is VDirective =>
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
 */
export function hasAttribute(
  node: VElement,
  name: string,
  value?: string
): boolean {
  return Boolean(getAttribute(node, name, value))
}

/**
 * Check whether the given start tag has specific directive.
 */
export function hasDirective(
  node: VElement,
  name: string,
  argument?: string
): boolean {
  return Boolean(getDirective(node, name, argument))
}

/**
 * Check whether the given directive node is v-bind same-name shorthand.
 */
export function isVBindSameNameShorthand(
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
 * Checks whether given defineProps call node has withDefaults.
 */
export function hasWithDefaults(
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
 */
function getWithDefaults(node: CallExpression): CallExpression | null {
  return hasWithDefaults(node) ? node.parent : null
}

/**
 * Gets a map of the property nodes defined in withDefaults.
 */
export function getWithDefaultsProps(node: CallExpression): {
  [key: string]: Property | undefined
} {
  if (!hasWithDefaults(node)) {
    return {}
  }
  const param = node.parent.arguments[1]
  if (!param || param.type !== 'ObjectExpression') {
    return {}
  }

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
 * Gets the props destructure property nodes for defineProp.
 */
export function getPropsDestructure(
  node: CallExpression
): Record<string, AssignmentProperty | undefined> {
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
 */
export function getDefaultPropExpressionsForPropsDestructure(
  node: CallExpression
): Record<
  string,
  { prop: AssignmentProperty; expression: Expression } | undefined
> {
  const result: ReturnType<
    typeof getDefaultPropExpressionsForPropsDestructure
  > = Object.create(null)
  for (const [name, prop] of Object.entries(getPropsDestructure(node))) {
    if (!prop) continue
    const value = prop.value
    if (value.type !== 'AssignmentPattern') continue
    result[name] = { prop, expression: value.right }
  }
  return result
}

/**
 * Gets the pattern of the left operand of defineProps.
 */
export function getLeftOfDefineProps(node: CallExpression): Pattern | null {
  let target = node
  if (hasWithDefaults(target)) {
    target = target.parent
  }
  if (!target.parent) {
    return null
  }
  if (
    target.parent.type === 'VariableDeclarator' &&
    target.parent.init === target
  ) {
    return target.parent.id
  }
  return null
}

/**
 * Get all props from component options object.
 */
export function getComponentPropsFromOptions(
  componentObject: ObjectExpression
): (ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp)[] {
  const propsNode = componentObject.properties.find(
    (p): p is Property & { key: Identifier & { name: 'props' } } =>
      p.type === 'Property' && getStaticPropertyName(p) === 'props'
  )

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
 */
export function getComponentEmitsFromOptions(
  componentObject: ObjectExpression
): (ComponentArrayEmit | ComponentObjectEmit | ComponentUnknownEmit)[] {
  const emitsNode = componentObject.properties.find(
    (p): p is Property & { key: Identifier & { name: 'emits' } } =>
      p.type === 'Property' && getStaticPropertyName(p) === 'emits'
  )

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
    return getComponentEmitsFromTypeDefine(context, typeArguments.params[0]!)
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
 */
function getComponentModelFromDefineModel(
  _context: RuleContext,
  node: CallExpression
): ComponentModel {
  let name: ComponentModelName = {
    modelName: 'modelValue',
    node: null
  }
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
 */
function getComponentPropsFromDefine(
  propsNode: ObjectExpression | ArrayExpression
): (ComponentArrayProp | ComponentObjectProp | ComponentUnknownProp)[] {
  if (propsNode.type === 'ObjectExpression') {
    return propsNode.properties.map(
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

function getObjectOrArray(
  context: RuleContext,
  node: ESNode
): ObjectExpression | ArrayExpression | null {
  if (node.type === 'ObjectExpression') {
    return node
  }
  if (node.type === 'ArrayExpression') {
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

export { getScope } from './scope.ts'
