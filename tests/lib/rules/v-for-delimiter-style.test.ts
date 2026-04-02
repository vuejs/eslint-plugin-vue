/**
 * @fileoverview enforce `v-for` directive's delimiter style
 * @author Flo Edelmann
 * @copyright 2020 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/v-for-delimiter-style'
import vueEslintParser from 'vue-eslint-parser'
import { getTypeScriptFixtureTestOptions } from '../../test-utils/typescript'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('v-for-delimiter-style', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x in xs"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x    in xs"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x in    xs"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x    in    xs"></div></template>'
    },
    {
      // https://github.com/vuejs/vue-eslint-parser/issues/226
      filename: 'test.vue',
      code: '<template><div v-for="(x,) in xs"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="(value, key, index) in xs"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="{ x, y } in xs"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x in xs"></div></template>',
      options: ['in']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x of xs"></div></template>',
      options: ['of']
    },
    // object option: number (static: literal RHS)
    {
      filename: 'test.vue',
      code: '<template><div v-for="i in 10"></div></template>',
      options: [{ number: 'in' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="i of 10"></div></template>',
      options: [{ number: 'of' }]
    },
    // object option: string (static: literal RHS)
    {
      filename: 'test.vue',
      code: '<template><div v-for="c in \'hello\'"></div></template>',
      options: [{ string: 'in' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="c of \'hello\'"></div></template>',
      options: [{ string: 'of' }]
    },
    // object option: object (static: 3 left-side variables)
    {
      filename: 'test.vue',
      code: '<template><div v-for="(v, k, i) in obj"></div></template>',
      options: [{ object: 'in' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="(v, k, i) of obj"></div></template>',
      options: [{ object: 'of' }]
    },
    // object option: unknown type not configured → skip
    {
      filename: 'test.vue',
      code: '<template><div v-for="item in items"></div></template>',
      options: [{ array: 'of' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="item of items"></div></template>',
      options: [{ object: 'in' }]
    },
    // object option: unknown type configured → enforce
    {
      filename: 'test.vue',
      code: '<template><div v-for="item of items"></div></template>',
      options: [{ unknown: 'of' }]
    },
    // object option: empty option object → nothing enforced
    {
      filename: 'test.vue',
      code: '<template><div v-for="item in items"></div></template>',
      options: [{}]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="item of items"></div></template>',
      options: [{}]
    },
    // object option: number type not configured even when others are
    {
      filename: 'test.vue',
      code: '<template><div v-for="i of 10"></div></template>',
      options: [{ array: 'of', object: 'in' }]
    },

    // array: string[]
    {
      code: `<template><div v-for="item of items"></div></template>
<script setup lang="ts">
const items: string[] = ['a', 'b']
</script>`,
      options: [{ array: 'of' }],
      ...getTypeScriptFixtureTestOptions()
    },
    // array: not configured → skip even if TS knows it's an array
    {
      code: `<template><div v-for="item in items"></div></template>
<script setup lang="ts">
const items: string[] = ['a', 'b']
</script>`,
      options: [{ object: 'in' }],
      ...getTypeScriptFixtureTestOptions()
    },
    {
      code: `<template><div v-for="item of items"></div></template>
<script setup lang="ts">
const items: string[] = ['a', 'b']
</script>`,
      options: [{ object: 'in' }],
      ...getTypeScriptFixtureTestOptions()
    },
    // object: Record<string, number>
    {
      code: `<template><div v-for="v in obj"></div></template>
<script setup lang="ts">
const obj: Record<string, number> = {}
</script>`,
      options: [{ object: 'in' }],
      ...getTypeScriptFixtureTestOptions()
    },
    // iterable: Set<string>
    {
      code: `<template><div v-for="item of s"></div></template>
<script setup lang="ts">
const s: Set<string> = new Set()
</script>`,
      options: [{ iterable: 'of' }],
      ...getTypeScriptFixtureTestOptions()
    },
    // number variable
    {
      code: `<template><div v-for="i of n"></div></template>
<script setup lang="ts">
const n: number = 10
</script>`,
      options: [{ number: 'of' }],
      ...getTypeScriptFixtureTestOptions()
    },
    // string variable
    {
      code: `<template><div v-for="c in str"></div></template>
<script setup lang="ts">
const str: string = 'hello'
</script>`,
      options: [{ string: 'in' }],
      ...getTypeScriptFixtureTestOptions()
    },
    // union of same category: (string | 'literal')[] → still array
    {
      code: `<template><div v-for="item of items"></div></template>
<script setup lang="ts">
const items: Array<string | number> = []
</script>`,
      options: [{ array: 'of' }],
      ...getTypeScriptFixtureTestOptions()
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-for="x of xs"></div></template>',
      output: '<template><div v-for="x in xs"></div></template>',
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="(x, index) of xs"></div></template>',
      output: '<template><div v-for="(x, index) in xs"></div></template>',
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x    of xs"></div></template>',
      output: '<template><div v-for="x    in xs"></div></template>',
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x of    xs"></div></template>',
      output: '<template><div v-for="x in    xs"></div></template>',
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x    of    xs"></div></template>',
      output: '<template><div v-for="x    in    xs"></div></template>',
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x of xs"></div></template>',
      output: '<template><div v-for="x in xs"></div></template>',
      options: ['in'],
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="x in xs"></div></template>',
      output: '<template><div v-for="x of xs"></div></template>',
      options: ['of'],
      errors: [
        {
          message: "Expected 'of' instead of 'in' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    // object option: number
    {
      filename: 'test.vue',
      code: '<template><div v-for="i of 10"></div></template>',
      output: '<template><div v-for="i in 10"></div></template>',
      options: [{ number: 'in' }],
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="i in 10"></div></template>',
      output: '<template><div v-for="i of 10"></div></template>',
      options: [{ number: 'of' }],
      errors: [
        {
          message: "Expected 'of' instead of 'in' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    // object option: string
    {
      filename: 'test.vue',
      code: '<template><div v-for="c of \'hello\'"></div></template>',
      output: '<template><div v-for="c in \'hello\'"></div></template>',
      options: [{ string: 'in' }],
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="c in \'hello\'"></div></template>',
      output: '<template><div v-for="c of \'hello\'"></div></template>',
      options: [{ string: 'of' }],
      errors: [
        {
          message: "Expected 'of' instead of 'in' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    // object option: object (3 left-side variables)
    {
      filename: 'test.vue',
      code: '<template><div v-for="(v, k, i) of obj"></div></template>',
      output: '<template><div v-for="(v, k, i) in obj"></div></template>',
      options: [{ object: 'in' }],
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="(v, k, i) in obj"></div></template>',
      output: '<template><div v-for="(v, k, i) of obj"></div></template>',
      options: [{ object: 'of' }],
      errors: [
        {
          message: "Expected 'of' instead of 'in' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    // object option: unknown type configured
    {
      filename: 'test.vue',
      code: '<template><div v-for="item in items"></div></template>',
      output: '<template><div v-for="item of items"></div></template>',
      options: [{ unknown: 'of' }],
      errors: [
        {
          message: "Expected 'of' instead of 'in' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="item of items"></div></template>',
      output: '<template><div v-for="item in items"></div></template>',
      options: [{ unknown: 'in' }],
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 36
        }
      ]
    },

    // array: string[]
    {
      code: `<template><div v-for="item in items"></div></template>
<script setup lang="ts">
const items: string[] = ['a', 'b']
</script>`,
      output: `<template><div v-for="item of items"></div></template>
<script setup lang="ts">
const items: string[] = ['a', 'b']
</script>`,
      options: [{ array: 'of' }],
      errors: [
        {
          message: "Expected 'of' instead of 'in' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 36
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },
    // object: Record<string, number>
    {
      code: `<template><div v-for="v of obj"></div></template>
<script setup lang="ts">
const obj: Record<string, number> = {}
</script>`,
      output: `<template><div v-for="v in obj"></div></template>
<script setup lang="ts">
const obj: Record<string, number> = {}
</script>`,
      options: [{ object: 'in' }],
      errors: [
        {
          message: "Expected 'in' instead of 'of' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 31
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },
    // iterable: Set<string>
    {
      code: `<template><div v-for="item in s"></div></template>
<script setup lang="ts">
const s: Set<string> = new Set()
</script>`,
      output: `<template><div v-for="item of s"></div></template>
<script setup lang="ts">
const s: Set<string> = new Set()
</script>`,
      options: [{ iterable: 'of' }],
      errors: [
        {
          message: "Expected 'of' instead of 'in' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 32
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },
    // number variable
    {
      code: `<template><div v-for="i in n"></div></template>
<script setup lang="ts">
const n: number = 10
</script>`,
      output: `<template><div v-for="i of n"></div></template>
<script setup lang="ts">
const n: number = 10
</script>`,
      options: [{ number: 'of' }],
      errors: [
        {
          message: "Expected 'of' instead of 'in' in 'v-for'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 29
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    }
  ]
})
