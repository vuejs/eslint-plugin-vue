const { getScope } = require('../scope')
const { findVariable } = require('@eslint-community/eslint-utils')
const { inferRuntimeTypeFromTypeNode } = require('./ts-types')
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
 * @typedef {import('../index').ComponentTypeProp} ComponentTypeProp
 * @typedef {import('../index').ComponentUnknownProp} ComponentUnknownProp
 * @typedef {import('../index').ComponentTypeEmit} ComponentTypeEmit
 * @typedef {import('../index').ComponentUnknownEmit} ComponentUnknownEmit
 * @typedef {import('../index').ComponentTypeSlot} ComponentTypeSlot
 * @typedef {import('../index').ComponentUnknownSlot} ComponentUnknownSlot
 */

/**
 * All type node types. Typed as `Record<TypeNode['type'], true>` so that the
 * list stays exhaustive: adding or removing a member of `TypeNode['type']`
 * becomes a compile-time error here.
 * @type {Record<TypeNode['type'], true>}
 */
const TYPE_NODE_TYPES = {
  TSAbstractKeyword: true,
  TSAnyKeyword: true,
  TSAsyncKeyword: true,
  TSArrayType: true,
  TSBigIntKeyword: true,
  TSBooleanKeyword: true,
  TSConditionalType: true,
  TSConstructorType: true,
  TSDeclareKeyword: true,
  TSExportKeyword: true,
  TSFunctionType: true,
  TSImportType: true,
  TSIndexedAccessType: true,
  TSInferType: true,
  TSIntersectionType: true,
  TSIntrinsicKeyword: true,
  TSLiteralType: true,
  TSMappedType: true,
  TSNamedTupleMember: true,
  TSNeverKeyword: true,
  TSNullKeyword: true,
  TSNumberKeyword: true,
  TSObjectKeyword: true,
  TSOptionalType: true,
  TSQualifiedName: true,
  TSPrivateKeyword: true,
  TSProtectedKeyword: true,
  TSPublicKeyword: true,
  TSReadonlyKeyword: true,
  TSRestType: true,
  TSStaticKeyword: true,
  TSStringKeyword: true,
  TSSymbolKeyword: true,
  TSTemplateLiteralType: true,
  TSThisType: true,
  TSTupleType: true,
  TSTypeLiteral: true,
  TSTypeOperator: true,
  TSTypePredicate: true,
  TSTypeQuery: true,
  TSTypeReference: true,
  TSUndefinedKeyword: true,
  TSUnionType: true,
  TSUnknownKeyword: true,
  TSVoidKeyword: true
}

module.exports = {
  isTypeNode,
  flattenTypeNodes,
  isTSInterfaceBody,
  isTSTypeLiteral,
  isTSTypeLiteralOrTSFunctionType,
  extractRuntimeProps,
  extractRuntimeEmits,
  extractRuntimeSlots,
  inferRuntimeType
}

/**
 * @param {ASTNode} node
 * @returns {node is TypeNode}
 */
function isTypeNode(node) {
  return TYPE_NODE_TYPES[/** @type {TypeNode['type']} */ (node.type)] === true
}

/**
 * @param {TSESTreeTypeNode|TSESTreeTSInterfaceBody} node
 * @returns {node is TSESTreeTSInterfaceBody}
 */
function isTSInterfaceBody(node) {
  return node.type === 'TSInterfaceBody'
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
 * @returns {IterableIterator<ComponentTypeProp | ComponentUnknownProp>}
 */
function* extractRuntimeProps(context, node) {
  const members = node.type === 'TSTypeLiteral' ? node.members : node.body
  for (const member of members) {
    if (
      member.type !== 'TSPropertySignature' &&
      member.type !== 'TSMethodSignature'
    ) {
      continue
    }

    if (member.key.type !== 'Identifier' && member.key.type !== 'Literal') {
      yield {
        type: 'unknown',
        propName: null,
        node: /** @type {Expression} */ (member.key)
      }
      continue
    }
    /** @type {string[]|undefined} */
    let types
    if (member.type === 'TSMethodSignature') {
      types = ['Function']
    } else if (member.typeAnnotation) {
      types = inferRuntimeType(context, member.typeAnnotation.typeAnnotation)
    }
    yield {
      type: 'type',
      key: /** @type {Identifier | Literal} */ (member.key),
      propName:
        member.key.type === 'Identifier'
          ? member.key.name
          : String(member.key.value),
      node: /** @type {TSPropertySignature | TSMethodSignature} */ (member),

      required: !member.optional,
      types: types || [`null`]
    }
  }
}

/**
 * @param {TSESTreeTSTypeLiteral | TSESTreeTSInterfaceBody | TSESTreeTSFunctionType} node
 * @returns {IterableIterator<ComponentTypeEmit | ComponentUnknownEmit>}
 */
function* extractRuntimeEmits(node) {
  if (node.type === 'TSFunctionType') {
    yield* extractEventNames(
      node.params[0],
      /** @type {TSFunctionType} */ (node)
    )
    return
  }
  const members = node.type === 'TSTypeLiteral' ? node.members : node.body
  for (const member of members) {
    if (member.type === 'TSCallSignatureDeclaration') {
      yield* extractEventNames(
        member.params[0],
        /** @type {TSCallSignatureDeclaration} */ (member)
      )
    } else if (
      member.type === 'TSPropertySignature' ||
      member.type === 'TSMethodSignature'
    ) {
      if (member.key.type !== 'Identifier' && member.key.type !== 'Literal') {
        yield {
          type: 'unknown',
          emitName: null,
          node: /** @type {Expression} */ (member.key)
        }
        continue
      }
      yield {
        type: 'type',
        key: /** @type {Identifier | Literal} */ (member.key),
        emitName:
          member.key.type === 'Identifier'
            ? member.key.name
            : String(member.key.value),
        node: /** @type {TSPropertySignature | TSMethodSignature} */ (member)
      }
    }
  }
}

/**
 * @param {TSESTreeTSTypeLiteral | TSESTreeTSInterfaceBody} node
 * @returns {IterableIterator<ComponentTypeSlot | ComponentUnknownSlot>}
 */
function* extractRuntimeSlots(node) {
  const members = node.type === 'TSTypeLiteral' ? node.members : node.body
  for (const member of members) {
    if (
      member.type !== 'TSPropertySignature' &&
      member.type !== 'TSMethodSignature'
    ) {
      continue
    }

    if (member.key.type !== 'Identifier' && member.key.type !== 'Literal') {
      yield {
        type: 'unknown',
        slotName: null,
        node: /** @type {Expression} */ (member.key)
      }
      continue
    }
    yield {
      type: 'type',
      key: /** @type {Identifier | Literal} */ (member.key),
      slotName:
        member.key.type === 'Identifier'
          ? member.key.name
          : String(member.key.value),
      node: /** @type {TSPropertySignature | TSMethodSignature} */ (member)
    }
  }
}

/**
 * @param {TSESTreeParameter} eventName
 * @param {TSCallSignatureDeclaration | TSFunctionType} member
 * @returns {IterableIterator<ComponentTypeEmit>}
 */
function* extractEventNames(eventName, member) {
  if (
    !eventName ||
    eventName.type !== 'Identifier' ||
    !eventName.typeAnnotation ||
    eventName.typeAnnotation.type !== 'TSTypeAnnotation'
  ) {
    return
  }

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
      if (t.type !== 'TSLiteralType' || t.literal.type !== 'Literal') {
        continue
      }

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

/**
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TSESTreeTypeNode} node
 * @returns {(TSESTreeTypeNode|TSESTreeTSInterfaceBody)[]}
 */
function flattenTypeNodes(context, node) {
  /**
   * @typedef {object} TraversedData
   * @property {Set<TSESTreeTypeNode|TSESTreeTSInterfaceBody>} nodes
   * @property {boolean} finished
   */
  /** @type {Map<TSESTreeTypeNode,TraversedData>} */
  const traversed = new Map()

  return [...flattenImpl(node)]
  /**
   * @param {TSESTreeTypeNode} node
   * @returns {Iterable<TSESTreeTypeNode|TSESTreeTSInterfaceBody>}
   */
  function* flattenImpl(node) {
    if (node.type === 'TSUnionType' || node.type === 'TSIntersectionType') {
      for (const typeNode of node.types) {
        yield* flattenImpl(typeNode)
      }
      return
    }
    if (
      node.type === 'TSTypeReference' &&
      node.typeName.type === 'Identifier'
    ) {
      const refName = node.typeName.name
      const variable = findVariable(
        getScope(context, /** @type {any} */ (node)),
        refName
      )
      if (variable && variable.defs.length === 1) {
        const defNode = /** @type {TSESTreeNode} */ (variable.defs[0].node)
        if (defNode.type === 'TSInterfaceDeclaration') {
          yield defNode.body
          return
        }
        if (defNode.type === 'TSTypeAliasDeclaration') {
          const typeAnnotation = defNode.typeAnnotation
          let traversedData = traversed.get(typeAnnotation)
          if (traversedData) {
            const copy = [...traversedData.nodes]
            yield* copy
            if (!traversedData.finished) {
              // Include the node because it will probably be referenced recursively.
              yield typeAnnotation
            }
            return
          }
          traversedData = { nodes: new Set(), finished: false }
          traversed.set(typeAnnotation, traversedData)
          for (const e of flattenImpl(typeAnnotation)) {
            traversedData.nodes.add(e)
          }
          traversedData.finished = true
          yield* traversedData.nodes
          return
        }
      }
    }
    yield node
  }
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
    case 'TSTemplateLiteralType': {
      return ['String']
    }
    case 'TSNumberKeyword': {
      return ['Number']
    }
    case 'TSBooleanKeyword': {
      return ['Boolean']
    }
    case 'TSObjectKeyword': {
      return ['Object']
    }
    case 'TSTypeLiteral': {
      return inferTypeLiteralType(node)
    }
    case 'TSFunctionType': {
      return ['Function']
    }
    case 'TSArrayType':
    case 'TSTupleType': {
      return ['Array']
    }
    case 'TSSymbolKeyword': {
      return ['Symbol']
    }

    case 'TSLiteralType': {
      if (node.literal.type === 'Literal') {
        switch (typeof node.literal.value) {
          case 'boolean': {
            return ['Boolean']
          }
          case 'string': {
            return ['String']
          }
          case 'number':
          case 'bigint': {
            return ['Number']
          }
        }
      }
      return inferRuntimeTypeFromTypeNode(
        context,
        /** @type {TypeNode} */ (node)
      )
    }
    case 'TSTypeReference': {
      if (node.typeName.type === 'Identifier') {
        const variable = findVariable(
          getScope(context, /** @type {any} */ (node)),
          node.typeName.name
        )
        if (variable && variable.defs.length === 1) {
          const defNode = /** @type {TSESTreeNode} */ (variable.defs[0].node)
          if (defNode.type === 'TSInterfaceDeclaration') {
            return [`Object`]
          }
          if (defNode.type === 'TSTypeAliasDeclaration') {
            const typeAnnotation = defNode.typeAnnotation
            if (!checked.has(typeAnnotation)) {
              checked.add(typeAnnotation)
              return inferRuntimeType(context, typeAnnotation, checked)
            }
          } else if (defNode.type === 'TSEnumDeclaration') {
            return inferEnumType(context, defNode)
          }
        }
        for (const name of [
          node.typeName.name,
          ...(node.typeName.name.startsWith('Readonly')
            ? [node.typeName.name.slice(8)]
            : [])
        ]) {
          switch (name) {
            case 'Array':
            case 'Function':
            case 'Object':
            case 'Set':
            case 'Map':
            case 'WeakSet':
            case 'WeakMap':
            case 'Date': {
              return [name]
            }
          }
        }

        switch (node.typeName.name) {
          case 'Record':
          case 'Partial':
          case 'Readonly':
          case 'Pick':
          case 'Omit':
          case 'Required':
          case 'InstanceType': {
            return ['Object']
          }
          case 'Uppercase':
          case 'Lowercase':
          case 'Capitalize':
          case 'Uncapitalize': {
            return ['String']
          }
          case 'Parameters':
          case 'ConstructorParameters': {
            return ['Array']
          }
          case 'NonNullable': {
            const typeArguments =
              'typeArguments' in node
                ? node.typeArguments
                : /** @type {any} typescript-eslint v5 */ (node).typeParameters
            if (typeArguments && typeArguments.params[0]) {
              return inferRuntimeType(
                context,
                typeArguments.params[0],
                checked
              ).filter((t) => t !== 'null')
            }
            break
          }
          case 'Extract': {
            const typeArguments =
              'typeArguments' in node
                ? node.typeArguments
                : /** @type {any} typescript-eslint v5 */ (node).typeParameters
            if (typeArguments && typeArguments.params[1]) {
              return inferRuntimeType(context, typeArguments.params[1], checked)
            }
            break
          }
          case 'Exclude':
          case 'OmitThisParameter': {
            const typeArguments =
              'typeArguments' in node
                ? node.typeArguments
                : /** @type {any} typescript-eslint v5 */ (node).typeParameters
            if (typeArguments && typeArguments.params[0]) {
              return inferRuntimeType(context, typeArguments.params[0], checked)
            }
            break
          }
        }
      }
      return inferRuntimeTypeFromTypeNode(
        context,
        /** @type {TypeNode} */ (node)
      )
    }

    case 'TSUnionType':
    case 'TSIntersectionType': {
      return inferUnionType(node)
    }

    default: {
      return inferRuntimeTypeFromTypeNode(
        context,
        /** @type {TypeNode} */ (node)
      )
    }
  }

  /**
   * @param {import('@typescript-eslint/types').TSESTree.TSUnionType|import('@typescript-eslint/types').TSESTree.TSIntersectionType} node
   * @returns {string[]}
   */
  function inferUnionType(node) {
    const types = new Set()
    for (const t of node.types) {
      for (const tt of inferRuntimeType(context, t, checked)) {
        types.add(tt)
      }
    }
    return [...types]
  }
}

/**
 * @param {import('@typescript-eslint/types').TSESTree.TSTypeLiteral} node
 * @returns {string[]}
 */
function inferTypeLiteralType(node) {
  const types = new Set()
  for (const m of node.members) {
    if (
      m.type === 'TSCallSignatureDeclaration' ||
      m.type === 'TSConstructSignatureDeclaration'
    ) {
      types.add('Function')
    } else {
      types.add('Object')
    }
  }
  return types.size > 0 ? [...types] : ['Object']
}
/**
 * @param {import('@typescript-eslint/types').TSESTree.Literal['value']} value
 * @returns {string | null}
 */
function inferLiteralValueType(value) {
  switch (typeof value) {
    case 'string': {
      return 'String'
    }
    case 'number':
    case 'bigint': {
      // Now it's a syntax error.
      return 'Number'
    }
    case 'boolean': {
      // Now it's a syntax error.
      return 'Boolean'
    }
    default: {
      return null
    }
  }
}

/**
 * @param {RuleContext} context The ESLint rule context object.
 * @param {import('@typescript-eslint/types').TSESTree.TSEnumDeclaration} node
 * @returns {string[]}
 */
function inferEnumType(context, node) {
  const types = new Set()
  for (const m of node.members) {
    if (m.initializer) {
      if (m.initializer.type === 'Literal') {
        const type = inferLiteralValueType(m.initializer.value)
        if (type) {
          types.add(type)
        }
      } else {
        for (const type of inferRuntimeTypeFromTypeNode(
          context,
          /** @type {Expression} */ (m.initializer)
        )) {
          types.add(type)
        }
      }
    }
  }
  return types.size > 0 ? [...types] : ['Number']
}
