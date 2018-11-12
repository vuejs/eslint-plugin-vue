/**
 * @fileoverview enforce valid `.sync` modifier on `v-bind` directives
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
 * Check whether the given node is valid or not.
 * @param {ASTNode} node The element node to check.
 * @returns {boolean} `true` if the node is valid.
 */
function isValidElement (node) {
  if (
    (!utils.isHtmlElementNode(node) && !utils.isSvgElementNode(node)) ||
    utils.isHtmlWellKnownElementName(node.rawName) ||
    utils.isSvgWellKnownElementName(node.rawName)
  ) {
    // non Vue-component
    return false
  }
  return true
}

/**
 * Check whether the given node can be LHS.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node can be LHS.
 */
function isLhs (node) {
  return node != null && (
    node.type === 'Identifier' ||
    node.type === 'MemberExpression'
  )
}

/**
 * Get the variable by names.
 * @param {string} name The variable name to find.
 * @param {ASTNode} leafNode The node to look up.
 * @returns {Variable|null} The found variable or null.
 */
function getVariable (name, leafNode) {
  let node = leafNode

  while (node != null) {
    const variables = node.variables
    const variable = variables && variables.find(v => v.id.name === name)

    if (variable != null) {
      return variable
    }

    node = node.parent
  }

  return null
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce valid `.sync` modifier on `v-bind` directives',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/valid-v-bind-sync.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='bind']" (node) {
        if (node.key.modifiers.indexOf('sync') < 0) {
          return
        }
        const element = node.parent.parent
        const name = element.name

        if (!isValidElement(element)) {
          context.report({
            node,
            loc: node.loc,
            message: "'.sync' modifiers aren't supported on <{{name}}> non Vue-components.",
            data: { name }
          })
        }

        if (node.value) {
          if (!isLhs(node.value.expression)) {
            context.report({
              node,
              loc: node.loc,
              message: "'.sync' modifiers require the attribute value which is valid as LHS."
            })
          }

          for (const reference of node.value.references) {
            const id = reference.id
            if (id.parent.type !== 'VExpressionContainer') {
              continue
            }

            const variable = getVariable(id.name, element)
            if (variable != null) {
              context.report({
                node,
                loc: node.loc,
                message: "'.sync' modifiers cannot update the iteration variable '{{varName}}' itself.",
                data: { varName: id.name }
              })
            }
          }
        }
      }
    })
  }
}
