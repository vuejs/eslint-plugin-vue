'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')

const Linter = require('eslint').Linter

const htmlComments = require('../../../lib/utils/html-comments')

const FIXTURE_ROOT = path.resolve(
  __dirname,
  '../../fixtures/utils/html-comments'
)

/**
 * Load test patterns from fixtures.
 *
 * @returns {object} The loaded patterns.
 */
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
    const option = JSON.parse(/^<!--(.+?)-->/.exec(code0)[1])
    return { code, name, option }
  })
}

function tokenize(code, option) {
  const linter = new Linter()
  const result = []

  linter.defineRule('vue/html-comments-test', (content) =>
    htmlComments.defineVisitor(content, option, (commentTokens) => {
      result.push(commentTokens)
    })
  )
  linter.defineParser('vue-eslint-parser', require('vue-eslint-parser'))
  linter.verify(
    code,
    {
      parser: 'vue-eslint-parser',
      parserOptions: { ecmaVersion: 2018 },
      rules: { 'vue/html-comments-test': 'error' }
    },
    undefined,
    true
  )

  return result
}

describe('defineVisitor()', () => {
  for (const { name, code, option } of loadPatterns()) {
    describe(`'test/fixtures/utils/html-comments/${name}/source.vue'`, () => {
      it('should be parsed to valid tokens.', () => {
        const tokens = tokenize(code, option)

        const actual = JSON.stringify(tokens, null, 4)

        // update fixture
        // fs.writeFileSync(path.join(FIXTURE_ROOT, name, 'comment-tokens.json'), actual, 'utf8')

        const expected = fs.readFileSync(
          path.join(FIXTURE_ROOT, name, 'comment-tokens.json'),
          'utf8'
        )
        assert.strictEqual(actual, expected)
      })
    })
  }
})
