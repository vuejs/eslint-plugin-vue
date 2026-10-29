/**
 * @fileoverview Enforce line breaks style after opening and before closing block-level tags.
 * @author Yosuke Ota
 */
import utils from '../utils/index.js'

type OptionType = 'always' | 'never' | 'consistent' | 'ignore'
interface ContentsOptions {
  singleline?: OptionType
  multiline?: OptionType
  maxEmptyLines?: number
}

function getLinebreakCount(text: string): number {
  return text.split(/\r\n|[\r\n\u{2028}\u{2029}]/gu).length - 1
}

function getPhrase(lineBreaks: number) {
  switch (lineBreaks) {
    case 1: {
      return '1 line break'
    }
    default: {
      return `${lineBreaks} line breaks`
    }
  }
}

const ENUM_OPTIONS = { enum: ['always', 'never', 'consistent', 'ignore'] }
export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce line breaks after opening and before closing block-level tags',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/block-tag-newline.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          singleline: ENUM_OPTIONS,
          multiline: ENUM_OPTIONS,
          maxEmptyLines: { type: 'number', minimum: 0 },
          blocks: {
            type: 'object',
            patternProperties: {
              '^(?:\\S+)$': {
                type: 'object',
                properties: {
                  singleline: ENUM_OPTIONS,
                  multiline: ENUM_OPTIONS,
                  maxEmptyLines: { type: 'number', minimum: 0 }
                },
                additionalProperties: false
              }
            },
            additionalProperties: false
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpectedOpeningLinebreak:
        "There should be no line break after '<{{tag}}>'.",
      expectedOpeningLinebreak:
        "Expected {{expected}} after '<{{tag}}>', but {{actual}} found.",
      expectedClosingLinebreak:
        "Expected {{expected}}  before '</{{tag}}>', but {{actual}} found.",
      missingOpeningLinebreak: "A line break is required after '<{{tag}}>'.",
      missingClosingLinebreak: "A line break is required before '</{{tag}}>'."
    }
  },
  create(context: RuleContext) {
    type ArgsOptions = Required<ContentsOptions>
    type Options = ContentsOptions & {
      blocks?: { [element: string]: ContentsOptions }
    }

    const sourceCode = context.sourceCode
    const df =
      sourceCode.parserServices.getDocumentFragment &&
      sourceCode.parserServices.getDocumentFragment()
    if (!df) {
      return {}
    }

    function verifyBeforeSpaces(
      startTag: VStartTag,
      beforeText: string,
      beforeLinebreakCount: number,
      beforeOption: 'always' | 'never',
      maxEmptyLines: number
    ): void {
      if (beforeOption === 'always') {
        if (beforeLinebreakCount === 0) {
          context.report({
            loc: {
              start: startTag.loc.end,
              end: startTag.loc.end
            },
            messageId: 'missingOpeningLinebreak',
            data: { tag: startTag.parent.name },
            fix(fixer) {
              return fixer.insertTextAfter(startTag, '\n')
            }
          })
        } else if (maxEmptyLines < beforeLinebreakCount - 1) {
          context.report({
            loc: {
              start: startTag.loc.end,
              end: sourceCode.getLocFromIndex(
                startTag.range[1] + beforeText.length
              )
            },
            messageId: 'expectedOpeningLinebreak',
            data: {
              tag: startTag.parent.name,
              expected: getPhrase(maxEmptyLines + 1),
              actual: getPhrase(beforeLinebreakCount)
            },
            fix(fixer) {
              return fixer.replaceTextRange(
                [startTag.range[1], startTag.range[1] + beforeText.length],
                '\n'.repeat(maxEmptyLines + 1)
              )
            }
          })
        }
      } else {
        if (beforeLinebreakCount > 0) {
          context.report({
            loc: {
              start: startTag.loc.end,
              end: sourceCode.getLocFromIndex(
                startTag.range[1] + beforeText.length
              )
            },
            messageId: 'unexpectedOpeningLinebreak',
            data: { tag: startTag.parent.name },
            fix(fixer) {
              return fixer.removeRange([
                startTag.range[1],
                startTag.range[1] + beforeText.length
              ])
            }
          })
        }
      }
    }
    function verifyAfterSpaces(
      endTag: VEndTag,
      afterText: string,
      afterLinebreakCount: number,
      afterOption: 'always' | 'never',
      maxEmptyLines: number
    ): void {
      if (afterOption === 'always') {
        if (afterLinebreakCount === 0) {
          context.report({
            loc: {
              start: endTag.loc.start,
              end: endTag.loc.start
            },
            messageId: 'missingClosingLinebreak',
            data: { tag: endTag.parent.name },
            fix(fixer) {
              return fixer.insertTextBefore(endTag, '\n')
            }
          })
        } else if (maxEmptyLines < afterLinebreakCount - 1) {
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(
                endTag.range[0] - afterText.length
              ),
              end: endTag.loc.start
            },
            messageId: 'expectedClosingLinebreak',
            data: {
              tag: endTag.parent.name,
              expected: getPhrase(maxEmptyLines + 1),
              actual: getPhrase(afterLinebreakCount)
            },
            fix(fixer) {
              return fixer.replaceTextRange(
                [endTag.range[0] - afterText.length, endTag.range[0]],
                '\n'.repeat(maxEmptyLines + 1)
              )
            }
          })
        }
      } else {
        if (afterLinebreakCount > 0) {
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(
                endTag.range[0] - afterText.length
              ),
              end: endTag.loc.start
            },
            messageId: 'unexpectedOpeningLinebreak',
            data: { tag: endTag.parent.name },
            fix(fixer) {
              return fixer.removeRange([
                endTag.range[0] - afterText.length,
                endTag.range[0]
              ])
            }
          })
        }
      }
    }
    function verifyElement(element: VElement, options: ArgsOptions): void {
      const { startTag, endTag } = element
      if (endTag == null || startTag.selfClosing) {
        return
      }
      const text = sourceCode.text.slice(startTag.range[1], endTag.range[0])

      const trimText = text.trim()
      if (!trimText) {
        return
      }

      const option =
        options.multiline !== options.singleline &&
        /[\n\r\u{2028}\u{2029}]/u.test(text.trim())
          ? options.multiline
          : options.singleline
      if (option === 'ignore') {
        return
      }
      const beforeText = /^\s*/u.exec(text)![0]
      const afterText = /\s*$/u.exec(text)![0]
      const beforeLinebreakCount = getLinebreakCount(beforeText)
      const afterLinebreakCount = getLinebreakCount(afterText)

      let beforeOption: 'always' | 'never'
      let afterOption: 'always' | 'never'
      if (option === 'always' || option === 'never') {
        beforeOption = option
        afterOption = option
      } else {
        // consistent
        if (beforeLinebreakCount > 0 === afterLinebreakCount > 0) {
          return
        }
        beforeOption = 'always'
        afterOption = 'always'
      }

      verifyBeforeSpaces(
        startTag,
        beforeText,
        beforeLinebreakCount,
        beforeOption,
        options.maxEmptyLines
      )

      verifyAfterSpaces(
        endTag,
        afterText,
        afterLinebreakCount,
        afterOption,
        options.maxEmptyLines
      )
    }

    /**
     * Normalizes a given option value.
     */
    function normalizeOptionValue(
      option: Options | undefined
    ): (element: VElement) => void {
      if (!option) {
        return normalizeOptionValue({})
      }

      const contentsOptions: ContentsOptions = option
      const options: ArgsOptions = {
        singleline: contentsOptions.singleline || 'consistent',
        multiline: contentsOptions.multiline || 'always',
        maxEmptyLines: contentsOptions.maxEmptyLines || 0
      }
      const { blocks } = option
      if (!blocks) {
        return (element) => verifyElement(element, options)
      }

      return (element) => {
        const { name } = element
        const elementsOptions = blocks[name]
        if (elementsOptions) {
          normalizeOptionValue({
            singleline: elementsOptions.singleline || options.singleline,
            multiline: elementsOptions.multiline || options.multiline,
            maxEmptyLines:
              elementsOptions.maxEmptyLines ?? options.maxEmptyLines
          })(element)
        } else {
          verifyElement(element, options)
        }
      }
    }

    const documentFragment = df

    const verify = normalizeOptionValue(context.options[0])

    return utils.defineTemplateBodyVisitor(
      context,
      {},
      {
        Program(node: Program) {
          if (utils.hasInvalidEOF(node)) {
            return
          }

          for (const element of documentFragment.children) {
            if (utils.isVElement(element)) {
              verify(element)
            }
          }
        }
      }
    )
  }
}
