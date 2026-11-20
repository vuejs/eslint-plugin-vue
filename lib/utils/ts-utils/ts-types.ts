import type { TSESTree } from '@typescript-eslint/types'
import type { Type, TypeChecker, Node as TypeScriptNode } from 'typescript'
import type {
  ComponentInferTypeProp,
  ComponentUnknownProp,
  ComponentInferTypeEmit,
  ComponentUnknownEmit,
  ComponentInferTypeSlot,
  ComponentUnknownSlot
} from '../index.ts'
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

interface Services {
  ts: typeof import('typescript')
  tsNodeMap: Map<ESNode | TSNode | TSESTree.Node, TypeScriptNode>
  checker: TypeChecker
}

/**
 * Get TypeScript parser services.
 */
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

/**
 * Get all props by looking at all component's properties
 */
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

/**
 * Get all emits by looking at all component's properties
 */
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

/**
 * Get all slots by looking at all component's properties
 */
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
  return type ? inferRuntimeTypeInternal(type, services) : ['null']
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
  const types: Set<string> = new Set()

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

  const targetTypes = iterateTypes(checker.getNonNullableType(type))
  for (const targetType of targetTypes) {
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

  if (types.size === 0) types.add('null')

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

function unionConstituents(type: Type): Type[] {
  return type.isUnion() ? type.types : [type]
}

function intersectionConstituents(type: Type): Type[] {
  return type.isIntersection() ? type.types : [type]
}

function isTypeLiteralLike(
  type: Type,
  ts: typeof import('typescript')
): boolean {
  return (
    (type.flags &
      (ts.TypeFlags.Literal |
        ts.TypeFlags.Undefined |
        ts.TypeFlags.Null |
        ts.TypeFlags.UniqueESSymbol)) !==
    0
  )
}

/**
 * Check whether the given expression is typed as a Vue ref object,
 * e.g. `Ref`, `ShallowRef` or `ComputedRef`.
 */
export function isRefObjectType(context: RuleContext, node: ESNode): boolean {
  const services = getTSParserServices(context)
  const tsNode = services && services.tsNodeMap.get(node)
  if (!tsNode) return false

  const { checker } = services
  const type = checker.getTypeAtLocation(tsNode)
  // Every ref type inherits the `[RefSymbol]` marker declared by `Ref`
  return checker
    .getPropertiesOfType(type)
    .some((property) =>
      String(property.escapedName).startsWith('__@RefSymbol@')
    )
}

/**
 * Check whether a switch statement's discriminant is a finite union of literal
 * types and every union member is covered by a case clause.
 * Does NOT verify that case bodies terminate — callers can use ESLint's code
 * path analysis for that.
 */
export function isExhaustiveSwitch(
  context: RuleContext,
  switchNode: SwitchStatement
): boolean {
  const services = getTSParserServices(context)
  if (!services) return false

  const { ts, tsNodeMap, checker } = services

  const discriminantTSNode = tsNodeMap.get(switchNode.discriminant)
  if (!discriminantTSNode) return false

  let discriminantType = checker.getTypeAtLocation(discriminantTSNode)
  if (!discriminantType) return false
  discriminantType =
    checker.getBaseConstraintOfType(discriminantType) ?? discriminantType

  const caseTypes: Set<Type> = new Set()
  for (const switchCase of switchNode.cases) {
    if (switchCase.test === null) return true
    const caseTSNode = tsNodeMap.get(switchCase.test)
    if (!caseTSNode) return false
    let caseType = checker.getTypeAtLocation(caseTSNode)
    if (!caseType) return false
    caseType = checker.getBaseConstraintOfType(caseType) ?? caseType
    caseTypes.add(caseType)
  }

  const hasUndefinedCase = [...caseTypes].some(
    (type) => (type.flags & ts.TypeFlags.Undefined) !== 0
  )

  // Every union member needs a literal constituent that a case covers.
  // A member without one (e.g. a plain object type) can't be matched.
  for (const member of unionConstituents(discriminantType)) {
    const isCovered = intersectionConstituents(member).some(
      (part) =>
        isTypeLiteralLike(part, ts) &&
        (caseTypes.has(part) ||
          // multiple TS objects can represent undefined
          (hasUndefinedCase && (part.flags & ts.TypeFlags.Undefined) !== 0))
    )
    if (!isCovered) return false
  }

  return true
}
