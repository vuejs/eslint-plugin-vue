import type { TSESTree } from '@typescript-eslint/types'
import type { Type, TypeChecker, Node as TypeScriptNode } from 'typescript'
import type {
  ComponentInferTypeProp,
  ComponentUnknownProp,
  ComponentInferTypeEmit,
  ComponentUnknownEmit,
  ComponentInferTypeSlot,
  ComponentUnknownSlot
} from '../index.js'
import {
  getTypeScript,
  isAny,
  isUnknown,
  isNever,
  isNull,
  isObject,
  isFunction,
  isStringLike,
  isNumberLike,
  isBooleanLike,
  isBigIntLike,
  isArrayLikeObject,
  isReferenceObject
} from './typescript.ts'

type TSESTreeNode = TSESTree.Node

interface Services {
  ts: typeof import('typescript')
  tsNodeMap: Map<ESNode | TSNode | TSESTreeNode, TypeScriptNode>
  checker: TypeChecker
}

function getTSParserServices(context: RuleContext): Services | null {
  const sourceCode = context.sourceCode
  const tsNodeMap = sourceCode.parserServices.esTreeNodeToTSNodeMap
  if (!tsNodeMap) return null
  const hasFullTypeInformation =
    sourceCode.parserServices.hasFullTypeInformation !== false
  const checker =
    (hasFullTypeInformation &&
      sourceCode.parserServices.program &&
      sourceCode.parserServices.program.getTypeChecker()) ||
    null
  if (!checker) return null
  const ts = getTypeScript()
  if (!ts) return null

  return {
    ts,
    tsNodeMap,
    checker
  }
}

export function getComponentPropsFromTypeDefineTypes(
  context: RuleContext,
  propsNode: TypeNode
): (ComponentInferTypeProp | ComponentUnknownProp)[] {
  const services = getTSParserServices(context)
  const tsNode = services && services.tsNodeMap.get(propsNode)
  const type = tsNode && services.checker.getTypeAtLocation(tsNode)
  if (
    !type ||
    isAny(type) ||
    isUnknown(type) ||
    isNever(type) ||
    isNull(type)
  ) {
    return [
      {
        type: 'unknown',
        propName: null,
        node: propsNode
      }
    ]
  }
  return [...extractRuntimeProps(type, tsNode, propsNode, services)]
}

export function getComponentEmitsFromTypeDefineTypes(
  context: RuleContext,
  emitsNode: TypeNode
): (ComponentInferTypeEmit | ComponentUnknownEmit)[] {
  const services = getTSParserServices(context)
  const tsNode = services && services.tsNodeMap.get(emitsNode)
  const type = tsNode && services.checker.getTypeAtLocation(tsNode)
  if (
    !type ||
    isAny(type) ||
    isUnknown(type) ||
    isNever(type) ||
    isNull(type)
  ) {
    return [
      {
        type: 'unknown',
        emitName: null,
        node: emitsNode
      }
    ]
  }
  return [...extractRuntimeEmits(type, tsNode, emitsNode, services)]
}

export function getComponentSlotsFromTypeDefineTypes(
  context: RuleContext,
  slotsNode: TypeNode
): (ComponentInferTypeSlot | ComponentUnknownSlot)[] {
  const services = getTSParserServices(context)
  const tsNode = services && services.tsNodeMap.get(slotsNode)
  const type = tsNode && services.checker.getTypeAtLocation(tsNode)
  if (
    !type ||
    isAny(type) ||
    isUnknown(type) ||
    isNever(type) ||
    isNull(type)
  ) {
    return [
      {
        type: 'unknown',
        slotName: null,
        node: slotsNode
      }
    ]
  }
  return [...extractRuntimeSlots(type, slotsNode)]
}

export function inferRuntimeTypeFromTypeNode(
  context: RuleContext,
  node: TypeNode | Expression
): string[] {
  const services = getTSParserServices(context)
  const tsNode = services && services.tsNodeMap.get(node)
  const type = tsNode && services.checker.getTypeAtLocation(tsNode)
  if (!type) {
    return ['null']
  }
  return inferRuntimeTypeInternal(type, services)
}

function* extractRuntimeProps(
  type: Type,
  tsNode: TypeScriptNode,
  propsNode: TypeNode,
  services: Services
): IterableIterator<ComponentInferTypeProp> {
  const { ts, checker } = services
  for (const property of type.getProperties()) {
    const isOptional = (property.flags & ts.SymbolFlags.Optional) !== 0
    const name = property.getName()

    const type = checker.getTypeOfSymbolAtLocation(property, tsNode)

    yield {
      type: 'infer-type',
      propName: name,
      required: !isOptional,
      node: propsNode,
      types: inferRuntimeTypeInternal(type, services)
    }
  }
}

function inferRuntimeTypeInternal(type: Type, services: Services): string[] {
  const { checker } = services
  const types = new Set<string>()

  // handle generic parameter types
  if (type.isTypeParameter()) {
    const constraint = type.getConstraint()
    if (constraint) {
      for (const t of inferRuntimeTypeInternal(constraint, services)) {
        types.add(t)
      }
    }
    return [...types]
  }

  for (const targetType of iterateTypes(checker.getNonNullableType(type))) {
    if (
      isAny(targetType) ||
      isUnknown(targetType) ||
      isNever(targetType) ||
      isNull(targetType)
    ) {
      types.add('null')
    } else if (isStringLike(targetType)) {
      types.add('String')
    } else if (isNumberLike(targetType) || isBigIntLike(targetType)) {
      types.add('Number')
    } else if (isBooleanLike(targetType)) {
      types.add('Boolean')
    } else if (isFunction(targetType)) {
      types.add('Function')
    } else if (
      isArrayLikeObject(targetType) ||
      (targetType.isClassOrInterface() &&
        ['Array', 'ReadonlyArray'].includes(
          checker.getFullyQualifiedName(targetType.symbol)
        ))
    ) {
      types.add('Array')
    } else if (isObject(targetType)) {
      types.add('Object')
    }
  }

  if (types.size <= 0) types.add('null')

  return [...types]
}

function* extractRuntimeEmits(
  type: Type,
  tsNode: TypeScriptNode,
  emitsNode: TypeNode,
  services: Services
): IterableIterator<ComponentInferTypeEmit | ComponentUnknownEmit> {
  const { checker } = services
  if (isFunction(type)) {
    for (const signature of type.getCallSignatures()) {
      const param = signature.getParameters()[0]
      if (!param) {
        yield {
          type: 'unknown',
          emitName: null,
          node: emitsNode
        }
        continue
      }
      const type = checker.getTypeOfSymbolAtLocation(param, tsNode)

      for (const targetType of iterateTypes(type)) {
        yield targetType.isStringLiteral()
          ? {
              type: 'infer-type',
              emitName: targetType.value,
              node: emitsNode
            }
          : {
              type: 'unknown',
              emitName: null,
              node: emitsNode
            }
      }
    }
  } else if (isObject(type)) {
    for (const property of type.getProperties()) {
      const name = property.getName()
      yield {
        type: 'infer-type',
        emitName: name,
        node: emitsNode
      }
    }
  } else {
    yield {
      type: 'unknown',
      emitName: null,
      node: emitsNode
    }
  }
}

function* extractRuntimeSlots(
  type: Type,
  slotsNode: TypeNode
): IterableIterator<ComponentInferTypeSlot> {
  for (const property of type.getProperties()) {
    const name = property.getName()

    yield {
      type: 'infer-type',
      slotName: name,
      node: slotsNode
    }
  }
}

function* iterateTypes(type: Type): Iterable<Type> {
  if (isReferenceObject(type) && type.target !== type) {
    yield* iterateTypes(type.target)
  } else if (type.isUnion() && !isBooleanLike(type)) {
    for (const t of type.types) {
      yield* iterateTypes(t)
    }
  } else {
    yield type
  }
}
