/**
 * @author 2nofa11
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * Check TypeScript type node for MaybeRef/MaybeRefOrGetter
 * @param {import('@typescript-eslint/types').TSESTree.TypeNode | undefined} typeNode
 * @returns {boolean}
 */
function isMaybeRefTypeNode(typeNode) {
  if (!typeNode) return false
  if (
    typeNode.type === 'TSTypeReference' &&
    typeNode.typeName &&
    typeNode.typeName.type === 'Identifier'
  ) {
    return (
      typeNode.typeName.name === 'MaybeRef' ||
      typeNode.typeName.name === 'MaybeRefOrGetter'
    )
  }
  if (typeNode.type === 'TSUnionType') {
    return typeNode.types.some((t) => isMaybeRefTypeNode(t))
  }
  return false
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require `MaybeRef` values to be unwrapped with `unref()` before using in conditions',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-mayberef-unwrap.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      requireUnref:
        'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref({{name}})` instead.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const filename = context.getFilename()
    if (!utils.isVueFile(filename) && !utils.isTypeScriptFile(filename)) {
      return {}
    }

    /** @type {Map<string, Set<string>>} */
    const maybeRefPropsMap = new Map()

    /**
     * Determine if identifier should be considered MaybeRef
     * @param {Identifier} node
     */
    function isMaybeRef(node) {
      const variable = utils.findVariableByIdentifier(context, node)
      if (!variable) {
        return false
      }

      const definition = variable.defs[0]
      if (definition.type !== 'Variable') {
        return false
      }

      const id = definition.node?.id
      if (!id || id.type !== 'Identifier' || !id.typeAnnotation) {
        return false
      }

      return isMaybeRefTypeNode(id.typeAnnotation.typeAnnotation)
    }

    /**
     * Check if MemberExpression accesses a MaybeRef prop
     * @param {Identifier} objectNode
     * @param {string} propertyName
     */
    function isMaybeRefPropsAccess(objectNode, propertyName) {
      if (!propertyName) {
        return false
      }

      const variable = utils.findVariableByIdentifier(context, objectNode)
      if (!variable) {
        return false
      }

      const maybeRefProps = maybeRefPropsMap.get(variable.name)
      return maybeRefProps ? maybeRefProps.has(propertyName) : false
    }

    /**
     * Reports if the identifier is a MaybeRef type
     * @param {Identifier} node
     * @param {string} [customName] Custom name for error message
     */
    function reportIfMaybeRef(node, customName) {
      if (!isMaybeRef(node)) {
        return
      }

      const sourceCode = context.getSourceCode()
      context.report({
        node,
        messageId: 'requireUnref',
        data: { name: customName || node.name },
        fix(fixer) {
          return fixer.replaceText(node, `unref(${sourceCode.getText(node)})`)
        }
      })
    }

    /**
     * Reports if the MemberExpression accesses a MaybeRef prop
     * @param {MemberExpression} node
     */
    function reportIfMaybeRefProps(node) {
      if (node.object.type !== 'Identifier') {
        return
      }

      const propertyName = utils.getStaticPropertyName(node)
      if (!propertyName) {
        return
      }

      if (!isMaybeRefPropsAccess(node.object, propertyName)) {
        return
      }

      const sourceCode = context.getSourceCode()
      context.report({
        node: node.property,
        messageId: 'requireUnref',
        data: { name: `${node.object.name}.${propertyName}` },
        fix(fixer) {
          return fixer.replaceText(node, `unref(${sourceCode.getText(node)})`)
        }
      })
    }

    return utils.compositingVisitors(
      {
        // if (maybeRef)
        /** @param {Identifier} node */
        'IfStatement>Identifier'(node) {
          reportIfMaybeRef(node)
        },
        // maybeRef ? x : y
        /** @param {Identifier & {parent: ConditionalExpression}} node */
        'ConditionalExpression>Identifier'(node) {
          if (node.parent.test !== node) {
            return
          }
          reportIfMaybeRef(node)
        },
        // !maybeRef, +maybeRef, -maybeRef, ~maybeRef, typeof maybeRef
        /** @param {Identifier} node */
        'UnaryExpression>Identifier'(node) {
          reportIfMaybeRef(node)
        },
        // maybeRef || other, maybeRef && other, maybeRef ?? other
        /** @param {Identifier & {parent: LogicalExpression}} node */
        'LogicalExpression>Identifier'(node) {
          reportIfMaybeRef(node)
        },
        // maybeRef == x, maybeRef != x, maybeRef === x, maybeRef !== x
        /** @param {Identifier} node */
        'BinaryExpression>Identifier'(node) {
          reportIfMaybeRef(node)
        },
        // Boolean(maybeRef), String(maybeRef)
        /** @param {Identifier} node */
        'CallExpression>Identifier'(node) {
          const parent = node.parent
          if (parent?.type !== 'CallExpression') return

          const callee = parent.callee
          if (callee?.type !== 'Identifier') return

          if (!['Boolean', 'String'].includes(callee.name)) return

          if (parent.arguments[0] === node) {
            reportIfMaybeRef(node)
          }
        },
        // props.maybeRefProp
        /** @param {MemberExpression} node */
        MemberExpression(node) {
          reportIfMaybeRefProps(node)
        }
      },
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          if (
            !node.parent ||
            node.parent.type !== 'VariableDeclarator' ||
            node.parent.init !== node
          ) {
            return
          }

          const propsParam = node.parent.id
          if (propsParam.type !== 'Identifier') {
            return
          }

          const maybeRefProps = new Set()
          for (const prop of props) {
            if (prop.type !== 'type' || !prop.node) {
              continue
            }

            if (
              prop.node.type !== 'TSPropertySignature' ||
              !prop.node.typeAnnotation
            ) {
              continue
            }

            const typeAnnotation = prop.node.typeAnnotation.typeAnnotation
            if (isMaybeRefTypeNode(typeAnnotation)) {
              maybeRefProps.add(prop.propName)
            }
          }

          if (maybeRefProps.size > 0) {
            maybeRefPropsMap.set(propsParam.name, maybeRefProps)
          }
        }
      }),
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
          const propsParam = utils.skipDefaultParamValue(node.params[0])
          if (!propsParam || propsParam.type !== 'Identifier') {
            return
          }

          if (!propsParam.typeAnnotation) {
            return
          }

          const typeAnnotation = propsParam.typeAnnotation.typeAnnotation
          const maybeRefProps = new Set()

          if (typeAnnotation.type === 'TSTypeLiteral') {
            for (const member of typeAnnotation.members) {
              if (
                member.type === 'TSPropertySignature' &&
                member.key &&
                member.key.type === 'Identifier' &&
                member.typeAnnotation &&
                isMaybeRefTypeNode(member.typeAnnotation.typeAnnotation)
              ) {
                maybeRefProps.add(member.key.name)
              }
            }
          }

          if (maybeRefProps.size > 0) {
            maybeRefPropsMap.set(propsParam.name, maybeRefProps)
          }
        },
        onVueObjectExit() {
          maybeRefPropsMap.clear()
        }
      })
    )
  }
}
