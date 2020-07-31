/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const Linter = require('eslint').Linter
const parser = require('babel-eslint')
const rules = require('../..').rules
const assert = require('assert')

describe("Don't crash even if without vue-eslint-parser.", () => {
  const code = '<template><div>TEST</div></template>'

  for (const key of Object.keys(rules)) {
    const ruleId = `vue/${key}`

    it(ruleId, () => {
      const linter = new Linter()
      const config = {
        parser: 'babel-eslint',
        parserOptions: { ecmaVersion: 2015 },
        rules: {
          [ruleId]: 'error'
        }
      }
      linter.defineParser('babel-eslint', parser)
      linter.defineRule(ruleId, rules[key])
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
