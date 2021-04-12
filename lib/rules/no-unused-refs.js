/**
 * @fileoverview Disallow unused refs.
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Extract names from references objects.
 * @param {VReference[]} references
 */
function getReferences(references) {
  return references.filter((ref) => ref.variable == null).map((ref) => ref.id)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused refs',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-unused-refs.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unused: "'{{name}}' is defined as ref, but never used."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Set<string>} */
    const usedRefs = new Set()

    /** @type {VLiteral[]} */
    const defineRefs = []
    let hasUnknown = false

    /**
     * Report all unused refs.
     */
    function reportUnusedRefs() {
      for (const defineRef of defineRefs) {
        if (usedRefs.has(defineRef.value)) {
          continue
        }

        context.report({
          node: defineRef,
          messageId: 'unused',
          data: {
            name: defineRef.value
          }
        })
      }
    }

    /**
     * Extract the use ref names for ObjectPattern.
     * @param {ObjectPattern} node
     * @returns {void}
     */
    function extractUsedForObjectPattern(node) {
      for (const prop of node.properties) {
        if (prop.type === 'Property') {
          const name = utils.getStaticPropertyName(prop)
          if (name) {
            usedRefs.add(name)
          } else {
            hasUnknown = true
            return
          }
        } else {
          hasUnknown = true
          return
        }
      }
    }
    /**
     * Extract the use ref names.
     * @param {Identifier | MemberExpression} refsNode
     * @returns {void}
     */
    function extractUsedForPattern(refsNode) {
      /** @type {Identifier | MemberExpression | ChainExpression} */
      let node = refsNode
      while (node.parent.type === 'ChainExpression') {
        node = node.parent
      }
      const parent = node.parent
      if (parent.type === 'AssignmentExpression') {
        if (parent.right === node) {
          if (parent.left.type === 'ObjectPattern') {
            // `({foo} = $refs)`
            extractUsedForObjectPattern(parent.left)
          } else if (parent.left.type === 'Identifier') {
            // `foo = $refs`
            hasUnknown = true
          }
        }
      } else if (parent.type === 'VariableDeclarator') {
        if (parent.init === node) {
          if (parent.id.type === 'ObjectPattern') {
            // `const {foo} = $refs`
            extractUsedForObjectPattern(parent.id)
          } else if (parent.id.type === 'Identifier') {
            // `const foo = $refs`
            hasUnknown = true
          }
        }
      } else if (parent.type === 'MemberExpression') {
        if (parent.object === node) {
          // `$refs.foo`
          const name = utils.getStaticPropertyName(parent)
          if (name) {
            usedRefs.add(name)
          } else {
            hasUnknown = true
          }
        }
      } else if (parent.type === 'CallExpression') {
        const argIndex = parent.arguments.indexOf(node)
        if (argIndex > -1) {
          // `foo($refs)`
          hasUnknown = true
        }
      } else if (
        parent.type === 'ForInStatement' ||
        parent.type === 'ReturnStatement'
      ) {
        hasUnknown = true
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        /**
         * @param {VExpressionContainer} node
         */
        VExpressionContainer(node) {
          if (hasUnknown) {
            return
          }
          for (const id of getReferences(node.references)) {
            if (id.name !== '$refs') {
              continue
            }
            extractUsedForPattern(id)
          }
        },
        /**
         * @param {VAttribute} node
         */
        'VAttribute[directive=false]'(node) {
          if (hasUnknown) {
            return
          }
          if (node.key.name === 'ref' && node.value != null) {
            defineRefs.push(node.value)
          }
        },
        "VElement[parent.type!='VElement']:exit"() {
          if (hasUnknown) {
            return
          }
          reportUnusedRefs()
        }
      },
      {
        Identifier(id) {
          if (hasUnknown) {
            return
          }
          if (id.name !== '$refs') {
            return
          }
          /** @type {Identifier | MemberExpression} */
          let refsNode = id
          if (id.parent.type === 'MemberExpression') {
            if (id.parent.property === id) {
              // `this.$refs.foo`
              refsNode = id.parent
            }
          }
          extractUsedForPattern(refsNode)
        }
      }
    )
  }
}
