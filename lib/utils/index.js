/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const HTML_ELEMENT_NAMES = new Set(require('./html-elements.json'))
const SVG_ELEMENT_NAMES = new Set(require('./svg-elements.json'))
const VOID_ELEMENT_NAMES = new Set(require('./void-elements.json'))
const assert = require('assert')

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
     * @param {object} visitor The visitor.
     * @returns {void}
     */
  registerTemplateBodyVisitor (context, visitor) {
    if (context.parserServices.registerTemplateBodyVisitor == null) {
      context.report({
        loc: { line: 1, column: 0 },
        message: 'Use the latest vue-eslint-parser.'
      })
      return
    }
    context.parserServices.registerTemplateBodyVisitor(context, visitor)
  },

    /**
     * Get the token store of template bodies.
     * If the parser service of `vue-eslint-parser` was not found,
     * this generates a warning.
     *
     * @param {RuleContext} context The rule context to use parser services.
     * @returns {TokenStore} The gotten token store.
     */
  getTemplateBodyTokenStore (context) {
    if (context.parserServices.getTemplateBodyTokenStore == null) {
      context.report({
        loc: { line: 1, column: 0 },
        message: 'Use the latest vue-eslint-parser.'
      })
      return null
    }
    return context.parserServices.getTemplateBodyTokenStore(context)
  },

    /**
     * Check whether the given node is the root element or not.
     * @param {ASTNode} node The element node to check.
     * @returns {boolean} `true` if the node is the root element.
     */
  isRootElement (node) {
    assert(node && node.type === 'VElement')

    return (
            node.parent.type === 'Program' ||
            node.parent.parent.type === 'Program'
    )
  },

    /**
     * Get the previous sibling element of the given element.
     * @param {ASTNode} node The element node to get the previous sibling element.
     * @returns {ASTNode|null} The previous sibling element.
     */
  prevSibling (node) {
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
     * @returns {boolean} `true` if the start tag has the directive.
     */
  hasAttribute (node, name, value) {
    assert(node && node.type === 'VStartTag')
    return node.attributes.some(a =>
            !a.directive &&
            a.key.name === name &&
            (
                value === undefined ||
                (a.value != null && a.value.value === value)
            )
        )
  },

    /**
     * Check whether the given start tag has specific directive.
     * @param {ASTNode} node The start tag node to check.
     * @param {string} name The directive name to check.
     * @param {string} [argument] The directive argument to check.
     * @returns {boolean} `true` if the start tag has the directive.
     */
  hasDirective (node, name, argument) {
    assert(node && node.type === 'VStartTag')
    return node.attributes.some(a =>
            a.directive &&
            a.key.name === name &&
            (argument === undefined || a.key.argument === argument)
        )
  },

    /**
     * Check whether the given attribute has their attribute value.
     * @param {ASTNode} node The attribute node to check.
     * @returns {boolean} `true` if the attribute has their value.
     */
  hasAttributeValue (node) {
    assert(node && node.type === 'VAttribute')
    return (
            node.value != null &&
            (node.value.expression != null || node.value.syntaxError != null)
    )
  },

    /**
     * Get the attribute which has the given name.
     * @param {ASTNode} node The start tag node to check.
     * @param {string} name The attribute name to check.
     * @param {string} [value] The attribute value to check.
     * @returns {ASTNode} The found attribute.
     */
  getAttribute (node, name, value) {
    assert(node && node.type === 'VStartTag')
    return node.attributes.find(a =>
            !a.directive &&
            a.key.name === name &&
            (
                value === undefined ||
                (a.value != null && a.value.value === value)
            )
        )
  },

    /**
     * Get the directive which has the given name.
     * @param {ASTNode} node The start tag node to check.
     * @param {string} name The directive name to check.
     * @param {string} [argument] The directive argument to check.
     * @returns {ASTNode} The found directive.
     */
  getDirective (node, name, argument) {
    assert(node && node.type === 'VStartTag')
    return node.attributes.find(a =>
            a.directive &&
            a.key.name === name &&
            (argument === undefined || a.key.argument === argument)
        )
  },

    /**
     * Check whether the previous sibling element has `if` or `else-if` directive.
     * @param {ASTNode} node The element node to check.
     * @returns {boolean} `true` if the previous sibling element has `if` or `else-if` directive.
     */
  prevElementHasIf (node) {
    assert(node && node.type === 'VElement')

    const prev = this.prevSibling(node)
    return (
            prev != null &&
            prev.startTag.attributes.some(a =>
                a.directive &&
                (a.key.name === 'if' || a.key.name === 'else-if')
            )
    )
  },

    /**
     * Check whether the given node is a custom component or not.
     * @param {ASTNode} node The start tag node to check.
     * @returns {boolean} `true` if the node is a custom component.
     */
  isCustomComponent (node) {
    assert(node && node.type === 'VStartTag')

    const name = node.id.name
    return (
            !(this.isHtmlElementName(name) || this.isSvgElementName(name)) ||
            this.hasAttribute(node, 'is') ||
            this.hasDirective(node, 'bind', 'is')
    )
  },

    /**
     * Check whether the given name is a HTML element name or not.
     * @param {string} name The name to check.
     * @returns {boolean} `true` if the name is a HTML element name.
     */
  isHtmlElementName (name) {
    assert(typeof name === 'string')

    return HTML_ELEMENT_NAMES.has(name.toLowerCase())
  },

    /**
     * Check whether the given name is a SVG element name or not.
     * @param {string} name The name to check.
     * @returns {boolean} `true` if the name is a SVG element name.
     */
  isSvgElementName (name) {
    assert(typeof name === 'string')

    return SVG_ELEMENT_NAMES.has(name.toLowerCase())
  },

    /**
     * Check whether the given name is a void element name or not.
     * @param {string} name The name to check.
     * @returns {boolean} `true` if the name is a void element name.
     */
  isVoidElementName (name) {
    assert(typeof name === 'string')

    return VOID_ELEMENT_NAMES.has(name.toLowerCase())
  }
}
