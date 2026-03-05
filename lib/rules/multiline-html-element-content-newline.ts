/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { kebabCase, pascalCase } from '../utils/casing.ts'
import INLINE_ELEMENTS from '../utils/inline-non-void-elements.json' with { type: 'json' }

function isMultilineElement(element: VElement & { endTag: VEndTag }) {
  return element.loc.start.line < element.endTag.loc.start.line
}

function parseOptions(options: any) {
  return Object.assign(
    {
      ignores: ['pre', 'textarea', ...INLINE_ELEMENTS],
      ignoreWhenEmpty: true,
      allowEmptyLines: false
    },
    options
  )
}

function getPhrase(lineBreaks: number) {
  switch (lineBreaks) {
    case 0: {
      return 'no'
    }
    default: {
      return `${lineBreaks}`
    }
  }
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
        'require a line break before and after the contents of a multiline element',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/multiline-html-element-content-newline.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreWhenEmpty: {
            type: 'boolean'
          },
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          },
          allowEmptyLines: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpectedAfterClosingBracket:
        'Expected 1 line break after opening tag (`<{{name}}>`), but {{actual}} line breaks found.',
      unexpectedBeforeOpeningBracket:
        'Expected 1 line break before closing tag (`</{{name}}>`), but {{actual}} line breaks found.'
    }
  },
  create(context: RuleContext) {
    const options = parseOptions(context.options[0])
    const ignores = options.ignores
    const ignoreWhenEmpty = options.ignoreWhenEmpty
    const allowEmptyLines = options.allowEmptyLines
    const sourceCode = context.sourceCode
    const template =
      sourceCode.parserServices.getTemplateBodyTokenStore &&
      sourceCode.parserServices.getTemplateBodyTokenStore()

    let inIgnoreElement: VElement | null = null

    function isIgnoredElement(node: VElement) {
      return (
        ignores.includes(node.name) ||
        ignores.includes(pascalCase(node.rawName)) ||
        ignores.includes(kebabCase(node.rawName))
      )
    }

    function isInvalidLineBreaks(lineBreaks: number) {
      return allowEmptyLines ? lineBreaks === 0 : lineBreaks !== 1
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

        const element = node as VElement & { endTag: VEndTag }

        if (!isMultilineElement(element)) {
          return
        }

        const getTokenOption: SourceCode.CursorWithCountOptions = {
          includeComments: true,
          filter: (token) => token.type !== 'HTMLWhitespace'
        }
        if (
          ignoreWhenEmpty &&
          element.children.length === 0 &&
          template.getFirstTokensBetween(
            element.startTag,
            element.endTag,
            getTokenOption
          ).length === 0
        ) {
          return
        }

        const contentFirst = template.getTokenAfter(
          element.startTag,
          getTokenOption
        )!
        const contentLast = template.getTokenBefore(
          element.endTag,
          getTokenOption
        )!

        const beforeLineBreaks =
          contentFirst.loc.start.line - element.startTag.loc.end.line
        const afterLineBreaks =
          element.endTag.loc.start.line - contentLast.loc.end.line
        if (isInvalidLineBreaks(beforeLineBreaks)) {
          context.report({
            node: template.getLastToken(element.startTag),
            loc: {
              start: element.startTag.loc.end,
              end: contentFirst.loc.start
            },
            messageId: 'unexpectedAfterClosingBracket',
            data: {
              name: element.rawName,
              actual: getPhrase(beforeLineBreaks)
            },
            fix(fixer) {
              const range: Range = [
                element.startTag.range[1],
                contentFirst.range[0]
              ]
              return fixer.replaceTextRange(range, '\n')
            }
          })
        }

        if (isEmpty(element, sourceCode)) {
          return
        }

        if (isInvalidLineBreaks(afterLineBreaks)) {
          context.report({
            node: template.getFirstToken(element.endTag),
            loc: {
              start: contentLast.loc.end,
              end: element.endTag.loc.start
            },
            messageId: 'unexpectedBeforeOpeningBracket',
            data: {
              name: element.name,
              actual: getPhrase(afterLineBreaks)
            },
            fix(fixer) {
              const range: Range = [
                contentLast.range[1],
                element.endTag.range[0]
              ]
              return fixer.replaceTextRange(range, '\n')
            }
          })
        }
      },
      'VElement:exit'(node) {
        if (inIgnoreElement === node) {
          inIgnoreElement = null
        }
      }
    })
  }
}
