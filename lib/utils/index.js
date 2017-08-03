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
const VOID_ELEMENT_NAMES = new Set(require('./void-elements.json'))
const assert = require('assert')
const vueEslintParser = require('vue-eslint-parser')

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
   * @param {Object} visitor The visitor.
   */
  registerTemplateBodyVisitor (context, visitor) {
    if (context.parserServices.registerTemplateBodyVisitor == null) {
      context.report({
        loc: { line: 1, column: 0 },
        message: 'Use the latest vue-eslint-parser. See also https://github.com/vuejs/eslint-plugin-vue#what-is-the-use-the-latest-vue-eslint-parser-error'
      })
      return
    }
    context.parserServices.registerTemplateBodyVisitor(context, visitor)
  },

  /**
   * Check whether the given node is the root element or not.
   * @param {ASTNode} node The element node to check.
   * @returns {boolean} `true` if the node is the root element.
   */
  isRootElement (node) {
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
    assert(node && node.type === 'VElement')
    return node.startTag.attributes.some(a =>
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
    assert(node && node.type === 'VElement')
    return node.startTag.attributes.some(a =>
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
    assert(node && node.type === 'VElement')
    return node.startTag.attributes.find(a =>
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
    assert(node && node.type === 'VElement')
    return node.startTag.attributes.find(a =>
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
    assert(node && node.type === 'VElement')

    return (
      !(this.isKnownHtmlElementNode(node) || this.isSvgElementNode(node) || this.isMathMLElementNode(node)) ||
      this.hasAttribute(node, 'is') ||
      this.hasDirective(node, 'bind', 'is')
    )
  },

  /**
   * Check whether the given node is a HTML element or not.
   * @param {ASTNode} node The node to check.
   * @returns {boolean} `true` if the node is a HTML element.
   */
  isKnownHtmlElementNode (node) {
    assert(node && node.type === 'VElement')

    return node.namespace === vueEslintParser.AST.NS.HTML && HTML_ELEMENT_NAMES.has(node.name.toLowerCase())
  },

  /**
   * Check whether the given node is a SVG element or not.
   * @param {ASTNode} node The node to check.
   * @returns {boolean} `true` if the name is a SVG element.
   */
  isSvgElementNode (node) {
    assert(node && node.type === 'VElement')

    return node.namespace === vueEslintParser.AST.NS.SVG
  },

  /**
   * Check whether the given name is a MathML element or not.
   * @param {ASTNode} name The node to check.
   * @returns {boolean} `true` if the node is a MathML element.
   */
  isMathMLElementNode (node) {
    assert(node && node.type === 'VElement')

    return node.namespace === vueEslintParser.AST.NS.MathML
  },

  /**
   * Check whether the given name is a void element name or not.
   * @param {string} name The name to check.
   * @returns {boolean} `true` if the name is a void element name.
   */
  isVoidElementName (name) {
    assert(typeof name === 'string')

    return VOID_ELEMENT_NAMES.has(name.toLowerCase())
  },

  /**
   * Parse member expression node to get array with all of it's parts
   * @param {ASTNode} MemberExpression
   * @returns {Array}
   */
  parseMemberExpression (node) {
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
   * @param {ASTNode} node - The node to get.
   * @return {string|null} The property name if static. Otherwise, null.
   */
  getStaticPropertyName (node) {
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
  },

  /**
   * Get all computed properties by looking at all component's properties
   * @param {ObjectExpression} Object with component definition
   * @return {Array} Array of computed properties in format: [{key: String, value: ASTNode}]
   */
  getComputedProperties (componentObject) {
    const computedPropertiesNode = componentObject.properties
      .find(p =>
        p.key.type === 'Identifier' &&
        p.key.name === 'computed' &&
        p.value.type === 'ObjectExpression'
      )

    if (!computedPropertiesNode) { return [] }

    return computedPropertiesNode.value.properties
      .filter(cp => cp.type === 'Property')
      .map(cp => {
        const key = cp.key.name
        let value

        if (cp.value.type === 'FunctionExpression') {
          value = cp.value.body
        } else if (cp.value.type === 'ObjectExpression') {
          value = cp.value.properties
            .filter(p =>
              p.key.type === 'Identifier' &&
              p.key.name === 'get' &&
              p.value.type === 'FunctionExpression'
            )
            .map(p => p.value.body)[0]
        }

        return { key, value }
      })
  },

  /**
   * Check whether the given node is a Vue component based
   * on the filename and default export type
   * export default {} in .vue || .jsx
   * @param {ASTNode} node Node to check
   * @param {string} path File name with extension
   * @returns {boolean}
   */
  isVueComponentFile (node, path) {
    const isVueFile = path.endsWith('.vue') || path.endsWith('.jsx')
    return isVueFile &&
      node.type === 'ExportDefaultDeclaration' &&
      node.declaration.type === 'ObjectExpression'
  },

  /**
   * Check whether given node is Vue component
   * Vue.component('xxx', {}) || component('xxx', {})
   * @param {ASTNode} node Node to check
   * @returns {boolean}
   */
  isVueComponent (node) {
    const callee = node.callee

    const isFullVueComponent = node.type === 'CallExpression' &&
      callee.type === 'MemberExpression' &&
      callee.object.type === 'Identifier' &&
      callee.object.name === 'Vue' &&
      callee.property.type === 'Identifier' &&
      callee.property.name === 'component' &&
      node.arguments.length &&
      node.arguments.slice(-1)[0].type === 'ObjectExpression'

    const isDestructedVueComponent = callee.type === 'Identifier' &&
      callee.name === 'component'

    return isFullVueComponent || isDestructedVueComponent
  },

  /**
   * Check whether given node is new Vue instance
   * new Vue({})
   * @param {ASTNode} node Node to check
   * @returns {boolean}
   */
  isVueInstance (node) {
    const callee = node.callee
    return node.type === 'NewExpression' &&
      callee.type === 'Identifier' &&
      callee.name === 'Vue' &&
      node.arguments.length &&
      node.arguments[0].type === 'ObjectExpression'
  },

  /**
   * Check if current file is a Vue instance or component and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param {Function} cb Callback function
   */
  executeOnVue (context, cb) {
    return Object.assign(
      this.executeOnVueComponent(context, cb),
      this.executeOnVueInstance(context, cb)
    )
  },

  /**
   * Check if current file is a Vue instance (new Vue) and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param {Function} cb Callback function
   */
  executeOnVueInstance (context, cb) {
    const _this = this

    return {
      'NewExpression:exit' (node) {
        // new Vue({})
        if (!_this.isVueInstance(node)) return
        cb(node.arguments[0])
      }
    }
  },

  /**
   * Check if current file is a Vue component and call callback
   * @param {RuleContext} context The ESLint rule context object.
   * @param {Function} cb Callback function
   */
  executeOnVueComponent (context, cb) {
    const filePath = context.getFilename()
    const _this = this

    return {
      'ExportDefaultDeclaration:exit' (node) {
        // export default {} in .vue || .jsx
        if (!_this.isVueComponentFile(node, filePath)) return
        cb(node.declaration)
      },
      'CallExpression:exit' (node) {
        // Vue.component('xxx', {}) || component('xxx', {})
        if (!_this.isVueComponent(node)) return
        cb(node.arguments.slice(-1)[0])
      }
    }
  },

  /**
   * Return generator with all properties
   * @param {ASTNode} node Node to check
   * @param {string} groupName Name of parent group
   */
  * iterateProperties (node, groups) {
    const nodes = node.properties.filter(p => p.type === 'Property' && groups.has(this.getStaticPropertyName(p.key)))
    for (const item of nodes) {
      const name = this.getStaticPropertyName(item.key)
      if (item.value.type === 'ArrayExpression') {
        yield * this.iterateArrayExpression(item.value, name)
      } else if (item.value.type === 'ObjectExpression') {
        yield * this.iterateObjectExpression(item.value, name)
      } else if (item.value.type === 'FunctionExpression') {
        yield * this.iterateFunctionExpression(item.value, name)
      }
    }
  },

  /**
   * Return generator with all elements inside ArrayExpression
   * @param {ASTNode} node Node to check
   * @param {string} groupName Name of parent group
   */
  * iterateArrayExpression (node, groupName) {
    assert(node.type === 'ArrayExpression')
    for (const item of node.elements) {
      const name = this.getStaticPropertyName(item)
      if (name) {
        const obj = { name, groupName, node: item }
        yield obj
      }
    }
  },

  /**
   * Return generator with all elements inside ObjectExpression
   * @param {ASTNode} node Node to check
   * @param {string} groupName Name of parent group
   */
  * iterateObjectExpression (node, groupName) {
    assert(node.type === 'ObjectExpression')
    for (const item of node.properties) {
      const name = this.getStaticPropertyName(item)
      if (name) {
        const obj = { name, groupName, node: item.key }
        yield obj
      }
    }
  },

  /**
   * Return generator with all elements inside FunctionExpression
   * @param {ASTNode} node Node to check
   * @param {string} groupName Name of parent group
   */
  * iterateFunctionExpression (node, groupName) {
    assert(node.type === 'FunctionExpression')
    if (node.body.type === 'BlockStatement') {
      for (const item of node.body.body) {
        if (item.type === 'ReturnStatement' && item.argument.type === 'ObjectExpression') {
          yield * this.iterateObjectExpression(item.argument, groupName)
        }
      }
    }
  }
}
