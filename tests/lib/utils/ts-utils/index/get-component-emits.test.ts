import path from 'node:path'
import { FIXTURES_ROOT, verifyWithTsParser } from './utils'

const TS_TEST_FILENAME = 'test-emits'
const SRC_TS_TEST_PATH = path.join(
  FIXTURES_ROOT,
  `./src/${TS_TEST_FILENAME}.ts`
)
const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-emits')

function extractComponentEmits(code: string, tsFileCode = '') {
  const result: { type: string; name: string | null }[] = []
  verifyWithTsParser(
    code,
    {
      onDefineEmitsEnter(_node, emits) {
        result.push(
          ...emits.map((emit) => ({
            type: emit.type,
            name: emit.emitName
          }))
        )
      }
    },
    SRC_TS_TEST_PATH,
    tsFileCode
  )
  return result
}

describe.sequential('getComponentEmitsFromTypeDefineTypes', () => {
  it.each([
    {
      name: 'inline-call-signatures',
      scriptCode: `defineEmits<{(e:'foo'):void,(e:'bar'):void}>()`
    },
    {
      name: 'imported-call-signatures',
      tsFileCode: `export type Emits = {(e:'foo'):void,(e:'bar'):void}`,
      scriptCode: `import { Emits } from './${TS_TEST_FILENAME}'
      defineEmits<Emits>()`
    },
    {
      name: 'imported-any',
      tsFileCode: `export type Emits = any`,
      scriptCode: `import { Emits } from './${TS_TEST_FILENAME}'
      defineEmits<Emits>()`
    },
    {
      name: 'imported-union-call-signatures',
      tsFileCode: `export type Emits = {(e:'foo' | 'bar'): void, (e:'baz',payload:number): void}`,
      scriptCode: `import { Emits } from './${TS_TEST_FILENAME}'
      defineEmits<Emits>()`
    },
    {
      name: 'imported-record-style',
      tsFileCode: `export type Emits = { a: [], b: [number], c: [string]}`,
      scriptCode: `import { Emits } from './${TS_TEST_FILENAME}'
      defineEmits<Emits>()`
    }
  ])(
    'should return expected emits with $name',
    async ({ name, scriptCode, tsFileCode }) => {
      const code = `<script setup lang="ts"> ${scriptCode} </script>`
      const emits = extractComponentEmits(code, tsFileCode)

      await expect(JSON.stringify(emits, null, 4)).toMatchFileSnapshot(
        path.join(SNAPSHOT_ROOT, `${name}.json`)
      )
    }
  )
})
