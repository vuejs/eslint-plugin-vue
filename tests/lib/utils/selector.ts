import fs from 'node:fs'
import path from 'node:path'
import { expect } from 'vitest'
import selector from '../../../lib/utils/selector'
import utils from '../../../lib/utils'
import { Linter } from '../../eslint-compat'
import parser from 'vue-eslint-parser'

const FIXTURE_ROOT = path.resolve(__dirname, '../../fixtures/utils/selector')

function loadPatterns() {
  return fs.readdirSync(FIXTURE_ROOT).map((name) => {
    const code0 = fs.readFileSync(
      path.join(FIXTURE_ROOT, name, 'source.vue'),
      'utf8'
    )
    const code = code0.replace(/^<!--(.+?)-->/, `<!--${name}-->`)
    const inputSelector = /^<!--(.+?)-->/.exec(code0)![1].trim()
    return { code, name, inputSelector }
  })
}

function extractElements(code: string, inputSelector: string) {
  const linter = new Linter()
  const matches: string[] = []

  const messages = linter.verify(code, {
    plugins: {
      vue: {
        rules: {
          'selector-test': {
            create: (context) => {
              const parsed = selector.parseSelector(inputSelector, context)
              return utils.defineDocumentVisitor(context, {
                VElement(node) {
                  if (parsed.test(node)) {
                    matches.push(
                      context.sourceCode.text.slice(...node.startTag.range)
                    )
                  }
                }
              })
            }
          } as RuleModule
        }
      }
    },
    languageOptions: {
      parser,
      ecmaVersion: 2018
    },
    rules: { 'vue/selector-test': 'error' }
  })

  return {
    selector: inputSelector,
    matches,
    errors: messages.map((message) => message.message)
  }
}

describe.each(loadPatterns())(
  `parseSelector() [$name]`,
  ({ name, code, inputSelector }) => {
    it('should to parse the selector to match the valid elements.', () => {
      const elements = extractElements(code, inputSelector)
      const actual = JSON.stringify(elements, null, 4)

      expect(actual).toMatchFileSnapshot(
        path.join(FIXTURE_ROOT, name, 'result.json')
      )
    })
  }
)
