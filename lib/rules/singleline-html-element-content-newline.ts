/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { pascalCase, kebabCase } from '../utils/casing.ts'
import INLINE_ELEMENTS from '../utils/inline-non-void-elements.json' with { type: 'json' }

function isSinglelineElement(element: VElement & { endTag: VEndTag }) {
  return element.loc.start.line === element.endTag.loc.start.line
}

function parseOptions(options: any) {
  return Object.assign(
    {
      ignores: ['pre', 'textarea', ...INLINE_ELEMENTS],
      externalIgnores: [],
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true
    },
    options
  )
}

/**
 * Check whether the given element is empty or not.
 * This ignores whitespaces, doesn't ignore comments.
 */
function isEmpty(
  node: VElement & { endTag: VEndTag },
  sourceCode: SourceCode
): boolean {
  const start = node.startTag.range[1]
  const end = node.endTag.range[0]
  return sourceCode.text.slice(start, end).trim() === ''
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'require a line break before and after the contents of a singleline element',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/singleline-html-element-content-newline.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreWhenNoAttributes: {
            type: 'boolean'
          },
          ignoreWhenEmpty: {
            type: 'boolean'
          },
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          },
          externalIgnores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpectedAfterClosingBracket:
        'Expected 1 line break after opening tag (`<{{name}}>`), but no line breaks found.',
      unexpectedBeforeOpeningBracket:
        'Expected 1 line break before closing tag (`</{{name}}>`), but no line breaks found.'
    }
  },
  create(context: RuleContext) {
    const options = parseOptions(context.options[0])
    const ignores = new Set([...options.ignores, ...options.externalIgnores])
    const ignoreWhenNoAttributes = options.ignoreWhenNoAttributes
    const ignoreWhenEmpty = options.ignoreWhenEmpty
    const sourceCode = context.sourceCode
    const template =
      sourceCode.parserServices.getTemplateBodyTokenStore &&
      sourceCode.parserServices.getTemplateBodyTokenStore()

    let inIgnoreElement: VElement | null = null

    function isIgnoredElement(node: VElement) {
      return (
        ignores.has(node.name) ||
        ignores.has(pascalCase(node.rawName)) ||
        ignores.has(kebabCase(node.rawName))
      )
    }

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (inIgnoreElement) {
          return
        }
        if (isIgnoredElement(node)) {
          // ignore element name
          inIgnoreElement = node
          return
        }
        if (node.startTag.selfClosing || !node.endTag) {
          // self closing
          return
        }

        const elem = node as VElement & { endTag: VEndTag }

        if (!isSinglelineElement(elem)) {
          return
        }
        if (ignoreWhenNoAttributes && elem.startTag.attributes.length === 0) {
          return
        }

        const getTokenOption: SourceCode.CursorWithCountOptions = {
          includeComments: true,
          filter: (token) => token.type !== 'HTMLWhitespace'
        }
        if (
          ignoreWhenEmpty &&
          elem.children.length === 0 &&
          template.getFirstTokensBetween(
            elem.startTag,
            elem.endTag,
            getTokenOption
          ).length === 0
        ) {
          return
        }

        const contentFirst = template.getTokenAfter(
          elem.startTag,
          getTokenOption
        )!
        const contentLast = template.getTokenBefore(
          elem.endTag,
          getTokenOption
        )!

        context.report({
          node: template.getLastToken(elem.startTag),
          loc: {
            start: elem.startTag.loc.end,
            end: contentFirst.loc.start
          },
          messageId: 'unexpectedAfterClosingBracket',
          data: {
            name: elem.rawName
          },
          fix(fixer) {
            const range: Range = [elem.startTag.range[1], contentFirst.range[0]]
            return fixer.replaceTextRange(range, '\n')
          }
        })

        if (isEmpty(elem, sourceCode)) {
          return
        }

        context.report({
          node: template.getFirstToken(elem.endTag),
          loc: {
            start: contentLast.loc.end,
            end: elem.endTag.loc.start
          },
          messageId: 'unexpectedBeforeOpeningBracket',
          data: {
            name: elem.rawName
          },
          fix(fixer) {
            const range: Range = [contentLast.range[1], elem.endTag.range[0]]
            return fixer.replaceTextRange(range, '\n')
          }
        })
      },
      'VElement:exit'(node) {
        if (inIgnoreElement === node) {
          inIgnoreElement = null
        }
      }
    })
  }
}
