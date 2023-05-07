'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')

const Linter = require('eslint').Linter

const {
  extractRefObjectReferences,
  extractReactiveVariableReferences
} = require('../../../lib/utils/ref-object-references')

const FIXTURE_ROOT = path.resolve(
  __dirname,
  '../../fixtures/utils/ref-object-references'
)
const REF_OBJECTS_FIXTURE_ROOT = path.resolve(FIXTURE_ROOT, 'ref-objects')
const REACTIVE_VARS_FIXTURE_ROOT = path.resolve(FIXTURE_ROOT, 'reactive-vars')

/**
 * Load test patterns from fixtures.
 *
 * @returns {object} The loaded patterns.
 */
function loadPatterns(rootDir) {
  return fs.readdirSync(rootDir).map((name) => {
    const code0 = fs.readFileSync(path.join(rootDir, name, 'source.js'), 'utf8')
    const code = code0.replace(/^<!--(.+?)-->/, `<!--${name}-->`)
    return { code, name }
  })
}

function extractRefs(code, extract) {
  const linter = new Linter()
  const references = []

  linter.defineRule('vue/extract-test', (context) => {
    const refs = extract(context)

    const processed = new Set()
    return {
      '*'(node) {
        if (processed.has(node)) {
          // Old ESLint may be called twice on the same node.
          return
        }
        processed.add(node)
        const data = refs.get(node)
        if (data) {
          references.push(data)
        }
      }
    }
  })
  const messages = linter.verify(
    code,
    {
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
      rules: { 'vue/extract-test': 'error' },
      globals: {
        $ref: 'readonly',
        $computed: 'readonly',
        $shallowRef: 'readonly',
        $customRef: 'readonly',
        $toRef: 'readonly',
        $: 'readonly',
        $$: 'readonly'
      }
    },
    undefined,
    true
  )

  const errors = messages.map((message) => message.message)
  if (errors.length > 0) {
    assert.fail(errors.join(','))
  }

  return references
}

describe('extractRefObjectReferences()', () => {
  for (const { name, code } of loadPatterns(REF_OBJECTS_FIXTURE_ROOT)) {
    describe(`'test/fixtures/utils/ref-object-references/ref-objects/${name}/source.vue'`, () => {
      it('should to extract the references to match the expected references.', () => {
        /** @type {import('../../../lib/utils/ref-object-references').RefObjectReference[]} */
        const references = [...extractRefs(code, extractRefObjectReferences)]

        let result = ''
        let start = 0
        let ref
        while ((ref = references.shift())) {
          result += code.slice(start, ref.node.range[0])
          result += `/*>*/`
          result += code.slice(...ref.node.range)
          result += `/*<${JSON.stringify({
            type: ref.type,
            method: ref.method
          })}*/`
          start = ref.node.range[1]
        }
        result += code.slice(start)

        const actual = result

        // update fixture
        // fs.writeFileSync(
        //   path.join(REF_OBJECTS_FIXTURE_ROOT, name, 'result.js'),
        //   actual,
        //   'utf8'
        // )

        const expected = fs.readFileSync(
          path.join(REF_OBJECTS_FIXTURE_ROOT, name, 'result.js'),
          'utf8'
        )
        assert.strictEqual(actual, expected)
      })
    })
  }
})
describe('extractReactiveVariableReferences()', () => {
  for (const { name, code } of loadPatterns(REACTIVE_VARS_FIXTURE_ROOT)) {
    describe(`'test/fixtures/utils/ref-object-references/reactive-vars/${name}/source.vue'`, () => {
      it('should to extract the references to match the expected references.', () => {
        /** @type {import('../../../lib/utils/ref-object-references').ReactiveVariableReference[]} */
        const references = [
          ...extractRefs(code, extractReactiveVariableReferences)
        ]

        let result = ''
        let start = 0
        let ref
        while ((ref = references.shift())) {
          result += code.slice(start, ref.node.range[0])
          result += `/*>*/`
          result += code.slice(...ref.node.range)
          result += `/*<${JSON.stringify({
            escape: ref.escape,
            method: ref.method
          })}*/`
          start = ref.node.range[1]
        }
        result += code.slice(start)

        const actual = result

        // update fixture
        // fs.writeFileSync(
        //   path.join(REACTIVE_VARS_FIXTURE_ROOT, name, 'result.js'),
        //   actual,
        //   'utf8'
        // )

        const expected = fs.readFileSync(
          path.join(REACTIVE_VARS_FIXTURE_ROOT, name, 'result.js'),
          'utf8'
        )
        assert.strictEqual(actual, expected)
      })
    })
  }
})
