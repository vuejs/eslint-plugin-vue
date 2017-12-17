/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const Linter = require('eslint').Linter
const rules = require('../..').rules

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
      linter.defineRule(ruleId, rules[key])
      linter.verifyAndFix(code, config, 'test.vue')
    })
  }
})
