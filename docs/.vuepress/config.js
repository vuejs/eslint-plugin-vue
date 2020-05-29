/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rules = require('../../tools/lib/rules')

const uncategorizedRules = rules.filter(
  (rule) =>
    !rule.meta.docs.categories &&
    !rule.meta.docs.extensionRule &&
    !rule.meta.deprecated
)
const uncategorizedExtensionRule = rules.filter(
  (rule) =>
    !rule.meta.docs.categories &&
    rule.meta.docs.extensionRule &&
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
  { title: 'Priority A: Essential for Vue.js 2.x', categoryIds: ['essential'] },
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

const categorizedRules = []
for (const { title, categoryIds } of sidebarCategories) {
  const categoryRules = rules
    .filter((rule) => rule.meta.docs.categories && !rule.meta.deprecated)
    .filter((rule) =>
      categoryIds.every((categoryId) =>
        rule.meta.docs.categories.includes(categoryId)
      )
    )
  const children = categoryRules
    .filter(({ ruleId }) => {
      const exists = categorizedRules.some(({ children }) =>
        children.some(([, alreadyRuleId]) => alreadyRuleId === ruleId)
      )
      return !exists
    })
    .map(({ ruleId, name }) => [`/rules/${name}`, ruleId])

  if (children.length === 0) {
    continue
  }
  categorizedRules.push({
    title,
    collapsable: false,
    children
  })
}

const extraCategories = []
if (uncategorizedRules.length > 0) {
  extraCategories.push({
    title: 'Uncategorized',
    collapsable: false,
    children: uncategorizedRules.map(({ ruleId, name }) => [
      `/rules/${name}`,
      ruleId
    ])
  })
}
if (uncategorizedExtensionRule.length > 0) {
  extraCategories.push({
    title: 'Extension Rules',
    collapsable: false,
    children: uncategorizedExtensionRule.map(({ ruleId, name }) => [
      `/rules/${name}`,
      ruleId
    ])
  })
}
if (deprecatedRules.length > 0) {
  extraCategories.push({
    title: 'Deprecated',
    collapsable: false,
    children: deprecatedRules.map(({ ruleId, name }) => [
      `/rules/${name}`,
      ruleId
    ])
  })
}

module.exports = {
  configureWebpack(_config, _isServer) {
    return {
      resolve: {
        alias: {
          module: require.resolve('./shim/module')
        }
      }
    }
  },

  base: '/',
  title: 'eslint-plugin-vue',
  description: 'Official ESLint plugin for Vue.js',
  evergreen: true,
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],

  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: true
    }
  },

  themeConfig: {
    repo: 'vuejs/eslint-plugin-vue',
    docsRepo: 'vuejs/eslint-plugin-vue',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    lastUpdated: true,

    nav: [
      { text: 'User Guide', link: '/user-guide/' },
      { text: 'Developer Guide', link: '/developer-guide/' },
      { text: 'Rules', link: '/rules/' },
      { text: 'Demo', link: 'https://mysticatea.github.io/vue-eslint-demo' }
    ],

    sidebar: {
      '/rules/': [
        '/rules/',

        // Rules in each category.
        ...categorizedRules,

        // Rules in no category.
        ...extraCategories
      ],

      '/': ['/', '/user-guide/', '/developer-guide/', '/rules/']
    },

    algolia: {
      apiKey: 'b2b69365da747a9a9635cda391317c36',
      indexName: 'eslint-plugin-vue'
    }
  }
}
