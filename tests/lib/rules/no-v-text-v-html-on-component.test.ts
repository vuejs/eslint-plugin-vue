/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-v-text-v-html-on-component'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-v-text-v-html-on-component', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-text="content" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-html="content" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComponent v-if="content" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link v-text="content" />
      </template>
      `,
      options: [{ allow: ['router-link'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link v-html="content" />
        <NuxtLink v-html="content" />
      </template>
      `,
      options: [{ allow: ['RouterLink', 'nuxt-link'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <svg><g v-text="content" /></svg>
        <math><mspace v-text="content" /></math>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <h1 v-html="content" />
        <g v-text="content" />
        <mi v-text="content" />
      </template>
      `,
      options: [{ ignoreElementNamespaces: true }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComponent v-text="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-text on component may break component's content.",
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyComponent v-html="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-html on component may break component's content.",
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <component :is="component" v-text="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-text on component may break component's content.",
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <component :is="component" v-html="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-html on component may break component's content.",
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :is="component" v-text="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-text on component may break component's content.",
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 46
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :is="component" v-html="content" />
      </template>
      `,
      errors: [
        {
          message: "Using v-html on component may break component's content.",
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 46
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link v-html="content" />
      </template>
      `,
      options: [{ allow: ['nuxt-link'] }],
      errors: [
        {
          message: "Using v-html on component may break component's content.",
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <g v-text="content" />
        <mi v-text="content" />
      </template>
      `,
      options: [{ ignoreElementNamespaces: false }],
      errors: [
        {
          message: "Using v-text on component may break component's content.",
          line: 3,
          column: 12,
          endLine: 3,
          endColumn: 28
        },
        {
          message: "Using v-text on component may break component's content.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 29
        }
      ]
    }
  ]
})
