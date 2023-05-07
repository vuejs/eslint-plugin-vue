'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')

const Linter = require('eslint').Linter

const selector = require('../../../lib/utils/selector')
const utils = require('../../../lib/utils')

const FIXTURE_ROOT = path.resolve(__dirname, '../../fixtures/utils/selector')

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
    const code = code0.replace(/^<!--(.+?)-->/, `<!--${name}-->`)
    const inputSelector = /^<!--(.+?)-->/.exec(code0)[1].trim()
    return { code, name, inputSelector }
  })
}

function extractElements(code, inputSelector) {
  const linter = new Linter()
  const matches = []

  linter.defineRule('vue/selector-test', (context) => {
    const parsed = selector.parseSelector(inputSelector, context)
    return utils.defineDocumentVisitor(context, {
      VElement(node) {
        if (parsed.test(node)) {
          matches.push(
            context.getSourceCode().text.slice(...node.startTag.range)
          )
        }
      }
    })
  })
  linter.defineParser('vue-eslint-parser', require('vue-eslint-parser'))
  const messages = linter.verify(
    code,
    {
      parser: 'vue-eslint-parser',
      parserOptions: { ecmaVersion: 2018 },
      rules: { 'vue/selector-test': 'error' }
    },
    undefined,
    true
  )

  return {
    selector: inputSelector,
    matches,
    errors: messages.map((message) => message.message)
  }
}

describe('parseSelector()', () => {
  for (const { name, code, inputSelector } of loadPatterns()) {
    describe(`'test/fixtures/utils/selector/${name}/source.vue'`, () => {
      it('should to parse the selector to match the valid elements.', () => {
        const elements = extractElements(code, inputSelector)
        const actual = JSON.stringify(elements, null, 4)

        // update fixture
        // fs.writeFileSync(
        //   path.join(FIXTURE_ROOT, name, 'result.json'),
        //   actual,
        //   'utf8'
        // )

        const expected = fs.readFileSync(
          path.join(FIXTURE_ROOT, name, 'result.json'),
          'utf8'
        )
        assert.strictEqual(actual, expected)
      })
    })
  }
})
