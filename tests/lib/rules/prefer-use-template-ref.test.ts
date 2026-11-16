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
      output: `
      <template>
          <div ref="root"/>
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
      output: `
      <template>
          <button ref="button">Content</button>
          <a href="" ref="link">Link</a>
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const buttonRef = ref();
        const link = useTemplateRef('link');
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
      // The second fix overlaps the added import, so ESLint applies it in the next pass.
      output: `
      <template>
          <h1 ref="heading">Heading</h1>
          <a href="" ref="link">Link</a>
      </template>
      <script setup>
        import { ref, useTemplateRef } from 'vue';
        const heading = useTemplateRef('heading');
        const link = ref();
      </script>
      `,
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
      output: `
      <template>
        <p>Button clicked {{counter}} times.</p>
        <button ref="button">Click</button>
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
      `,
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
      output: `
      <template>
          <div ref="root"/>
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
      output: `
      <template>
        <button ref="button">Click</button>
      </template>
      <script>
        import { ref, useTemplateRef } from 'vue';
        export default {
          setup: () => {
            const button = useTemplateRef('button');
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
      output: `
      <template>
        <div ref="root" :data-a="A" />
      </template>

      <script setup>
      import { ref, useTemplateRef } from 'vue'
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
      output: `
      <template>
        <div ref="root" :data-a="A" />
      </template>

      <script>
      const A = 'foo'
      </script>

      <script setup>
      import { ref, useTemplateRef } from 'vue'
      const root = useTemplateRef('root')
      </script>
      `,
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
        const root = ref<HTMLDivElement>();
      </script>
      `,
      output: `
      <template>
        <div ref="root" />
      </template>
      <script setup lang="ts">
        import { ref, useTemplateRef } from 'vue';
        const root = useTemplateRef<HTMLDivElement>('root');
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
          endColumn: 43
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
        const root = ref();
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
          endColumn: 27
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
        const root = ref();
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
          endColumn: 27
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
        const root = ref();
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
          endColumn: 27
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
        const root = ref();
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
          endColumn: 27
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
        const root = ref();
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
          endColumn: 27
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
        let root = ref();
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
          endColumn: 25
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
      filename: 'ref-bound-with-v-model.vue',
      code: `
      <template>
        <MyInput ref="root" v-model="root" />
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
      filename: 'local-use-template-ref.vue',
      code: `
      <template>
        <div ref="root" />
      </template>
      <script setup>
        import { ref } from 'vue';
        const useTemplateRef = (name) => name;
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
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 27
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
        const root: Ref<HTMLDivElement | undefined> = ref();
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
          column: 55,
          endLine: 7,
          endColumn: 60
        }
      ]
    }
  ]
})
