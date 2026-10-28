import type { TSESTree } from '@typescript-eslint/types'
import type {
  ComponentTypeProp,
  ComponentInferTypeProp,
  ComponentUnknownProp,
  ComponentTypeEmit,
  ComponentInferTypeEmit,
  ComponentUnknownEmit,
  ComponentTypeSlot,
  ComponentInferTypeSlot,
  ComponentUnknownSlot
} from '../index.ts'
import tsAst from './ts-ast.js'
import tsTypes from './ts-types.js'

const {
  isTypeNode,
  extractRuntimeProps,
  isTSTypeLiteral,
  isTSTypeLiteralOrTSFunctionType,
  extractRuntimeEmits,
  flattenTypeNodes,
  isTSInterfaceBody,
  extractRuntimeSlots
} = tsAst
const {
  getComponentPropsFromTypeDefineTypes,
  getComponentEmitsFromTypeDefineTypes,
  getComponentSlotsFromTypeDefineTypes,
  isExhaustiveSwitch,
  isRefObjectType
} = tsTypes

export { isTypeNode, isExhaustiveSwitch, isRefObjectType }

/**
 * Get all props by looking at all component's properties
 */
export function getComponentPropsFromTypeDefine(
  context: RuleContext,
  propsNode: TypeNode
): (ComponentTypeProp | ComponentInferTypeProp | ComponentUnknownProp)[] {
  const result: (
    ComponentTypeProp | ComponentInferTypeProp | ComponentUnknownProp
  )[] = []
  for (const defNode of flattenTypeNodes(
    context,
    propsNode as TSESTree.TypeNode
  )) {
    if (isTSInterfaceBody(defNode) || isTSTypeLiteral(defNode)) {
      result.push(...extractRuntimeProps(context, defNode))
    } else {
      result.push(
        ...getComponentPropsFromTypeDefineTypes(context, defNode as TypeNode)
      )
    }
  }
  return result
}

/**
 * Get all emits by looking at all component's properties
 */
export function getComponentEmitsFromTypeDefine(
  context: RuleContext,
  emitsNode: TypeNode
): (ComponentTypeEmit | ComponentInferTypeEmit | ComponentUnknownEmit)[] {
  const result: (
    ComponentTypeEmit | ComponentInferTypeEmit | ComponentUnknownEmit
  )[] = []
  for (const defNode of flattenTypeNodes(
    context,
    emitsNode as TSESTree.TypeNode
  )) {
    if (
      isTSInterfaceBody(defNode) ||
      isTSTypeLiteralOrTSFunctionType(defNode)
    ) {
      result.push(...extractRuntimeEmits(defNode))
    } else {
      result.push(
        ...getComponentEmitsFromTypeDefineTypes(context, defNode as TypeNode)
      )
    }
  }
  return result
}

/**
 * Get all slots by looking at all component's properties
 */
export function getComponentSlotsFromTypeDefine(
  context: RuleContext,
  slotsNode: TypeNode
): (ComponentTypeSlot | ComponentInferTypeSlot | ComponentUnknownSlot)[] {
  const result: (
    ComponentTypeSlot | ComponentInferTypeSlot | ComponentUnknownSlot
  )[] = []
  for (const defNode of flattenTypeNodes(
    context,
    slotsNode as TSESTree.TypeNode
  )) {
    if (isTSInterfaceBody(defNode) || isTSTypeLiteral(defNode)) {
      result.push(...extractRuntimeSlots(defNode))
    } else {
      result.push(
        ...getComponentSlotsFromTypeDefineTypes(context, defNode as TypeNode)
      )
    }
  }
  return result
}
