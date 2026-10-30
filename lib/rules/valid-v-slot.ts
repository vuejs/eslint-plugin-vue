/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

interface VSlotVForVariables {
  expr: VForExpression
  variables: VVariable[]
}

/**
 * Get all `v-slot` directives on a given element.
 */
function getSlotDirectivesOnElement(node: VElement): VDirective[] {
  return utils.getDirectives(node, 'slot')
}

/**
 * Get all `v-slot` directives on the children of a given element, grouped by
 * `v-if`/`v-else-if`/`v-else` sequences.
 */
function getSlotDirectivesOnChildren(node: VElement): VDirective[][] {
  const groups: VDirective[][] = []
  for (const group of utils.iterateChildElementsChains(node)) {
    const slotDirs = group
      .map((childElement) =>
        childElement.name === 'template'
          ? utils.getDirective(childElement, 'slot')
          : null
      )
      .filter(utils.isDef)
    if (slotDirs.length > 0) {
      groups.push(slotDirs)
    }
  }

  return groups
}

/**
 * Get the normalized name of a given `v-slot` directive node with modifiers after `v-slot:` directive.
 */
function getNormalizedName(node: VDirective, sourceCode: SourceCode): string {
  if (node.key.argument == null) {
    return 'default'
  }
  return node.key.modifiers.length === 0
    ? sourceCode.getText(node.key.argument)
    : sourceCode.text.slice(node.key.argument.range[0], node.key.range[1])
}

/**
 * Get all `v-slot` directives which are distributed to the same slot as a given `v-slot` directive node.
 * @param vSlotGroups The result of `getAllNamedSlotElements()`.
 */
function filterSameSlot(
  vSlotGroups: VDirective[][],
  currentVSlot: VDirective,
  currentVSlotVForVars: VSlotVForVariables | null,
  sourceCode: SourceCode,
  tokenStore: ParserServices.TokenStore
): VDirective[][] {
  const currentName = getNormalizedName(currentVSlot, sourceCode)
  return vSlotGroups
    .map((vSlots) =>
      vSlots.filter((vSlot) => {
        if (getNormalizedName(vSlot, sourceCode) !== currentName) {
          return false
        }
        const vForExpr = getVSlotVForVariableIfUsingIterationVars(
          vSlot,
          utils.getDirective(vSlot.parent.parent, 'for')
        )
        return currentVSlotVForVars && vForExpr
          ? areVSlotVForVariablesEqual(
              currentVSlotVForVars,
              vForExpr,
              tokenStore
            )
          : !currentVSlotVForVars && !vForExpr
      })
    )
    .filter((slots) => slots.length > 0)
}

/**
 * Determines whether the two given `v-slot` variables are considered to be equal.
 */
function areVSlotVForVariablesEqual(
  a: VSlotVForVariables,
  b: VSlotVForVariables,
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

/**
 * Gets the `v-for` directive and variable that provide the variables used by the given` v-slot` directive.
 */
function getVSlotVForVariableIfUsingIterationVars(
  vSlot: VDirective,
  vFor?: VDirective | null
): VSlotVForVariables | null {
  const expr = vFor && vFor.value && (vFor.value.expression as VForExpression)
  const variables =
    expr && getUsingIterationVars(vSlot.key.argument, vSlot.parent.parent)
  return expr && variables && variables.length > 0 ? { expr, variables } : null
}

/**
 * Gets iterative variables if a given argument node is using iterative variables that the element defined.
 */
function getUsingIterationVars(
  argument: VExpressionContainer | VIdentifier | null,
  element: VElement
): VVariable[] {
  const vars: VVariable[] = []
  if (argument && argument.type === 'VExpressionContainer') {
    for (const { variable } of argument.references) {
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
 * Check whether a given argument node is using an scope variable that the directive defined.
 */
function isUsingScopeVar(vSlot: VDirective): boolean {
  const argument = vSlot.key.argument
  const value = vSlot.value

  if (argument && value && argument.type === 'VExpressionContainer') {
    for (const { variable } of argument.references) {
      if (
        variable != null &&
        variable.kind === 'scope' &&
        variable.id.range[0] > value.range[0] &&
        variable.id.range[1] < value.range[1]
      ) {
        return true
      }
    }
  }
  return false
}

/**
 * If `allowModifiers` option is set to `true`, check whether a given argument node has invalid modifiers like `v-slot.foo`.
 * Otherwise, check whether a given argument node has at least one modifier.
 */
function hasInvalidModifiers(
  vSlot: VDirective,
  shouldAllowModifiers: boolean
): boolean {
  return shouldAllowModifiers
    ? vSlot.key.argument == null && vSlot.key.modifiers.length > 0
    : vSlot.key.modifiers.length > 0
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-slot` directives',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-slot.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowModifiers: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      ownerMustBeCustomElement:
        "'v-slot' directive must be owned by a custom element, but '{{name}}' is not.",
      namedSlotMustBeOnTemplate:
        "Named slots must use '<template>' on a custom element.",
      defaultSlotMustBeOnTemplate:
        "Default slot must use '<template>' on a custom element when there are other named slots.",
      disallowDuplicateSlotsOnElement:
        "An element cannot have multiple 'v-slot' directives.",
      disallowDuplicateSlotsOnChildren:
        "An element cannot have multiple '<template>' elements which are distributed to the same slot.",
      disallowArgumentUseSlotParams:
        "Dynamic argument of 'v-slot' directive cannot use that slot parameter.",
      disallowAnyModifier: "'v-slot' directive doesn't support any modifier.",
      requireAttributeValue:
        "'v-slot' directive on a custom element requires that attribute value."
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const tokenStore =
      sourceCode.parserServices.getTemplateBodyTokenStore &&
      sourceCode.parserServices.getTemplateBodyTokenStore()
    const options = context.options[0] || {}
    const shouldAllowModifiers = options.allowModifiers === true

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='slot']"(node: VDirective) {
        const isDefaultSlot =
          node.key.argument == null ||
          (node.key.argument.type === 'VIdentifier' &&
            node.key.argument.name === 'default')
        const element = node.parent.parent
        const parentElement = element.parent
        const ownerElement =
          element.name === 'template' ? parentElement : element
        if (ownerElement.type === 'VDocumentFragment') {
          return
        }
        const vSlotsOnElement = getSlotDirectivesOnElement(element)
        const vSlotGroupsOnChildren = getSlotDirectivesOnChildren(ownerElement)

        // Verify location.
        if (!utils.isCustomComponent(ownerElement)) {
          context.report({
            node,
            messageId: 'ownerMustBeCustomElement',
            data: { name: ownerElement.rawName }
          })
        }
        if (!isDefaultSlot && element.name !== 'template') {
          context.report({
            node,
            messageId: 'namedSlotMustBeOnTemplate'
          })
        }
        if (ownerElement === element && vSlotGroupsOnChildren.length > 0) {
          context.report({
            node,
            messageId: 'defaultSlotMustBeOnTemplate'
          })
        }

        // Verify duplication.
        if (vSlotsOnElement.length >= 2 && vSlotsOnElement[0] !== node) {
          // E.g., <my-component #one #two>
          context.report({
            node,
            messageId: 'disallowDuplicateSlotsOnElement'
          })
        }
        if (ownerElement === parentElement) {
          const vFor = utils.getDirective(element, 'for')
          const vSlotVForVar = getVSlotVForVariableIfUsingIterationVars(
            node,
            vFor
          )
          const vSlotGroupsOfSameSlot = filterSameSlot(
            vSlotGroupsOnChildren,
            node,
            vSlotVForVar,
            sourceCode,
            tokenStore
          )
          if (
            vSlotGroupsOfSameSlot.length >= 2 &&
            !vSlotGroupsOfSameSlot[0].includes(node)
          ) {
            // E.g., <template #one></template>
            //       <template #one></template>
            context.report({
              node,
              messageId: 'disallowDuplicateSlotsOnChildren'
            })
          }
          if (vFor && !vSlotVForVar) {
            // E.g., <template v-for="x of xs" #one></template>
            context.report({
              node,
              messageId: 'disallowDuplicateSlotsOnChildren'
            })
          }
        }

        // Verify argument.
        if (isUsingScopeVar(node)) {
          context.report({
            node,
            messageId: 'disallowArgumentUseSlotParams'
          })
        }

        // Verify modifiers.
        const lastModifier = node.key.modifiers.at(-1)
        if (lastModifier && hasInvalidModifiers(node, shouldAllowModifiers)) {
          // E.g., <template v-slot.foo>
          context.report({
            node,
            loc: {
              start: node.key.modifiers[0].loc.start,
              end: lastModifier.loc.end
            },
            messageId: 'disallowAnyModifier'
          })
        }

        // Verify value.
        if (
          ownerElement === element &&
          isDefaultSlot &&
          (!node.value ||
            utils.isEmptyValueDirective(node, context) ||
            utils.isEmptyExpressionValueDirective(node, context))
        ) {
          context.report({
            node,
            messageId: 'requireAttributeValue'
          })
        }
      }
    })
  }
}
