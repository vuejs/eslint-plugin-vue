/**
 * @fileoverview Tests for comment-directive rule.
 * @author Toru Nagashima
 */

'use strict'

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const assert = require('assert')
const path = require('path')
const Module = require('module')
const eslint = require('eslint')

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

// Initialize linter.
const linter = new eslint.CLIEngine({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2015
  },
  plugins: ['vue'],
  rules: {
    'no-unused-vars': 'error',
    'vue/comment-directive': 'error',
    'vue/no-parsing-error': 'error',
    'vue/no-duplicate-attributes': 'error'
  },
  useEslintrc: false
})

describe('comment-directive', () => {
  // Preparation.
  // Make `require("eslint-plugin-vue")` loading this plugin while this test.
  const resolveFilename = Module._resolveFilename
  before(() => {
    Module._resolveFilename = function (id) {
      if (id === 'eslint-plugin-vue') {
        return path.resolve(__dirname, '../../../lib/index.js')
      }
      return resolveFilename.apply(this, arguments)
    }
  })
  after(() => {
    Module._resolveFilename = resolveFilename
  })

  describe('eslint-disable/eslint-enable', () => {
    it('disable all rules if <!-- eslint-disable -->', () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 0)
    })

    it('disable specific rules if <!-- eslint-disable vue/no-duplicate-attributes -->', () => {
      const code = `
        <template>
          <!-- eslint-disable vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
    })

    it('enable all rules if <!-- eslint-enable -->', () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id id="a">Hello</div>
          <!-- eslint-enable -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[0].line, 6)
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[1].line, 6)
    })

    it('enable specific rules if <!-- eslint-enable vue/no-duplicate-attributes -->', () => {
      const code = `
        <template>
          <!-- eslint-disable vue/no-parsing-error, vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
          <!-- eslint-enable vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[0].line, 6)
    })

    it('should not affect to the code in <script>.', () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id id="a">Hello</div>
        </template>
        <script>
          var a
        </script>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.strictEqual(messages.length, 1)
      assert.strictEqual(messages[0].ruleId, 'no-unused-vars')
    })
  })

  describe('eslint-disable-line', () => {
    it('disable all rules if <!-- eslint-disable-line -->', () => {
      const code = `
        <template>
          <div id id="a">Hello</div> <!-- eslint-disable-line -->
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 0)
    })

    it('disable specific rules if <!-- eslint-disable-line vue/no-duplicate-attributes -->', () => {
      const code = `
        <template>
          <div id id="a">Hello</div> <!-- eslint-disable-line vue/no-duplicate-attributes -->
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
    })

    it('don\'t disable rules if <!-- eslint-disable-line --> is on another line', () => {
      const code = `
        <template>
          <!-- eslint-disable-line -->
          <div id id="a">Hello</div>
          <!-- eslint-disable-line -->
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
    })
  })

  describe('eslint-disable-next-line', () => {
    it('disable all rules if <!-- eslint-disable-next-line -->', () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 0)
    })

    it('disable specific rules if <!-- eslint-disable-next-line vue/no-duplicate-attributes -->', () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
    })

    it('don\'t disable rules if <!-- eslint-disable-next-line --> is on another line', () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line -->

          <div id id="a">Hello</div> <!-- eslint-disable-next-line -->
          <!-- eslint-disable-next-line -->
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
    })

    it('should affect only the next line', () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line vue/no-parsing-error, vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
          <div id id="b">Hello</div>
        </template>
      `
      const messages = linter.executeOnText(code, 'test.vue').results[0].messages

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[0].line, 5)
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[1].line, 5)
    })
  })
})
