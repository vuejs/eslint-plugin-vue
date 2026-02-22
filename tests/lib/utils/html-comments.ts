import fs from 'node:fs'
import path from 'node:path'
import { Linter } from '../../eslint-compat'
import htmlComments, {
  CommentParserConfig,
  ParsedHTMLComment
} from '../../../lib/utils/html-comments'
import vueEslintParser from 'vue-eslint-parser'

const FIXTURE_ROOT = path.resolve(
  __dirname,
  '../../fixtures/utils/html-comments'
)

function loadPatterns() {
  return fs.readdirSync(FIXTURE_ROOT).map((name) => {
    const code0 = fs.readFileSync(
      path.join(FIXTURE_ROOT, name, 'source.vue'),
      'utf8'
    )
    const code = code0.replace(
      /^<!--(.+?)-->/,
      `<test-name>${name}</test-name>`
    )
    const option: CommentParserConfig = JSON.parse(
      /^<!--(.+?)-->/.exec(code0)![1]
    )
    return { code, name, option }
  })
}

function tokenize(code: string, option: CommentParserConfig) {
  const linter = new Linter()
  const result: ParsedHTMLComment[] = []

  linter.verify(code, {
    languageOptions: {
      parser: vueEslintParser,
      ecmaVersion: 2018
    },
    plugins: {
      vue: {
        rules: {
          'html-comments-test': {
            create: (content) =>
              htmlComments.defineVisitor(content, option, (commentTokens) => {
                result.push(commentTokens)
              })
          } as RuleModule
        }
      }
    },
    rules: { 'vue/html-comments-test': 'error' }
  })

  return result
}

describe('defineVisitor()', () => {
  for (const { name, code, option } of loadPatterns()) {
    describe(`'test/fixtures/utils/html-comments/${name}/source.vue'`, () => {
      it('should be parsed to valid tokens.', () => {
        const tokens = tokenize(code, option)

        const actual = JSON.stringify(tokens, null, 4)

        expect(actual).toMatchFileSnapshot(
          path.join(FIXTURE_ROOT, name, 'comment-tokens.json')
        )
      })
    })
  }
})
