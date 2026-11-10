/**
 * @author Dominik Ivanov
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

/** Directives whose placement this rule checks. */
const CHECKED_DIRECTIVES = new Set(['if', 'else-if', 'else', 'for'])

/**
 * Directives and attributes that make a `<template>` a slot template.
 * Slot templates are required by Vue, so this rule never reports them.
 * Same list as `vue/no-lone-template` (`slot-scope` and `scope` are deprecated, but still valid).
 */
const SLOT_DIRECTIVES = new Set(['slot', 'slot-scope', 'scope'])

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
 * The only element inside a `<template>` wrapper, or `null` when it contains anything else
 * (whitespace aside). With several elements, text or interpolations there is no single element
 * to move the directives to.
 */
function getSingleElementChild(element: VElement): VElement | null {
  let single: VElement | null = null
  for (const child of element.children) {
    if (child.type === 'VElement') {
      if (single) {
        return null
      }
      single = child
    } else if (child.type === 'VExpressionContainer' || child.value.trim()) {
      return null
    }
  }
  return single
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
    type: 'suggestion',
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
          },
          ignoreRootElements: {
            type: 'boolean'
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
    type Style = 'always' | 'never'
    const style: Style = context.options[0]?.style ?? 'always'
    const shouldIgnoreRootElements: boolean =
      context.options[0]?.ignoreRootElements ?? false

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
          // Vue 2 does not allow `<template>` as the component root, so root elements
          // cannot be wrapped there.
          if (
            shouldIgnoreRootElements &&
            element.parent.parent.type !== 'VElement'
          ) {
            return
          }
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

        if (style !== 'never' || !isTemplate || isSlotTemplate(element)) {
          return
        }

        // The directives can only be moved to a single element that has none of them yet,
        // e.g. not in `<template v-for="..."><li v-if="..." /></template>`.
        const child = getSingleElementChild(element)
        if (child && getCheckedDirectives(child).length === 0) {
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
