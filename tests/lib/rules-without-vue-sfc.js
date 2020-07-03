/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const Linter = require('eslint').Linter
const parser = require('vue-eslint-parser')
const rules = require('../..').rules

describe("Don't crash even if without vue SFC.", () => {
  const code = 'var a = 1'

  for (const key of Object.keys(rules)) {
    const ruleId = `vue/${key}`

    it(ruleId, () => {
      const linter = new Linter()
      const config = {
        parser: 'vue-eslint-parser',
        parserOptions: { ecmaVersion: 2015 },
        rules: {
          [ruleId]: 'error'
        }
      }
      linter.defineParser('vue-eslint-parser', parser)
      linter.defineRule(ruleId, rules[key])
      linter.verifyAndFix(code, config, 'test.js')
    })
  }
})
