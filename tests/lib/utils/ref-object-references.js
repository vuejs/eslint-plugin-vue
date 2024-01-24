'use strict'

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const vueESLintParser = require('vue-eslint-parser')

const Linter = require('../../eslint-compat').Linter

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
 * @typedef {object} LoadedPattern
 * @property {string} code The code to test.
 * @property {string} name The name of the pattern.
 * @property {string} sourceFilePath
 * @property {string} resultFilePath
 * @property {object} [options]
 * @property {string} [options.parser]
 */
/**
 * Load test patterns from fixtures.
 *
 * @returns {LoadedPattern[]} The loaded patterns.
 */
function loadPatterns(rootDir) {
  return fs.readdirSync(rootDir).map((name) => {
    for (const [sourceFile, resultFile, options] of [
      ['source.js', 'result.js'],
      [
        'source.vue',
        'result.vue',
        { languageOptions: { parser: 'vue-eslint-parser' } }
      ]
    ]) {
      const sourceFilePath = path.join(rootDir, name, sourceFile)
      if (fs.existsSync(sourceFilePath)) {
        return {
          code: fs.readFileSync(sourceFilePath, 'utf8'),
          name,
          sourceFilePath,
          resultFilePath: path.join(rootDir, name, resultFile),
          options
        }
      }
    }
  })
}

function extractRefs(code, extract, options) {
  const linter = new Linter()
  const references = []

  const messages = linter.verify(
    code,
    {
      ...options,
      plugins: {
        vue: {
          rules: {
            'extract-test': {
              create: (context) => {
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
              }
            }
          }
        }
      },
      languageOptions: {
        ...options?.languageOptions,
        ...(options?.languageOptions?.parser === 'vue-eslint-parser'
          ? { parser: vueESLintParser }
          : {}),
        ecmaVersion: 2020,
        sourceType: 'module',
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
      rules: { 'vue/extract-test': 'error' }
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
  for (const { code, sourceFilePath, resultFilePath, options } of loadPatterns(
    REF_OBJECTS_FIXTURE_ROOT
  )) {
    describe(sourceFilePath, () => {
      it('should to extract the references to match the expected references.', () => {
        /** @type {import('../../../lib/utils/ref-object-references').RefObjectReference[]} */
        const references = [
          ...extractRefs(code, extractRefObjectReferences, options)
        ]

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

        if (!fs.existsSync(resultFilePath)) {
          // update fixture
          fs.writeFileSync(resultFilePath, actual, 'utf8')
        }

        const expected = fs.readFileSync(resultFilePath, 'utf8')
        assert.strictEqual(actual, expected)
      })
    })
  }
})
describe('extractReactiveVariableReferences()', () => {
  for (const { code, sourceFilePath, resultFilePath, options } of loadPatterns(
    REACTIVE_VARS_FIXTURE_ROOT
  )) {
    describe(sourceFilePath, () => {
      it('should to extract the references to match the expected references.', () => {
        /** @type {import('../../../lib/utils/ref-object-references').ReactiveVariableReference[]} */
        const references = [
          ...extractRefs(code, extractReactiveVariableReferences, options)
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

        if (!fs.existsSync(resultFilePath)) {
          // update fixture
          fs.writeFileSync(resultFilePath, actual, 'utf8')
        }

        const expected = fs.readFileSync(resultFilePath, 'utf8')
        assert.strictEqual(actual, expected)
      })
    })
  }
})
