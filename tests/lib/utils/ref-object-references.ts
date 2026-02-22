import * as eslint from 'eslint'
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'
import vueESLintParser from 'vue-eslint-parser'
import { Linter } from '../../eslint-compat'
import {
  extractRefObjectReferences,
  extractReactiveVariableReferences,
  RefObjectReferences,
  RefObjectReference,
  ReactiveVariableReferences,
  ReactiveVariableReference
} from '../../../lib/utils/ref-object-references'

const FIXTURE_ROOT = path.resolve(
  __dirname,
  '../../fixtures/utils/ref-object-references'
)
const REF_OBJECTS_FIXTURE_ROOT = path.resolve(FIXTURE_ROOT, 'ref-objects')
const REACTIVE_VARS_FIXTURE_ROOT = path.resolve(FIXTURE_ROOT, 'reactive-vars')

interface LoadedPattern {
  code: string
  name: string
  sourceFilePath: string
  resultFilePath: string
  options?: eslint.Linter.FlatConfig
}

function loadPatterns(rootDir: string): LoadedPattern[] {
  return fs.readdirSync(rootDir).map((name) => {
    for (const [sourceFile, resultFile, options] of [
      ['source.js', 'result.js'],
      [
        'source.vue',
        'result.vue',
        { languageOptions: { parser: vueESLintParser } }
      ]
    ] satisfies [string, string, eslint.Linter.FlatConfig?][]) {
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
    throw new Error(`No source file found for pattern: ${name}`)
  })
}

function extractRefs(
  code: string,
  extract: (context: RuleContext) => RefObjectReferences,
  options: LoadedPattern['options']
): RefObjectReference[]
function extractRefs(
  code: string,
  extract: (context: RuleContext) => ReactiveVariableReferences,
  options: LoadedPattern['options']
): ReactiveVariableReference[]
function extractRefs(
  code: string,
  extract: (
    context: RuleContext
  ) => RefObjectReferences | ReactiveVariableReferences,
  options: LoadedPattern['options']
) {
  const linter = new Linter()
  const references: (RefObjectReference | ReactiveVariableReference)[] = []

  const messages = linter.verify(code, {
    ...options,
    plugins: {
      vue: {
        rules: {
          'extract-test': {
            create: (context): RuleListener => {
              const refs = extract(context)

              const processed = new Set<ESNode>()
              return {
                '*'(node: ESNode) {
                  if (processed.has(node)) {
                    // Old ESLint may be called twice on the same node.
                    return
                  }
                  processed.add(node)
                  const data = refs.get(node as Identifier)
                  if (data) {
                    references.push(data)
                  }
                }
              }
            }
          } as RuleModule
        }
      }
    },
    languageOptions: {
      ...options?.languageOptions,
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
  })

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

        expect(result).toMatchFileSnapshot(resultFilePath)
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

        expect(result).toMatchFileSnapshot(resultFilePath)
      })
    })
  }
})
