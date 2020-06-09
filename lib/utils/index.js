/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

/**
 * @typedef {import('vue-eslint-parser').AST.ESLintArrayExpression} ArrayExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintExpression} Expression
 * @typedef {import('vue-eslint-parser').AST.ESLintIdentifier} Identifier
 * @typedef {import('vue-eslint-parser').AST.ESLintLiteral} Literal
 * @typedef {import('vue-eslint-parser').AST.ESLintMemberExpression} MemberExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintMethodDefinition} MethodDefinition
 * @typedef {import('vue-eslint-parser').AST.ESLintObjectExpression} ObjectExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintProperty} Property
 * @typedef {import('vue-eslint-parser').AST.ESLintTemplateLiteral} TemplateLiteral
 * @typedef {import('vue-eslint-parser').AST.ESLintFunctionExpression} FunctionExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintBlockStatement} BlockStatement
 * @typedef {import('vue-eslint-parser').AST.ESLintNode} ESLintNode
 *
 * @typedef {import('vue-eslint-parser').AST.ESLintArrowFunctionExpression | { type: 'ArrowFunctionExpression', body: BlockStatement | Expression } } ArrowFunctionExpression
 */

/**
 * @typedef {import('eslint').Rule.RuleContext} RuleContext
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 * @typedef {import('vue-eslint-parser').AST.Token} Token
 */

/**
 * @typedef { {key: Literal | null, value: null, node: ArrayExpression['elements'][0], propName: string} } ComponentArrayProp
 * @typedef { {key: Property['key'], value: Expression, node: Property, propName: string} } ComponentObjectProp
 */
/**
 * @typedef { {key: Literal | null, value: null, node: ArrayExpression['elements'][0], emitName: string} } ComponentArrayEmit
 * @typedef { {key: Property['key'], value: Property['value'], node: Property, emitName: string} } ComponentObjectEmit
 */
/**
 * @typedef { {key: string, value: BlockStatement} } ComponentComputedProperty
 */
/**
 * @typedef { { name: string, groupName: string, node: Literal | TemplateLiteral } } ComponentArrayPropertyData
 * @typedef { { name: string, groupName: string, node: Identifier | Literal | TemplateLiteral } } ComponentObjectPropertyData
 * @typedef { ComponentArrayPropertyData | ComponentObjectPropertyData } ComponentPropertyData
 */

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const HTML_ELEMENT_NAMES = new Set(require('./html-elements.json'))
const SVG_ELEMENT_NAMES = new Set(require('./svg-elements.json'))
const VOID_ELEMENT_NAMES = new Set(require('./void-elements.json'))
const assert = require('assert')
const path = require('path')
const vueEslintParser = require('vue-eslint-parser')
const { findVariable } = require('eslint-utils')

/**
 * @type { WeakMap<RuleContext, Token[]> }
 */
const componentComments = new WeakMap()

/**
 * Wrap the rule context object to override methods which access to tokens (such as getTokenAfter).
 * @param {RuleContext} context The rule context object.
 * @param {TokenStore} tokenStore The token store object for template.
 */
function wrapContextToOverrideTokenMethods(context, tokenStore) {
  const eslintSourceCode = context.getSourceCode()
  let tokensAndComments
  function getTokensAndComments() {
    if (tokensAndComments) {
      return tokensAndComments
    }
    const templateBody = eslintSourceCode.ast.templateBody
    tokensAndComments = templateBody
      ? tokenStore.getTokens(templateBody, {
          includeComments: true
        })
      : []
    return tokensAndComments
  }
  const sourceCode = new Proxy(Object.assign({}, eslintSourceCode), {
    get(object, key) {
      if (key === 'tokensAndComments') {
        return getTokensAndComments()
      }
      return key in tokenStore ? tokenStore[key] : eslintSourceCode[key]
    }
  })

  return {
    __proto__: context,
    getSourceCode() {
      return sourceCode
    }
  }
}

/**
 * Wrap the rule context object to override report method to skip the dynamic argument.
 * @param {RuleContext} context The rule context object.
 */
function wrapContextToOverrideReportMethodToSkipDynamicArgument(context) {
  const sourceCode = context.getSourceCode()
  const templateBody = sourceCode.ast.templateBody
  if (!templateBody) {
    return context
  }
  const directiveKeyRanges = []
  const traverseNodes = vueEslintParser.AST.traverseNodes
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

  return {
    __proto__: context,
    report(descriptor, ...args) {
      let range = null
      if (descriptor.loc) {
        const startLoc = isLoc(descriptor.loc.start)
          ? descriptor.loc.start
          : descriptor.loc
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
  }

  function isLoc(loc) {
    return (
      loc &&
      typeof loc === 'object' &&
      typeof loc.line === 'number' &&
      typeof loc.column === 'number'
    )
  }
}

// ------------------------------------------------------------------------------
// Exports
// ------------------------------------------------------------------------------

module.exports = {
  /**
   * Register the given visitor to parser services.
   * If the parser service of `vue-eslint-parser` was not found,
   * this generates a warning.
   *
   * @param {RuleContext} context The rule context to use parser services.
   * @param {Object} templateBodyVisitor The visitor to traverse the template body.
   * @param {Object} [scriptVisitor] The visitor to traverse the script.
   * @returns {Object} The merged visitor.
   */
  defineTemplateBodyVisitor,

  /**
   * Wrap a given core rule to apply it to Vue.js template.
   * @param {RuleModule} coreRule The core rule implementation to wrap.
   * @param {Object} [options] The option of this rule.
   * @param {string[]} [options.categories] The categories of this rule.
   * @param {boolean} [options.skipDynamicArguments] If `true`, skip validation within dynamic arguments.
   * @param {boolean} [options.skipDynamicArgumentsReport] If `true`, skip report within dynamic arguments.
   * @param {RuleModule["create"]} [options.create] If define, extend core rule.
   * @returns {RuleModule} The wrapped rule implementation.
   */
  wrapCoreRule(coreRule, options) {
    const {
      categories,
      skipDynamicArguments,
      skipDynamicArgumentsReport,
      create
    } = options || {}
    return {
      create(context) {
        const tokenStore =
          context.parserServices.getTemplateBodyTokenStore &&
          context.parserServices.getTemplateBodyTokenStore()

        // The `context.getSourceCode()` cannot access the tokens of templates.
        // So override the methods which access to tokens by the `tokenStore`.
        if (tokenStore) {
          context = wrapContextToOverrideTokenMethods(context, tokenStore)
        }

        if (skipDynamicArgumentsReport) {
          context = wrapContextToOverrideReportMethodToSkipDynamicArgument(
            context
          )
        }

        // Move `Program` handlers to `VElement[parent.type!='VElement']`
        const coreHandlers = coreRule.create(context)
        const handlers = Object.assign({}, coreHandlers)
        if (handlers.Program) {
          handlers["VElement[parent.type!='VElement']"] = handlers.Program
          delete handlers.Program
        }
        if (handlers['Program:exit']) {
          handlers["VElement[parent.type!='VElement']:exit"] =
            handlers['Program:exit']
          delete handlers['Program:exit']
        }

        if (skipDynamicArguments) {
          let withinDynamicArguments = false
          for (const name of Object.keys(handlers)) {
            const original = handlers[name]
            handlers[name] = (...args) => {
              if (withinDynamicArguments) return
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
          compositingVisitors(handlers, create(context, { coreHandlers }))
        }

        // Apply the handlers to templates.
        return defineTemplateBodyVisitor(context, handlers)
      },

      meta: Object.assign({}, coreRule.meta, {
        docs: Object.assign({}, coreRule.meta.docs, {
          category: null,
          categories,
          url: `https://eslint.vuejs.org/rules/${path.basename(
            coreRule.meta.docs.url || ''
          )}.html`,
          extensionRule: true,
          coreRuleUrl: coreRule.meta.docs.url
        })
      })
    }
  },

  /**
   * Check whether the given node is the root element or not.
   * @param {ASTNode} node The element node to check.
   * @returns {boolean} `true` if the node is the root element.
   */
  isRootElement(node) {
    assert(node && node.type === 'VElement')

    return (
      node.parent.type === 'VDocumentFragment' ||
      node.parent.parent.type === 'VDocumentFragment'
    )
  },

  /**
   * Get the previous sibling element of the given element.
   * @param {ASTNode} node The element node to get the previous sibling element.
   * @returns {ASTNode|null} The previous sibling element.
   */
  prevSibling(node) {
    assert(node && node.type === 'VElement')
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
  },

  /**
   * Check whether the given start tag has specific directive.
   * @param {ASTNode} node The start tag node to check.
   * @param {string} name The attribute name to check.
   * @param {string} [value] The attribute value to check.
   * @returns {boolean} `true` if the start tag has the attribute.
   */
  hasAttribute(node, name, value) {
    assert(node && node.type === 'VElement')
    return Boolean(this.getAttribute(node, name, value))
  },

  /**
   * Check whether the given start tag has specific directive.
   * @param {ASTNode} node The start tag node to check.
   * @param {string} name The directive name to check.
   * @param {string} [argument] The directive argument to check.
   * @returns {boolean} `true` if the start tag has the directive.
   */
  hasDirective(node, name, argument) {
    assert(node && node.type === 'VElement')
    return Boolean(this.getDirective(node, name, argument))
  },

  /**
   * Check whether the given directive attribute has their empty value (`=""`).
   * @param {ASTNode} node The directive attribute node to check.
   * @param {RuleContext} context The rule context to use parser services.
   * @returns {boolean} `true` if the directive attribute has their empty value (`=""`).
   */
  isEmptyValueDirective(node, context) {
    assert(node && node.type === 'VAttribute')
    if (node.value == null) {
      return false
    }
    if (node.value.expression != null) {
      return false
    }

    let valueText = context.getSourceCode().getText(node.value)
    if (
      (valueText[0] === '"' || valueText[0] === "'") &&
      valueText[0] === valueText[valueText.length - 1]
    ) {
      // quoted
      valueText = valueText.slice(1, -1)
    }
    if (!valueText) {
      // empty
      return true
    }
    return false
  },

  /**
   * Check whether the given directive attribute has their empty expression value (e.g. `=" "`, `="/* &ast;/"`).
   * @param {ASTNode} node The directive attribute node to check.
   * @param {RuleContext} context The rule context to use parser services.
   * @returns {boolean} `true` if the directive attribute has their empty expression value.
   */
  isEmptyExpressionValueDirective(node, context) {
    assert(node && node.type === 'VAttribute')
    if (node.value == null) {
      return false
    }
    if (node.value.expression != null) {
      return false
    }

    const valueNode = node.value
    const tokenStore = context.parserServices.getTemplateBodyTokenStore()
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
   * @param {ASTNode} node The start tag node to check.
   * @param {string} name The attribute name to check.
   * @param {string} [value] The attribute value to check.
   * @returns {ASTNode} The found attribute.
   */
  getAttribute(node, name, value) {
    assert(node && node.type === 'VElement')
    return node.startTag.attributes.find(
      (a) =>
        !a.directive &&
        a.key.name === name &&
        (value === undefined || (a.value != null && a.value.value === value))
    )
  },

  /**
   * Get the directive which has the given name.
   * @param {ASTNode} node The start tag node to check.
   * @param {string} name The directive name to check.
   * @param {string} [argument] The directive argument to check.
   * @returns {ASTNode} The found directive.
   */
  getDirective(node, name, argument) {
    assert(node && node.type === 'VElement')
    return node.startTag.attributes.find(
      (a) =>
        a.directive &&
        a.key.name.name === name &&
        (argument === undefined ||
          (a.key.argument && a.key.argument.name) === argument)
    )
  },

  /**
   * Returns the list of all registered components
   * @param {ASTNode} componentObject
   * @returns {Array} Array of ASTNodes
   */
  getRegisteredComponents(componentObject) {
    const componentsNode = componentObject.properties.find(
      (p) =>
        p.type === 'Property' &&
        p.key.type === 'Identifier' &&
        p.key.name === 'components' &&
        p.value.type === 'ObjectExpression'
    )

    if (!componentsNode) {
      return []
    }

    return componentsNode.value.properties
      .filter((p) => p.type === 'Property')
      .map((node) => {
        const name = getStaticPropertyName(node)
        return name ? { node, name } : null
      })
      .filter((comp) => comp != null)
  },

  /**
   * Check whether the previous sibling element has `if` or `else-if` directive.
   * @param {ASTNode} node The element node to check.
   * @returns {boolean} `true` if the previous sibling element has `if` or `else-if` directive.
   */
  prevElementHasIf(node) {
    assert(node && node.type === 'VElement')

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
   * Check whether the given node is a custom component or not.
   * @param {ASTNode} node The start tag node to check.
   * @returns {boolean} `true` if the node is a custom component.
   */
  isCustomComponent(node) {
    assert(node && node.type === 'VElement')

    return (
      (this.isHtmlElementNode(node) &&
        !this.isHtmlWellKnownElementName(node.rawName)) ||
      this.hasAttribute(node, 'is') ||
      this.hasDirective(node, 'bind', 'is')
    )
  },

  /**
   * Check whether the given node is a HTML element or not.
   * @param {ASTNode} node The node to check.
   * @returns {boolean} `true` if the node is a HTML element.
   */
  isHtmlElementNode(node) {
    assert(node && node.type === 'VElement')

    return node.namespace === vueEslintParser.AST.NS.HTML
  },

  /**
   * Check whether the given node is a SVG element or not.
   * @param {ASTNode} node The node to check.
   * @returns {boolean} `true` if the name is a SVG element.
   */
  isSvgElementNode(node) {
    assert(node && node.type === 'VElement')

    return node.namespace === vueEslintParser.AST.NS.SVG
  },

  /**
   * Check whether the given name is a MathML element or not.
   * @param {ASTNode} node The node to check.
   * @returns {boolean} `true` if the node is a MathML element.
   */
  isMathMLElementNode(node) {
    assert(node && node.type === 'VElement')

    return node.namespace === vueEslintParser.AST.NS.MathML
  },

  /**
   * Check whether the given name is an well-known element or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is an well-known element name.
   */
  isHtmlWellKnownElementName(name) {
    assert(typeof name === 'string')

    return HTML_ELEMENT_NAMES.has(name)
  },

  /**
   * Check whether the given name is an well-known SVG element or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is an well-known SVG element name.
   */
  isSvgWellKnownElementName(name) {
    assert(typeof name === 'string')
    return SVG_ELEMENT_NAMES.has(name)
  },

  /**
   * Check whether the given name is a void element name or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is a void element name.
   */
  isHtmlVoidElementName(name) {
    assert(typeof name === 'string')

    return VOID_ELEMENT_NAMES.has(name)
  },

  /**
   * Parse member expression node to get array with all of its parts
   * @param {ASTNode} node MemberExpression
   * @returns {Array}
   */
  parseMemberExpression(node) {
    const members = []
    let memberExpression

    if (node.type === 'MemberExpression') {
      memberExpression = node

      while (memberExpression.type === 'MemberExpression') {
        if (memberExpression.property.type === 'Identifier') {
          members.push(memberExpression.property.name)
        }
        memberExpression = memberExpression.object
      }

      if (memberExpression.type === 'ThisExpression') {
        members.push('this')
      } else if (memberExpression.type === 'Identifier') {
        members.push(memberExpression.name)
      }
    }

    return members.reverse()
  },

  /**
   * Gets the property name of a given node.
   * @param {Property|MethodDefinition|MemberExpression|Literal|TemplateLiteral|Identifier} node - The node to get.
   * @return {string|null} The property name if static. Otherwise, null.
   */
  getStaticPropertyName,

  /**
   * Get all props by looking at all component's properties
   * @param {ObjectExpression} componentObject Object with component definition
   * @return {(ComponentArrayProp | ComponentObjectProp)[]} Array of component props in format: [{key?: String, value?: ASTNode, node: ASTNod}]
   */
  getComponentProps(componentObject) {
    const propsNode = componentObject.properties.find(
      (p) =>
        p.type === 'Property' &&
        p.key.type === 'Identifier' &&
        p.key.name === 'props' &&
        (p.value.type === 'ObjectExpression' ||
          p.value.type === 'ArrayExpression')
    )

    if (!propsNode) {
      return []
    }

    if (propsNode.value.type === 'ObjectExpression') {
      return propsNode.value.properties
        .filter((prop) => prop.type === 'Property')
        .map((prop) => {
          return {
            key: prop.key,
            value: unwrapTypes(prop.value),
            node: prop,
            propName: getStaticPropertyName(prop)
          }
        })
    } else {
      return propsNode.value.elements
        .filter((prop) => prop)
        .map((prop) => {
          const key =
            prop.type === 'Literal' && typeof prop.value === 'string'
              ? prop
              : null
          return {
            key,
            value: null,
            node: prop,
            propName: key != null ? prop.value : null
          }
        })
    }
  },

  /**
   * Get all emits by looking at all component's properties
   * @param {ObjectExpression} componentObject Object with component definition
   * @return {(ComponentArrayEmit | ComponentObjectEmit)[]} Array of component emits in format: [{key?: String, value?: ASTNode, node: ASTNod}]
   */
  getComponentEmits(componentObject) {
    const emitsNode = componentObject.properties.find(
      (p) =>
        p.type === 'Property' &&
        p.key.type === 'Identifier' &&
        p.key.name === 'emits' &&
        (p.value.type === 'ObjectExpression' ||
          p.value.type === 'ArrayExpression')
    )

    if (!emitsNode) {
      return []
    }

    if (emitsNode.value.type === 'ObjectExpression') {
      return emitsNode.value.properties
        .filter((prop) => prop.type === 'Property')
        .map((prop) => {
          return {
            key: prop.key,
            value: unwrapTypes(prop.value),
            node: prop,
            emitName: getStaticPropertyName(prop)
          }
        })
    } else {
      return emitsNode.value.elements
        .filter((prop) => prop)
        .map((prop) => {
          const key =
            prop.type === 'Literal' && typeof prop.value === 'string'
              ? prop
              : null
          return {
            key,
            value: null,
            node: prop,
            emitName: key != null ? prop.value : null
          }
        })
    }
  },

  /**
   * Get all computed properties by looking at all component's properties
   * @param {ObjectExpression} componentObject Object with component definition
   * @return {ComponentComputedProperty[]} Array of computed properties in format: [{key: String, value: ASTNode}]
   */
  getComputedProperties(componentObject) {
    const computedPropertiesNode = componentObject.properties.find(
      (p) =>
        p.type === 'Property' &&
        p.key.type === 'Identifier' &&
        p.key.name === 'computed' &&
        p.value.type === 'ObjectExpression'
    )

    if (!computedPropertiesNode) {
      return []
    }

    return computedPropertiesNode.value.properties
      .filter((cp) => cp.type === 'Property')
      .map((cp) => {
        const key = getStaticPropertyName(cp)
        /** @type {Expression} */
        const propValue = cp.value
        /** @type {BlockStatement | null} */
        let value = null

        if (propValue.type === 'FunctionExpression') {
          value = propValue.body
        } else if (propValue.type === 'ObjectExpression') {
          /** @type { (Property & { value: FunctionExpression }) | undefined} */
          const get = propValue.properties.find(
            (p) =>
              p.type === 'Property' &&
              p.key.type === 'Identifier' &&
              p.key.name === 'get' &&
              p.value.type === 'FunctionExpression'
          )
          value = get ? get.value.body : null
        }

        return { key, value }
      })
  },

  isVueFile,

  /**
   * Check if current file is a Vue instance or component and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param {Function} cb Callback function
   */
  executeOnVue(context, cb) {
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
   * @param {Object} visitor The visitor to traverse the Vue Objects.
   */
  defineVueVisitor(context, visitor) {
    let vueStack = null

    function callVisitor(key, node) {
      if (visitor[key] && vueStack) {
        visitor[key](node, vueStack)
      }
    }

    const vueVisitor = {}
    for (const key in visitor) {
      vueVisitor[key] = (node) => callVisitor(key, node)
    }

    /**
     * @param {ObjectExpression} node
     */
    vueVisitor.ObjectExpression = (node) => {
      const type = getVueObjectType(context, node)
      if (type) {
        vueStack = {
          node,
          type,
          parent: vueStack,
          get functional() {
            /** @type {Property} */
            const functional = node.properties.find(
              (p) =>
                p.type === 'Property' &&
                getStaticPropertyName(p) === 'functional'
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
    if (visitor.onSetupFunctionEnter || visitor.onRenderFunctionEnter) {
      vueVisitor[
        'Property[value.type=/^(Arrow)?FunctionExpression$/] > :function'
      ] = (node) => {
        /** @type {Property} */
        const prop = node.parent
        if (vueStack && prop.parent === vueStack.node && prop.value === node) {
          const name = getStaticPropertyName(prop)
          if (name === 'setup') {
            callVisitor('onSetupFunctionEnter', node)
          } else if (name === 'render') {
            callVisitor('onRenderFunctionEnter', node)
          }
        }
        callVisitor(
          'Property[value.type=/^(Arrow)?FunctionExpression$/] > :function',
          node
        )
      }
    }

    return vueVisitor
  },

  getVueObjectType,
  compositingVisitors,

  /**
   * Check if current file is a Vue instance (new Vue) and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param {Function} cb Callback function
   */
  executeOnVueInstance(context, cb) {
    return {
      'ObjectExpression:exit'(node) {
        const type = getVueObjectType(context, node)
        if (!type || type !== 'instance') return
        cb(node, type)
      }
    }
  },

  /**
   * Check if current file is a Vue component and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param {Function} cb Callback function
   */
  executeOnVueComponent(context, cb) {
    return {
      'ObjectExpression:exit'(node) {
        const type = getVueObjectType(context, node)
        if (
          !type ||
          (type !== 'mark' && type !== 'export' && type !== 'definition')
        )
          return
        cb(node, type)
      }
    }
  },

  /**
   * Check call `Vue.component` and call callback.
   * @param {RuleContext} _context The ESLint rule context object.
   * @param {Function} cb Callback function
   */
  executeOnCallVueComponent(_context, cb) {
    return {
      "CallExpression > MemberExpression > Identifier[name='component']": (
        node
      ) => {
        const callExpr = node.parent.parent
        const callee = callExpr.callee

        if (callee.type === 'MemberExpression') {
          const calleeObject = unwrapTypes(callee.object)

          if (
            calleeObject.type === 'Identifier' &&
            // calleeObject.name === 'Vue' && // Any names can be used in Vue.js 3.x. e.g. app.component()
            callee.property === node &&
            callExpr.arguments.length >= 1
          ) {
            cb(callExpr)
          }
        }
      }
    }
  },
  /**
   * Return generator with all properties
   * @param {ObjectExpression} node Node to check
   * @param {Set<string>} groups Name of parent group
   * @returns {IterableIterator<ComponentPropertyData>}
   */
  *iterateProperties(node, groups) {
    for (const item of node.properties) {
      if (item.type !== 'Property') {
        continue
      }
      const name = getStaticPropertyName(item)
      if (!name || !groups.has(name)) continue

      if (item.value.type === 'ArrayExpression') {
        yield* this.iterateArrayExpression(item.value, name)
      } else if (item.value.type === 'ObjectExpression') {
        yield* this.iterateObjectExpression(item.value, name)
      } else if (item.value.type === 'FunctionExpression') {
        yield* this.iterateFunctionExpression(item.value, name)
      } else if (item.value.type === 'ArrowFunctionExpression') {
        yield* this.iterateArrowFunctionExpression(item.value, name)
      }
    }
  },

  /**
   * Return generator with all elements inside ArrayExpression
   * @param {ArrayExpression} node Node to check
   * @param {string} groupName Name of parent group
   * @returns {IterableIterator<ComponentArrayPropertyData>}
   */
  *iterateArrayExpression(node, groupName) {
    assert(node.type === 'ArrayExpression')
    for (const item of node.elements) {
      if (item.type === 'Literal' || item.type === 'TemplateLiteral') {
        const name = getStaticPropertyName(item)
        if (name) {
          yield { name, groupName, node: item }
        }
      }
    }
  },

  /**
   * Return generator with all elements inside ObjectExpression
   * @param {ObjectExpression} node Node to check
   * @param {string} groupName Name of parent group
   * @returns {IterableIterator<ComponentObjectPropertyData>}
   */
  *iterateObjectExpression(node, groupName) {
    assert(node.type === 'ObjectExpression')
    let usedGetter
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
            if (item.kind === 'set') {
              // find getter pair
              if (!usedGetter) {
                usedGetter = new Set()
              }
              if (
                node.properties.some((item2) => {
                  if (
                    item2.type === 'Property' &&
                    item2.kind === 'get' &&
                    !usedGetter.has(item2)
                  ) {
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
            }
            yield { name, groupName, node: key }
          }
        }
      }
    }
  },

  /**
   * Return generator with all elements inside FunctionExpression
   * @param {FunctionExpression} node Node to check
   * @param {string} groupName Name of parent group
   * @returns {IterableIterator<ComponentObjectPropertyData>}
   */
  *iterateFunctionExpression(node, groupName) {
    assert(node.type === 'FunctionExpression')
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
   * @param {string} groupName Name of parent group
   * @returns {IterableIterator<ComponentObjectPropertyData>}
   */
  *iterateArrowFunctionExpression(node, groupName) {
    assert(node.type === 'ArrowFunctionExpression')
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
   * @param {boolean} treatUndefinedAsUnspecified
   * @param {Function} cb Callback function
   */
  executeOnFunctionsWithoutReturn(treatUndefinedAsUnspecified, cb) {
    let funcInfo = {
      funcInfo: null,
      codePath: null,
      hasReturn: false,
      hasReturnValue: false,
      node: null
    }

    function isReachable(segment) {
      return segment.reachable
    }

    function isValidReturn() {
      if (funcInfo.codePath.currentSegments.some(isReachable)) {
        return false
      }
      return !treatUndefinedAsUnspecified || funcInfo.hasReturnValue
    }

    return {
      onCodePathStart(codePath, node) {
        funcInfo = {
          codePath,
          funcInfo,
          hasReturn: false,
          hasReturnValue: false,
          node
        }
      },
      onCodePathEnd() {
        funcInfo = funcInfo.funcInfo
      },
      ReturnStatement(node) {
        funcInfo.hasReturn = true
        funcInfo.hasReturnValue = Boolean(node.argument)
      },
      'ArrowFunctionExpression:exit'(node) {
        if (!isValidReturn() && !node.expression) {
          cb(funcInfo.node)
        }
      },
      'FunctionExpression:exit'(node) {
        if (!isValidReturn()) {
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
  isSingleLine(node) {
    return node.loc.start.line === node.loc.end.line
  },

  /**
   * Check whether the templateBody of the program has invalid EOF or not.
   * @param {Program} node The program node to check.
   * @returns {boolean} `true` if it has invalid EOF.
   */
  hasInvalidEOF(node) {
    const body = node.templateBody
    if (body == null || body.errors == null) {
      return
    }
    return body.errors.some(
      (error) => typeof error.code === 'string' && error.code.startsWith('eof-')
    )
  },

  /**
   * Get the chaining nodes of MemberExpression.
   *
   * @param  {ESLintNode} node The node to parse
   * @return {[ESLintNode, ...MemberExpression[]]} The chaining nodes
   */
  getMemberChaining(node) {
    const nodes = []
    let n = node

    while (n.type === 'MemberExpression') {
      nodes.push(n)
      n = n.object
    }
    nodes.push(n)

    return nodes.reverse()
  },
  /**
   * Parse CallExpression or MemberExpression to get simplified version without arguments
   *
   * @param  {ASTNode} node The node to parse (MemberExpression | CallExpression)
   * @return {String} eg. 'this.asd.qwe().map().filter().test.reduce()'
   */
  parseMemberOrCallExpression(node) {
    const parsedCallee = []
    let n = node
    let isFunc

    while (n.type === 'MemberExpression' || n.type === 'CallExpression') {
      if (n.type === 'CallExpression') {
        n = n.callee
        isFunc = true
      } else {
        if (n.computed) {
          parsedCallee.push(`[]${isFunc ? '()' : ''}`)
        } else if (n.property.type === 'Identifier') {
          parsedCallee.push(n.property.name + (isFunc ? '()' : ''))
        }
        isFunc = false
        n = n.object
      }
    }

    if (n.type === 'Identifier') {
      parsedCallee.push(n.name)
    }

    if (n.type === 'ThisExpression') {
      parsedCallee.push('this')
    }

    return parsedCallee.reverse().join('.').replace(/\.\[/g, '[')
  },

  /**
   * return two string editdistance
   * @param {string} a string a to compare
   * @param {string} b string b to compare
   * @returns {number}
   */
  editDistance(a, b) {
    if (a === b) {
      return 0
    }
    const alen = a.length
    const blen = b.length
    const dp = Array.from({ length: alen + 1 }).map((_) =>
      Array.from({ length: blen + 1 }).fill(0)
    )
    for (let i = 0; i <= alen; i++) {
      dp[i][0] = i
    }
    for (let j = 0; j <= blen; j++) {
      dp[0][j] = j
    }
    for (let i = 1; i <= alen; i++) {
      for (let j = 1; j <= blen; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
        }
      }
    }
    return dp[alen][blen]
  },
  /**
   * Unwrap typescript types like "X as F"
   * @template T
   * @param {T} node
   * @return {T}
   */
  unwrapTypes,

  /**
   * Check whether the given node is `this` or variable that stores `this`.
   * @param  {ASTNode} node The node to check
   * @returns {boolean} `true` if the given node is `this`.
   */
  isThis(node, context) {
    if (node.type === 'ThisExpression') {
      return true
    }
    if (node.type !== 'Identifier') {
      return false
    }
    const parent = node.parent
    if (parent.type === 'MemberExpression') {
      if (parent.property === node) {
        return false
      }
    } else if (parent.type === 'Property') {
      if (parent.key === node && !parent.computed) {
        return false
      }
    }

    const variable = findVariable(context.getScope(), node)

    if (variable != null && variable.defs.length === 1) {
      const def = variable.defs[0]
      if (
        def.parent &&
        def.parent.kind === 'const' &&
        def.node.id.type === 'Identifier'
      ) {
        return (
          def.node && def.node.init && def.node.init.type === 'ThisExpression'
        )
      }
    }
    return false
  },

  /**
   * @param {MemberExpression|Identifier} props
   * @returns { { kind: 'assignment' | 'update' | 'call' , node: Node, pathNodes: MemberExpression[] } }
   */
  findMutating(props) {
    /** @type {MemberExpression[]} */
    const pathNodes = []
    let node = props
    let target = node.parent
    while (true) {
      if (target.type === 'AssignmentExpression') {
        if (target.left === node) {
          // this.xxx <=|+=|-=>
          return {
            kind: 'assignment',
            node: target,
            pathNodes
          }
        }
      } else if (target.type === 'UpdateExpression') {
        // this.xxx <++|-->
        return {
          kind: 'update',
          node: target,
          pathNodes
        }
      } else if (target.type === 'CallExpression') {
        if (node !== props && target.callee === node) {
          const callName = getStaticPropertyName(node)
          if (
            callName &&
            /^push|pop|shift|unshift|reverse|splice|sort|copyWithin|fill$/u.exec(
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
      } else if (target.type === 'MemberExpression') {
        if (target.object === node) {
          pathNodes.push(target)
          node = target
          target = target.parent
          continue // loop
        }
      }

      return null
    }
  }
}

/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param {RuleContext} context The rule context to use parser services.
 * @param {Object} templateBodyVisitor The visitor to traverse the template body.
 * @param {Object} [scriptVisitor] The visitor to traverse the script.
 * @returns {Object} The merged visitor.
 */
function defineTemplateBodyVisitor(
  context,
  templateBodyVisitor,
  scriptVisitor
) {
  if (context.parserServices.defineTemplateBodyVisitor == null) {
    context.report({
      loc: { line: 1, column: 0 },
      message:
        'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error'
    })
    return {}
  }
  return context.parserServices.defineTemplateBodyVisitor(
    templateBodyVisitor,
    scriptVisitor
  )
}

/**
 * Unwrap typescript types like "X as F"
 * @template T
 * @param {T} node
 * @return {T}
 */
function unwrapTypes(node) {
  return !node
    ? node
    : node.type === 'TSAsExpression'
    ? unwrapTypes(node.expression)
    : node
}

/**
 * Gets the property name of a given node.
 * @param {Property|MethodDefinition|MemberExpression|Literal|TemplateLiteral|Identifier} node - The node to get.
 * @return {string|null} The property name if static. Otherwise, null.
 */
function getStaticPropertyName(node) {
  let prop
  switch (node && node.type) {
    case 'Property':
    case 'MethodDefinition':
      prop = node.key
      break
    case 'MemberExpression':
      prop = node.property
      break
    case 'Literal':
    case 'TemplateLiteral':
    case 'Identifier':
      prop = node
      break
    // no default
  }

  switch (prop && prop.type) {
    case 'Literal':
      return String(prop.value)
    case 'TemplateLiteral':
      if (prop.expressions.length === 0 && prop.quasis.length === 1) {
        return prop.quasis[0].value.cooked
      }
      break
    case 'Identifier':
      if (!node.computed) {
        return prop.name
      }
      break
    // no default
  }

  return null
}

function isVueFile(path) {
  return path.endsWith('.vue') || path.endsWith('.jsx')
}

/**
 * Check whether the given node is a Vue component based
 * on the filename and default export type
 * export default {} in .vue || .jsx
 * @param {ASTNode} node Node to check
 * @param {string} path File name with extension
 * @returns {boolean}
 */
function isVueComponentFile(node, path) {
  return (
    isVueFile(path) &&
    node.type === 'ExportDefaultDeclaration' &&
    node.declaration.type === 'ObjectExpression'
  )
}

/**
 * Check whether given node is Vue component
 * Vue.component('xxx', {}) || component('xxx', {})
 * @param {ASTNode} node Node to check
 * @returns {boolean}
 */
function isVueComponent(node) {
  if (node.type === 'CallExpression') {
    const callee = node.callee

    if (callee.type === 'MemberExpression') {
      const calleeObject = unwrapTypes(callee.object)

      if (calleeObject.type === 'Identifier') {
        const propName = getStaticPropertyName(callee.property)
        if (calleeObject.name === 'Vue') {
          // for Vue.js 2.x
          // Vue.component('xxx', {}) || Vue.mixin({}) || Vue.extend('xxx', {})
          const isFullVueComponentForVue2 =
            ['component', 'mixin', 'extend'].includes(propName) &&
            isObjectArgument(node)

          return isFullVueComponentForVue2
        }

        // for Vue.js 3.x
        // app.component('xxx', {}) || app.mixin({})
        const isFullVueComponent =
          ['component', 'mixin'].includes(propName) && isObjectArgument(node)

        return isFullVueComponent
      }
    }

    if (callee.type === 'Identifier') {
      if (callee.name === 'component') {
        // for Vue.js 2.x
        // component('xxx', {})
        const isDestructedVueComponent = isObjectArgument(node)
        return isDestructedVueComponent
      }
      if (callee.name === 'createApp') {
        // for Vue.js 3.x
        // createApp({})
        const isAppVueComponent = isObjectArgument(node)
        return isAppVueComponent
      }
      if (callee.name === 'defineComponent') {
        // for Vue.js 3.x
        // defineComponent({})
        const isDestructedVueComponent = isObjectArgument(node)
        return isDestructedVueComponent
      }
    }
  }

  return false

  function isObjectArgument(node) {
    return (
      node.arguments.length > 0 &&
      unwrapTypes(node.arguments.slice(-1)[0]).type === 'ObjectExpression'
    )
  }
}

/**
 * Check whether given node is new Vue instance
 * new Vue({})
 * @param {ASTNode} node Node to check
 * @returns {boolean}
 */
function isVueInstance(node) {
  const callee = node.callee
  return (
    node.type === 'NewExpression' &&
    callee.type === 'Identifier' &&
    callee.name === 'Vue' &&
    node.arguments.length &&
    unwrapTypes(node.arguments[0]).type === 'ObjectExpression'
  )
}

/**
 * If the given object is a Vue component or instance, returns the Vue definition type.
 * @param {RuleContext} context The ESLint rule context object.
 * @param {ObjectExpression} node Node to check
 * @returns { 'mark' | 'export' | 'definition' | 'instance' | null } The Vue definition type.
 */
function getVueObjectType(context, node) {
  if (node.type !== 'ObjectExpression') {
    return null
  }
  let parent = node.parent
  while (parent && parent.type === 'TSAsExpression') {
    parent = parent.parent
  }
  if (parent) {
    if (parent.type === 'ExportDefaultDeclaration') {
      // export default {} in .vue || .jsx
      const filePath = context.getFilename()
      if (
        isVueComponentFile(parent, filePath) &&
        unwrapTypes(parent.declaration) === node
      ) {
        return 'export'
      }
    } else if (parent.type === 'CallExpression') {
      // Vue.component('xxx', {}) || component('xxx', {})
      if (
        isVueComponent(parent) &&
        unwrapTypes(parent.arguments.slice(-1)[0]) === node
      ) {
        return 'definition'
      }
    } else if (parent.type === 'NewExpression') {
      // new Vue({})
      if (isVueInstance(parent) && unwrapTypes(parent.arguments[0]) === node) {
        return 'instance'
      }
    }
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
 * Gets the component comments of a given context.
 * @param {RuleContext} context The ESLint rule context object.
 * @return {Token[]} The the component comments.
 */
function getComponentComments(context) {
  let tokens = componentComments.get(context)
  if (tokens) {
    return tokens
  }
  const sourceCode = context.getSourceCode()
  tokens = sourceCode
    .getAllComments()
    .filter((comment) => /@vue\/component/g.test(comment.value))
  componentComments.set(context, tokens)
  return tokens
}

function compositingVisitors(visitor, ...visitors) {
  for (const v of visitors) {
    for (const key in v) {
      if (visitor[key]) {
        const o = visitor[key]
        visitor[key] = (node) => {
          o(node)
          v[key](node)
        }
      } else {
        visitor[key] = v[key]
      }
    }
  }
  return visitor
}
