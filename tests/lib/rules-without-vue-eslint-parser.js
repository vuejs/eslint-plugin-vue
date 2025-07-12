/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const Linter = require('../eslint-compat').Linter
const rules = require('../..').rules
const assert = require('assert')

describe("Don't crash even if without vue-eslint-parser.", () => {
  const code = '<template><div>TEST</div></template>'

  for (const key of Object.keys(rules)) {
    const ruleId = `vue/${key}`

    it(ruleId, () => {
      const linter = new Linter()
      const config = {
        files: ['*.vue', '*.js'],
        languageOptions: {
          ecmaVersion: 2015,
          parserOptions: { ecmaFeatures: { jsx: true } }
        },
        plugins: {
          vue: {
            rules: {
              [key]: rules[key]
            }
          }
        },
        rules: {
          [ruleId]: 'error'
        }
      }
      const resultVue = linter.verifyAndFix(code, config, 'test.vue')
      for (const { message } of resultVue.messages) {
        assert.strictEqual(
          message,
          'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
        )
      }

      const resultJs = linter.verifyAndFix(code, config, 'test.js')
      assert.strictEqual(resultJs.messages.length, 0)
    })
  }
})
