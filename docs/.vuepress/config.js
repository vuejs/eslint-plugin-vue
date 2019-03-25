/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rules = require('../../tools/lib/rules')
const categories = require('../../tools/lib/categories')

const uncategorizedRules = rules.filter(rule => !rule.meta.docs.category && !rule.meta.deprecated)
const deprecatedRules = rules.filter(rule => rule.meta.deprecated)

const extraCategories = []
if (uncategorizedRules.length > 0) {
  extraCategories.push({
    title: 'Uncategorized',
    collapsable: false,
    children: uncategorizedRules.map(({ ruleId, name }) => [`/rules/${name}`, ruleId])
  })
}
if (deprecatedRules.length > 0) {
  extraCategories.push({
    title: 'Deprecated',
    collapsable: false,
    children: deprecatedRules.map(({ ruleId, name }) => [`/rules/${name}`, ruleId])
  })
}

module.exports = {
  base: '/',
  title: 'eslint-plugin-vue',
  description: 'Official ESLint plugin for Vue.js',
  serviceWorker: true,
  evergreen: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],

  themeConfig: {
    repo: 'vuejs/eslint-plugin-vue',
    docsRepo: 'vuejs/eslint-plugin-vue',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    lastUpdated: true,
    serviceWorker: {
      updatePopup: true
    },

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
        ...categories.map(({ title, rules }) => ({
          title: title.replace(/ \(.+?\)/, ''),
          collapsable: false,
          children: rules.map(({ ruleId, name }) => [`/rules/${name}`, ruleId])
        })),

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
