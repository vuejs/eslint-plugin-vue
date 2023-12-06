import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import path from 'path'
import { fileURLToPath } from 'url'
import { viteCommonjs, vitePluginRequireResolve } from './vite-plugin.mjs'

// Pre-build cjs packages that cannot be bundled well.
import './build-system/build.mjs'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default async () => {
  const rulesPath = '../../tools/lib/rules.js' // Avoid bundle
  const rules: typeof import('../../tools/lib/rules.js') = await import(
    rulesPath
  ).then((mod) => mod.default || mod)
  const uncategorizedRules = rules.filter(
    (rule) =>
      !rule.meta.docs.categories &&
      !rule.meta.docs.extensionSource &&
      !rule.meta.deprecated
  )
  const uncategorizedExtensionRule = rules.filter(
    (rule) =>
      !rule.meta.docs.categories &&
      rule.meta.docs.extensionSource &&
      !rule.meta.deprecated
  )
  const deprecatedRules = rules.filter((rule) => rule.meta.deprecated)

  const sidebarCategories = [
    { title: 'Base Rules', categoryIds: ['base'] },
    {
      title: 'Priority A: Essential',
      categoryIds: ['vue3-essential', 'essential']
    },
    {
      title: 'Priority A: Essential for Vue.js 3.x',
      categoryIds: ['vue3-essential']
    },
    {
      title: 'Priority A: Essential for Vue.js 2.x',
      categoryIds: ['essential']
    },
    {
      title: 'Priority B: Strongly Recommended',
      categoryIds: ['vue3-strongly-recommended', 'strongly-recommended']
    },
    {
      title: 'Priority B: Strongly Recommended for Vue.js 3.x',
      categoryIds: ['vue3-strongly-recommended']
    },
    {
      title: 'Priority B: Strongly Recommended for Vue.js 2.x',
      categoryIds: ['strongly-recommended']
    },
    {
      title: 'Priority C: Recommended',
      categoryIds: ['vue3-recommended', 'recommended']
    },
    {
      title: 'Priority C: Recommended for Vue.js 3.x',
      categoryIds: ['vue3-recommended']
    },
    {
      title: 'Priority C: Recommended for Vue.js 2.x',
      categoryIds: ['recommended']
    }
  ]

  const categorizedRules: DefaultTheme.SidebarItem[] = []
  for (const { title, categoryIds } of sidebarCategories) {
    const categoryRules = rules
      .filter((rule) => rule.meta.docs.categories && !rule.meta.deprecated)
      .filter((rule) =>
        categoryIds.every((categoryId) =>
          rule.meta.docs.categories.includes(categoryId)
        )
      )
    const children: DefaultTheme.SidebarItem[] = categoryRules
      .filter(({ ruleId }) => {
        const exists = categorizedRules.some(
          ({ items }) =>
            items &&
            items.some(({ text: alreadyRuleId }) => alreadyRuleId === ruleId)
        )
        return !exists
      })
      .map(({ ruleId, name }) => {
        return {
          text: ruleId,
          link: `/rules/${name}`
        }
      })

    if (children.length === 0) {
      continue
    }
    categorizedRules.push({
      text: title,
      collapsed: false,
      items: children
    })
  }

  const extraCategories: DefaultTheme.SidebarItem[] = []
  if (uncategorizedRules.length > 0) {
    extraCategories.push({
      text: 'Uncategorized',
      collapsed: false,
      items: uncategorizedRules.map(({ ruleId, name }) => ({
        text: ruleId,
        link: `/rules/${name}`
      }))
    })
  }
  if (uncategorizedExtensionRule.length > 0) {
    extraCategories.push({
      text: 'Extension Rules',
      collapsed: false,
      items: uncategorizedExtensionRule.map(({ ruleId, name }) => ({
        text: ruleId,
        link: `/rules/${name}`
      }))
    })
  }
  if (deprecatedRules.length > 0) {
    extraCategories.push({
      text: 'Deprecated',
      collapsed: false,
      items: deprecatedRules.map(({ ruleId, name }) => ({
        text: ruleId,
        link: `/rules/${name}`
      }))
    })
  }
  return defineConfig({
    base: '/',
    title: 'eslint-plugin-vue',
    description: 'Official ESLint plugin for Vue.js',
    head: [['link', { rel: 'icon', href: '/favicon.png' }]],

    vite: {
      publicDir: path.resolve(dirname, './public'),
      plugins: [vitePluginRequireResolve(), viteCommonjs()],
      resolve: {
        alias: {
          'eslint/use-at-your-own-risk': path.join(
            dirname,
            './build-system/shim/eslint/use-at-your-own-risk.mjs'
          ),
          eslint: path.join(dirname, './build-system/shim/eslint.mjs'),
          assert: path.join(dirname, './build-system/shim/assert.mjs'),
          path: path.join(dirname, './build-system/shim/path.mjs'),

          tslib: path.join(dirname, '../../node_modules/tslib/tslib.es6.js'),
          esquery: path.join(dirname, './build-system/shim/esquery.mjs'),
          globby: path.join(dirname, './build-system/shim/globby.mjs')
        }
      },
      define: {
        'process.env.NODE_DEBUG': 'false',
        'require.cache': '{}'
      }
    },

    lastUpdated: true,
    themeConfig: {
      editLink: {
        pattern:
          'https://github.com/vuejs/eslint-plugin-vue/edit/master/docs/:path'
      },
      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/vuejs/eslint-plugin-vue'
        }
      ],

      nav: [
        { text: 'User Guide', link: '/user-guide/' },
        { text: 'Developer Guide', link: '/developer-guide/' },
        { text: 'Rules', link: '/rules/' },
        {
          text: 'Demo',
          link: 'https://ota-meshi.github.io/eslint-plugin-vue-demo/'
        }
      ],

      sidebar: {
        '/rules/': [
          {
            text: 'Rules',
            items: [{ text: 'Available Rules', link: '/rules/' }]
          },

          // Rules in each category.
          ...categorizedRules,

          // Rules in no category.
          ...extraCategories
        ],

        '/': [
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/' },
              { text: 'User Guide', link: '/user-guide/' },
              { text: 'Developer Guide', link: '/developer-guide/' },
              { text: 'Rules', link: '/rules/' }
            ]
          }
        ]
      },

      algolia: {
        appId: '2L4MGZSULB',
        apiKey: 'fdf57932b27a6c230d01a890492ab76d',
        indexName: 'eslint-plugin-vue'
      }
    }
  })
}
