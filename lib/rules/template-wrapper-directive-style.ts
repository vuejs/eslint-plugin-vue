/**
 * @author Dominik Ivanov
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

/** Directives whose placement this rule checks. */
const CHECKED_DIRECTIVES = new Set(['if', 'else-if', 'else', 'for'])

/**
 * Directives and attributes that make a `<template>` a slot template.
 * Slot templates are required by Vue, so this rule never reports them.
 * Same list as `vue/no-lone-template` (`slot-scope` and `scope` are deprecated, but still valid).
 */
const SLOT_DIRECTIVES = new Set(['slot', 'slot-scope', 'scope'])

type Style = 'always' | 'never'

function isSlotTemplate(element: VElement): boolean {
  return element.startTag.attributes.some((attr) => {
    if (attr.directive) {
      const name = attr.key.name.name
      return (
        SLOT_DIRECTIVES.has(name) ||
        // `:slot="..."` (deprecated in Vue.js 2.6)
        (name === 'bind' &&
          attr.key.argument != null &&
          attr.key.argument.type === 'VIdentifier' &&
          attr.key.argument.name === 'slot')
      )
    }
    // `slot="..."` (deprecated in Vue.js 2.6)
    return attr.key.name === 'slot'
  })
}

/**
 * Whether the directives of a `<template>` wrapper could be moved to its content, which is the case
 * only when it contains exactly one element and nothing else (whitespace aside). With several
 * elements, text or interpolations there is no single element to move the directives to.
 */
function hasSingleElementChild(element: VElement): boolean {
  let elements = 0
  for (const child of element.children) {
    if (child.type === 'VElement') {
      elements++
    } else if (child.type === 'VExpressionContainer' || child.value.trim()) {
      return false
    }
  }
  return elements === 1
}

/** The checked directives of an element, in source order. */
function getCheckedDirectives(element: VElement): VDirective[] {
  return element.startTag.attributes.filter(
    (attr): attr is VDirective =>
      attr.directive && CHECKED_DIRECTIVES.has(attr.key.name.name)
  )
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce or disallow `v-if`, `v-else-if`, `v-else` and `v-for` on `<template>` wrappers',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/template-wrapper-directive-style.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          style: {
            enum: ['always', 'never']
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      requireTemplate:
        'Expected `{{directive}}` on a `<template>` wrapper instead of `<{{element}}>`.',
      disallowTemplate:
        'Expected `{{directive}}` on the element instead of a `<template>` wrapper.'
    }
  },
  create(context: RuleContext) {
    const style: Style = context.options[0]?.style ?? 'always'

    return utils.defineTemplateBodyVisitor(context, {
      VElement(element: VElement) {
        // The root `<template>` of a single-file component is not a wrapper.
        if (element.parent.type !== 'VElement') {
          return
        }

        const directives = getCheckedDirectives(element)
        if (directives.length === 0) {
          return
        }

        const isTemplate = element.name === 'template'

        if (style === 'always' && !isTemplate) {
          for (const directive of directives) {
            context.report({
              node: directive,
              messageId: 'requireTemplate',
              data: {
                directive: `v-${directive.key.name.name}`,
                element: element.rawName
              }
            })
          }
          return
        }

        if (
          style === 'never' &&
          isTemplate &&
          !isSlotTemplate(element) &&
          hasSingleElementChild(element)
        ) {
          for (const directive of directives) {
            context.report({
              node: directive,
              messageId: 'disallowTemplate',
              data: { directive: `v-${directive.key.name.name}` }
            })
          }
        }
      }
    })
  }
}
