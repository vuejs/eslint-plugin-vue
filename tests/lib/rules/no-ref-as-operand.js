/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-ref-as-operand')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2019, sourceType: 'module' }
})

tester.run('no-ref-as-operand', rule, {
  valid: [
    `
    import { ref } from 'vue'
    const count = ref(0)
    console.log(count.value) // 0

    count.value++
    console.log(count.value) // 1
    `,
    `
    <script>
      import { ref } from 'vue'
      export default {
        setup() {
          const count = ref(0)
          console.log(count.value) // 0

          count.value++
          console.log(count.value) // 1
          return {
            count
          }
        }
      }
    </script>
    `
  ],
  invalid: [
    {
      code: `
      import { ref } from 'vue'
      let count = ref(0)

      count++ // error
      console.log(count + 1) // error
      console.log(1 + count) // error
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 12
        },
        {
          messageId: 'requireDotValue',
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 24
        },
        {
          messageId: 'requireDotValue',
          line: 7,
          column: 23,
          endLine: 7,
          endColumn: 28
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from 'vue'
        export default {
          setup() {
            let count = ref(0)

            count++ // error
            console.log(count + 1) // error
            console.log(1 + count) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 9,
          column: 25,
          endLine: 9,
          endColumn: 30
        },
        {
          messageId: 'requireDotValue',
          line: 10,
          column: 29,
          endLine: 10,
          endColumn: 34
        }
      ]
    }
  ]
})
