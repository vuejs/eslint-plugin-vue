/**
 * @fileoverview Disallow use other than available `lang`
 * @author Yosuke Ota
 */
import utils from '../utils/index.ts'

interface BlockOptions {
  lang: Set<string>
  allowNoLang: boolean
  required: boolean
}
type Options = Record<string, BlockOptions | undefined>
interface UserBlockOptions {
  lang?: string[] | string
  allowNoLang?: boolean
  required?: boolean
}
type UserOptions = Record<string, UserBlockOptions | undefined>

/**
 * https://vuejs.github.io/vetur/guide/highlighting.html
 * <template lang="html"></template>
 * <style lang="css"></style>
 * <script lang="js"></script>
 * <script lang="javascript"></script>
 */
const DEFAULT_LANGUAGES: Record<string, string[] | undefined> = {
  template: ['html'],
  style: ['css'],
  script: ['js', 'javascript']
}

function getAllowsLangPhrase(lang: Set<string>): string {
  const langs = [...lang].map((s) => `'${s}'`)
  switch (langs.length) {
    case 1: {
      return langs[0]
    }
    default: {
      return `${langs.slice(0, -1).join(', ')}, and ${langs.at(-1)}`
    }
  }
}

/**
 * Normalizes the option of the given block.
 */
function normalizeOption(
  blockName: string,
  option: UserBlockOptions
): BlockOptions {
  let lang: Set<string>

  if (Array.isArray(option.lang)) {
    lang = new Set(option.lang)
  } else if (typeof option.lang === 'string') {
    lang = new Set([option.lang])
  } else {
    lang = new Set()
  }

  let hasDefault = false
  const defaultLanguages = DEFAULT_LANGUAGES[blockName] || []
  for (const def of defaultLanguages) {
    if (!lang.has(def)) {
      continue
    }

    lang.delete(def)
    hasDefault = true
  }
  const isRequired = option.required === true
  if (lang.size === 0) {
    return {
      lang,
      allowNoLang: true,
      required: isRequired
    }
  }
  return {
    lang,
    allowNoLang: hasDefault || Boolean(option.allowNoLang),
    required: isRequired
  }
}
/**
 * Normalizes the given options.
 */
function normalizeOptions(options: UserOptions): Options {
  if (!options) {
    return {}
  }

  const normalized: Options = {}

  for (const [blockName, value] of Object.entries(options)) {
    if (value) {
      normalized[blockName] = normalizeOption(blockName, value)
    }
  }

  return normalized
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use other than available `lang`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/block-lang.html'
    },
    schema: [
      {
        type: 'object',
        patternProperties: {
          '^(?:\\S+)$': {
            oneOf: [
              {
                type: 'object',
                properties: {
                  lang: {
                    oneOf: [
                      { type: 'string' },
                      {
                        type: 'array',
                        items: {
                          type: 'string'
                        },
                        uniqueItems: true
                      }
                    ]
                  },
                  allowNoLang: { type: 'boolean' },
                  required: { type: 'boolean' }
                },
                additionalProperties: false
              }
            ]
          }
        },
        minProperties: 1,
        additionalProperties: false
      }
    ],
    messages: {
      expected:
        "Only {{allows}} can be used for the 'lang' attribute of '<{{tag}}>'.",
      missing: "The 'lang' attribute of '<{{tag}}>' is missing.",
      missingBlock: "The '<{{tag}}>' block is missing.",
      unexpected: "Do not specify the 'lang' attribute of '<{{tag}}>'.",
      useOrNot:
        "Only {{allows}} can be used for the 'lang' attribute of '<{{tag}}>'. Or, not specifying the 'lang' attribute is allowed.",
      unexpectedDefault:
        "Do not explicitly specify the default language for the 'lang' attribute of '<{{tag}}>'."
    }
  },
  create(context: RuleContext): RuleListener {
    const options = normalizeOptions(
      context.options[0] || {
        script: { allowNoLang: true },
        template: { allowNoLang: true },
        style: { allowNoLang: true }
      }
    )
    if (Object.keys(options).length === 0) {
      return {}
    }

    function verify(element: VElement): void {
      const tag = element.name
      const option = options[tag]
      if (!option) {
        return
      }
      const lang = utils.getAttribute(element, 'lang')
      if (lang == null || lang.value == null) {
        if (!option.allowNoLang) {
          context.report({
            node: element.startTag,
            messageId: 'missing',
            data: {
              tag
            }
          })
        }
        return
      }

      if (option.lang.has(lang.value.value)) {
        return
      }

      let messageId
      if (!option.allowNoLang) {
        messageId = 'expected'
      } else if (option.lang.size === 0) {
        messageId = (DEFAULT_LANGUAGES[tag] || []).includes(lang.value.value)
          ? 'unexpectedDefault'
          : 'unexpected'
      } else {
        messageId = 'useOrNot'
      }
      context.report({
        node: lang,
        messageId,
        data: {
          tag,
          allows: getAllowsLangPhrase(option.lang)
        }
      })
    }

    /**
     * Reports the blocks that are required to exist but are not in the document.
     */
    function verifyMissingBlocks(): void {
      const documentFragment =
        context.sourceCode.parserServices.getDocumentFragment?.()
      if (!documentFragment) {
        return
      }
      const existingBlocks = new Set(
        documentFragment.children
          .filter(utils.isVElement)
          .map((element) => element.name)
      )
      for (const [tag, option] of Object.entries(options)) {
        if (!option || !option.required || existingBlocks.has(tag)) {
          continue
        }
        context.report({
          loc: { line: 1, column: 0 },
          messageId: 'missingBlock',
          data: {
            tag
          }
        })
      }
    }

    return utils.compositingVisitors(
      utils.defineDocumentVisitor(context, {
        'VDocumentFragment > VElement': verify
      }),
      {
        Program: verifyMissingBlocks
      }
    )
  }
}
