/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

type SlotStyle = 'any' | 'with-wrapper' | 'without-wrapper'

interface Options {
  /** The style for named slots. */
  namedSlotStyle: SlotStyle
  /** The style for the default slot. Inherits from `namedSlotStyle` when not set. */
  defaultSlotStyle: SlotStyle
  /** Whether HTML comments are ignored when looking for other children. */
  treatCommentsAsInsignificant: boolean
}

function normalizeOptions(options: unknown): Options {
  const normalized: Options = {
    namedSlotStyle: 'without-wrapper',
    defaultSlotStyle: 'without-wrapper',
    treatCommentsAsInsignificant: false
  }

  if (typeof options === 'string') {
    normalized.namedSlotStyle = options as SlotStyle
    normalized.defaultSlotStyle = options as SlotStyle
  } else if (options != null) {
    const opts = options as Partial<Options>
    if (opts.namedSlotStyle != null) {
      normalized.namedSlotStyle = opts.namedSlotStyle
      // `defaultSlotStyle` inherits from `namedSlotStyle` when it is not set.
      normalized.defaultSlotStyle = opts.namedSlotStyle
    }
    if (opts.defaultSlotStyle != null) {
      normalized.defaultSlotStyle = opts.defaultSlotStyle
    }
    if (opts.treatCommentsAsInsignificant != null) {
      normalized.treatCommentsAsInsignificant =
        opts.treatCommentsAsInsignificant === true
    }
  }

  return normalized
}

/**
 * Get the statically known slot name of a given `v-slot` directive.
 * Returns `null` when the name cannot be determined statically
 * (e.g. a dynamic argument such as `#[name]`).
 */
function getSlotName(vSlot: VDirective): string | null {
  const { argument } = vSlot.key
  if (argument == null) {
    return 'default'
  }
  return argument.type === 'VIdentifier' ? argument.name : null
}

/**
 * Check whether a given child node contributes to the rendered output.
 * Whitespace-only text nodes do not.
 */
function isSignificantChild(node: VElement['children'][number]): boolean {
  return node.type !== 'VText' || node.value.trim() !== ''
}

/**
 * Get the HTML comments that are direct children of a given element.
 * `vue-eslint-parser` does not put comments into `children`, so they have to be
 * matched by range instead.
 */
function getOwnComments<T extends { range: Range }>(
  element: VElement,
  comments: readonly T[]
): T[] {
  const { endTag } = element
  if (endTag == null) {
    return []
  }
  const start = element.startTag.range[1]
  const end = endTag.range[0]
  return comments.filter(
    (comment) =>
      comment.range[0] >= start &&
      comment.range[1] <= end &&
      // Exclude comments that belong to a nested element.
      element.children.every(
        (child) =>
          child.type !== 'VElement' ||
          child.range[0] > comment.range[0] ||
          comment.range[1] > child.range[1]
      )
  )
}

/**
 * Get the range to insert an attribute after, within a start tag.
 * Uses the last existing attribute, or the tag name when there is none,
 * so that multiline start tags stay readable.
 */
function getAttributeInsertRange(element: VElement): Range {
  const last = element.startTag.attributes.at(-1)
  if (last) {
    return last.range
  }
  const nameEnd = element.startTag.range[0] + 1 + element.rawName.length
  return [element.startTag.range[0], nameEnd]
}

/**
 * Get the indentation of the line that a given offset is on.
 * Returns `null` if the offset is not preceded by whitespace only.
 */
function getLineIndent(text: string, offset: number): string | null {
  const lineStart = text.lastIndexOf('\n', offset - 1) + 1
  const indent = text.slice(lineStart, offset)
  return /^[\t ]*$/u.test(indent) ? indent : null
}

/**
 * Infer the indentation step between an outer and an inner offset.
 * Returns `null` when it cannot be determined.
 */
function getIndentStep(
  text: string,
  outerOffset: number,
  innerOffset: number
): string | null {
  const outer = getLineIndent(text, outerOffset)
  const inner = getLineIndent(text, innerOffset)
  if (outer == null || inner == null) {
    return null
  }
  if (inner.length <= outer.length || !inner.startsWith(outer)) {
    return null
  }
  return inner.slice(outer.length)
}

/**
 * Add one indentation step to every line but the first.
 */
function indentLines(text: string, step: string): string {
  return text
    .split('\n')
    .map((line, index) =>
      index === 0 || line.length === 0 ? line : step + line
    )
    .join('\n')
}

/**
 * Remove the line break and indentation that surround a block of content.
 * The whitespace around the removed `<template>` already provides them.
 */
function stripSurroundingLineBreaks(text: string): string {
  return text.replace(/^\n[\t ]*/u, '').replace(/\n[\t ]*$/u, '')
}

/**
 * Remove up to one indentation step from every line but the first.
 */
function dedentLines(text: string, step: string): string {
  return text
    .split('\n')
    .map((line, index) => {
      if (index === 0) {
        return line
      }
      let removed = 0
      while (
        removed < step.length &&
        (line[removed] === ' ' || line[removed] === '\t')
      ) {
        removed++
      }
      return line.slice(removed)
    })
    .join('\n')
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce a consistent style for components with a single `v-slot`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/single-v-slot-style.html'
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [
          { enum: ['any', 'with-wrapper', 'without-wrapper'] },
          {
            type: 'object',
            properties: {
              namedSlotStyle: {
                enum: ['any', 'with-wrapper', 'without-wrapper']
              },
              defaultSlotStyle: {
                enum: ['any', 'with-wrapper', 'without-wrapper']
              },
              treatCommentsAsInsignificant: { type: 'boolean' }
            },
            additionalProperties: false
          }
        ]
      }
    ],
    messages: {
      redundantWrapper:
        "Redundant '<template>' wrapper for the only slot '{{name}}'.",
      missingWrapper:
        "Expected the only slot '{{name}}' to use a '<template>' wrapper."
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const options = normalizeOptions(context.options[0])

    function getStyle(name: string): SlotStyle {
      return name === 'default'
        ? options.defaultSlotStyle
        : options.namedSlotStyle
    }

    /**
     * Build the directive text to place directly on the component.
     * Returns `null` when no directive is needed at all.
     */
    function getDirectiveTextOnComponent(
      vSlot: VDirective,
      isDefaultSlot: boolean
    ): string | null {
      if (!isDefaultSlot) {
        // Named slots keep the author's spelling (`#foo` / `v-slot:foo`).
        return sourceCode.text.slice(vSlot.range[0], vSlot.range[1])
      }
      if (vSlot.value == null) {
        // `<MyComponent>` already means the default slot, and both
        // `<MyComponent v-slot>` and `<MyComponent #default>` are reported by
        // `vue/valid-v-slot`, so drop the directive entirely.
        return null
      }
      // `vue/valid-v-slot` requires a value here and `vue/v-slot-style`
      // defaults to `v-slot` for the default slot on a component.
      const value = sourceCode.text.slice(vSlot.key.range[1], vSlot.range[1])
      return `v-slot${value}`
    }

    /**
     * Build the directive text to place on the `<template>` wrapper.
     */
    function getDirectiveTextOnTemplate(
      vSlot: VDirective,
      isDefaultSlot: boolean
    ): string {
      if (!isDefaultSlot) {
        return sourceCode.text.slice(vSlot.range[0], vSlot.range[1])
      }
      // `vue/v-slot-style` defaults to the `#default` shorthand on a wrapper.
      const value = sourceCode.text.slice(vSlot.key.range[1], vSlot.range[1])
      return `#default${value}`
    }

    /**
     * Fix a redundant `<template>` wrapper by moving the `v-slot` directive
     * onto the component and unwrapping the children.
     */
    function* fixUnwrap(
      fixer: RuleFixer,
      component: VElement,
      template: VElement,
      vSlot: VDirective,
      isDefaultSlot: boolean
    ): IterableIterator<Fix> {
      const directiveText = getDirectiveTextOnComponent(vSlot, isDefaultSlot)
      if (directiveText != null) {
        yield fixer.insertTextAfterRange(
          getAttributeInsertRange(component),
          ` ${directiveText}`
        )
      }

      const templateEndTag = template.endTag
      const inner = templateEndTag
        ? sourceCode.text.slice(
            template.startTag.range[1],
            templateEndTag.range[0]
          )
        : ''
      const step = getIndentStep(
        sourceCode.text,
        component.range[0],
        template.range[0]
      )
      const content = stripSurroundingLineBreaks(
        step == null ? inner : dedentLines(inner, step)
      )

      // Only the `<template>` element itself is replaced, so sibling comments
      // and the surrounding whitespace are kept as they are.
      let start = template.range[0]
      if (content === '') {
        // Drop the now-empty line as well.
        const lineStart = sourceCode.text.lastIndexOf('\n', start - 1)
        if (
          lineStart !== -1 &&
          /^[\t ]*$/u.test(sourceCode.text.slice(lineStart + 1, start))
        ) {
          start = lineStart
        }
      }
      yield fixer.replaceTextRange([start, template.range[1]], content)
    }

    /**
     * Fix a missing `<template>` wrapper by moving the `v-slot` directive off
     * the component and wrapping the children.
     */
    function* fixWrap(
      fixer: RuleFixer,
      component: VElement,
      vSlot: VDirective,
      isDefaultSlot: boolean
    ): IterableIterator<Fix> {
      const componentEndTag = component.endTag
      /* c8 ignore next 3 -- guarded by the caller */
      if (componentEndTag == null) {
        return
      }

      // Remove the directive, together with the whitespace in front of it.
      const { attributes } = component.startTag
      const index = attributes.indexOf(vSlot)
      const previous = index > 0 ? attributes[index - 1] : null
      const removeFrom = previous
        ? previous.range[1]
        : component.startTag.range[0] + 1 + component.rawName.length
      yield fixer.removeRange([removeFrom, vSlot.range[1]])

      const contentStart = component.startTag.range[1]
      const contentEnd = componentEndTag.range[0]
      const content = sourceCode.text.slice(contentStart, contentEnd)
      const directiveText = getDirectiveTextOnTemplate(vSlot, isDefaultSlot)

      if (content.includes('\n')) {
        const componentIndent = getLineIndent(
          sourceCode.text,
          component.range[0]
        )
        const step = getIndentStep(
          sourceCode.text,
          component.range[0],
          contentStart + content.length - content.trimStart().length
        )
        if (componentIndent != null && step != null) {
          const inner = indentLines(content, step)
          yield fixer.replaceTextRange(
            [contentStart, contentEnd],
            `\n${componentIndent}${step}<template ${directiveText}>${inner}</template>\n${componentIndent}`
          )
          return
        }
      }

      yield fixer.replaceTextRange(
        [contentStart, contentEnd],
        `<template ${directiveText}>${content}</template>`
      )
    }

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node: VElement) {
        if (!utils.isCustomComponent(node)) {
          return
        }

        const vSlotOnComponent = utils.getDirective(node, 'slot')
        const slotTemplateChildren = node.children.filter(
          (child): child is VElement =>
            child.type === 'VElement' &&
            child.name === 'template' &&
            utils.hasDirective(child, 'slot')
        )

        if (vSlotOnComponent) {
          // `<MyComponent #foo>...</MyComponent>`
          if (slotTemplateChildren.length > 0) {
            // Mixed form, already reported by `vue/valid-v-slot`.
            return
          }
          if (vSlotOnComponent.key.modifiers.length > 0) {
            return
          }
          const name = getSlotName(vSlotOnComponent)
          if (name == null || getStyle(name) !== 'with-wrapper') {
            return
          }
          const isDefaultSlot = name === 'default'
          // A self-closing component cannot be restructured safely.
          const canFix = node.endTag != null
          context.report({
            node: vSlotOnComponent,
            messageId: 'missingWrapper',
            data: { name },
            fix: canFix
              ? (fixer) => [
                  ...fixWrap(fixer, node, vSlotOnComponent, isDefaultSlot)
                ]
              : null
          })
          return
        }

        // `<MyComponent><template #foo>...</template></MyComponent>`
        if (slotTemplateChildren.length !== 1) {
          return
        }
        const significantChildren = node.children.filter(isSignificantChild)
        if (significantChildren.length !== 1) {
          return
        }
        const template = slotTemplateChildren[0]
        /* c8 ignore next 3 -- the only significant child is the slot template */
        if (significantChildren[0] !== template) {
          return
        }
        if (!options.treatCommentsAsInsignificant) {
          const templateBody = sourceCode.ast.templateBody
          const comments = templateBody ? templateBody.comments : []
          if (getOwnComments(node, comments).length > 0) {
            return
          }
        }
        // Any other attribute (`v-if`, `v-for`, `key`, ...) changes the meaning
        // of the wrapper, so it cannot be removed.
        if (template.startTag.attributes.length !== 1) {
          return
        }
        const vSlot = utils.getDirective(template, 'slot')
        /* c8 ignore next 3 -- guaranteed by the filter above */
        if (vSlot == null) {
          return
        }
        if (vSlot.key.modifiers.length > 0) {
          return
        }
        const name = getSlotName(vSlot)
        if (name == null || getStyle(name) !== 'without-wrapper') {
          return
        }
        const isDefaultSlot = name === 'default'
        context.report({
          node: template.startTag,
          messageId: 'redundantWrapper',
          data: { name },
          fix: (fixer) => [
            ...fixUnwrap(fixer, node, template, vSlot, isDefaultSlot)
          ]
        })
      }
    })
  }
}
