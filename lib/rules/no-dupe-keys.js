/**
 * @fileoverview Prevents duplication of field names.
 * @author Armano
 */
'use strict'

const { findVariable } = require('@eslint-community/eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('../utils').GroupName} GroupName
 * @typedef {import('eslint').Scope.Variable} Variable
 * @typedef {import('../utils').ComponentProp} ComponentProp
 */

/** @type {GroupName[]} */
const GROUP_NAMES = ['props', 'computed', 'data', 'methods', 'setup']

/**
 * Gets the props pattern node from given `defineProps()` node
 * @param {CallExpression} node
 * @returns {Pattern|null}
 */
function getPropsPattern(node) {
  let target = node
  if (
    target.parent &&
    target.parent.type === 'CallExpression' &&
    target.parent.arguments[0] === target &&
    target.parent.callee.type === 'Identifier' &&
    target.parent.callee.name === 'withDefaults'
  ) {
    target = target.parent
  }

  if (
    !target.parent ||
    target.parent.type !== 'VariableDeclarator' ||
    target.parent.init !== target
  ) {
    return null
  }
  return target.parent.id
}

/**
 * Checks whether the initialization of the given variable declarator node contains one of the references.
 * @param {VariableDeclarator} node
 * @param {ESNode[]} references
 */
function isInsideInitializer(node, references) {
  const init = node.init
  if (!init) {
    return false
  }
  return references.some(
    (id) => init.range[0] <= id.range[0] && id.range[1] <= init.range[1]
  )
}

/**
 * Gets the name of the prop that the given expression reads from the props object.
 * @param {Expression} node
 * @param {ESNode[]} propReferences References to the props object
 * @returns {string|null} The prop name, or `null` if it cannot be resolved
 */
function getAliasedPropName(node, propReferences) {
  const expression = utils.skipChainExpression(utils.skipTSAsExpression(node))

  // `props.foo` or `props['foo']`
  if (expression.type === 'MemberExpression') {
    return propReferences.includes(utils.skipTSAsExpression(expression.object))
      ? utils.getStaticPropertyName(expression)
      : null
  }

  // `toRef(props, 'foo')`
  if (
    expression.type === 'CallExpression' &&
    expression.callee.type === 'Identifier' &&
    expression.callee.name === 'toRef' &&
    propReferences.includes(expression.arguments[0])
  ) {
    const key = expression.arguments[1]
    return key?.type === 'Literal' && typeof key.value === 'string'
      ? key.value
      : null
  }

  return null
}

/**
 * Checks whether the given expression evaluates to the props object itself,
 * e.g. `props`, `defineProps()` or `toRefs(props)`.
 * @param {Expression} node
 * @param {ESNode[]} propReferences References to the props object
 */
function isPropsObject(node, propReferences) {
  if (propReferences.includes(node)) {
    return true
  }
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'toRefs' &&
    propReferences.includes(node.arguments[0])
  )
}

/**
 * Checks whether the given variable declarator binds `propName` to a *different* prop,
 * e.g. `const foo = toRef(props, 'bar')`. Such a declaration shadows the `propName` prop
 * in the template, so it is a duplicate key even though it reads from the props object.
 * Declarations whose source prop cannot be resolved are not reported.
 * @param {VariableDeclarator} node
 * @param {string} propName
 * @param {ESNode[]} propReferences References to the props object
 */
function aliasesOtherProp(node, propName, propReferences) {
  const init = node.init
  if (!init) {
    return false
  }

  if (node.id.type === 'Identifier' && node.id.name === propName) {
    const aliased = getAliasedPropName(init, propReferences)
    return aliased !== null && aliased !== propName
  }

  if (node.id.type === 'ObjectPattern' && isPropsObject(init, propReferences)) {
    for (const property of node.id.properties) {
      if (property.type !== 'Property') continue
      const value =
        property.value.type === 'AssignmentPattern'
          ? property.value.left
          : property.value
      if (value.type !== 'Identifier' || value.name !== propName) continue
      const key = utils.getStaticPropertyName(property)
      return key !== null && key !== propName
    }
  }

  return false
}

/**
 * Collects all renamed props from a pattern
 * @param {Pattern | null} pattern - The destructuring pattern
 * @returns {Set<string>} - Set of prop names that have been renamed
 */
function collectRenamedProps(pattern) {
  const renamedProps = new Set()

  if (!pattern || pattern.type !== 'ObjectPattern') {
    return renamedProps
  }

  for (const prop of pattern.properties) {
    if (prop.type !== 'Property') continue

    if (
      prop.key.type === 'Identifier' &&
      prop.value.type === 'Identifier' &&
      prop.key.name !== prop.value.name
    ) {
      renamedProps.add(prop.key.name)
    }
  }

  return renamedProps
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplication of field names',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-dupe-keys.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      duplicateKey:
        "Duplicate key '{{name}}'. May cause name collision in script or template tag."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const groups = new Set([...GROUP_NAMES, ...(options.groups || [])])

    return utils.compositingVisitors(
      utils.executeOnVue(context, (obj) => {
        const properties = utils.iterateProperties(obj, groups)
        /** @type {Set<string>} */
        const usedNames = new Set()
        for (const o of properties) {
          if (usedNames.has(o.name)) {
            context.report({
              node: o.node,
              messageId: 'duplicateKey',
              data: {
                name: o.name
              }
            })
          }

          usedNames.add(o.name)
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          const propsNode = getPropsPattern(node)
          const propReferences = [
            ...(propsNode ? extractReferences(propsNode) : []),
            node
          ]

          const renamedProps = collectRenamedProps(propsNode)

          for (const prop of props) {
            const propName = prop.propName
            if (!propName) continue

            if (renamedProps.has(propName)) {
              continue
            }

            const variable = findVariable(
              utils.getScope(context, node),
              propName
            )
            if (!variable || variable.defs.length === 0) continue

            if (
              variable.defs.some((def) => {
                if (def.type !== 'Variable') return false
                // Reading the props object does not make the declaration an alias
                // of this prop, e.g. `const foo = toRef(props, 'bar')`.
                if (aliasesOtherProp(def.node, propName, propReferences)) {
                  return false
                }
                return isInsideInitializer(def.node, propReferences)
              })
            ) {
              continue
            }

            context.report({
              node: variable.defs[0].node,
              messageId: 'duplicateKey',
              data: {
                name: propName
              }
            })
          }
        }
      })
    )

    /**
     * Extracts references from the given node.
     * @param {Pattern} node
     * @returns {Identifier[]} References
     */
    function extractReferences(node) {
      if (node.type === 'Identifier') {
        const variable = findVariable(utils.getScope(context, node), node)
        if (!variable) {
          return []
        }
        return variable.references.map((ref) => ref.identifier)
      }
      if (node.type === 'ObjectPattern') {
        return node.properties.flatMap((prop) =>
          extractReferences(prop.type === 'Property' ? prop.value : prop)
        )
      }
      if (node.type === 'AssignmentPattern') {
        return extractReferences(node.left)
      }
      if (node.type === 'RestElement') {
        return extractReferences(node.argument)
      }
      return []
    }
  }
}
