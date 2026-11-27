/**
 * @fileoverview enforce ordering of attributes
 * @author Erin Depew
 */
import utils from '../utils/index.ts'

type VBindDirective = VDirective & {
  key: VDirectiveKey & { name: VIdentifier & { name: 'bind' } }
}

const ATTRS = {
  DEFINITION: 'DEFINITION',
  LIST_RENDERING: 'LIST_RENDERING',
  CONDITIONALS: 'CONDITIONALS',
  RENDER_MODIFIERS: 'RENDER_MODIFIERS',
  GLOBAL: 'GLOBAL',
  UNIQUE: 'UNIQUE',
  SLOT: 'SLOT',
  TWO_WAY_BINDING: 'TWO_WAY_BINDING',
  OTHER_DIRECTIVES: 'OTHER_DIRECTIVES',
  OTHER_ATTR: 'OTHER_ATTR',
  ATTR_STATIC: 'ATTR_STATIC',
  ATTR_DYNAMIC: 'ATTR_DYNAMIC',
  ATTR_SHORTHAND_BOOL: 'ATTR_SHORTHAND_BOOL',
  EVENTS: 'EVENTS',
  CONTENT: 'CONTENT'
}

/**
 * Check whether the given attribute is `v-bind` directive.
 */
function isVBind(
  node: VAttribute | VDirective | undefined | null
): node is VBindDirective {
  return Boolean(node && node.directive && node.key.name.name === 'bind')
}
/**
 * Check whether the given attribute is `v-model` directive.
 */
function isVModel(
  node: VAttribute | VDirective | undefined | null
): node is VDirective {
  return Boolean(node && node.directive && node.key.name.name === 'model')
}
/**
 * Check whether the given attribute is plain attribute.
 */
function isVAttribute(
  node: VAttribute | VDirective | undefined | null
): node is VAttribute {
  return Boolean(node && !node.directive)
}
/**
 * Check whether the given attribute is plain attribute, `v-bind` directive or `v-model` directive.
 */
function isVAttributeOrVBindOrVModel(
  node: VAttribute | VDirective | undefined | null
): node is VAttribute {
  return isVAttribute(node) || isVBind(node) || isVModel(node)
}

/**
 * Check whether the given attribute is `v-bind="..."` directive.
 */
function isVBindObject(
  node: VAttribute | VDirective | undefined | null
): node is VBindDirective {
  return isVBind(node) && node.key.argument == null
}

/**
 * Check whether moving the attributes changes which of `v-bind="object"` and
 * another binding comes first. In Vue 3 the later one wins, so the behavior changes.
 */
function isVBindObjectOverrideChanged(
  before: (VAttribute | VDirective)[],
  after: (VAttribute | VDirective)[]
): boolean {
  return before.some(
    (vBindObject, vBindObjectIndex) =>
      isVBindObject(vBindObject) &&
      before.some(
        (attr, index) =>
          isVAttributeOrVBindOrVModel(attr) &&
          !isVBindObject(attr) &&
          index < vBindObjectIndex !==
            after.indexOf(attr) < after.indexOf(vBindObject)
      )
  )
}

/**
 * Check whether the given attribute is a shorthand boolean like `selected`.
 */
function isVShorthandBoolean(
  node: VAttribute | VDirective | undefined | null
): node is VAttribute {
  return isVAttribute(node) && !node.value
}

function getAttributeName(
  attribute: VAttribute | VDirective,
  sourceCode: SourceCode
) {
  if (attribute.directive) {
    if (isVBind(attribute)) {
      return attribute.key.argument
        ? sourceCode.getText(attribute.key.argument)
        : ''
    }
    return getDirectiveKeyName(attribute.key, sourceCode)
  }
  return attribute.key.name
}

function getDirectiveKeyName(
  directiveKey: VDirectiveKey,
  sourceCode: SourceCode
) {
  let text = `v-${directiveKey.name.name}`
  if (directiveKey.argument) {
    text += `:${sourceCode.getText(directiveKey.argument)}`
  }
  for (const modifier of directiveKey.modifiers) {
    text += `.${modifier.name}`
  }
  return text
}

function getAttributeType(attribute: VAttribute | VDirective) {
  let propName
  if (attribute.directive) {
    if (!isVBind(attribute)) {
      const name = attribute.key.name.name
      switch (name) {
        case 'for': {
          return ATTRS.LIST_RENDERING
        }
        case 'if':
        case 'else-if':
        case 'else':
        case 'show':
        case 'cloak': {
          return ATTRS.CONDITIONALS
        }
        case 'pre':
        case 'once': {
          return ATTRS.RENDER_MODIFIERS
        }
        case 'model': {
          return ATTRS.TWO_WAY_BINDING
        }
        case 'on': {
          return ATTRS.EVENTS
        }
        case 'html':
        case 'text': {
          return ATTRS.CONTENT
        }
        case 'slot': {
          return ATTRS.SLOT
        }
        case 'is': {
          return ATTRS.DEFINITION
        }
        default: {
          return ATTRS.OTHER_DIRECTIVES
        }
      }
    }
    propName =
      attribute.key.argument && attribute.key.argument.type === 'VIdentifier'
        ? attribute.key.argument.rawName
        : ''
  } else {
    propName = attribute.key.name
  }
  switch (propName) {
    case 'is': {
      return ATTRS.DEFINITION
    }
    case 'id': {
      return ATTRS.GLOBAL
    }
    case 'ref':
    case 'key': {
      return ATTRS.UNIQUE
    }
    case 'slot':
    case 'slot-scope': {
      return ATTRS.SLOT
    }
    default: {
      if (isVBind(attribute)) {
        return ATTRS.ATTR_DYNAMIC
      }
      return isVShorthandBoolean(attribute)
        ? ATTRS.ATTR_SHORTHAND_BOOL
        : ATTRS.ATTR_STATIC
    }
  }
}

/**
 * Returns `null` if the order of the attribute is omitted, so it is not enforced.
 */
function getPosition(
  attribute: VAttribute | VDirective,
  attributePosition: { [key: string]: number }
): number | null {
  const attributeType = getAttributeType(attribute)
  return attributePosition[attributeType] ?? null
}

function isAlphabetical(
  prevNode: VAttribute | VDirective,
  currNode: VAttribute | VDirective,
  sourceCode: SourceCode
) {
  const prevName = getAttributeName(prevNode, sourceCode)
  const currName = getAttributeName(currNode, sourceCode)
  if (prevName === currName) {
    const isPrevVBind = isVBind(prevNode)
    const isCurrVBind = isVBind(currNode)
    return isPrevVBind <= isCurrVBind
  }
  return prevName < currName
}

function create(context: RuleContext): RuleListener {
  const sourceCode = context.sourceCode
  const otherAttrs = [
    ATTRS.ATTR_DYNAMIC,
    ATTRS.ATTR_STATIC,
    ATTRS.ATTR_SHORTHAND_BOOL
  ]
  let attributeOrder = [
    ATTRS.DEFINITION,
    ATTRS.LIST_RENDERING,
    ATTRS.CONDITIONALS,
    ATTRS.RENDER_MODIFIERS,
    ATTRS.GLOBAL,
    [ATTRS.UNIQUE, ATTRS.SLOT],
    ATTRS.TWO_WAY_BINDING,
    ATTRS.OTHER_DIRECTIVES,
    otherAttrs,
    ATTRS.EVENTS,
    ATTRS.CONTENT
  ]
  if (context.options[0] && context.options[0].order) {
    attributeOrder = [...context.options[0].order]

    // check if `OTHER_ATTR` is valid
    for (const item of attributeOrder.flat()) {
      if (item === ATTRS.OTHER_ATTR) {
        for (const attribute of attributeOrder.flat()) {
          if (otherAttrs.includes(attribute)) {
            throw new Error(
              `Value "${ATTRS.OTHER_ATTR}" is not allowed with "${attribute}".`
            )
          }
        }
      }
    }

    // expand `OTHER_ATTR` alias
    for (const [index, item] of attributeOrder.entries()) {
      if (item === ATTRS.OTHER_ATTR) {
        attributeOrder[index] = otherAttrs
      } else if (Array.isArray(item) && item.includes(ATTRS.OTHER_ATTR)) {
        const attributes = item.filter((i) => i !== ATTRS.OTHER_ATTR)
        attributes.push(...otherAttrs)
        attributeOrder[index] = attributes
      }
    }
  }
  const shouldSortAlphabetical = Boolean(
    context.options[0] && context.options[0].alphabetical
  )
  const shouldSortLineLength = Boolean(
    context.options[0] && context.options[0].sortLineLength
  )
  const shouldIgnoreVBindObject = Boolean(
    context.options[0] && context.options[0].ignoreVBindObject
  )

  const attributePosition: { [key: string]: number } = {}
  for (const [i, item] of attributeOrder.entries()) {
    if (Array.isArray(item)) {
      for (const attr of item) {
        attributePosition[attr] = i
      }
    } else attributePosition[item] = i
  }

  function reportIssue(
    node: VAttribute | VDirective,
    previousNode: VAttribute | VDirective
  ) {
    const currentNode = sourceCode.getText(node.key)
    const prevNode = sourceCode.getText(previousNode.key)
    const attributes = node.parent.attributes

    let isMoveUp: (node: VAttribute | VDirective | undefined) => boolean

    if (isVBindObject(node)) {
      // prev, v-bind:foo, v-bind -> v-bind:foo, v-bind, prev
      isMoveUp = isVAttributeOrVBindOrVModel
    } else if (isVAttributeOrVBindOrVModel(node)) {
      // prev, v-bind, v-bind:foo -> v-bind, v-bind:foo, prev
      isMoveUp = isVBindObject
    } else {
      isMoveUp = () => false
    }

    const previousNodes = attributes.slice(
      attributes.indexOf(previousNode),
      attributes.indexOf(node)
    )
    const moveNodes = [node]
    for (const node of previousNodes) {
      if (isMoveUp(node)) {
        moveNodes.unshift(node)
      } else {
        moveNodes.push(node)
      }
    }

    const fix = (fixer: RuleFixer) =>
      moveNodes.map((moveNode, index) => {
        const text = sourceCode.getText(moveNode)
        return fixer.replaceText(previousNodes[index] || node, text)
      })
    const data = { currentNode, prevNode }

    // Don't autofix if it would change what `v-bind="object"` overrides
    const shouldSuggest = isVBindObjectOverrideChanged(
      [...previousNodes, node],
      moveNodes
    )
    context.report({
      node,
      messageId: 'expectedOrder',
      data,
      fix: shouldSuggest ? null : fix,
      suggest: shouldSuggest
        ? [{ messageId: 'moveAttribute', data, fix }]
        : null
    })
  }

  return utils.defineTemplateBodyVisitor(context, {
    VStartTag(node) {
      const attributeAndPositions = getAttributeAndPositionList(node)
      if (attributeAndPositions.length <= 1) {
        return
      }

      let { attr: previousNode, position: previousPosition } =
        attributeAndPositions[0]
      for (let index = 1; index < attributeAndPositions.length; index++) {
        const { attr, position } = attributeAndPositions[index]

        let isValid = previousPosition <= position
        if (isValid && previousPosition === position) {
          let isSortedByLength = false
          if (shouldSortLineLength) {
            const prevText = sourceCode.getText(previousNode)
            const currText = sourceCode.getText(attr)

            if (prevText.length !== currText.length) {
              isValid = prevText.length < currText.length
              isSortedByLength = true
            }
          }

          if (shouldSortAlphabetical && !isSortedByLength) {
            isValid = isAlphabetical(previousNode, attr, sourceCode)
          }
        }

        if (isValid) {
          previousNode = attr
          previousPosition = position
        } else {
          reportIssue(attr, previousNode)
        }
      }
    }
  })

  function getAttributeAndPositionList(
    node: VStartTag
  ): { attr: VAttribute | VDirective; position: number }[] {
    const attributes = node.attributes.filter(
      (node, index, attributes) =>
        // If ignoreVBindObject is enabled, ignore v-bind="object"
        !(shouldIgnoreVBindObject && isVBindObject(node)) &&
        // In Vue 3, ignore `v-bind="object"`, which is
        // a pair of `v-bind:foo="..."` and `v-bind="object"` and
        // a pair of `v-model="..."` and `v-bind="object"`,
        // because changing the order behaves differently.
        (!isVBindObject(node) ||
          (!isVAttributeOrVBindOrVModel(attributes[index - 1]) &&
            !isVAttributeOrVBindOrVModel(attributes[index + 1])))
    )

    const results = []
    for (const [index, attr] of attributes.entries()) {
      const position = getPositionFromAttrIndex(index)
      if (position == null) {
        // The omitted order is skipped.
        continue
      }
      results.push({ attr, position })
    }

    return results

    function getPositionFromAttrIndex(index: number): number | null {
      const node = attributes[index]
      if (isVBindObject(node)) {
        // node is `v-bind="object"` syntax

        // In Vue 3, if change the order of `v-bind:foo="..."`, `v-model="..."` and `v-bind="object"`,
        // the behavior will be different, so adjust so that there is no change in behavior.

        const len = attributes.length
        for (let nextIndex = index + 1; nextIndex < len; nextIndex++) {
          const next = attributes[nextIndex]

          if (isVAttributeOrVBindOrVModel(next) && !isVBindObject(next)) {
            // It is considered to be in the same order as the next bind prop node.
            return getPositionFromAttrIndex(nextIndex)
          }
        }
      }
      return getPosition(node, attributePosition)
    }
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce order of attributes',
      categories: ['vue3-recommended', 'vue2-recommended'],
      url: 'https://eslint.vuejs.org/rules/attributes-order.html'
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              oneOf: [
                { enum: Object.values(ATTRS) },
                {
                  type: 'array',
                  items: {
                    enum: Object.values(ATTRS),
                    uniqueItems: true,
                    additionalItems: false
                  }
                }
              ]
            },
            uniqueItems: true,
            additionalItems: false
          },
          alphabetical: { type: 'boolean' },
          sortLineLength: { type: 'boolean' },
          ignoreVBindObject: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      expectedOrder: `Attribute "{{currentNode}}" should go before "{{prevNode}}".`,
      moveAttribute:
        'Move "{{currentNode}}" before "{{prevNode}}", which changes what `v-bind="..."` overrides.'
    }
  },
  create
}
