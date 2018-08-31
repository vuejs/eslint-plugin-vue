/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const Linter = require('eslint').Linter
const chai = require('chai')

const rules = require('../..').rules

const assert = chai.assert

const baseConfig = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
}

describe('Complex autofix test cases', () => {
  const linter = new Linter()
  for (const key of Object.keys(rules)) {
    const ruleId = `vue/${key}`
    linter.defineRule(ruleId, rules[key])
  }

  // https://github.com/vuejs/eslint-plugin-vue/issues/566
  describe('Autofix of `vue/order-in-components` and `comma-dangle` should not conflict.', () => {
    const config = Object.assign({}, baseConfig, { 'rules': {
      'vue/order-in-components': ['error'],
      'comma-dangle': ['error', 'always']
    }})
    it('Even if set comma-dangle:always, the output should be as expected.', () => {
      const code = `
      <script>
        export default {
          data() {
          },
          name: 'burger'
        };
      </script>`
      const output = `
      <script>
        export default {
          name: 'burger',
          data() {
          },
        };
      </script>`
      assert.equal(
        linter.verifyAndFix(code, config, 'test.vue').output,
        output
      )
    })
    it('Even if include comments, the output should be as expected.', () => {
      const code = `
      <script>
        export default {
          /**data*/
          data() {
          }/*after data*/,
          /**name*/
          name: 'burger'/*after name*/
        };
      </script>`
      const output = `
      <script>
        export default {
          /**name*/
          name: 'burger',
          /**data*/
          data() {
          },/*after data*//*after name*/
        };
      </script>`
      assert.equal(
        linter.verifyAndFix(code, config, 'test.vue').output,
        output
      )
    })
  })
})
