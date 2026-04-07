/**
 * @fileoverview Enforces that a return statement is present in computed property (return-in-computed-property)
 * @author Armano
 */
import type { Linter } from 'eslint'
import rule from '../../../lib/rules/return-in-computed-property'
import { getTypeScriptFixtureTestOptions } from '../../test-utils/typescript'
import { RuleTester } from '../../eslint-compat'

const languageOptions: Linter.LanguageOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('return-in-computed-property', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              return true
            },
            bar: function () {
              return false
            },
            bar3: {
              set () {
                return true
              },
              get () {
                return true
              }
            },
            bar4 () {
              if (foo) {
                return true
              } else {
                return false
              }
            }
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              const options = []
              this.matches.forEach((match) => {
                options.push(match)
              })
              return options
            }
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              const options = []
              this.matches.forEach(function (match) {
                options.push(match)
              })
              return options
            }
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: {
              get () {
                return
              }
            }
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: false }],
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed(() => true)
            const bar = computed(function() {
              return false
            })
            const bar3 = computed({
              set: () => true,
              get: () => true
            })
            const bar4 = computed(() => {
              if (foo) {
                return true
              } else {
                return false
              }
            })
            const foo2 = computed(() => {
              const options = []
              this.matches.forEach((match) => {
                options.push(match)
              })
              return options
            })
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed({
              get: () => {
                return
              }
            })
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: false }],
      languageOptions
    },
    // Switch with all cases returning AND a default (ESLint handles this via code path analysis)
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
                case 'a': return 1
                case 'b': return 2
                default: return 3
              }
            }
          }
        }
      `,
      languageOptions
    },
    // TS: Union type — all literal cases covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { Status } from './test01'
        const status = ref<Status>('active')
        const result = computed(() => {
          switch (status.value) {
            case 'active': return 1
            case 'inactive': return 2
            case 'pending': return 3
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Enum — all members covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { Color } from './test01'
        const color = ref<Color>(Color.Red)
        const result = computed(() => {
          switch (color.value) {
            case Color.Red: return 'r'
            case Color.Green: return 'g'
            case Color.Blue: return 'b'
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Boolean — true and false covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        const flag = ref<boolean>(true)
        const result = computed(() => {
          switch (flag.value) {
            case true: return 'yes'
            case false: return 'no'
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Nullable union — all cases including null covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { NullableKind } from './test01'
        const kind = ref<NullableKind>('a')
        const result = computed(() => {
          switch (kind.value) {
            case 'a': return 1
            case 'b': return 2
            case null: return 0
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Union with mix of return and throw
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { Status } from './test01'
        const status = ref<Status>('active')
        const result = computed(() => {
          switch (status.value) {
            case 'active': return 1
            case 'inactive': throw new Error('not supported')
            case 'pending': return 3
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Union with fallthrough cases
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { Status } from './test01'
        const status = ref<Status>('active')
        const result = computed(() => {
          switch (status.value) {
            case 'active':
            case 'inactive': return 1
            case 'pending': return 2
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Undefined in union — all cases including undefined covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { UndefinedKind } from './test01'
        const kind = ref<UndefinedKind>('a')
        const result = computed(() => {
          switch (kind.value) {
            case 'a': return 1
            case 'b': return 2
            case undefined: return 0
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Both null and undefined in union — all cases covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { FullyNullable } from './test01'
        const val = ref<FullyNullable>('x')
        const result = computed(() => {
          switch (val.value) {
            case 'x': return 1
            case 'y': return 2
            case null: return 0
            case undefined: return 3
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Numeric literal union — all cases covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { NumericUnion } from './test01'
        const num = ref<NumericUnion>(1)
        const result = computed(() => {
          switch (num.value) {
            case 1: return 'one'
            case 2: return 'two'
            case 3: return 'three'
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: String enum — all members covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { StringStatus } from './test01'
        const status = ref<StringStatus>(StringStatus.Active)
        const result = computed(() => {
          switch (status.value) {
            case StringStatus.Active: return 1
            case StringStatus.Inactive: return 2
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Generic component with constrained type parameter — all cases covered
    {
      code: `
        <script setup lang="ts" generic="T extends Status">
        import { computed } from 'vue'
        import { Status } from './test01'
        const props = defineProps<{ value: T }>()
        const result = computed(() => {
          switch (props.value) {
            case 'active': return 1
            case 'inactive': return 2
            case 'pending': return 3
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Branded/intersection type — all cases covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { BrandedStatus } from './test01'
        const status = ref<BrandedStatus>('active' as BrandedStatus)
        const result = computed(() => {
          switch (status.value) {
            case 'active': return 1
            case 'inactive': return 2
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: BigInt literal union — all cases covered
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { BigIntUnion } from './test01'
        const num = ref<BigIntUnion>(1n)
        const result = computed(() => {
          switch (num.value) {
            case 1n: return 'one'
            case 2n: return 'two'
            case 3n: return 'three'
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Heterogeneous literal union — mixed number, string, boolean
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { MixedLiterals } from './test01'
        const val = ref<MixedLiterals>(0)
        const result = computed(() => {
          switch (val.value) {
            case 0: return 'zero'
            case 1: return 'one'
            case 'two': return 'two'
            case true: return 'yes'
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    },
    // TS: Discriminated union — all cases covered via property access
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { AppEvent } from './test01'
        const event = ref<AppEvent>({ type: 'click', x: 0, y: 0 })
        const result = computed(() => {
          switch (event.value.type) {
            case 'click': return 'clicked'
            case 'hover': return 'hovered'
            case 'key': return 'pressed'
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions()
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 17,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 18,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              if (a) {
                return
              }
            }
          }
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 18,
          endLine: 8,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: {
              set () {
              },
              get () {
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 7,
          column: 19,
          endLine: 8,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              function bar () {
                return this.baz * 2
              }
              bar()
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 18,
          endLine: 9,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
            },
            bar () {
              return
            }
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: false }],
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 17,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              return
            }
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: true }],
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 17,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        // @vue/component
        export default {
          computed: {
              my_FALSE_test() {
                  let aa = 2;
                  this.my_id = aa;
              }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message:
            'Expected to return a value in "my_FALSE_test" computed property.',
          line: 5,
          column: 28,
          endLine: 8,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed(() => {})
            const foo2 = computed(function() {})
            const foo3 = computed(() => {
              if (a) {
                return
              }
            })
            const foo4 = computed({
              set: () => {},
              get: () => {}
            })
            const foo5 = computed(() => {
              const bar = () => {
                return this.baz * 2
              }
              bar()
            })
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 42
        },
        {
          message: 'Expected to return a value in computed function.',
          line: 6,
          column: 35,
          endLine: 6,
          endColumn: 48
        },
        {
          message: 'Expected to return a value in computed function.',
          line: 7,
          column: 35,
          endLine: 11,
          endColumn: 14
        },
        {
          message: 'Expected to return a value in computed function.',
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 28
        },
        {
          message: 'Expected to return a value in computed function.',
          line: 16,
          column: 35,
          endLine: 21,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed(() => {})
            const baz = computed(() => {
              return
            })
          }
        }
      `,
      options: [{ treatUndefinedAsUnspecified: false }],
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        'computed': {
          foo() {
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4,
          column: 14,
          endLine: 5,
          endColumn: 12
        }
      ]
    },
    // JS: Switch with all cases returning but no default — no type info, must error
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
                case 'a': return 1
                case 'b': return 2
                case 'c': return 3
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4
        }
      ]
    },
    // JS: Composition API switch without default — no type info, must error
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed(() => {
              switch (type) {
                case 'a': return 1
                case 'b': return 2
              }
            })
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 5
        }
      ]
    },
    // TS: Union type — missing a case
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { Status } from './test01'
        const status = ref<Status>('active')
        const result = computed(() => {
          switch (status.value) {
            case 'active': return 1
            case 'inactive': return 2
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions(),
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 6
        }
      ]
    },
    // TS: Wide type (string) — not a finite union, must error
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        const s = ref<string>('hello')
        const result = computed(() => {
          switch (s.value) {
            case 'a': return 1
            case 'b': return 2
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions(),
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 5
        }
      ]
    },
    // TS: Exhaustive union but case uses break — must still error
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { Status } from './test01'
        const status = ref<Status>('active')
        const result = computed(() => {
          switch (status.value) {
            case 'active': return 1
            case 'inactive': return 2
            case 'pending': break
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions(),
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 6
        }
      ]
    },
    // TS: Missing null in nullable union — must error
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { NullableKind } from './test01'
        const kind = ref<NullableKind>('a')
        const result = computed(() => {
          switch (kind.value) {
            case 'a': return 1
            case 'b': return 2
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions(),
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 6
        }
      ]
    },
    // TS: Missing undefined in union — must error
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { UndefinedKind } from './test01'
        const kind = ref<UndefinedKind>('a')
        const result = computed(() => {
          switch (kind.value) {
            case 'a': return 1
            case 'b': return 2
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions(),
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 6
        }
      ]
    },
    // TS: Generic component with constrained type parameter — missing a case
    {
      code: `
        <script setup lang="ts" generic="T extends Status">
        import { computed } from 'vue'
        import { Status } from './test01'
        const props = defineProps<{ value: T }>()
        const result = computed(() => {
          switch (props.value) {
            case 'active': return 1
            case 'inactive': return 2
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions(),
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 6
        }
      ]
    },
    // TS: Discriminated union — missing a case
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { AppEvent } from './test01'
        const event = ref<AppEvent>({ type: 'click', x: 0, y: 0 })
        const result = computed(() => {
          switch (event.value.type) {
            case 'click': return 'clicked'
            case 'hover': return 'hovered'
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions(),
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 6
        }
      ]
    },
    // TS: BigInt literal union — missing a case
    {
      code: `
        <script setup lang="ts">
        import { computed, ref } from 'vue'
        import { BigIntUnion } from './test01'
        const num = ref<BigIntUnion>(1n)
        const result = computed(() => {
          switch (num.value) {
            case 1n: return 'one'
            case 2n: return 'two'
          }
        })
        </script>`,
      ...getTypeScriptFixtureTestOptions(),
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 6
        }
      ]
    },
    // Switch where one case uses break instead of return
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
                case 'a': return 1
                case 'b': break
                case 'c': return 3
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4
        }
      ]
    },
    // Switch where one non-fallthrough case has no return
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
                case 'a': return 1
                case 'b': console.log('b')
                case 'c': return 3
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4
        }
      ]
    },
    // Empty switch (no cases)
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4
        }
      ]
    },
    // Code after the switch — switch is not the last statement
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
                case 'a': return 1
                case 'b': return 2
              }
              console.log('after switch')
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4
        }
      ]
    },
    // Conditional return inside a case (conservative — still flagged)
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
                case 'a':
                  if (this.x) return 1
                case 'b': return 2
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4
        }
      ]
    },
    // Switch with only fallthrough cases and no terminal returning case
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
                case 'a':
                case 'b':
                case 'c':
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4
        }
      ]
    },
    // Return inside a nested function in a case (doesn't count)
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              switch (this.type) {
                case 'a':
                  return 1
                case 'b':
                  const fn = () => { return 2 }
                  fn()
              }
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in "foo" computed property.',
          line: 4
        }
      ]
    },
    // Composition API — switch with break (invalid)
    {
      filename: 'test.vue',
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const foo = computed(() => {
              switch (type) {
                case 'a': return 1
                case 'b': break
              }
            })
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in computed function.',
          line: 5
        }
      ]
    }
  ]
})
