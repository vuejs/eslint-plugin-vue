import type { TSESTree } from '@typescript-eslint/types'
import { findVariable } from '@eslint-community/eslint-utils'
import type {
  ComponentTypeProp,
  ComponentUnknownProp,
  ComponentTypeEmit,
  ComponentUnknownEmit,
  ComponentTypeSlot,
  ComponentUnknownSlot
} from '../index.ts'
import { getScope } from '../scope.ts'
import tsTypes from './ts-types.js'

const { inferRuntimeTypeFromTypeNode } = tsTypes

/**
 * All type node types. Typed as `Record<TypeNode['type'], true>` so that the
 * list stays exhaustive: adding or removing a member of `TypeNode['type']`
 * becomes a compile-time error here.
 */
const TYPE_NODE_TYPES: Record<TypeNode['type'], true> = {
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

export function isTypeNode(node: ASTNode): node is TypeNode {
  return TYPE_NODE_TYPES[node.type as TypeNode['type']] === true
}

export function isTSInterfaceBody(
  node: TSESTree.TypeNode | TSESTree.TSInterfaceBody
): node is TSESTree.TSInterfaceBody {
  return node.type === 'TSInterfaceBody'
}

export function isTSTypeLiteral(
  node: TSESTree.TypeNode
): node is TSESTree.TSTypeLiteral {
  return node.type === 'TSTypeLiteral'
}

function isTSFunctionType(
  node: TSESTree.TypeNode
): node is TSESTree.TSFunctionType {
  return node.type === 'TSFunctionType'
}

export function isTSTypeLiteralOrTSFunctionType(
  node: TSESTree.TypeNode
): node is TSESTree.TSTypeLiteral | TSESTree.TSFunctionType {
  return isTSTypeLiteral(node) || isTSFunctionType(node)
}

/**
 * @see https://github.com/vuejs/vue-next/blob/253ca2729d808fc051215876aa4af986e4caa43c/packages/compiler-sfc/src/compileScript.ts#L1512
 */
export function* extractRuntimeProps(
  context: RuleContext,
  node: TSESTree.TSTypeLiteral | TSESTree.TSInterfaceBody
): IterableIterator<ComponentTypeProp | ComponentUnknownProp> {
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
        node: member.key as Expression
      }
      continue
    }
    let types: string[] | undefined
    if (member.type === 'TSMethodSignature') {
      types = ['Function']
    } else if (member.typeAnnotation) {
      types = inferRuntimeType(context, member.typeAnnotation.typeAnnotation)
    }
    yield {
      type: 'type',
      key: member.key as Identifier | Literal,
      propName:
        member.key.type === 'Identifier'
          ? member.key.name
          : String(member.key.value),
      node: member as TSPropertySignature | TSMethodSignature,

      required: !member.optional,
      types: types || [`null`]
    }
  }
}

export function* extractRuntimeEmits(
  node:
    TSESTree.TSTypeLiteral | TSESTree.TSInterfaceBody | TSESTree.TSFunctionType
): IterableIterator<ComponentTypeEmit | ComponentUnknownEmit> {
  if (node.type === 'TSFunctionType') {
    yield* extractEventNames(node.params[0], node as TSFunctionType)
    return
  }
  const members = node.type === 'TSTypeLiteral' ? node.members : node.body
  for (const member of members) {
    if (member.type === 'TSCallSignatureDeclaration') {
      yield* extractEventNames(
        member.params[0],
        member as TSCallSignatureDeclaration
      )
    } else if (
      member.type === 'TSPropertySignature' ||
      member.type === 'TSMethodSignature'
    ) {
      if (member.key.type !== 'Identifier' && member.key.type !== 'Literal') {
        yield {
          type: 'unknown',
          emitName: null,
          node: member.key as Expression
        }
        continue
      }
      yield {
        type: 'type',
        key: member.key as Identifier | Literal,
        emitName:
          member.key.type === 'Identifier'
            ? member.key.name
            : String(member.key.value),
        node: member as TSPropertySignature | TSMethodSignature
      }
    }
  }
}

export function* extractRuntimeSlots(
  node: TSESTree.TSTypeLiteral | TSESTree.TSInterfaceBody
): IterableIterator<ComponentTypeSlot | ComponentUnknownSlot> {
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
        node: member.key as Expression
      }
      continue
    }
    yield {
      type: 'type',
      key: member.key as Identifier | Literal,
      slotName:
        member.key.type === 'Identifier'
          ? member.key.name
          : String(member.key.value),
      node: member as TSPropertySignature | TSMethodSignature
    }
  }
}

function* extractEventNames(
  eventName: TSESTree.Parameter,
  member: TSCallSignatureDeclaration | TSFunctionType
): IterableIterator<ComponentTypeEmit> {
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
      key: typeNode as TSLiteralType,
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
        key: t as TSLiteralType,
        emitName,
        node: member
      }
    }
  }
}

export function flattenTypeNodes(
  context: RuleContext,
  node: TSESTree.TypeNode
): (TSESTree.TypeNode | TSESTree.TSInterfaceBody)[] {
  interface TraversedData {
    nodes: Set<TSESTree.TypeNode | TSESTree.TSInterfaceBody>
    finished: boolean
  }
  const traversed: Map<TSESTree.TypeNode, TraversedData> = new Map()

  return [...flattenImpl(node)]

  function* flattenImpl(
    node: TSESTree.TypeNode
  ): Iterable<TSESTree.TypeNode | TSESTree.TSInterfaceBody> {
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
      const variable = findVariable(getScope(context, node as any), refName)
      if (variable && variable.defs.length === 1) {
        const defNode = variable.defs[0].node as TSESTree.Node
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

export function inferRuntimeType(
  context: RuleContext,
  node: TSESTree.TypeNode,
  checked: Set<TSESTree.TypeNode> = new Set()
): string[] {
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
      return inferRuntimeTypeFromTypeNode(context, node as TypeNode)
    }
    case 'TSTypeReference': {
      if (node.typeName.type === 'Identifier') {
        const variable = findVariable(
          getScope(context, node as any),
          node.typeName.name
        )
        if (variable && variable.defs.length === 1) {
          const defNode = variable.defs[0].node as TSESTree.Node
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
                : // typescript-eslint v5
                  (node as any).typeParameters
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
                : // typescript-eslint v5
                  (node as any).typeParameters
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
                : // typescript-eslint v5
                  (node as any).typeParameters
            if (typeArguments && typeArguments.params[0]) {
              return inferRuntimeType(context, typeArguments.params[0], checked)
            }
            break
          }
        }
      }
      return inferRuntimeTypeFromTypeNode(context, node as TypeNode)
    }

    case 'TSUnionType':
    case 'TSIntersectionType': {
      return inferUnionType(node)
    }

    default: {
      return inferRuntimeTypeFromTypeNode(context, node as TypeNode)
    }
  }

  function inferUnionType(
    node: TSESTree.TSUnionType | TSESTree.TSIntersectionType
  ): string[] {
    const types = new Set<string>()
    for (const t of node.types) {
      for (const tt of inferRuntimeType(context, t, checked)) {
        types.add(tt)
      }
    }
    return [...types]
  }
}

function inferTypeLiteralType(node: TSESTree.TSTypeLiteral): string[] {
  const types = new Set<string>()
  for (const m of node.members) {
    types.add(
      m.type === 'TSCallSignatureDeclaration' ||
        m.type === 'TSConstructSignatureDeclaration'
        ? 'Function'
        : 'Object'
    )
  }
  return types.size > 0 ? [...types] : ['Object']
}

function inferLiteralValueType(
  value: TSESTree.Literal['value']
): string | null {
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

function inferEnumType(
  context: RuleContext,
  node: TSESTree.TSEnumDeclaration
): string[] {
  const types = new Set<string>()
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
          m.initializer as Expression
        )) {
          types.add(type)
        }
      }
    }
  }
  return types.size > 0 ? [...types] : ['Number']
}
