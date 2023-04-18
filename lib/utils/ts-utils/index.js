const {
  isTypeNode,
  resolveQualifiedType,
  extractRuntimeProps,
  isTSTypeLiteral,
  isTSTypeLiteralOrTSFunctionType,
  extractRuntimeEmits
} = require('./ts-ast')
const {
  getComponentPropsFromTypeDefineTypes,
  getComponentEmitsFromTypeDefineTypes
} = require('./ts-types')

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.TypeNode} TSESTreeTypeNode
 */
/**
 * @typedef {import('../../../typings/eslint-plugin-vue/util-types/utils').ComponentTypeProp} ComponentTypeProp
 * @typedef {import('../../../typings/eslint-plugin-vue/util-types/utils').ComponentInferTypeProp} ComponentInferTypeProp
 * @typedef {import('../../../typings/eslint-plugin-vue/util-types/utils').ComponentUnknownProp} ComponentUnknownProp
 * @typedef {import('../../../typings/eslint-plugin-vue/util-types/utils').ComponentTypeEmit} ComponentTypeEmit
 * @typedef {import('../../../typings/eslint-plugin-vue/util-types/utils').ComponentInferTypeEmit} ComponentInferTypeEmit
 * @typedef {import('../../../typings/eslint-plugin-vue/util-types/utils').ComponentUnknownEmit} ComponentUnknownEmit
 */

module.exports = {
  isTypeNode,
  getComponentPropsFromTypeDefine,
  getComponentEmitsFromTypeDefine
}

/**
 * Get all props by looking at all component's properties
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} propsNode Type with props definition
 * @return {(ComponentTypeProp|ComponentInferTypeProp|ComponentUnknownProp)[]} Array of component props
 */
function getComponentPropsFromTypeDefine(context, propsNode) {
  const defNode = resolveQualifiedType(
    context,
    /** @type {TSESTreeTypeNode} */ (propsNode),
    isTSTypeLiteral
  )
  if (!defNode) {
    return getComponentPropsFromTypeDefineTypes(context, propsNode)
  }
  return [...extractRuntimeProps(context, defNode)]
}

/**
 * Get all emits by looking at all component's properties
 * @param {RuleContext} context The ESLint rule context object.
 * @param {TypeNode} emitsNode Type with emits definition
 * @return {(ComponentTypeEmit|ComponentInferTypeEmit|ComponentUnknownEmit)[]} Array of component emits
 */
function getComponentEmitsFromTypeDefine(context, emitsNode) {
  const defNode = resolveQualifiedType(
    context,
    /** @type {TSESTreeTypeNode} */ (emitsNode),
    isTSTypeLiteralOrTSFunctionType
  )
  if (!defNode) {
    return getComponentEmitsFromTypeDefineTypes(context, emitsNode)
  }
  return [...extractRuntimeEmits(defNode)]
}
