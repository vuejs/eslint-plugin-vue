/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-content-outside-block'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2020 }
})

tester.run('no-content-outside-block', rule as RuleModule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `<template>
  <div>666</div>
</template>

<script>
export default {}
</script>

<style>
div {
  color: red;
}
</style>
`
    },
    {
      // only a `<script>` block
      filename: 'test.vue',
      code: `<script>
console.log(1)
</script>
`
    },
    {
      // HTML comments outside of the blocks are allowed
      filename: 'test.vue',
      code: `<!-- leading comment -->
<template>
  <div>666</div>
</template>
<!-- comment between the blocks -->
<script>
export default {}
</script>
<!-- trailing comment -->
`
    },
    {
      // custom blocks are elements, not stray content
      filename: 'test.vue',
      code: `<docs>
Some documentation.
</docs>

<i18n>
{ "en": { "hello": "hello" } }
</i18n>

<template>
  <div>666</div>
</template>
`
    },
    {
      // not a `.vue` file
      filename: 'test.js',
      code: 'console.log(1)'
    }
  ],
  invalid: [
    {
      // content between the blocks
      filename: 'test.vue',
      code: `<template>
  <div>666</div>
</template>

console.log(1);

<script>
console.log(2);
</script>
`,
      errors: [
        {
          messageId: 'unexpectedContent',
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 16,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `<template>
  <div>666</div>
</template>



<script>
console.log(2);
</script>
`
            }
          ]
        }
      ]
    },
    {
      // content before the first block
      filename: 'test.vue',
      code: `hello world

<template>
  <div>666</div>
</template>
`,
      errors: [
        {
          messageId: 'unexpectedContent',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 12,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `

<template>
  <div>666</div>
</template>
`
            }
          ]
        }
      ]
    },
    {
      // content after the last block
      filename: 'test.vue',
      code: `<template>
  <div>666</div>
</template>

trailing text
`,
      errors: [
        {
          messageId: 'unexpectedContent',
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 14,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `<template>
  <div>666</div>
</template>


`
            }
          ]
        }
      ]
    },
    {
      // multiple separate runs
      filename: 'test.vue',
      code: `before

<template>
  <div>666</div>
</template>

middle

<script>
export default {}
</script>

after
`,
      errors: [
        {
          messageId: 'unexpectedContent',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 7,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `

<template>
  <div>666</div>
</template>

middle

<script>
export default {}
</script>

after
`
            }
          ]
        },
        {
          messageId: 'unexpectedContent',
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 7,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `before

<template>
  <div>666</div>
</template>



<script>
export default {}
</script>

after
`
            }
          ]
        },
        {
          messageId: 'unexpectedContent',
          line: 13,
          column: 1,
          endLine: 13,
          endColumn: 6,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `before

<template>
  <div>666</div>
</template>

middle

<script>
export default {}
</script>


`
            }
          ]
        }
      ]
    },
    {
      // a multi-line run is reported once, without the surrounding blank lines
      filename: 'test.vue',
      code: `<template>
  <div>666</div>
</template>

console.log(1);
console.log(2);

<script>
export default {}
</script>
`,
      errors: [
        {
          messageId: 'unexpectedContent',
          line: 5,
          column: 1,
          endLine: 6,
          endColumn: 16,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `<template>
  <div>666</div>
</template>



<script>
export default {}
</script>
`
            }
          ]
        }
      ]
    },
    {
      // a file without any block
      filename: 'test.vue',
      code: 'hello',
      errors: [
        {
          messageId: 'unexpectedContent',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 6,
          suggestions: [
            {
              messageId: 'removeContent',
              output: ''
            }
          ]
        }
      ]
    },
    {
      // content around a custom block
      filename: 'test.vue',
      code: `<docs>
Some documentation.
</docs>

stray

<template>
  <div>666</div>
</template>
`,
      errors: [
        {
          messageId: 'unexpectedContent',
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 6,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `<docs>
Some documentation.
</docs>



<template>
  <div>666</div>
</template>
`
            }
          ]
        }
      ]
    },
    {
      // an HTML comment splits the content into separate runs
      filename: 'test.vue',
      code: `<template>
  <div>666</div>
</template>

foo
<!-- comment -->
bar

<script>
export default {}
</script>
`,
      errors: [
        {
          messageId: 'unexpectedContent',
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 4,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `<template>
  <div>666</div>
</template>


<!-- comment -->
bar

<script>
export default {}
</script>
`
            }
          ]
        },
        {
          messageId: 'unexpectedContent',
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 4,
          suggestions: [
            {
              messageId: 'removeContent',
              output: `<template>
  <div>666</div>
</template>

foo
<!-- comment -->


<script>
export default {}
</script>
`
            }
          ]
        }
      ]
    }
  ]
})
