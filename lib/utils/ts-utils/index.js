const {
  isTypeNode,
  extractRuntimeProps,
  isTSTypeLiteral,
  isTSTypeLiteralOrTSFunctionType,
  extractRuntimeEmits,
  flattenTypeNodes,
  isTSInterfaceBody,
  isTSInterfaceHeritage,
  extractRuntimeSlots
} = require('./ts-ast')
const {
  getComponentPropsFromTypeDefineTypes,
  getComponentEmitsFromTypeDefineTypes,
  getComponentSlotsFromTypeDefineTypes,
  isExhaustiveSwitch
} = require('./ts-types')

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.TypeNode} TSESTreeTypeNode
 * @typedef {import('@typescript-eslint/types').TSESTree.BaseNode} TSESTreeBaseNode
 */
/**
 * @typedef {import('../index').ComponentTypeProp} ComponentTypeProp
 * @typedef {import('../index').ComponentInferTypeProp} ComponentInferTypeProp
 * @typedef {import('../index').ComponentUnknownProp} ComponentUnknownProp
 * @typedef {import('../index').ComponentTypeEmit} ComponentTypeEmit
 * @typedef {import('../index').ComponentInferTypeEmit} ComponentInferTypeEmit
 * @typedef {import('../index').ComponentUnknownEmit} ComponentUnknownEmit
 * @typedef {import('../index').ComponentTypeSlot} ComponentTypeSlot
 * @typedef {import('../index').ComponentInferTypeSlot} ComponentInferTypeSlot
 * @typedef {import('../index').ComponentUnknownSlot} ComponentUnknownSlot
 */

module.exports = {
  isTypeNode,
  isExhaustiveSwitch,
  getComponentPropsFromTypeDefine,
  getComponentEmitsFromTypeDefine,
  getComponentSlotsFromTypeDefine
}

/**
 * Get all props by looking at all component's properties
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} propsNode Type with props definition
 * @return {(ComponentTypeProp|ComponentInferTypeProp|ComponentUnknownProp)[]} Array of component props
 */
function getComponentPropsFromTypeDefine(context, propsNode) {
  /** @type {(ComponentTypeProp|ComponentInferTypeProp|ComponentUnknownProp)[]} */
  const result = []

  const overrideResolver = createInterfaceOverrideResolver((prop) => prop.propName)

  for (const defNode of flattenTypeNodes(
    context,
    /** @type {TSESTreeTypeNode} */ (propsNode)
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
          getComponentPropsFromTypeDefineTypes(
            context,
            /** @type {TypeNode} */ (defNode)
          )
        )
      )
    }
  }
  return result
}

/**
 * Get all emits by looking at all component's properties
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} emitsNode Type with emits definition
 * @return {(ComponentTypeEmit|ComponentInferTypeEmit|ComponentUnknownEmit)[]} Array of component emits
 */
function getComponentEmitsFromTypeDefine(context, emitsNode) {
  /** @type {(ComponentTypeEmit|ComponentInferTypeEmit|ComponentUnknownEmit)[]} */
  const result = []

  const overrideResolver = createInterfaceOverrideResolver((emit) => emit.emitName)

  for (const defNode of flattenTypeNodes(
    context,
    /** @type {TSESTreeTypeNode} */ (emitsNode)
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
          getComponentEmitsFromTypeDefineTypes(
            context,
            /** @type {TypeNode} */ (defNode)
          )
        )
      )
    }
  }
  return result
}

/**
 * Get all slots by looking at all component's properties
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} slotsNode Type with slots definition
 * @return {(ComponentTypeSlot|ComponentInferTypeSlot|ComponentUnknownSlot)[]} Array of component slots
 */
function getComponentSlotsFromTypeDefine(context, slotsNode) {
  /** @type {(ComponentTypeSlot|ComponentInferTypeSlot|ComponentUnknownSlot)[]} */
  const result = []

  const overrideResolver = createInterfaceOverrideResolver((slot) => slot.slotName)

  for (const defNode of flattenTypeNodes(
    context,
    /** @type {TSESTreeTypeNode} */ (slotsNode)
  )) {
    if (isTSInterfaceBody(defNode) || isTSTypeLiteral(defNode)) {
      result.push(
        ...overrideResolver.resolve(defNode, [...extractRuntimeSlots(defNode)])
      )
    } else {
      result.push(
        ...overrideResolver.resolve(
          defNode,
          getComponentSlotsFromTypeDefineTypes(
            context,
            /** @type {TypeNode} */ (defNode)
          )
        )
      )
    }
  }
  return result
}

/**
 * Drops duplicate interface fields that were overriden
 * @template T
 * @param {(member: T) => string | null} getName
 */
function createInterfaceOverrideResolver(getName) {
  /** @type {Map<TSESTreeBaseNode, Set<string>>} */
  const membersByInterfaceDecl = new Map()

  /**
   * @param {T[]} members
   * @returns {string[]}
   */
  function getNames(members) {
    return members.map(getName).filter((name) => name !== null)
  }

  return {
    /**
     * @param {TSESTreeBaseNode} defNode
     * @param {T[]} members
     * @returns {T[]}
     */
    resolve(defNode, members) {
      if (isTSInterfaceBody(defNode)) {
        membersByInterfaceDecl.set(
          defNode.parent,
          new Set(getNames(members))
        )
        return members
      }

      const declaredMembers =
        isTSInterfaceHeritage(defNode) &&
        membersByInterfaceDecl.get(defNode.parent)

      if (!declaredMembers) {
        return members
      }

      const dedupedInheritedMembers = members.filter((member) => {
        const name = getName(member)
        return name === null || !declaredMembers.has(name)
      })
      for (const name of getNames(dedupedInheritedMembers)) {
        declaredMembers.add(name)
      }
      return dedupedInheritedMembers
    }
  }
}
