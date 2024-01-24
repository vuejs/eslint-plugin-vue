/**
 * @author  Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-computed-properties-in-data')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-computed-properties-in-data', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          const foo = this.foo
          return {}
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          const foo = this.foo()
          return {}
        },
        methods: {
          foo() {}
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: ['foo'],
        data() {
          const foo = this.foo
          return {}
        },
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data: {
          foo: this.foo
        },
        computed: {
          foo () {}
        }
      }
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          const foo = this.foo
          return  {}
        },
        computed: {
          foo () {}
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'The computed property cannot be used in `data()` because it is before initialization.',
          line: 5,
          column: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          const vm = this
          const foo = vm.foo
          return  {}
        },
        computed: {
          foo () {}
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'The computed property cannot be used in `data()` because it is before initialization.',
          line: 6,
          column: 23
        }
      ]
    }
  ]
})
