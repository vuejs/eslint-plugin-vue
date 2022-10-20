/**
 * @fileoverview disallow mutation component props
 * @author 2018 Armano
 */
'use strict'

const utils = require('../utils')
const { findVariable } = require('eslint-utils')

// https://github.com/vuejs/vue-next/blob/7c11c58faf8840ab97b6449c98da0296a60dddd8/packages/shared/src/globalsWhitelist.ts
const GLOBALS_WHITE_LISTED = new Set([
  'Infinity',
  'undefined',
  'NaN',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Math',
  'Number',
  'Date',
  'Array',
  'Object',
  'Boolean',
  'String',
  'RegExp',
  'Map',
  'Set',
  'JSON',
  'Intl',
  'BigInt'
])

/**
 * @param {ASTNode} node
 * @returns {VExpressionContainer}
 */
function getVExpressionContainer(node) {
  let n = node
  while (n.type !== 'VExpressionContainer') {
    n = /** @type {ASTNode} */ (n.parent)
  }
  return n
}

/**
 * @param {ASTNode} node
 * @returns {node is Identifier}
 */
function isVmReference(node) {
  if (node.type !== 'Identifier') {
    return false
  }
  const parent = node.parent
  if (parent.type === 'MemberExpression') {
    if (parent.property === node) {
      // foo.id
      return false
    }
  } else if (
    parent.type === 'Property' &&
    parent.key === node &&
    !parent.computed
  ) {
    // {id: foo}
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
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Map<ObjectExpression|CallExpression, Set<string>>} */
    const propsMap = new Map()
    /** @type { { type: 'export' | 'mark' | 'definition', object: ObjectExpression } | { type: 'setup', object: CallExpression } | null } */
    let vueObjectData = null

    /**
     * @param {ASTNode} node
     * @param {string} name
     */
    function report(node, name) {
      context.report({
        node,
        message: 'Unexpected mutation of "{{key}}" prop.',
        data: {
          key: name
        }
      })
    }

    /**
     * @param {MemberExpression|AssignmentProperty} node
     * @returns {string}
     */
    function getPropertyNameText(node) {
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
     * @param {MemberExpression|Identifier} props
     * @param {string} name
     */
    function verifyMutating(props, name) {
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
    function* iteratePatternProperties(param, path) {
      if (!param) {
        return
      }
      switch (param.type) {
        case 'Identifier': {
          yield { node: param, path }
          break
        }
        case 'RestElement': {
          yield* iteratePatternProperties(param.argument, path)
          break
        }
        case 'AssignmentPattern': {
          yield* iteratePatternProperties(param.left, path)
          break
        }
        case 'ObjectPattern': {
          for (const prop of param.properties) {
            if (prop.type === 'Property') {
              const name = getPropertyNameText(prop)
              yield* iteratePatternProperties(prop.value, [...path, name])
            } else if (prop.type === 'RestElement') {
              yield* iteratePatternProperties(prop.argument, path)
            }
          }
          break
        }
        case 'ArrayPattern': {
          for (let index = 0; index < param.elements.length; index++) {
            const element = param.elements[index]
            yield* iteratePatternProperties(element, [...path, `${index}`])
          }
          break
        }
      }
    }

    /**
     * @param {Identifier} prop
     * @param {string[]} path
     */
    function verifyPropVariable(prop, path) {
      const variable = findVariable(context.getScope(), prop)
      if (!variable) {
        return
      }

      for (const reference of variable.references) {
        if (!reference.isRead()) {
          continue
        }
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

    function* extractDefineVariableNames() {
      const globalScope = context.getSourceCode().scopeManager.globalScope
      if (globalScope) {
        for (const variable of globalScope.variables) {
          if (variable.defs.length > 0) {
            yield variable.name
          }
        }
        const moduleScope = globalScope.childScopes.find(
          (scope) => scope.type === 'module'
        )
        for (const variable of (moduleScope && moduleScope.variables) || []) {
          if (variable.defs.length > 0) {
            yield variable.name
          }
        }
      }
    }

    return utils.compositingVisitors(
      {},
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          const defineVariableNames = new Set(extractDefineVariableNames())

          const propsSet = new Set(
            props
              .map((p) => p.propName)
              .filter(
                /**
                 * @returns {propName is string}
                 */
                (propName) =>
                  utils.isDef(propName) &&
                  !GLOBALS_WHITE_LISTED.has(propName) &&
                  !defineVariableNames.has(propName)
              )
          )
          propsMap.set(node, propsSet)
          vueObjectData = {
            type: 'setup',
            object: node
          }

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
            return
          }

          for (const { node: prop, path } of iteratePatternProperties(
            target.parent.id,
            []
          )) {
            verifyPropVariable(prop, path)
            propsSet.add(prop.name)
          }
        }
      }),
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          propsMap.set(
            node,
            new Set(
              utils
                .getComponentPropsFromOptions(node)
                .map((p) => p.propName)
                .filter(utils.isDef)
            )
          )
        },
        onVueObjectExit(node, { type }) {
          if (
            (!vueObjectData ||
              (vueObjectData.type !== 'export' &&
                vueObjectData.type !== 'setup')) &&
            type !== 'instance'
          ) {
            vueObjectData = {
              type,
              object: node
            }
          }
        },
        onSetupFunctionEnter(node) {
          const propsParam = node.params[0]
          if (!propsParam) {
            // no arguments
            return
          }
          if (
            propsParam.type === 'RestElement' ||
            propsParam.type === 'ArrayPattern'
          ) {
            // cannot check
            return
          }
          for (const { node: prop, path } of iteratePatternProperties(
            propsParam,
            []
          )) {
            verifyPropVariable(prop, path)
          }
        },
        /** @param {(Identifier | ThisExpression) & { parent: MemberExpression } } node */
        'MemberExpression > :matches(Identifier, ThisExpression)'(
          node,
          { node: vueNode }
        ) {
          if (!utils.isThis(node, context)) {
            return
          }
          const mem = node.parent
          if (mem.object !== node) {
            return
          }
          const name = utils.getStaticPropertyName(mem)
          if (
            name &&
            /** @type {Set<string>} */ (propsMap.get(vueNode)).has(name)
          ) {
            verifyMutating(mem, name)
          }
        }
      }),
      utils.defineTemplateBodyVisitor(context, {
        /** @param {ThisExpression & { parent: MemberExpression } } node */
        'VExpressionContainer MemberExpression > ThisExpression'(node) {
          if (!vueObjectData) {
            return
          }
          const mem = node.parent
          if (mem.object !== node) {
            return
          }
          const name = utils.getStaticPropertyName(mem)
          if (
            name &&
            /** @type {Set<string>} */ (propsMap.get(vueObjectData.object)).has(
              name
            )
          ) {
            verifyMutating(mem, name)
          }
        },
        /** @param {Identifier } node */
        'VExpressionContainer Identifier'(node) {
          if (!vueObjectData) {
            return
          }
          if (!isVmReference(node)) {
            return
          }
          const name = node.name
          if (
            name &&
            /** @type {Set<string>} */ (propsMap.get(vueObjectData.object)).has(
              name
            )
          ) {
            verifyMutating(node, name)
          }
        },
        /** @param {ESNode} node */
        "VAttribute[directive=true]:matches([key.name.name='model'], [key.name.name='bind']) VExpressionContainer > *"(
          node
        ) {
          if (!vueObjectData) {
            return
          }
          let attr = node.parent
          while (attr && attr.type !== 'VAttribute') {
            attr = attr.parent
          }
          if (
            attr &&
            attr.directive &&
            attr.key.name.name === 'bind' &&
            !attr.key.modifiers.some((mod) => mod.name === 'sync')
          ) {
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
          if (
            name &&
            /** @type {Set<string>} */ (propsMap.get(vueObjectData.object)).has(
              name
            )
          ) {
            report(node, name)
          }
        }
      })
    )
  }
}
