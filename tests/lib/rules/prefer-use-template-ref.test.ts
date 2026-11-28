/**
 * @author Thomasan1999
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/prefer-use-template-ref'
import vueEslintParser from 'vue-eslint-parser'
import tsEslintParser from '@typescript-eslint/parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-use-template-ref', rule, {
  valid: [
    {
      filename: 'single-use-template-ref.vue',
      code: `
      <template>
          <div ref="root" />
      </template>
      <script setup>
        import { useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `
    },
    {
      filename: 'multiple-use-template-refs.vue',
      code: `
      <template>
          <button ref="button">Content</button>
          <a href="" ref="link">Link</a>
      </template>
      <script setup>
        import { useTemplateRef } from 'vue';
        const buttonRef = useTemplateRef('button');
        const link = useTemplateRef('link');
      </script>
      `
    },
    {
      filename: 'use-template-ref-in-block.vue',
      code: `
      <template>
          <div>
            <ul>
              <li ref="firstListItem">Morning</li>
              <li>Afternoon</li>
              <li>Evening</li>
            </ul>
          </div>
      </template>
      <script setup>
        import { useTemplateRef } from 'vue';
        function getFirstListItemElement() {
          const firstListItem = useTemplateRef('firstListItem')
          console.log(firstListItem)
        }
      </script>
      `
    },
    {
      filename: 'non-template-ref.vue',
      code: `
      <template>
          <div>
            <ul>
              <li v-for="food in foods" :key="food">{{food}}</li>
            </ul>
          </div>
      </template>
      <script setup>
        import { ref } from 'vue';
        const foods = ref(['Spaghetti', 'Pizza', 'Cake']);
      </script>
      `
    },
    {
      filename: 'counter.js',
      code: `
      import { ref } from 'vue';
      const counter = ref(0);
      const names = ref(new Set());
      function incrementCounter() {
        counter.value++;
        return counter.value;
      }
      function storeName(name) {
        names.value.add(name)
      }
      `
    },
    {
      filename: 'setup-function.vue',
      code: `
      <template>
        <p>Button clicked {{counter}} times.</p>
        <button ref="button" @click="counter++">Click</button>
      </template>
      <script>
        import { ref, useTemplateRef } from 'vue';
        export default {
          name: 'Counter',
          setup() {
            const counter = ref(0);
            const button = useTemplateRef('button');
          }
        }
      </script>
      `
    },
    {
      filename: 'options-api-no-refs.vue',
      code: `
      <template>
        <label ref="label">
          Name:
          <input v-model="name" />
        </label>
        <p ref="textRef">{{niceName}}</p>
        <button
      </template>
      <script>
        import { ref } from 'vue';
        export default {
          name: 'NameRow',
          methods: {
            someFunction() {
              return {
                label: ref(5),
              }
            }
          }
          data() {
            return {
              label: 'label',
              name: ''
            }
          },
          computed: {
            niceName() {
              return 'Nice ' + this.name;
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'options-api-mixed.vue',
      code: `
      <template>
        <label ref="labelElem">
          Name:
          <input v-model="name" />
        </label>
        {{ loremIpsum }}
      </template>
      <script>
        import { ref } from 'vue';
        export default {
          name: 'NameRow',
          props: {
            defaultLabel: {
              type: String,
            },
          },
          data() {
            return {
              label: ref(this.defaultLabel),
              labelElem: ref(),
              name: ''
            }
          },
          computed: {
            loremIpsum() {
              return this.name + ' lorem ipsum'
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'template-ref-function.vue',
      code: `
      <template>
        <button :ref="ref => button = ref">Content</button>
      </template>
      <script setup>
        import { ref } from 'vue';
        const button = ref();
        </script>
      `
    },
    {
      filename: 'ref-in-block.vue',
      code: `
      <template>
          <div>
            <ul>
              <li ref="firstListItem">Morning</li>
              <li ref="second">Afternoon</li>
              <li>Evening</li>
            </ul>
          </div>
      </template>
      <script setup>
        import { ref, shallowRef } from 'vue';
        function getFirstListItemElement() {
          const firstListItem = ref();
          const nestedCallback = () => {
            const second = shallowRef();
            console.log(second);
          }
          nestedCallback();
        }
      </script>
      `
    },
    {
      filename: 'ref-in-block-setup-fn.vue',
      code: `
      <template>
          <div>
            <ul>
              <li ref="firstListItem">Morning</li>
              <li ref="second">Afternoon</li>
              <li>Evening</li>
            </ul>
          </div>
      </template>
      <script>
        import { ref, shallowRef } from 'vue';
        export default {
          name: 'ComponentWithRefInBlock',
          setup() {
            function getFirstListItemElement() {
              const firstListItem = shallowRef();
              const nestedCallback = () => {
                const second = ref();
                console.log(second);
              }
              nestedCallback();
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'non-block-arrow-setup-function.vue',
      code: `
        <script>
          import { defineComponent } from 'vue';
          export default defineComponent({
            setup: () => ({})
          })
        </script>
      `
    },
    {
      filename: 'multiple-scripts-setup-first.vue',
      code: `
      <template>
        <div ref="root" :data-a="A" />
      </template>

      <script setup>
      import { useTemplateRef } from 'vue'
      const root = useTemplateRef('root')
      </script>

      <script>
      const A = 'foo'
      </script>
      `
    },
    {
      filename: 'multiple-scripts-setup-last.vue',
      code: `
      <template>
        <div ref="root" :data-a="A" />
      </template>

      <script>
      const A = 'foo'
      </script>

      <script setup>
      import { useTemplateRef } from 'vue'
      const root = useTemplateRef('root')
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'single-ref.vue',
      code: `
      <template>
          <div ref="root"/>
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'one-ref-unused-in-script.vue',
      code: `
      <template>
          <button ref="button">Content</button>
          <a href="" ref="link">Link</a>
      </template>
      <script setup>
        import { ref } from 'vue';
        const buttonRef = ref();
        const link = ref();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'multiple-refs.vue',
      code: `
      <template>
          <h1 ref="heading">Heading</h1>
          <a href="" ref="link">Link</a>
      </template>
      <script setup>
        import { ref } from 'vue';
        const heading = ref();
        const link = ref();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 25,
          endLine: 8,
          endColumn: 30
        },
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'setup-function-only-refs.vue',
      code: `
      <template>
        <p>Button clicked {{counter}} times.</p>
        <button ref="button">Click</button>
      </template>
      <script>
        import { ref } from 'vue';
        export default {
          name: 'Counter',
          setup() {
            const counter = ref(0);
            const button = ref();
          }
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 12,
          column: 28,
          endLine: 12,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'single-shallowRef.vue',
      code: `
      <template>
          <div ref="root"/>
      </template>
      <script setup>
        import { shallowRef } from 'vue';
        const root = shallowRef();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'shallowRef'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'block-arrow-setup-function.vue',
      code: `
      <template>
        <button ref="button">Click</button>
      </template>
      <script>
        import { ref } from 'vue';
        export default {
          setup: () => {
            const button = ref();
          }
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 28,
          endLine: 9,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'multiple-scripts-setup-first.vue',
      code: `
      <template>
        <div ref="root" :data-a="A" />
      </template>

      <script setup>
      import { ref } from 'vue'
      const root = ref()
      </script>

      <script>
      const A = 'foo'
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 20,
          endLine: 8,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'multiple-scripts-setup-last.vue',
      code: `
      <template>
        <div ref="root" :data-a="A" />
      </template>

      <script>
      const A = 'foo'
      </script>

      <script setup>
      import { ref } from 'vue'
      const root = ref()
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 12,
          column: 20,
          endLine: 12,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'ref-with-type-arguments.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref<HTMLDivElement | null>(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef<HTMLDivElement | null>('root');
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 54
        }
      ]
    },
    {
      // `ref<T>()` starts as `undefined` (`T | undefined`), `useTemplateRef<T>()` as `null`
      filename: 'ref-with-type-arguments-without-initial-value.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref<HTMLDivElement>();
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'shallowRef-with-null.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { shallowRef } from 'vue';
        const root = shallowRef(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { shallowRef, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'shallowRef'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'multiple-refs-with-null.vue',
      code: `
      <template>
        <h1 ref="heading">Heading</h1>
        <a href="" ref="link">Link</a>
      </template>
      <script>
        import { ref } from 'vue';
        export default {
          setup() {
            const heading = ref(null);
            const link = ref(null);
          }
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 10,
          column: 29,
          endLine: 10,
          endColumn: 38
        },
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 11,
          column: 26,
          endLine: 11,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'block-arrow-setup-function-with-null.vue',
      code: `
      <template>
        <button ref="button">Click</button>
      </template>
      <script>
        import { ref } from 'vue';
        export default {
          setup: () => {
            const button = ref(null);
          }
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 28,
          endLine: 9,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'multiple-scripts-setup-first-without-imports.vue',
      code: `
      <template>
        <div ref="root" :data-a="A" />
      </template>

      <script setup>
      const root = ref(null)
      </script>

      <script>
      const A = 'foo'
      </script>
      `,
      output: `
      <template>
        <div ref="root" :data-a="A" />
      </template>

      <script setup>
      import { useTemplateRef } from 'vue';
      const root = useTemplateRef('root')
      </script>

      <script>
      const A = 'foo'
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'ref-with-undefined.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(undefined);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'use-template-ref-already-imported.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'vue-import-with-trailing-comma.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import {
          ref,
        } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import {
          ref, useTemplateRef,
        } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'no-value-import-from-vue.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import type { Ref } from 'vue';
        import { useFoo } from './foo';
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import type { Ref } from 'vue';
        import { useFoo } from './foo';
        import { useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'no-imports.vue',
      code: `
      <template>
        <div ref="root" :data-a="A" />
      </template>
      <script>
        const A = 'foo';
      </script>
      <script setup>
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" :data-a="A" />
      </template>
      <script>
        const A = 'foo';
      </script>
      <script setup>
        import { useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-global.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        const root = useTemplateRef('root');
      </script>
      `,
      languageOptions: {
        globals: {
          ref: 'readonly',
          useTemplateRef: 'readonly'
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 6,
          column: 22,
          endLine: 6,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-with-initial-value.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(document.body);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'ref-value-assigned-in-script.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        function reset() {
          root.value = null;
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-variable-reassigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, shallowRef } from 'vue';
        let root = ref(null);
        root = shallowRef();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'ref-assigned-in-template.vue',
      code: `
      <template>
        <div ref="root" @click="root = null" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-bound-with-v-model.vue',
      code: `
      <template>
        <MyInput ref="root" v-model="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'local-use-template-ref.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const useTemplateRef = (name) => name;
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-with-type-annotation.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref, type Ref } from 'vue';
        const root: Ref<HTMLDivElement | null> = ref(null);
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 50,
          endLine: 7,
          endColumn: 59
        }
      ]
    },
    {
      // `<script setup>` keeps the current instance after top-level `await`
      filename: 'script-setup-ref-after-await.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        await loadData();
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        await loadData();
        const root = useTemplateRef('root');
      </script>
      `,
      languageOptions: {
        ecmaVersion: 2022
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-with-same-key.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = ref(null);
        const rootElement = useTemplateRef('root');
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'aliased-use-template-ref-with-same-key.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef as useRefByKey } from 'vue';
        const root = ref(null);
        const rootElement = useRefByKey('root');
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-with-template-literal-key.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = ref(null);
        const rootElement = useTemplateRef(\`root\`);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-with-dynamic-key.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = ref(null);
        function useElement(key) {
          return useTemplateRef(key);
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-with-other-key.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = ref(null);
        const other = useTemplateRef('other');
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        const other = useTemplateRef('other');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-array-destructuring-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        [root.value] = [null];
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-object-destructuring-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        ({ element: root.value } = refs);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-nested-destructuring-default-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        [{ element: root.value = null }] = list;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-rest-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        [...root.value] = list;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-for-of-target.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        for (root.value of list) {}
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-for-in-target.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        for (root.value in object) {}
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-as-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
        (root.value as any) = null;
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-non-null-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
        root.value! = null;
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-satisfies-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
        (root.value satisfies any) = null;
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-type-assertion-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
        (<any>root.value) = null;
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-as-value-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
        (root as any).value = null;
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-non-null-value-updated.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
        root!.value++;
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-variable-destructuring-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        let root = ref(null);
        [root] = [null];
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'ref-variable-for-of-target.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        let root = ref(null);
        for (root of list) {}
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'ref-variable-as-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        let root = ref(null);
        (root as any) = null;
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 29
        }
      ]
    },
    {
      // writing a property of the element is not a write to the ref
      filename: 'ref-value-read-in-patterns.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        let first;
        [first] = [root.value];
        for (const child of root.value.children) {}
        root.value.textContent = '';
        root.value?.focus();
        const { value } = root;
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        let first;
        [first] = [root.value];
        for (const child of root.value.children) {}
        root.value.textContent = '';
        root.value?.focus();
        const { value } = root;
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-read-through-type-expressions.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
        (root.value as HTMLElement).focus();
        root.value!.focus();
        const element = root.value satisfies HTMLElement | null;
        (root as any).value.focus();
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        (root.value as HTMLElement).focus();
        root.value!.focus();
        const element = root.value satisfies HTMLElement | null;
        (root as any).value.focus();
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-imported-from-other-module.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'my-lib';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'local-ref-function.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        function ref(value) {
          return { value };
        }
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-aliased-from-other-vue-function.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { customRef as ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-imported-from-vue-separately.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { computed } from 'vue';
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { computed, useTemplateRef } from 'vue';
        import { ref } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-imported-from-other-module.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import { useTemplateRef } from 'my-lib';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-default-imported.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import useTemplateRef from 'my-lib';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-aliased-from-other-vue-function.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, toRef as useTemplateRef } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'use-template-ref-imported-from-vue-separately.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import { useTemplateRef } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import { useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-with-comment-before-argument.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(/* element */ null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'ref-with-comment-after-argument.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null /* element */);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'ref-with-comment-in-type-arguments.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref</* element */ HTMLElement | null>(null);
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 65
        }
      ]
    },
    {
      filename: 'ref-with-comments-around-call.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = /* element */ ref(null); // template ref
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = /* element */ useTemplateRef('root'); // template ref
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 36,
          endLine: 7,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'ref-alias-value-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const alias = root;
        alias.value = null;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-alias-in-same-declaration.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null),
          other = root;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-conditional-value-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        (visible ? root : other).value = null;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-deleted.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        delete root.value;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-exposed.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        defineExpose({ root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-assigned-to-variable.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        let saved;
        saved = root;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-array.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const refs = [root];
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-returned-from-function.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const getRoot = () => root;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-logical-expression.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const target = root || other;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      // passing the ref to a function or reading `.value` is fine
      filename: 'ref-passed-to-functions.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        watch(root, () => {});
        useElementSize(root);
        const value = root.value;
        const target = visible ? root.value : null;
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        watch(root, () => {});
        useElementSize(root);
        const value = root.value;
        const target = visible ? root.value : null;
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'options-api-setup-returns-ref.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script>
        import { ref } from 'vue';
        export default {
          setup() {
            const root = ref(null);
            const other = ref(0);
            return { root, other: other };
          }
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 26,
          endLine: 9,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'script-setup-instance-proxy-dynamic-member-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { getCurrentInstance, ref } from 'vue';
        const root = ref(null);
        const { proxy } = getCurrentInstance();
        function set(key) {
          proxy[key] = null;
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'script-setup-instance-proxy-member-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { getCurrentInstance, ref } from 'vue';
        const root = ref(null);
        function reset() {
          getCurrentInstance().proxy.root = null;
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'template-this-member-assigned.vue',
      code: `
      <template>
        <div ref="root" @click="this.root = null" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'template-this-member-v-model.vue',
      code: `
      <template>
        <div ref="root" />
        <MyInput v-model="this.root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'script-setup-ref-written-in-sibling-script.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script>
        export default {
          methods: {
            reset() {
              this.root = null;
            }
          }
        }
      </script>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 16,
          column: 22,
          endLine: 16,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-yielded.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        function* refs() {
          yield root;
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-class-field.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        class Holder {
          element = root;
        }
      </script>
      `,
      output: null,
      languageOptions: {
        ecmaVersion: 2022
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-awaited.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        async function load() {
          await root;
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-array-argument.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        watch([root], () => {});
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        watch([root], () => {});
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-option-array-argument.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        onClickOutside(target, () => {}, { ignore: [root] });
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        onClickOutside(target, () => {}, { ignore: [root] });
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-option-argument.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        useIntersectionObserver(target, () => {}, { root: root });
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        useIntersectionObserver(target, () => {}, { root: root });
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-nested-option-argument.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        useFocusTrap({ element: root });
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        useFocusTrap({ element: root });
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-name-member-of-other-object-assigned.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const payload = {};
        payload.root = 1;
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        const payload = {};
        payload.root = 1;
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'options-api-this-member-assigned-in-other-component.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script>
        import { ref } from 'vue';
        import { defineComponent } from 'vue';
        const Other = defineComponent({
          methods: {
            reset() {
              this.root = null;
            }
          }
        });
        export default {
          setup() {
            const root = ref(null);
            return { root };
          },
          components: { Other }
        }
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 17,
          column: 26,
          endLine: 17,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'script-setup-dynamic-member-of-this-in-class.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        class Store {
          set(key, value) {
            this[key] = value;
          }
        }
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        class Store {
          set(key, value) {
            this[key] = value;
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      // `this` in another `<script>` could write the ref through the component instance
      filename: 'script-setup-with-script-using-this.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script>
        export default {
          computed: {
            label() {
              return this.title;
            }
          }
        }
      </script>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 16,
          column: 22,
          endLine: 16,
          endColumn: 31
        }
      ]
    },
    {
      // Vue does not set template refs to a ref passed as `ref` in a render function
      filename: 'ref-as-ref-option-in-call.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import { h } from 'vue';
        const root = ref(null);
        const vnode = () => h('div', { ref: root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      // only `<script setup>` is fixed
      filename: 'options-api-define-component.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script>
        import { defineComponent, ref } from 'vue';
        export default defineComponent({
          setup() {
            const root = ref(null);
            return { root };
          }
        });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 26,
          endLine: 9,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'ref-in-type-query.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
        type Root = typeof root;
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        type Root = typeof root;
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-checked-for-truthiness.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        if (root && root.value) {}
        const label = !root ? 0 : 1;
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        if (root && root.value) {}
        const label = !root ? 0 : 1;
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-returned-from-callback-argument.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        useFoo(() => root);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        useFoo(() => root);
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-name-shadowed-by-slot-variable.vue',
      code: `
      <template>
        <div ref="root" />
        <MyList v-slot="{ root }">
          <MyInput v-model="root" @update="root = $event" />
        </MyList>
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
        <MyList v-slot="{ root }">
          <MyInput v-model="root" @update="root = $event" />
        </MyList>
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 10,
          column: 22,
          endLine: 10,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-logical-expression-value.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const element = root && root.value;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      // a module-level ref in `<script>` is shared by all instances
      filename: 'ref-in-script-before-script-setup.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      <script setup>
        const foo = 1;
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-script-after-script-setup.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        const foo = 1;
      </script>
      <script>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 10,
          column: 22,
          endLine: 10,
          endColumn: 31
        }
      ]
    },
    {
      // the ref holds an array, which `useTemplateRef()` makes readonly
      filename: 'template-ref-in-v-for.vue',
      code: `
      <template>
        <div v-for="item in items" :key="item" ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'template-ref-in-v-for-parent.vue',
      code: `
      <template>
        <template v-for="item in items" :key="item">
          <div ref="root" />
        </template>
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'template-ref-next-to-v-for.vue',
      code: `
      <template>
        <div ref="root" />
        <li v-for="item in items" :key="item">{{ item }}</li>
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
        <li v-for="item in items" :key="item">{{ item }}</li>
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-object-assign.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        Object.assign(root, { value: null });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-reflect-set.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        Reflect.set(root, 'value', null);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-reactive.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const state = reactive({ root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-to-refs.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const refs = toRefs({ root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-provide.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        provide('root', root);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-pushed-to-array.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        list.push(root);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-set-in-map.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        map.set('root', root);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-exposed-through-reactive.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        defineExpose(reactive({ root }));
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-reading-functions.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        console.log([root]);
        unref(root);
        toValue(root);
        const view = readonly({ root });
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        console.log([root]);
        unref(root);
        toValue(root);
        const view = readonly({ root });
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'aliased-get-current-instance.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { getCurrentInstance as useInstance, ref } from 'vue';
        const root = ref(null);
        const instance = useInstance();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'namespaced-get-current-instance.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import * as Vue from 'vue';
        const root = ref(null);
        const instance = Vue.getCurrentInstance();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'local-get-current-instance.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        function getCurrentInstance() {
          return null;
        }
        getCurrentInstance();
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        function getCurrentInstance() {
          return null;
        }
        getCurrentInstance();
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'template-v-model-with-non-null.vue',
      code: `
      <template>
        <div ref="root" />
        <MyInput v-model="root!" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'template-v-model-with-as.vue',
      code: `
      <template>
        <div ref="root" />
        <MyInput v-model="(root as any)" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'template-assignment-with-as.vue',
      code: `
      <template>
        <div ref="root" @click="(root as any) = null" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'template-read-with-non-null.vue',
      code: `
      <template>
        <div ref="root" />
        <MyInput :target="root!" />
      </template>
      <script setup lang="ts">
        import { ref } from 'vue';
        const root = ref(null);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
        <MyInput :target="root!" />
      </template>
      <script setup lang="ts">
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: tsEslintParser
        }
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-exposed-through-function.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        defineExpose(markRaw({ root }));
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-namespaced-provide.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import * as Vue from 'vue';
        const root = ref(null);
        Vue.provide('root', root);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-namespaced-reactive.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import * as Vue from 'vue';
        const root = ref(null);
        const state = Vue.reactive({ root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-aliased-provide.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { provide as provideValue, ref } from 'vue';
        const root = ref(null);
        provideValue('root', root);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-aliased-reactive.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { reactive as toState, ref } from 'vue';
        const root = ref(null);
        const state = toState({ root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-wrapped-in-ref.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const wrapper = ref({ root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-wrapped-in-shallow-ref.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const list = shallowRef([root]);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-map-constructor.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const refs = new Map([['root', root]]);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-set-constructor.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        const refs = new Set([root]);
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'get-current-instance-from-runtime-core.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import { getCurrentInstance } from '@vue/runtime-core';
        const root = ref(null);
        const instance = getCurrentInstance();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'get-current-instance-from-nuxt-imports.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import { getCurrentInstance as useInstance } from '#imports';
        const root = ref(null);
        const instance = useInstance();
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-exposed-through-getter.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        defineExpose({ getRoot: () => root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      // the exposed function could pass the ref to a caller
      filename: 'ref-used-in-exposed-function.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        defineExpose({ focus: () => unrefElement(root)?.focus() });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-aliased-and-namespaced-reading-functions.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, watch as watchSource } from 'vue';
        import * as Vue from 'vue';
        const root = ref(null);
        watchSource(root, () => {});
        Vue.watch(root, () => {});
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, watch as watchSource, useTemplateRef } from 'vue';
        import * as Vue from 'vue';
        const root = useTemplateRef('root');
        watchSource(root, () => {});
        Vue.watch(root, () => {});
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-callback-in-exposed-function.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        defineExpose({ withRoot: (callback) => callback(root) });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-in-exposed-computed.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        defineExpose({ element: computed(() => root) });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-value-read-in-exposed-function.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        defineExpose({ focus: () => root.value?.focus() });
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        defineExpose({ focus: () => root.value?.focus() });
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-provide-of-other-object.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        app.provide('root', root);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        app.provide('root', root);
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-local-provide.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const root = ref(null);
        function provide(key, value) {
          console.log(key, value);
        }
        provide('root', root);
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef('root');
        function provide(key, value) {
          console.log(key, value);
        }
        provide('root', root);
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-namespaced-reactive-from-nuxt-imports.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        import * as imports from '#imports';
        const root = ref(null);
        const state = imports.reactive({ root });
      </script>
      `,
      output: null,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'ref-passed-to-string-named-provide.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { 'provide' as provideValue, ref } from 'vue';
        const root = ref(null);
        provideValue('root', root);
      </script>
      `,
      output: null,
      languageOptions: {
        ecmaVersion: 2022
      },
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          data: {
            name: 'ref'
          },
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 31
        }
      ]
    }
  ]
})
