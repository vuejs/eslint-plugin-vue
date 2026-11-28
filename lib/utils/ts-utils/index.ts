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
import {
  extractRuntimeProps,
  isTSTypeLiteral,
  isTSTypeLiteralOrTSFunctionType,
  extractRuntimeEmits,
  flattenTypeNodes,
  isTSInterfaceHeritage,
  isTSInterfaceBody,
  extractRuntimeSlots
} from './ts-ast.ts'
import {
  getComponentPropsFromTypeDefineTypes,
  getComponentEmitsFromTypeDefineTypes,
  getComponentSlotsFromTypeDefineTypes
} from './ts-types.ts'

export { isTypeNode } from './ts-ast.ts'
export { isExhaustiveSwitch, isRefObjectType } from './ts-types.ts'

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

  const overrideResolver = createInterfaceOverrideResolver<
    ComponentTypeProp | ComponentInferTypeProp | ComponentUnknownProp
  >((prop) => prop.propName)

  for (const defNode of flattenTypeNodes(
    context,
    propsNode as TSESTree.TypeNode
  )) {
    if (isTSInterfaceBody(defNode) || isTSTypeLiteral(defNode)) {
      result.push(
        ...overrideResolver.resolve(defNode, [
          ...extractRuntimeProps(context, defNode)
        ])
      )
    } else {
      result.push(
        ...overrideResolver.resolve(
          defNode,
          getComponentPropsFromTypeDefineTypes(context, defNode as TypeNode)
        )
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

  const overrideResolver = createInterfaceOverrideResolver<
    ComponentTypeEmit | ComponentInferTypeEmit | ComponentUnknownEmit
  >((emit) => emit.emitName)

  for (const defNode of flattenTypeNodes(
    context,
    emitsNode as TSESTree.TypeNode
  )) {
    if (
      isTSInterfaceBody(defNode) ||
      isTSTypeLiteralOrTSFunctionType(defNode)
    ) {
      result.push(
        ...overrideResolver.resolve(defNode, [...extractRuntimeEmits(defNode)])
      )
    } else {
      result.push(
        ...overrideResolver.resolve(
          defNode,
          getComponentEmitsFromTypeDefineTypes(context, defNode as TypeNode)
        )
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

  const overrideResolver = createInterfaceOverrideResolver<
    ComponentTypeSlot | ComponentInferTypeSlot | ComponentUnknownSlot
  >((slot) => slot.slotName)

  for (const defNode of flattenTypeNodes(
    context,
    slotsNode as TSESTree.TypeNode
  )) {
    if (isTSInterfaceBody(defNode) || isTSTypeLiteral(defNode)) {
      result.push(
        ...overrideResolver.resolve(defNode, [...extractRuntimeSlots(defNode)])
      )
    } else {
      result.push(
        ...overrideResolver.resolve(
          defNode,
          getComponentSlotsFromTypeDefineTypes(context, defNode as TypeNode)
        )
      )
    }
  }
  return result
}

/**
 * Drops duplicate interface fields that were overriden
 */
function createInterfaceOverrideResolver<T>(
  getName: (member: T) => string | null
) {
  const membersByInterfaceDecl: Map<TSESTree.BaseNode, Set<string>> = new Map()

  function getNames(members: T[]): string[] {
    return members.map(getName).filter((name) => name !== null)
  }

  return {
    resolve(defNode: TSESTree.BaseNode, members: T[]): T[] {
      if (isTSInterfaceBody(defNode)) {
        membersByInterfaceDecl.set(defNode.parent, new Set(getNames(members)))
        return members
      }

      if (isTSInterfaceHeritage(defNode)) {
        const alreadyDeclaredMembers = membersByInterfaceDecl.get(
          defNode.parent
        )

        if (!alreadyDeclaredMembers) {
          return members
        }

        const dedupedInheritedMembers = members.filter((member) => {
          const name = getName(member)
          return name === null || !alreadyDeclaredMembers.has(name)
        })

        for (const name of getNames(dedupedInheritedMembers)) {
          alreadyDeclaredMembers.add(name)
        }

        return dedupedInheritedMembers
      }

      return members
    }
  }
}
