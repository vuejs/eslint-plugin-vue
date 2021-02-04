/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const Linter = require('eslint').Linter
const parser = require('vue-eslint-parser')
const assert = require('assert')
const experimentalScriptSetupVars = require('../../lib/rules/experimental-script-setup-vars')

const baseConfig = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
}

describe('script-setup test cases', () => {
  const linter = new Linter()
  linter.defineParser('vue-eslint-parser', parser)
  linter.defineRule(
    'vue/experimental-script-setup-vars',
    experimentalScriptSetupVars
  )

  describe('temporary supports.', () => {
    const config = Object.assign({}, baseConfig, {
      globals: { console: false },
      rules: {
        'vue/experimental-script-setup-vars': 'error',
        'no-undef': 'error'
      }
    })

    it('should not be marked.', () => {
      const code = `
      <script setup="props, { emit }">
      import { watchEffect } from 'vue'

      watchEffect(() => console.log(props.msg))
      emit('foo')
      </script>`
      const messages = linter.verify(code, config, 'test.vue')
      assert.deepStrictEqual(messages, [])
    })
  })
})
