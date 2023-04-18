const { findVariable } = require('@eslint-community/eslint-utils')
/**
 * @typedef {import('@typescript-eslint/types').TSESTree.TypeNode} TSESTreeTypeNode
 * @typedef {import('@typescript-eslint/types').TSESTree.TSInterfaceBody} TSESTreeTSInterfaceBody
 * @typedef {import('@typescript-eslint/types').TSESTree.TSTypeLiteral} TSESTreeTSTypeLiteral
 * @typedef {import('@typescript-eslint/types').TSESTree.TSFunctionType} TSESTreeTSFunctionType
 * @typedef {import('@typescript-eslint/types').TSESTree.Parameter} TSESTreeParameter
 * @typedef {import('@typescript-eslint/types').TSESTree.Node} TSESTreeNode
 *
 */
/**
 * @typedef {import('../../../typings/eslint-plugin-vue/util-types/utils').ComponentTypeProp} ComponentTypeProp
 * @typedef {import('../../../typings/eslint-plugin-vue/util-types/utils').ComponentTypeEmit} ComponentTypeEmit
 */

module.exports = {
  isTypeNode,
  resolveQualifiedType,
  isTSTypeLiteral,
  isTSTypeLiteralOrTSFunctionType,
  extractRuntimeProps,
  extractRuntimeEmits
}

/**
 * @param {TSESTreeNode | ASTNode} node
 * @returns {node is TSESTreeTypeNode}
 */
function isTypeNode(node) {
  return (
    node.type === 'TSAnyKeyword' ||
    node.type === 'TSArrayType' ||
    node.type === 'TSBigIntKeyword' ||
    node.type === 'TSBooleanKeyword' ||
    node.type === 'TSConditionalType' ||
    node.type === 'TSConstructorType' ||
    node.type === 'TSFunctionType' ||
    node.type === 'TSImportType' ||
    node.type === 'TSIndexedAccessType' ||
    node.type === 'TSInferType' ||
    node.type === 'TSIntersectionType' ||
    node.type === 'TSIntrinsicKeyword' ||
    node.type === 'TSLiteralType' ||
    node.type === 'TSMappedType' ||
    node.type === 'TSNamedTupleMember' ||
    node.type === 'TSNeverKeyword' ||
    node.type === 'TSNullKeyword' ||
    node.type === 'TSNumberKeyword' ||
    node.type === 'TSObjectKeyword' ||
    node.type === 'TSOptionalType' ||
    node.type === 'TSRestType' ||
    node.type === 'TSStringKeyword' ||
    node.type === 'TSSymbolKeyword' ||
    node.type === 'TSTemplateLiteralType' ||
    node.type === 'TSThisType' ||
    node.type === 'TSTupleType' ||
    node.type === 'TSTypeLiteral' ||
    node.type === 'TSTypeOperator' ||
    node.type === 'TSTypePredicate' ||
    node.type === 'TSTypeQuery' ||
    node.type === 'TSTypeReference' ||
    node.type === 'TSUndefinedKeyword' ||
    node.type === 'TSUnionType' ||
    node.type === 'TSUnknownKeyword' ||
    node.type === 'TSVoidKeyword'
  )
}

/**
 * @param {TSESTreeTypeNode} node
 * @returns {node is TSESTreeTSTypeLiteral}
 */
function isTSTypeLiteral(node) {
  return node.type === 'TSTypeLiteral'
}
/**
 * @param {TSESTreeTypeNode} node
 * @returns {node is TSESTreeTSFunctionType}
 */
function isTSFunctionType(node) {
  return node.type === 'TSFunctionType'
}
/**
 * @param {TSESTreeTypeNode} node
 * @returns {node is TSESTreeTSTypeLiteral | TSESTreeTSFunctionType}
 */
function isTSTypeLiteralOrTSFunctionType(node) {
  return isTSTypeLiteral(node) || isTSFunctionType(node)
}

/**
 * @see https://github.com/vuejs/vue-next/blob/253ca2729d808fc051215876aa4af986e4caa43c/packages/compiler-sfc/src/compileScript.ts#L1512
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TSESTreeTSTypeLiteral | TSESTreeTSInterfaceBody} node
 * @returns {IterableIterator<ComponentTypeProp>}
 */
function* extractRuntimeProps(context, node) {
  const members = node.type === 'TSTypeLiteral' ? node.members : node.body
  for (const m of members) {
    if (
      (m.type === 'TSPropertySignature' || m.type === 'TSMethodSignature') &&
      (m.key.type === 'Identifier' || m.key.type === 'Literal')
    ) {
      let type
      if (m.type === 'TSMethodSignature') {
        type = ['Function']
      } else if (m.typeAnnotation) {
        type = inferRuntimeType(context, m.typeAnnotation.typeAnnotation)
      }
      yield {
        type: 'type',
        key: /** @type {Identifier | Literal} */ (m.key),
        propName: m.key.type === 'Identifier' ? m.key.name : `${m.key.value}`,
        node: /** @type {TSPropertySignature | TSMethodSignature} */ (m),

        required: !m.optional,
        types: type || [`null`]
      }
    }
  }
}

/**
 * @see https://github.com/vuejs/vue-next/blob/348c3b01e56383ffa70b180d1376fdf4ac12e274/packages/compiler-sfc/src/compileScript.ts#L1632
 * @param {TSESTreeTSTypeLiteral | TSESTreeTSInterfaceBody | TSESTreeTSFunctionType} node
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
    yield* extractEventNames(
      node.params[0],
      /** @type {TSFunctionType} */ (node)
    )
  }
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
            node: member
          }
        }
      }
    }
  }
}

/**
 * @see https://github.com/vuejs/vue-next/blob/253ca2729d808fc051215876aa4af986e4caa43c/packages/compiler-sfc/src/compileScript.ts#L425
 *
 * @template {TSESTreeTypeNode} R
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TSESTreeTypeNode} node
 * @param {(n: TSESTreeTypeNode)=> n is R } qualifier
 * @returns {R | TSESTreeTSInterfaceBody | null}
 */
function resolveQualifiedType(context, node, qualifier) {
  if (qualifier(node)) {
    return node
  }
  if (node.type === 'TSTypeReference' && node.typeName.type === 'Identifier') {
    const refName = node.typeName.name
    const variable = findVariable(context.getScope(), refName)
    if (variable && variable.defs.length === 1) {
      const defNode = /** @type {TSESTreeNode} */ (variable.defs[0].node)
      if (defNode.type === 'TSInterfaceDeclaration') {
        return defNode.body
      }
      if (defNode.type === 'TSTypeAliasDeclaration') {
        const typeAnnotation = defNode.typeAnnotation
        return qualifier(typeAnnotation) ? typeAnnotation : null
      }
    }
  }
  return null
}

/**
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TSESTreeTypeNode} node
 * @param {Set<TSESTreeTypeNode>} [checked]
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
      if (node.literal.type === 'Literal') {
        switch (typeof node.literal.value) {
          case 'boolean':
            return ['Boolean']
          case 'string':
            return ['String']
          case 'number':
          case 'bigint':
            return ['Number']
        }
        if (node.literal.value instanceof RegExp) {
          return ['RegExp']
        }
      }
      return [`null`]
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
