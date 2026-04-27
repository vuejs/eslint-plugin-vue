const {
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
} = require('./typescript')
/**
 * @typedef {import('@typescript-eslint/types').TSESTree.Node} TSESTreeNode
 * @typedef {import('typescript').Type} Type
 * @typedef {import('typescript').TypeChecker} TypeChecker
 * @typedef {import('typescript').Node} TypeScriptNode
 */
/**
 * @typedef {import('../index').ComponentInferTypeProp} ComponentInferTypeProp
 * @typedef {import('../index').ComponentUnknownProp} ComponentUnknownProp
 * @typedef {import('../index').ComponentInferTypeEmit} ComponentInferTypeEmit
 * @typedef {import('../index').ComponentUnknownEmit} ComponentUnknownEmit
 * @typedef {import('../index').ComponentInferTypeSlot} ComponentInferTypeSlot
 * @typedef {import('../index').ComponentUnknownSlot} ComponentUnknownSlot
 */

module.exports = {
  getComponentPropsFromTypeDefineTypes,
  getComponentEmitsFromTypeDefineTypes,
  getComponentSlotsFromTypeDefineTypes,
  inferRuntimeTypeFromTypeNode,
  isExhaustiveSwitch
}

/**
 * @typedef {object} Services
 * @property {typeof import("typescript")} ts
 * @property {Map<ESNode | TSNode | TSESTreeNode, TypeScriptNode>} tsNodeMap
 * @property {import('typescript').TypeChecker} checker
 */

/**
 * Get TypeScript parser services.
 * @param {RuleContext} context The ESLint rule context object.
 * @returns {Services|null}
 */
function getTSParserServices(context) {
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
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} propsNode Type with props definition
 * @return {(ComponentInferTypeProp|ComponentUnknownProp)[]} Array of component props
 */
function getComponentPropsFromTypeDefineTypes(context, propsNode) {
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
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} emitsNode Type with emits definition
 * @return {(ComponentInferTypeEmit|ComponentUnknownEmit)[]} Array of component emits
 */
function getComponentEmitsFromTypeDefineTypes(context, emitsNode) {
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
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} slotsNode Type with slots definition
 * @return {(ComponentInferTypeSlot|ComponentUnknownSlot)[]} Array of component slots
 */
function getComponentSlotsFromTypeDefineTypes(context, slotsNode) {
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

/**
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode|Expression} node
 * @returns {string[]}
 */
function inferRuntimeTypeFromTypeNode(context, node) {
  const services = getTSParserServices(context)
  const tsNode = services && services.tsNodeMap.get(node)
  const type = tsNode && services.checker.getTypeAtLocation(tsNode)
  if (!type) {
    return ['null']
  }
  return inferRuntimeTypeInternal(type, services)
}

/**
 * @param {Type} type
 * @param {TypeScriptNode} tsNode
 * @param {TypeNode} propsNode Type with props definition
 * @param {Services} services
 * @returns {IterableIterator<ComponentInferTypeProp>}
 */
function* extractRuntimeProps(type, tsNode, propsNode, services) {
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

/**
 * @param {Type} type
 * @param {Services} services
 * @returns {string[]}
 */
function inferRuntimeTypeInternal(type, services) {
  const { checker } = services
  /** @type {Set<string>} */
  const types = new Set()

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

/**
 * @param {Type} type
 * @param {TypeScriptNode} tsNode
 * @param {TypeNode} emitsNode Type with emits definition
 * @param {Services} services
 * @returns {IterableIterator<ComponentInferTypeEmit|ComponentUnknownEmit>}
 */
function* extractRuntimeEmits(type, tsNode, emitsNode, services) {
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

/**
 * @param {Type} type
 * @param {TypeNode} slotsNode Type with slots definition
 * @returns {IterableIterator<ComponentInferTypeSlot>}
 */
function* extractRuntimeSlots(type, slotsNode) {
  for (const property of type.getProperties()) {
    const name = property.getName()

    yield {
      type: 'infer-type',
      slotName: name,
      node: slotsNode
    }
  }
}

/**
 * @param {Type} type
 * @returns {Iterable<Type>}
 */
function* iterateTypes(type) {
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

/**
 * @param {Type} type
 * @returns {Type[]}
 */
function unionConstituents(type) {
  return type.isUnion() ? type.types : [type]
}

/**
 * @param {Type} type
 * @returns {Type[]}
 */
function intersectionConstituents(type) {
  return type.isIntersection() ? type.types : [type]
}

/**
 * @param {Type} type
 * @param {typeof import('typescript')} ts
 * @returns {boolean}
 */
function isTypeLiteralLike(type, ts) {
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
 * Check whether a switch statement's discriminant is a finite union of literal
 * types and every union member is covered by a case clause.
 * Does NOT verify that case bodies terminate — callers can use ESLint's code
 * path analysis for that.
 * @param {RuleContext} context
 * @param {SwitchStatement} switchNode
 * @returns {boolean}
 */
function isExhaustiveSwitch(context, switchNode) {
  const services = getTSParserServices(context)
  if (!services) return false

  const { ts, tsNodeMap, checker } = services

  const discriminantTSNode = tsNodeMap.get(switchNode.discriminant)
  if (!discriminantTSNode) return false

  let discriminantType = checker.getTypeAtLocation(discriminantTSNode)
  if (!discriminantType) return false
  discriminantType =
    checker.getBaseConstraintOfType(discriminantType) ?? discriminantType

  /** @type {Set<Type>} */
  const caseTypes = new Set()
  for (const switchCase of switchNode.cases) {
    if (switchCase.test === null) return true
    const caseTSNode = tsNodeMap.get(switchCase.test)
    if (!caseTSNode) return false
    let caseType = checker.getTypeAtLocation(caseTSNode)
    if (!caseType) return false
    caseType = checker.getBaseConstraintOfType(caseType) ?? caseType
    caseTypes.add(caseType)
  }

  const constituents = unionConstituents(discriminantType)
    .flatMap(intersectionConstituents)
    .filter((part) => isTypeLiteralLike(part, ts))
  if (constituents.length === 0) return false

  const caseHasUndefined = [...caseTypes].some(
    (type) => (type.flags & ts.TypeFlags.Undefined) !== 0
  )
  for (const part of constituents) {
    if (caseTypes.has(part)) continue
    // multiple TS objects can represent undefined
    if (caseHasUndefined && (part.flags & ts.TypeFlags.Undefined) !== 0) {
      continue
    }
    return false
  }

  return true
}
