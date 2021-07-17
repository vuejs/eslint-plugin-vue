/**
 * @author Yosuke Ota
 */
'use strict'

const path = require('path')
const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-call-after-await')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('no-restricted-call-after-await', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      import { useI18n } from 'vue-i18n'
      export default {
        async setup() {
          const { t } = useI18n({ })
          return { t }
        }
      }
      </script>
      `,
      options: [{ module: 'vue-i18n', path: 'useI18n' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { useI18n } from 'vue-i18n'
      export default {
        async foo() {
          await doSomething()
          const { t } = useI18n({ })
          return { t }
        }
      }
      </script>
      `,
      options: [{ module: 'vue-i18n', path: 'useI18n' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { bar } from 'foo'
      export default {
        async setup() {
          const qux = bar.baz({ })
          await doSomething()
        }
      }
      </script>
      `,
      options: [{ module: 'foo', path: ['bar', 'baz'] }]
    },
    {
      filename: path.join(process.cwd(), 'test.vue'),
      code: `
      <script>
      export default {
        async setup() {
          await doSomething()
          const v = bar({ })
          qux()
          useI18n()
        }
      }
      </script>
      `,
      options: [
        { module: './foo', path: 'bar' },
        { module: './baz', path: 'qux' },
        { module: 'vue-i18n', path: 'useI18n' }
      ]
    },
    {
      filename: path.join(process.cwd(), 'test.vue'),
      code: `
      <script>
      import {useI18n} from 'vue-i18n'
      import { bar } from './foo'
      import { qux } from './baz'
      export default {
        async setup() {
          const v = bar({ })
          qux()
          useI18n()
          await doSomething()
        }
      }
      </script>
      `,
      options: [
        { module: './foo', path: 'bar' },
        { module: './baz', path: 'qux' },
        { module: 'vue-i18n', path: 'useI18n' }
      ]
    },
    {
      filename: path.join(process.cwd(), 'test.vue'),
      code: `
      <script>
      import {useI18n} from 'vue-i18n'
      import { bar } from './foo'
      import { qux } from './baz'
      const v = bar({ })
      qux()
      useI18n()
      export default {
        async setup() {
          await doSomething()
        }
      }
      </script>
      `,
      options: [
        { module: './foo', path: 'bar' },
        { module: './baz', path: 'qux' },
        { module: 'vue-i18n', path: 'useI18n' }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {useI18n} from 'vue-i18n'
      useI18n()
      await doSomething()
      </script>
      `,
      options: [{ module: 'vue-i18n', path: 'useI18n' }],
      parserOptions: { ecmaVersion: 2022 }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {useI18n} from 'vue-i18n'
      await doSomething()
      useI18n()
      </script>
      `,
      parserOptions: { ecmaVersion: 2022 },
      options: [{ module: 'vue-i18n', path: 'useI18n' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      import { useI18n } from 'vue-i18n'
      export default {
        async setup() {
          await doSomething()
          const { t } = useI18n({ })
          return { t }
        }
      }
      </script>
      `,
      options: [{ module: 'vue-i18n', path: 'useI18n' }],
      errors: [
        {
          message:
            'The `import("vue-i18n").useI18n` after `await` expression are forbidden.',
          line: 7,
          column: 25,
          endLine: 7,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { bar } from 'foo'
      export default {
        async setup() {
          await doSomething()
          const qux = bar.baz({ })
        }
      }
      </script>
      `,
      options: [{ module: 'foo', path: ['bar', 'baz'] }],
      errors: [
        {
          message:
            'The `import("foo").bar.baz` after `await` expression are forbidden.',
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { bar } from 'foo'
      import { useI18n } from 'vue-i18n'
      export default {
        async setup() {
          await doSomething()
          const {t} = useI18n({ })
          const qux = bar.baz({ })
        }
      }
      </script>
      `,
      options: [
        { module: 'vue-i18n', path: 'useI18n' },
        { module: 'foo', path: ['bar', 'baz'] }
      ],
      errors: [
        {
          message:
            'The `import("vue-i18n").useI18n` after `await` expression are forbidden.',
          line: 8
        },
        {
          message:
            'The `import("foo").bar.baz` after `await` expression are forbidden.',
          line: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import def from 'foo'
      export default {
        async setup() {
          await doSomething()
          const v = def({ })
        }
      }
      </script>
      `,
      options: [{ module: 'foo', path: 'default' }],
      errors: [
        {
          message:
            'The `import("foo").default` after `await` expression are forbidden.',
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import def from 'foo'
      export default {
        async setup() {
          await doSomething()
          const v = def({ })
        }
      }
      </script>
      `,
      options: [{ module: 'foo' }],
      errors: [
        {
          message:
            'The `import("foo").default` after `await` expression are forbidden.',
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import * as i18n from 'vue-i18n'
      export default {
        async setup() {
          await doSomething()
          const v = i18n.useI18n({ })
        }
      }
      </script>
      `,
      options: [{ module: 'vue-i18n', path: 'useI18n' }],
      errors: [
        {
          message:
            'The `import("vue-i18n").useI18n` after `await` expression are forbidden.',
          line: 7
        }
      ]
    },
    {
      filename: path.join(process.cwd(), 'test.vue'),
      code: `
      <script>
      import {useI18n} from 'vue-i18n'
      import { bar } from './foo'
      import { qux } from './baz'
      export default {
        async setup() {
          useI18n()
          await doSomething()
          const v = bar({ })
          qux()
          useI18n()
        }
      }
      </script>
      `,
      options: [
        { module: './foo', path: 'bar' },
        { module: './baz', path: 'qux' },
        { module: 'vue-i18n', path: 'useI18n' }
      ],
      errors: [
        {
          message:
            'The `import("./foo").bar` after `await` expression are forbidden.',
          line: 10
        },
        {
          message:
            'The `import("./baz").qux` after `await` expression are forbidden.',
          line: 11
        },
        {
          message:
            'The `import("vue-i18n").useI18n` after `await` expression are forbidden.',
          line: 12
        }
      ]
    },
    {
      filename: path.join(process.cwd(), 'test.vue'),
      code: `
      <script>
      import {useI18n} from 'vue-i18n'
      import { bar } from './foo'
      import { qux } from './baz'
      export default {
        async setup() {
          useI18n()
          await doSomething()
          const v = bar({ })
          qux()
          useI18n()
        }
      }
      </script>
      `,
      options: [
        { module: path.join(process.cwd(), './foo'), path: 'bar' },
        { module: path.join(process.cwd(), './baz'), path: 'qux' },
        { module: 'vue-i18n', path: 'useI18n' }
      ],
      errors: [
        {
          message:
            'The `import("./foo").bar` after `await` expression are forbidden.',
          line: 10
        },
        {
          message:
            'The `import("./baz").qux` after `await` expression are forbidden.',
          line: 11
        },
        {
          message:
            'The `import("vue-i18n").useI18n` after `await` expression are forbidden.',
          line: 12
        }
      ]
    },
    {
      filename: path.join(__dirname, '../../../test/test.vue'),
      code: `
      <script>
      import { foo } from '..'
      export default {
        async setup() {
          await doSomething()
          foo({})
        }
      }
      </script>
      `,
      options: [{ module: require.resolve('../../..'), path: 'foo' }],
      errors: [
        {
          message:
            'The `import("..").foo` after `await` expression are forbidden.',
          line: 7
        }
      ]
    }
  ]
})
