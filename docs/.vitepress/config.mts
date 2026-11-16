import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import path from 'pathe'
import { fileURLToPath } from 'node:url'
import { viteCommonjs, vitePluginRequireResolve } from './vite-plugin.mjs'
import eslint4b, { requireESLintUseAtYourOwnRisk4b } from 'vite-plugin-eslint4b'

// Pre-build cjs packages that cannot be bundled well.
import './build-system/build.mjs'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// eslint-disable-next-line unicorn/no-anonymous-default-export
export default async () => {
  const rulesPath = '../../tools/lib/rules.ts' // Avoid bundle
  const mod = await import(rulesPath)
  const rules: typeof import('../../tools/lib/rules.ts').default =
    mod.default || mod
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
    { title: 'Base Rules', categoryId: 'base' },
    { title: 'Priority A: Essential', categoryId: 'vue3-essential' },
    {
      title: 'Priority B: Strongly Recommended',
      categoryId: 'vue3-strongly-recommended'
    },
    { title: 'Priority C: Recommended', categoryId: 'vue3-recommended' }
  ]

  const categorizedRules: DefaultTheme.SidebarItem[] = []
  for (const { title, categoryId } of sidebarCategories) {
    const children: DefaultTheme.SidebarItem[] = rules
      .filter(
        (rule) =>
          rule.meta.docs.categories?.includes(categoryId) &&
          !rule.meta.deprecated
      )
      .map(({ ruleId, name }) => ({
        text: ruleId,
        link: `/rules/${name}`
      }))

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
      plugins: [
        vitePluginRequireResolve(),
        viteCommonjs(),
        eslint4b() as any,
        requireESLintUseAtYourOwnRisk4b()
      ],
      resolve: {
        alias: {
          'vue-eslint-parser': path.join(
            dirname,
            './build-system/shim/vue-eslint-parser.mjs'
          ),
          '@typescript-eslint/parser': path.join(
            dirname,
            './build-system/shim/@typescript-eslint/parser.mjs'
          ),

          tslib: path.join(dirname, '../../node_modules/tslib/tslib.es6.js'),
          globby: path.join(dirname, './build-system/shim/empty.ts'),
          'fast-glob': path.join(dirname, './build-system/shim/empty.ts'),
          tinyglobby: path.join(dirname, './build-system/shim/empty.ts'),
          module: path.join(dirname, './build-system/shim/empty.ts'),
          'node:module': path.join(dirname, './build-system/shim/empty.ts')
        }
      },
      define: {
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

      outline: {
        level: 'deep'
      },

      algolia: {
        appId: '2L4MGZSULB',
        apiKey: 'fdf57932b27a6c230d01a890492ab76d',
        indexName: 'eslint-plugin-vue'
      }
    }
  })
}
