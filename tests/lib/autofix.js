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

  // https://github.com/vuejs/eslint-plugin-vue/issues/554
  describe('Autofix of `html-self-closing` and `component-name-in-template-casing` should not conflict.', () => {
    const kebabConfig = Object.assign({}, baseConfig, { 'rules': {
      'vue/html-self-closing': ['error', {
        'html': {
          'component': 'never'
        }
      }],
      'vue/component-name-in-template-casing': ['error', 'kebab-case', { registeredComponentsOnly: false }]
    }})

    const pascalConfig = Object.assign({}, baseConfig, { 'rules': {
      'vue/html-self-closing': ['error', {
        'html': {
          'component': 'never'
        }
      }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }]
    }})

    it('Even if set kebab-case, the output should be as expected.', () => {
      const code = `
      <template>
        <VueComponent />
      </template>`
      const output = `
      <template>
        <vue-component ></vue-component>
      </template>`

      assert.equal(
        linter.verifyAndFix(code, kebabConfig, 'test.vue').output,
        output
      )
    })

    it('Even if set PascalCase, the output should be as expected.', () => {
      const code = `
      <template>
        <vue-component />
      </template>`
      const output = `
      <template>
        <VueComponent ></VueComponent>
      </template>`

      assert.equal(
        linter.verifyAndFix(code, pascalConfig, 'test.vue').output,
        output
      )
    })

    it('Even if element have an attributes, the output should be as expected.', () => {
      const code = `
      <template>
        <vue-component attr
          id="item1" />
      </template>`
      const output = `
      <template>
        <VueComponent attr
          id="item1" ></VueComponent>
      </template>`

      assert.equal(
        linter.verifyAndFix(code, pascalConfig, 'test.vue').output,
        output
      )
    })
  })
})
