/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'
import { pascalCase, kebabCase } from '../utils/casing.ts'
import INLINE_ELEMENTS from '../utils/inline-non-void-elements.json' with { type: 'json' }

function isSinglelineElement(element: VElement & { endTag: VEndTag }) {
  return element.loc.start.line === element.endTag.loc.start.line
}

function parseOptions(options: any) {
  return Object.assign(
    {
      ignores: [
        'pre',
        'textarea',
        'router-link',
        'nuxt-link',
        ...INLINE_ELEMENTS
      ],
      externalIgnores: [],
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignoreComments: false
    },
    options
  )
}

function isHTMLComment(token: Token) {
  return token.type === 'HTMLComment'
}

/**
 * Check whether the content between the given start and end is empty or not.
 * This ignores whitespaces, doesn't ignore comments.
 */
function isEmpty(
  startTagOrComment: VStartTag | Token,
  endTagOrComment: VEndTag | Token,
  sourceCode: SourceCode
): boolean {
  const start = startTagOrComment.range[1]
  const end = endTagOrComment.range[0]
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
            uniqueItems: true
          },
          externalIgnores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          },
          ignoreComments: {
            type: 'boolean'
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
    const ignoreComments = options.ignoreComments
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

        if (
          !isSinglelineElement(elem) ||
          (ignoreWhenNoAttributes && elem.startTag.attributes.length === 0)
        ) {
          return
        }

        const getTokenOption: SourceCode.CursorWithCountOptions = {
          includeComments: true,
          filter: (token) => token.type !== 'HTMLWhitespace'
        }
        let startTagOrComment: VStartTag | Token = elem.startTag
        let endTagOrComment: VEndTag | Token = elem.endTag
        let contentFirst = template.getTokenAfter(
          startTagOrComment,
          getTokenOption
        )!
        let contentLast = template.getTokenBefore(
          endTagOrComment,
          getTokenOption
        )!
        if (ignoreComments) {
          // comments on the same line as a tag are not treated as content
          while (isHTMLComment(contentFirst)) {
            startTagOrComment = contentFirst
            contentFirst = template.getTokenAfter(contentFirst, getTokenOption)!
          }
          while (isHTMLComment(contentLast)) {
            endTagOrComment = contentLast
            contentLast = template.getTokenBefore(contentLast, getTokenOption)!
          }
        }
        if (
          ignoreWhenEmpty &&
          elem.children.length === 0 &&
          template.getFirstTokensBetween(
            startTagOrComment,
            endTagOrComment,
            getTokenOption
          ).length === 0
        ) {
          return
        }

        context.report({
          node: template.getLastToken(elem.startTag),
          loc: {
            start: startTagOrComment.loc.end,
            end: contentFirst.loc.start
          },
          messageId: 'unexpectedAfterClosingBracket',
          data: {
            name: elem.rawName
          },
          fix(fixer) {
            const range: Range = [
              startTagOrComment.range[1],
              contentFirst.range[0]
            ]
            return fixer.replaceTextRange(range, '\n')
          }
        })

        if (isEmpty(startTagOrComment, endTagOrComment, sourceCode)) {
          return
        }

        context.report({
          node: template.getFirstToken(elem.endTag),
          loc: {
            start: contentLast.loc.end,
            end: endTagOrComment.loc.start
          },
          messageId: 'unexpectedBeforeOpeningBracket',
          data: {
            name: elem.rawName
          },
          fix(fixer) {
            const range: Range = [
              contentLast.range[1],
              endTagOrComment.range[0]
            ]
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
