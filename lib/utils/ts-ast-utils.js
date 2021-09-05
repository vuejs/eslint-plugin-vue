const { findVariable } = require('eslint-utils')
/**
 * @typedef {import('@typescript-eslint/types').TSESTree.TypeNode} TypeNode
 * @typedef {import('@typescript-eslint/types').TSESTree.TSInterfaceBody} TSInterfaceBody
 * @typedef {import('@typescript-eslint/types').TSESTree.TSTypeLiteral} TSTypeLiteral
 * @typedef {import('@typescript-eslint/types').TSESTree.Parameter} TSESTreeParameter
 *
 */
/**
 * @typedef {import('../../typings/eslint-plugin-vue/util-types/utils').ComponentTypeProp} ComponentTypeProp
 * @typedef {import('../../typings/eslint-plugin-vue/util-types/utils').ComponentTypeEmit} ComponentTypeEmit
 */

module.exports = {
  getComponentPropsFromTypeDefine,
  getComponentEmitsFromTypeDefine
}

/**
 * @param {TypeNode} node
 * @returns {node is TSTypeLiteral}
 */
function isTSTypeLiteral(node) {
  return node.type === 'TSTypeLiteral'
}
/**
 * @param {TypeNode} node
 * @returns {node is TSFunctionType}
 */
function isTSFunctionType(node) {
  return node.type === 'TSFunctionType'
}

/**
 * Get all props by looking at all component's properties
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} propsNode Type with props definition
 * @return {ComponentTypeProp[]} Array of component props
 */
function getComponentPropsFromTypeDefine(context, propsNode) {
  /** @type {TSInterfaceBody | TSTypeLiteral|null} */
  const defNode = resolveQualifiedType(context, propsNode, isTSTypeLiteral)
  if (!defNode) {
    return []
  }
  return [...extractRuntimeProps(context, defNode)]
}

/**
 * Get all emits by looking at all component's properties
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} emitsNode Type with emits definition
 * @return {ComponentTypeEmit[]} Array of component emits
 */
function getComponentEmitsFromTypeDefine(context, emitsNode) {
  /** @type {TSInterfaceBody | TSTypeLiteral | TSFunctionType | null} */
  const defNode = resolveQualifiedType(
    context,
    emitsNode,
    (n) => isTSTypeLiteral(n) || isTSFunctionType(n)
  )
  if (!defNode) {
    return []
  }
  return [...extractRuntimeEmits(defNode)]
}

/**
 * @see https://github.com/vuejs/vue-next/blob/253ca2729d808fc051215876aa4af986e4caa43c/packages/compiler-sfc/src/compileScript.ts#L1512
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TSTypeLiteral | TSInterfaceBody} node
 * @returns {IterableIterator<ComponentTypeProp>}
 */
function* extractRuntimeProps(context, node) {
  const members = node.type === 'TSTypeLiteral' ? node.members : node.body
  for (const m of members) {
    if (
      (m.type === 'TSPropertySignature' || m.type === 'TSMethodSignature') &&
      m.key.type === 'Identifier'
    ) {
      let type
      if (m.type === 'TSMethodSignature') {
        type = ['Function']
      } else if (m.typeAnnotation) {
        type = inferRuntimeType(context, m.typeAnnotation.typeAnnotation)
      }
      yield {
        type: 'type',
        key: /** @type {Identifier} */ (m.key),
        propName: m.key.name,
        value: null,
        node: /** @type {TSPropertySignature | TSMethodSignature} */ (m),

        required: !m.optional,
        types: type || [`null`]
      }
    }
  }
}

/**
 * @see https://github.com/vuejs/vue-next/blob/348c3b01e56383ffa70b180d1376fdf4ac12e274/packages/compiler-sfc/src/compileScript.ts#L1632
 * @param {TSTypeLiteral | TSInterfaceBody | TSFunctionType} node
 * @returns {IterableIterator<ComponentTypeEmit>}
 */
function* extractRuntimeEmits(node) {
  if (node.type === 'TSTypeLiteral' || node.type === 'TSInterfaceBody') {
    const members = node.type === 'TSTypeLiteral' ? node.members : node.body
    for (const t of members) {
      if (t.type === 'TSCallSignatureDeclaration') {
        yield* extractEventNames(
          t.params[0],
          /** @type {TSCallSignatureDeclaration} */ (t)
        )
      }
    }
    return
  } else {
    yield* extractEventNames(node.params[0], node)
  }

  /**
   * @param {TSESTreeParameter} eventName
   * @param {TSCallSignatureDeclaration | TSFunctionType} member
   * @returns {IterableIterator<ComponentTypeEmit>}
   */
  function* extractEventNames(eventName, member) {
    if (
      eventName &&
      eventName.type === 'Identifier' &&
      eventName.typeAnnotation &&
      eventName.typeAnnotation.type === 'TSTypeAnnotation'
    ) {
      const typeNode = eventName.typeAnnotation.typeAnnotation
      if (
        typeNode.type === 'TSLiteralType' &&
        typeNode.literal.type === 'Literal'
      ) {
        const emitName = String(typeNode.literal.value)
        yield {
          type: 'type',
          key: /** @type {TSLiteralType} */ (typeNode),
          emitName,
          value: null,
          node: member
        }
      } else if (typeNode.type === 'TSUnionType') {
        for (const t of typeNode.types) {
          if (t.type === 'TSLiteralType' && t.literal.type === 'Literal') {
            const emitName = String(t.literal.value)
            yield {
              type: 'type',
              key: /** @type {TSLiteralType} */ (t),
              emitName,
              value: null,
              node: member
            }
          }
        }
      }
    }
  }
}

/**
 * @see https://github.com/vuejs/vue-next/blob/253ca2729d808fc051215876aa4af986e4caa43c/packages/compiler-sfc/src/compileScript.ts#L425
 *
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} node
 * @param {(n: TypeNode)=> boolean } qualifier
 */
function resolveQualifiedType(context, node, qualifier) {
  if (qualifier(node)) {
    return node
  }
  if (node.type === 'TSTypeReference' && node.typeName.type === 'Identifier') {
    const refName = node.typeName.name
    const variable = findVariable(context.getScope(), refName)
    if (variable && variable.defs.length === 1) {
      const def = variable.defs[0]
      if (def.node.type === 'TSInterfaceDeclaration') {
        return /** @type {any} */ (def.node).body
      }
      if (def.node.type === 'TSTypeAliasDeclaration') {
        const typeAnnotation = /** @type {any} */ (def.node).typeAnnotation
        return qualifier(typeAnnotation) ? typeAnnotation : null
      }
    }
  }
}

/**
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} node
 * @param {Set<TypeNode>} [checked]
 * @returns {string[]}
 */
function inferRuntimeType(context, node, checked = new Set()) {
  switch (node.type) {
    case 'TSStringKeyword':
      return ['String']
    case 'TSNumberKeyword':
      return ['Number']
    case 'TSBooleanKeyword':
      return ['Boolean']
    case 'TSObjectKeyword':
      return ['Object']
    case 'TSTypeLiteral':
      return ['Object']
    case 'TSFunctionType':
      return ['Function']
    case 'TSArrayType':
    case 'TSTupleType':
      return ['Array']

    case 'TSLiteralType':
      switch (node.literal.type) {
        //@ts-ignore ?
        case 'StringLiteral':
          return ['String']
        //@ts-ignore ?
        case 'BooleanLiteral':
          return ['Boolean']
        //@ts-ignore ?
        case 'NumericLiteral':
        //@ts-ignore ?
        // eslint-disable-next-line no-fallthrough
        case 'BigIntLiteral':
          return ['Number']
        default:
          return [`null`]
      }

    case 'TSTypeReference':
      if (node.typeName.type === 'Identifier') {
        const variable = findVariable(context.getScope(), node.typeName.name)
        if (variable && variable.defs.length === 1) {
          const def = variable.defs[0]
          if (def.node.type === 'TSInterfaceDeclaration') {
            return [`Object`]
          }
          if (def.node.type === 'TSTypeAliasDeclaration') {
            const typeAnnotation = /** @type {any} */ (def.node).typeAnnotation
            if (!checked.has(typeAnnotation)) {
              checked.add(typeAnnotation)
              return inferRuntimeType(context, typeAnnotation, checked)
            }
          }
        }
        switch (node.typeName.name) {
          case 'Array':
          case 'Function':
          case 'Object':
          case 'Set':
          case 'Map':
          case 'WeakSet':
          case 'WeakMap':
          case 'Date':
            return [node.typeName.name]
          case 'Record':
          case 'Partial':
          case 'Readonly':
          case 'Pick':
          case 'Omit':
          case 'Exclude':
          case 'Extract':
          case 'Required':
          case 'InstanceType':
            return ['Object']
        }
      }
      return [`null`]

    case 'TSUnionType':
      const set = new Set()
      for (const t of node.types) {
        for (const tt of inferRuntimeType(context, t, checked)) {
          set.add(tt)
        }
      }
      return [...set]

    case 'TSIntersectionType':
      return ['Object']

    default:
      return [`null`] // no runtime check
  }
}
