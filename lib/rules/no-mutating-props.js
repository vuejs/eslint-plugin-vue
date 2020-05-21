/**
 * @fileoverview disallow mutation component props
 * @author 2018 Armano
 */
'use strict'

const utils = require('../utils')
const { findVariable } = require('eslint-utils')

/**
 * @typedef {import('vue-eslint-parser').AST.ESLintObjectExpression} ObjectExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintMemberExpression} MemberExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintProperty} Property
 * @typedef {import('vue-eslint-parser').AST.ESLintIdentifier} Identifier
 * @typedef {import('vue-eslint-parser').AST.VExpressionContainer} VExpressionContainer
 * @typedef {import('vue-eslint-parser').AST.ESLintObjectPattern} ObjectPattern
 * @typedef {import('vue-eslint-parser').AST.ESLintArrayPattern} ArrayPattern
 * @typedef {import('vue-eslint-parser').AST.ESLintPattern} Pattern
 * @typedef {import('vue-eslint-parser').AST.Node} Node
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow mutation of component props',
      categories: ['vue3-essential', 'essential'],
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

    /**
     * @param {Node} node
     * @param {string} name
     */
    function report (node, name) {
      context.report({
        node,
        message: 'Unexpected mutation of "{{key}}" prop.',
        data: {
          key: name
        }
      })
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
     * @param {MemberExpression|Property} node
     * @returns {string}
     */
    function getPropertyNameText (node) {
      const name = utils.getStaticPropertyName(node)
      if (name) {
        return name
      }
      if (node.computed) {
        const expr = node.type === 'Property' ? node.key : node.property
        const str = context.getSourceCode().getText(expr)
        return `[${str}]`
      }
      return '?unknown?'
    }
    /**
     * @param {Node} node
     * @returns {node is Identifier}
     */
    function isVmReference (node) {
      if (node.type !== 'Identifier') {
        return false
      }
      const parent = node.parent
      if (parent.type === 'MemberExpression') {
        if (parent.property === node) {
          // foo.id
          return false
        }
      } else if (parent.type === 'Property') {
        // {id: foo}
        if (parent.key === node && !parent.computed) {
          return false
        }
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

    /**
     * @param {MemberExpression|Identifier} props
     * @param {string} name
     */
    function verifyMutating (props, name) {
      const invalid = utils.findMutating(props)
      if (invalid) {
        report(invalid.node, name)
      }
    }

    /**
     * @param {Pattern} param
     * @param {string[]} path
     * @returns {Generator<{ node: Identifier, path: string[] }>}
     */
    function * iterateParamProperties (param, path) {
      if (!param) {
        return
      }
      if (param.type === 'Identifier') {
        yield {
          node: param,
          path
        }
      } else if (param.type === 'RestElement') {
        yield * iterateParamProperties(param.argument, path)
      } else if (param.type === 'AssignmentPattern') {
        yield * iterateParamProperties(param.left, path)
      } else if (param.type === 'ObjectPattern') {
        for (const prop of param.properties) {
          if (prop.type === 'Property') {
            const name = getPropertyNameText(prop)
            yield * iterateParamProperties(prop.value, [...path, name])
          } else if (prop.type === 'RestElement') {
            yield * iterateParamProperties(prop.argument, path)
          }
        }
      } else if (param.type === 'ArrayPattern') {
        for (let index = 0; index < param.elements.length; index++) {
          const element = param.elements[index]
          yield * iterateParamProperties(element, [...path, `${index}`])
        }
      }
    }

    return Object.assign({},
      utils.defineVueVisitor(context,
        {
          onVueObjectEnter (node) {
            propsMap.set(node, new Set(utils.getComponentProps(node).map(p => p.propName)))
          },
          onVueObjectExit (node, { type }) {
            if (!vueObjectData || vueObjectData.type !== 'export') {
              vueObjectData = {
                type,
                object: node
              }
            }
          },
          onSetupFunctionEnter (node) {
            /** @type {Pattern} */
            const propsParam = node.params[0]
            if (!propsParam) {
              // no arguments
              return
            }
            if (propsParam.type === 'RestElement' || propsParam.type === 'ArrayPattern') {
              // cannot check
              return
            }
            for (const { node: prop, path } of iterateParamProperties(propsParam, [])) {
              // @ts-ignore
              const variable = findVariable(context.getScope(), prop)
              if (!variable) {
                continue
              }

              for (const reference of variable.references) {
                if (!reference.isRead()) {
                  continue
                }
                /** @type {Identifier} */
                const id = reference.identifier

                const invalid = utils.findMutating(id)
                if (!invalid) {
                  continue
                }
                let name
                if (path.length === 0) {
                  if (invalid.pathNodes.length === 0) {
                    continue
                  }
                  const mem = invalid.pathNodes[0]
                  name = getPropertyNameText(mem)
                } else {
                  if (invalid.pathNodes.length === 0 && invalid.kind !== 'call') {
                    continue
                  }
                  name = path[0]
                }

                report(invalid.node, name)
              }
            }
          },
          'MemberExpression > :matches(Identifier, ThisExpression)' (node, { node: vueNode }) {
            if (!utils.isThis(node, context)) {
              return
            }
            /** @type {MemberExpression} */
            const mem = node.parent
            if (mem.object !== node) {
              return
            }
            const name = utils.getStaticPropertyName(mem)
            if (name && propsMap.get(vueNode).has(name)) {
              verifyMutating(mem, name)
            }
          }
        }
      ),
      utils.defineTemplateBodyVisitor(context, {
        'VExpressionContainer MemberExpression > ThisExpression' (node) {
          if (!vueObjectData) {
            return
          }
          /** @type {MemberExpression} */
          const mem = node.parent
          if (mem.object !== node) {
            return
          }
          const name = utils.getStaticPropertyName(mem)
          if (name && propsMap.get(vueObjectData.object).has(name)) {
            verifyMutating(mem, name)
          }
        },
        'VExpressionContainer Identifier' (node) {
          if (!vueObjectData) {
            return
          }
          if (!isVmReference(node)) {
            return
          }
          const name = node.name
          if (name && propsMap.get(vueObjectData.object).has(name)) {
            verifyMutating(node, name)
          }
        },
        "VAttribute[directive=true][key.name.name='model'] VExpressionContainer > *" (node) {
          if (!vueObjectData) {
            return
          }
          const nodes = utils.getMemberChaining(node)
          const first = nodes[0]
          let name
          if (isVmReference(first)) {
            name = first.name
          } else if (first.type === 'ThisExpression') {
            const mem = nodes[1]
            if (!mem) {
              return
            }
            name = utils.getStaticPropertyName(mem)
          } else {
            return
          }
          if (name && propsMap.get(vueObjectData.object).has(name)) {
            report(node, name)
          }
        }
      })
    )
  }
}
