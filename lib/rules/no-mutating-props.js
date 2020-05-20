/**
 * @fileoverview disallow mutation component props
 * @author 2018 Armano
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('vue-eslint-parser').AST.ESLintObjectExpression} ObjectExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintMemberExpression} MemberExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintCallExpression} CallExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintIdentifier} Identifier
 * @typedef {import('vue-eslint-parser').AST.VExpressionContainer} VExpressionContainer
 * @typedef {import('vue-eslint-parser').AST.Node} Node
 * @typedef {import('vue-eslint-parser').AST.ESLintExpression} Expression
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow mutation of component props',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-mutating-props.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create (context) {
    /** @type {Map<ObjectExpression, Set<string>>} */
    const propsMap = new Map()
    /** @type { { type: 'export' | 'mark' | 'definition', object: ObjectExpression } | null } */
    let vueObjectData = null

    function report (node, name) {
      context.report({
        node,
        message: 'Unexpected mutation of "{{key}}" prop.',
        data: {
          key: name
        }
      })
    }

    function isThis (node, template) {
      if (!template) {
        return utils.isThis(node, context)
      } else {
        return node.type === 'ThisExpression'
      }
    }
    /**
     * @param {MemberExpression} node
     * @param {ObjectExpression} vueNode
     * @param {boolean} template
     */
    function verifyMember (node, vueNode, template) {
      /** @type {MemberExpression} */
      let mem = node
      while (mem.object.type === 'MemberExpression') {
        mem = mem.object
      }
      let name
      if (isThis(mem.object, template)) {
        name = utils.getStaticPropertyName(mem)
      } else if (template && isVmReference(mem.object)) {
        name = mem.object.name
      } else {
        return
      }

      if (name && propsMap.get(vueNode).has(name)) {
        report(node, name)
      }
    }
    /**
     * @param {CallExpression} node
     * @param {ObjectExpression} vueNode
     * @param {boolean} template
     */
    function verifyCall (node, vueNode, template) {
      const nodes = utils.getMemberOrCallChaining(node)
      if (nodes.length < 3) {
        return
      } else if (!template && nodes.length < 4) {
        return
      }
      let name
      const first = nodes.shift()
      if (isThis(first, template)) {
        const propMem = nodes.shift()
        if (propMem.type !== 'MemberExpression') {
          return
        }
        name = utils.getStaticPropertyName(propMem)
      } else if (template && isVmReference(first)) {
        name = first.name
      } else {
        return
      }
      if (!name || !propsMap.get(vueNode).has(name) || nodes.length < 2) {
        return
      }
      const call = nodes.pop()
      const fnMem = nodes.pop()
      if (
        fnMem.type !== 'MemberExpression' ||
        call !== node
      ) {
        return
      }
      const callName = utils.getStaticPropertyName(fnMem)
      if (!callName || !/^push|pop|shift|unshift|reverse|splice|sort|copyWithin|fill$/u.exec(callName)) {
        return
      }

      if (nodes.some(n => n.type !== 'MemberExpression')) {
        return
      }

      report(node, name)
    }
    /**
     * @param {Identifier} node
     * @param {ObjectExpression} vueNode
     */
    function verifyIdInTemplate (node, vueNode) {
      if (!isVmReference(node)) {
        return
      }
      const name = node.name
      if (name && propsMap.get(vueNode).has(name)) {
        report(node, name)
      }
    }

    /**
     * @param {Expression} node
     * @param {ObjectExpression} vueNode
     */
    function verifyVModelExpr (node, vueNode) {
      if (node.type === 'Identifier') {
        verifyIdInTemplate(node, vueNode)
      } else if (node.type === 'MemberExpression') {
        verifyMember(node, vueNode, true)
      }
    }

    /**
     * @param {Node} node
     * @returns {VExpressionContainer}
     */
    function getVExpressionContainer (node) {
      let n = node
      while (n.type !== 'VExpressionContainer') {
        n = n.parent
      }
      return n
    }
    /**
     * @param {Node} node
     * @returns {node is Identifier}
     */
    function isVmReference (node) {
      if (node.type !== 'Identifier') {
        return false
      }
      const exprContainer = getVExpressionContainer(node)

      for (const reference of exprContainer.references) {
        if (reference.variable != null) {
          // Not vm reference
          continue
        }
        if (reference.id === node) {
          return true
        }
      }
      return false
    }

    return Object.assign({},
      utils.defineVueVisitor(context,
        {
          ObjectExpression (node, { node: vueNode }) {
            if (node !== vueNode) {
              return
            }
            propsMap.set(node, new Set(utils.getComponentProps(node).map(p => p.propName)))
          },
          'ObjectExpression:exit' (node, { node: vueNode, type }) {
            if (node !== vueNode) {
              return
            }
            if (!vueObjectData || vueObjectData.type !== 'export') {
              vueObjectData = {
                type,
                object: node
              }
            }
          },
          // this.xxx <=|+=|-=>
          'AssignmentExpression' (node, { node: vueNode }) {
            if (node.left.type !== 'MemberExpression') {
              return
            }
            verifyMember(node.left, vueNode, false)
          },
          // this.xxx <++|-->
          'UpdateExpression > MemberExpression' (node, { node: vueNode }) {
            verifyMember(node, vueNode, false)
          },
          // this.xxx.func()
          'CallExpression' (node, { node: vueNode }) {
            verifyCall(node, vueNode, false)
          }
        }
      ),
      utils.defineTemplateBodyVisitor(context, {
        // this.xxx <=|+=|-=>
        'VExpressionContainer AssignmentExpression' (node) {
          if (!vueObjectData) {
            return
          }
          if (node.left.type === 'Identifier') {
            verifyIdInTemplate(node.left, vueObjectData.object)
          } else if (node.left.type === 'MemberExpression') {
            verifyMember(node.left, vueObjectData.object, true)
          }
        },
        // this.xxx <++|-->
        'VExpressionContainer UpdateExpression > :matches(Identifier, MemberExpression)' (node) {
          if (!vueObjectData) {
            return
          }
          if (node.type === 'Identifier') {
            verifyIdInTemplate(node, vueObjectData.object)
          } else {
            // node.type === 'MemberExpression'
            verifyMember(node, vueObjectData.object, true)
          }
        },
        // this.xxx.func()
        'VExpressionContainer CallExpression' (node) {
          if (!vueObjectData) {
            return
          }
          verifyCall(node, vueObjectData.object, true)
        },
        "VAttribute[directive=true][key.name.name='model'] VExpressionContainer > *" (node) {
          if (!vueObjectData) {
            return
          }
          verifyVModelExpr(node, vueObjectData.object)
        }
      })
    )
  }
}
