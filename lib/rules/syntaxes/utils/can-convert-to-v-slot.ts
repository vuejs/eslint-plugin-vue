/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../../../utils/index.ts'

interface SlotVForVariables {
  expr: VForExpression
  variables: VVariable[]
}
interface SlotContext {
  element: VElement
  slot: VAttribute | VDirective | null
  vFor: VDirective | null
  slotVForVars: SlotVForVariables | null
  normalizedName: string
}

/**
 * Checks whether the given element can use v-slot.
 */
export default function canConvertToVSlot(
  element: VElement,
  sourceCode: SourceCode,
  tokenStore: ParserServices.TokenStore
) {
  const ownerElement = element.parent
  if (
    ownerElement.type === 'VDocumentFragment' ||
    !utils.isCustomComponent(ownerElement) ||
    ownerElement.name === 'component'
  ) {
    return false
  }
  const slot = getSlotContext(element, sourceCode)
  return (
    // E.g., <template v-for="x of xs" #one></template>
    !(slot.vFor && !slot.slotVForVars) &&
    !hasSameSlotDirective(ownerElement, slot, sourceCode, tokenStore)
  )
}

function getSlotContext(
  element: VElement,
  sourceCode: SourceCode
): SlotContext {
  const slot =
    utils.getAttribute(element, 'slot') ||
    utils.getDirective(element, 'bind', 'slot')
  const vFor = utils.getDirective(element, 'for')
  const slotVForVars = getSlotVForVariableIfUsingIterationVars(slot, vFor)

  return {
    element,
    slot,
    vFor,
    slotVForVars,
    normalizedName: getNormalizedName(slot, sourceCode)
  }
}

/**
 * Gets the `v-for` directive and variable that provide the variables used by the given `slot` attribute.
 */
function getSlotVForVariableIfUsingIterationVars(
  slot: VAttribute | VDirective | null,
  vFor?: VDirective | null
): SlotVForVariables | null {
  if (!slot || !slot.directive) {
    return null
  }
  const expr = vFor && vFor.value && (vFor.value.expression as VForExpression)
  const variables =
    expr && getUsingIterationVars(slot.value, slot.parent.parent)
  return expr && variables && variables.length > 0 ? { expr, variables } : null
}

/**
 * Gets iterative variables if a given expression node is using iterative variables that the element defined.
 */
function getUsingIterationVars(
  expression: VExpressionContainer | null,
  element: VElement
): VVariable[] {
  const vars = []
  if (expression && expression.type === 'VExpressionContainer') {
    for (const { variable } of expression.references) {
      if (
        variable != null &&
        variable.kind === 'v-for' &&
        variable.id.range[0] > element.startTag.range[0] &&
        variable.id.range[1] < element.startTag.range[1]
      ) {
        vars.push(variable)
      }
    }
  }
  return vars
}

/**
 * Get the normalized name of a given `slot` attribute node.
 */
function getNormalizedName(
  slotAttr: VAttribute | VDirective | null,
  sourceCode: SourceCode
): string {
  if (!slotAttr) {
    return 'default'
  }
  if (!slotAttr.directive) {
    return slotAttr.value ? slotAttr.value.value : 'default'
  }
  return slotAttr.value ? `[${sourceCode.getText(slotAttr.value)}]` : '[null]'
}

/**
 * Checks whether parent element has the same slot as the given slot.
 */
function hasSameSlotDirective(
  ownerElement: VElement,
  targetSlot: SlotContext,
  sourceCode: SourceCode,
  tokenStore: ParserServices.TokenStore
) {
  for (const group of utils.iterateChildElementsChains(ownerElement)) {
    if (group.includes(targetSlot.element)) {
      continue
    }
    for (const childElement of group) {
      const slot = getSlotContext(childElement, sourceCode)
      if (!targetSlot.slotVForVars || !slot.slotVForVars) {
        if (
          !targetSlot.slotVForVars &&
          !slot.slotVForVars &&
          targetSlot.normalizedName === slot.normalizedName
        ) {
          return true
        }
      } else if (
        areSlotVForVariablesEqual(
          targetSlot.slotVForVars,
          slot.slotVForVars,
          tokenStore
        )
      ) {
        return true
      }
    }
  }
  return false
}

/**
 * Determines whether the two given `v-slot` variables are considered to be equal.
 */
function areSlotVForVariablesEqual(
  a: SlotVForVariables,
  b: SlotVForVariables,
  tokenStore: ParserServices.TokenStore
): boolean {
  if (
    a.variables.length !== b.variables.length ||
    !isEqual(a.expr.right, b.expr.right)
  ) {
    return false
  }

  const checkedVarNames = new Set()
  const len = Math.min(a.expr.left.length, b.expr.left.length)
  for (let index = 0; index < len; index++) {
    const aPtn = a.expr.left[index]
    const bPtn = b.expr.left[index]

    const aVar = a.variables.find((v) => utils.isInRange(aPtn, v.id))
    const bVar = b.variables.find((v) => utils.isInRange(bPtn, v.id))
    if (aVar && bVar) {
      if (aVar.id.name !== bVar.id.name || !isEqual(aPtn, bPtn)) {
        return false
      }
      checkedVarNames.add(aVar.id.name)
    } else if (aVar || bVar) {
      return false
    }
  }
  return a.variables.every(
    (v) =>
      checkedVarNames.has(v.id.name) ||
      b.variables.some((bv) => v.id.name === bv.id.name)
  )

  /**
   * Determines whether the two given nodes are considered to be equal.
   */
  function isEqual(a: ASTNode, b: ASTNode): boolean {
    return a.type === b.type && utils.equalTokens(a, b, tokenStore)
  }
}
