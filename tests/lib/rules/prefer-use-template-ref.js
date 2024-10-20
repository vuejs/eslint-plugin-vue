/**
 * @author Thomasan1999
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/prefer-use-template-ref')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
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

      <script>
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

      <script>
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

      <script>
        import { useTemplateRef } from 'vue';

        function getFirstListItemElement() {
          const firstListItem = useTemplateRef('firstListItem');
        }
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

      <script>
        import { ref } from 'vue';

        const root = ref();
      </script>
      `,
      output: `
      <template>
          <div ref="root"/>
      </template>

      <script>
        import { ref } from 'vue';

        const root = useTemplateRef('root');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          line: 9,
          column: 22
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

      <script>
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

      <script>
        import { ref } from 'vue';

        const buttonRef = ref();
        const link = useTemplateRef('link');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          line: 11,
          column: 22
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

      <script>
        import { ref } from 'vue';

        const heading = ref();
        const link = ref();
      </script>
      `,
      output: `
      <template>
          <h1 ref="heading">Heading</h1>
          <a href="" ref="link">Link</a>
      </template>

      <script>
        import { ref } from 'vue';

        const heading = useTemplateRef('heading');
        const link = useTemplateRef('link');
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          line: 10,
          column: 25
        },
        {
          messageId: 'preferUseTemplateRef',
          line: 11,
          column: 22
        }
      ]
    },
    {
      filename: 'ref-in-block.vue',
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

      <script>
        import { ref } from 'vue';

        function getFirstListItemElement() {
          const firstListItem = ref();
        }
      </script>
      `,
      output: `
      <template>
          <div>
            <ul>
              <li ref="firstListItem">Morning</li>
              <li>Afternoon</li>
              <li>Evening</li>
            </ul>
          </div>
      </template>

      <script>
        import { ref } from 'vue';

        function getFirstListItemElement() {
          const firstListItem = useTemplateRef('firstListItem');
        }
      </script>
      `,
      errors: [
        {
          messageId: 'preferUseTemplateRef',
          line: 16,
          column: 33
        }
      ]
    }
  ]
})
