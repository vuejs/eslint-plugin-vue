/**
 * @author Marton Csordas
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-deprecated-router-link-tag-prop')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-deprecated-router-link-tag-prop', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <RouterLink to="/">Home</RouterLink>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link to="/">Home</router-link>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <RouterLink to="/">
          <div>Home</div>
        </RouterLink>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link to="/">
          <div>Home</div>
        </router-link>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <NuxtLink to="/">Home</NuxtLink>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <nuxt-link to="/">Home</nuxt-link>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <NuxtLink to="/">
          <div>Home</div>
        </NuxtLink>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <nuxt-link to="/">
          <div>Home</div>
        </nuxt-link>
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <RouterLink tag="div" to="/">Home</RouterLink>
      </template>
      `,
      errors: [
        {
          message:
            "'tag' property on 'RouterLink' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link tag="div" to="/">Home</router-link>
      </template>
      `,
      errors: [
        {
          message:
            "'tag' property on 'router-link' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <RouterLink tag="div" to="/">Home</RouterLink>
      </template>
      `,
      options: [{ components: ['RouterLink'] }],
      errors: [
        {
          message:
            "'tag' property on 'RouterLink' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <RouterLink tag="div" to="/">Home</RouterLink>
      </template>
      `,
      options: [{ components: ['router-link'] }],
      errors: [
        {
          message:
            "'tag' property on 'RouterLink' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link tag="div" to="/">Home</router-link>
      </template>
      `,
      options: [{ components: ['RouterLink'] }],
      errors: [
        {
          message:
            "'tag' property on 'router-link' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <RouterLink :tag="someVariable" to="/">Home</RouterLink>
      </template>
      `,
      errors: [
        {
          message:
            "'tag' property on 'RouterLink' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link :tag="someVariable" to="/">Home</router-link>
      </template>
      `,
      errors: [
        {
          message:
            "'tag' property on 'router-link' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <RouterLink :tag="someVariable" to="/">Home</RouterLink>
      </template>
      `,
      options: [{ components: ['RouterLink'] }],
      errors: [
        {
          message:
            "'tag' property on 'RouterLink' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <router-link :tag="someVariable" to="/">Home</router-link>
      </template>
      `,
      options: [{ components: ['RouterLink'] }],
      errors: [
        {
          message:
            "'tag' property on 'router-link' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <NuxtLink tag="div" to="/">Home</NuxtLink>
      </template>
      `,
      options: [{ components: ['NuxtLink'] }],
      errors: [
        {
          message:
            "'tag' property on 'NuxtLink' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <nuxt-link tag="div" to="/">Home</nuxt-link>
      </template>
      `,
      options: [{ components: ['NuxtLink'] }],
      errors: [
        {
          message:
            "'tag' property on 'nuxt-link' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <NuxtLink :tag="someVariable" to="/">Home</NuxtLink>
      </template>
      `,
      options: [{ components: ['NuxtLink'] }],
      errors: [
        {
          message:
            "'tag' property on 'NuxtLink' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <nuxt-link :tag="someVariable" to="/">Home</nuxt-link>
      </template>
      `,
      options: [{ components: ['NuxtLink'] }],
      errors: [
        {
          message:
            "'tag' property on 'nuxt-link' component is deprecated. Use scoped slots instead.",
          line: 3,
          column: 21
        }
      ]
    }
  ]
})
