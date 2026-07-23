import path from 'node:path'
import { FIXTURES_ROOT, verifyWithTsParser } from './utils'

const TS_TEST_FILENAME = 'test-props'
const SRC_TS_TEST_PATH = path.join(
  FIXTURES_ROOT,
  `./src/${TS_TEST_FILENAME}.ts`
)
const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-props')

function extractComponentProps(code: string, tsFileCode = '') {
  const result: {
    type: string
    name: string | null
    required: boolean | null
    types: string[] | null
  }[] = []
  verifyWithTsParser(
    code,
    {
      onDefinePropsEnter(_node, props) {
        result.push(
          ...props.map((prop) => ({
            type: prop.type,
            name: prop.propName,
            required: 'required' in prop ? prop.required : null,
            types: 'types' in prop ? prop.types : null
          }))
        )
      }
    },
    SRC_TS_TEST_PATH,
    tsFileCode
  )
  return result
}

describe.sequential('getComponentPropsFromTypeDefineTypes', () => {
  it.each([
    {
      name: 'inline-type',
      scriptCode: `defineProps<{foo:string,bar?:number}>()`
    },
    {
      name: 'intersection-type',
      scriptCode: `defineProps<{foo:string,bar?:number} & {baz?:string|number}>()`
    },
    {
      name: 'imported-type',
      tsFileCode: `export type Props = {foo:string,bar?:number}`,
      scriptCode: `import { Props } from './${TS_TEST_FILENAME}'
      defineProps<Props>()`
    },
    {
      name: 'imported-any',
      tsFileCode: `export type Props = any`,
      scriptCode: `import { Props } from './${TS_TEST_FILENAME}'
      defineProps<Props>()`
    },
    {
      name: 'imported-extends-required',
      tsFileCode: `
      interface Props {
        a?: number;
        b?: string;
      }
      export interface Props2 extends Required<Props> {
        c?: boolean;
      }`,
      scriptCode: `import { Props2 } from './${TS_TEST_FILENAME}'
      defineProps<Props2>()`
    },
    {
      name: 'imported-complex-types',
      tsFileCode: `
      export type Props = {
        a: string
        b?: number
        c?: boolean
        d?: boolean
        e?: number | string
        f?: () => number
        g?: { foo?: string }
        h?: string[]
        i?: readonly string[]
      }`,
      scriptCode: `import { Props } from './${TS_TEST_FILENAME}'
      defineProps<Props>()`
    },
    {
      name: 'imported-intersection',
      tsFileCode: `
      export interface Props {
        a?: number;
        b?: string;
      }`,
      scriptCode: `import { Props } from './${TS_TEST_FILENAME}'
defineProps<Props & {foo?:string}>()`
    },
    {
      name: 'imported-type-alias',
      tsFileCode: `
      export type A = string | number`,
      scriptCode: `import { A } from './${TS_TEST_FILENAME}'
defineProps<{foo?:A}>()`
    },
    {
      name: 'inline-enum',
      scriptCode: `enum A {a = 'a', b = 'b'}
defineProps<{foo?:A}>()`
    },
    {
      name: 'inline-enum-mixed',
      scriptCode: `
const foo = 42
enum A {a = foo, b = 'b'}
defineProps<{foo?:A}>()`
    }
  ])(
    'should return expected props with $name',
    async ({ name, scriptCode, tsFileCode }) => {
      const code = `<script setup lang="ts"> ${scriptCode} </script>`
      const props = extractComponentProps(code, tsFileCode)

      await expect(JSON.stringify(props, null, 4)).toMatchFileSnapshot(
        path.join(SNAPSHOT_ROOT, `${name}.json`)
      )
    }
  )
})
