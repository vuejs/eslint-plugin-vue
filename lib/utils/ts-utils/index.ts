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
} from '../index.js'
import {
  extractRuntimeProps,
  isTSTypeLiteral,
  isTSTypeLiteralOrTSFunctionType,
  extractRuntimeEmits,
  flattenTypeNodes,
  isTSInterfaceBody,
  extractRuntimeSlots
} from './ts-ast.ts'
import {
  getComponentPropsFromTypeDefineTypes,
  getComponentEmitsFromTypeDefineTypes,
  getComponentSlotsFromTypeDefineTypes
} from './ts-types.ts'

export { isTypeNode } from './ts-ast.ts'

export function getComponentPropsFromTypeDefine(
  context: RuleContext,
  propsNode: TSESTree.TypeNode
): (ComponentTypeProp | ComponentInferTypeProp | ComponentUnknownProp)[] {
  const result: (
    | ComponentTypeProp
    | ComponentInferTypeProp
    | ComponentUnknownProp
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

export function getComponentEmitsFromTypeDefine(
  context: RuleContext,
  emitsNode: TSESTree.TypeNode
): (ComponentTypeEmit | ComponentInferTypeEmit | ComponentUnknownEmit)[] {
  const result: (
    | ComponentTypeEmit
    | ComponentInferTypeEmit
    | ComponentUnknownEmit
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

export function getComponentSlotsFromTypeDefine(
  context: RuleContext,
  slotsNode: TSESTree.TypeNode
): (ComponentTypeSlot | ComponentInferTypeSlot | ComponentUnknownSlot)[] {
  const result: (
    | ComponentTypeSlot
    | ComponentInferTypeSlot
    | ComponentUnknownSlot
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
