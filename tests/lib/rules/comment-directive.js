/**
 * @fileoverview Tests for comment-directive rule.
 * @author Toru Nagashima
 */

'use strict'

const assert = require('assert')
const { ESLint } = require('../../eslint-compat')

// Initialize linter.
const eslint = new ESLint({
  overrideConfig: {
    parser: require.resolve('vue-eslint-parser'),
    parserOptions: {
      ecmaVersion: 2015
    },
    plugins: ['vue'],
    rules: {
      'no-unused-vars': 'error',
      'vue/comment-directive': 'error',
      'vue/no-parsing-error': 'error',
      'vue/no-duplicate-attributes': 'error'
    }
  },
  useEslintrc: false,
  plugins: { vue: require('../../../lib/index') }
})

async function lintMessages(code) {
  const result = await eslint.lintText(code, { filePath: 'test.vue' })
  return result[0].messages
}

describe('comment-directive', () => {
  describe('eslint-disable/eslint-enable', () => {
    it('disable all rules if <!-- eslint-disable -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })

    it('disable specific rules if <!-- eslint-disable vue/no-duplicate-attributes -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
    })

    it('enable all rules if <!-- eslint-enable -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id id="a">Hello</div>
          <!-- eslint-enable -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[0].line, 6)
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[1].line, 6)
    })

    it('enable specific rules if <!-- eslint-enable vue/no-duplicate-attributes -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable vue/no-parsing-error, vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
          <!-- eslint-enable vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[0].line, 6)
    })

    it('should not affect to the code in <script>.', async () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id id="a">Hello</div>
        </template>
        <script>
          var a
        </script>
      `
      const messages = await lintMessages(code)

      assert.strictEqual(messages.length, 1)
      assert.strictEqual(messages[0].ruleId, 'no-unused-vars')
    })

    it('disable specific rules if <!-- eslint-disable vue/no-duplicate-attributes ,, , vue/no-parsing-error -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable vue/no-duplicate-attributes ,, , vue/no-parsing-error -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })
  })

  describe('eslint-disable-line', () => {
    it('disable all rules if <!-- eslint-disable-line -->', async () => {
      const code = `
        <template>
          <div id id="a">Hello</div> <!-- eslint-disable-line -->
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })

    it('disable specific rules if <!-- eslint-disable-line vue/no-duplicate-attributes -->', async () => {
      const code = `
        <template>
          <div id id="a">Hello</div> <!-- eslint-disable-line vue/no-duplicate-attributes -->
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
    })

    it("don't disable rules if <!-- eslint-disable-line --> is on another line", async () => {
      const code = `
        <template>
          <!-- eslint-disable-line -->
          <div id id="a">Hello</div>
          <!-- eslint-disable-line -->
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
    })
  })

  describe('eslint-disable-next-line', () => {
    it('disable all rules if <!-- eslint-disable-next-line -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })

    it('disable specific rules if <!-- eslint-disable-next-line vue/no-duplicate-attributes -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
    })

    it("don't disable rules if <!-- eslint-disable-next-line --> is on another line", async () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line -->

          <div id id="a">Hello</div> <!-- eslint-disable-next-line -->
          <!-- eslint-disable-next-line -->
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
    })

    it('should affect only the next line', async () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line vue/no-parsing-error, vue/no-duplicate-attributes -->
          <div id id="a">Hello</div>
          <div id id="b">Hello</div>
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[0].line, 5)
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[1].line, 5)
    })
  })

  describe('allow description', () => {
    it('disable all rules if <!-- eslint-disable -- description -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable -- description -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })

    it('enable all rules if <!-- eslint-enable -- description -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable -- description -->
          <div id id="a">Hello</div>
          <!-- eslint-enable -- description -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[0].line, 6)
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[1].line, 6)
    })

    it('enable specific rules if <!-- eslint-enable vue/no-duplicate-attributes -- description -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable vue/no-parsing-error, vue/no-duplicate-attributes -- description -->
          <div id id="a">Hello</div>
          <!-- eslint-enable vue/no-duplicate-attributes -- description -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[0].line, 6)
    })

    it('disable all rules if <!-- eslint-disable-line -- description -->', async () => {
      const code = `
        <template>
          <div id id="a">Hello</div> <!-- eslint-disable-line -- description -->
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })

    it('disable specific rules if <!-- eslint-disable-line vue/no-duplicate-attributes -- description -->', async () => {
      const code = `
        <template>
          <div id id="a">Hello</div> <!-- eslint-disable-line vue/no-duplicate-attributes -- description -->
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
    })

    it('disable all rules if <!-- eslint-disable-next-line -- description -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line -- description -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })

    it('disable specific rules if <!-- eslint-disable-next-line vue/no-duplicate-attributes -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line vue/no-duplicate-attributes -- description -->
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
    })
  })

  describe('block level directive', () => {
    it('disable all rules if <!-- eslint-disable -->', async () => {
      const code = `
        <!-- eslint-disable -->
        <template>
          <div id id="a">Hello</div>
        </template>
      `
      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })

    it("don't disable rules if <!-- eslint-disable --> is on after block", async () => {
      const code = `
        <!-- eslint-disable -->
        <i18n>
        </i18n>
        <template>
          <div id id="a">Hello</div>
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 2)
      assert.deepEqual(messages[0].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[1].ruleId, 'vue/no-duplicate-attributes')
    })
  })

  describe('reportUnusedDisableDirectives', () => {
    const eslint = new ESLint({
      overrideConfig: {
        parser: require.resolve('vue-eslint-parser'),
        parserOptions: {
          ecmaVersion: 2015
        },
        plugins: ['vue'],
        rules: {
          'no-unused-vars': 'error',
          'vue/comment-directive': [
            'error',
            { reportUnusedDisableDirectives: true }
          ],
          'vue/no-parsing-error': 'error',
          'vue/no-duplicate-attributes': 'error'
        }
      },
      useEslintrc: false
    })

    async function lintMessages(code) {
      const result = await eslint.lintText(code, { filePath: 'test.vue' })
      return result[0].messages
    }

    it('report unused <!-- eslint-disable -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id="a">Hello</div>
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/comment-directive')
      assert.deepEqual(
        messages[0].message,
        'Unused eslint-disable directive (no problems were reported).'
      )
      assert.deepEqual(messages[0].line, 3)
      assert.deepEqual(messages[0].column, 11)
    })

    it('dont report unused <!-- eslint-disable -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id id="a">Hello</div>
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })
    it('disable and report unused <!-- eslint-disable -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <div id id="a">Hello</div>
          <!-- eslint-enable -->
          <!-- eslint-disable -->
          <div id="b">Hello</div>
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 1)
      assert.deepEqual(messages[0].ruleId, 'vue/comment-directive')
      assert.deepEqual(
        messages[0].message,
        'Unused eslint-disable directive (no problems were reported).'
      )
      assert.deepEqual(messages[0].line, 6)
      assert.deepEqual(messages[0].column, 11)
    })

    it('report unused <!-- eslint-disable vue/no-duplicate-attributes, vue/no-parsing-error -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable vue/no-duplicate-attributes, vue/no-parsing-error -->
          <div id="a">Hello</div>
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 2)

      assert.deepEqual(messages[0].ruleId, 'vue/comment-directive')
      assert.deepEqual(
        messages[0].message,
        "Unused eslint-disable directive (no problems were reported from 'vue/no-duplicate-attributes')."
      )
      assert.deepEqual(messages[0].line, 3)
      assert.deepEqual(messages[0].column, 31)

      assert.deepEqual(messages[1].ruleId, 'vue/comment-directive')
      assert.deepEqual(
        messages[1].message,
        "Unused eslint-disable directive (no problems were reported from 'vue/no-parsing-error')."
      )
      assert.deepEqual(messages[1].line, 3)
      assert.deepEqual(messages[1].column, 60)
    })

    it('report unused <!-- eslint-disable-next-line vue/no-duplicate-attributes, vue/no-parsing-error -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line vue/no-duplicate-attributes, vue/no-parsing-error -->
          <div id="a">Hello</div>
          <div id id="b">Hello</div>
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 4)

      assert.deepEqual(messages[0].ruleId, 'vue/comment-directive')
      assert.deepEqual(
        messages[0].message,
        "Unused eslint-disable-next-line directive (no problems were reported from 'vue/no-duplicate-attributes')."
      )
      assert.deepEqual(messages[0].line, 3)
      assert.deepEqual(messages[0].column, 41)

      assert.deepEqual(messages[1].ruleId, 'vue/comment-directive')
      assert.deepEqual(
        messages[1].message,
        "Unused eslint-disable-next-line directive (no problems were reported from 'vue/no-parsing-error')."
      )
      assert.deepEqual(messages[1].line, 3)
      assert.deepEqual(messages[1].column, 70)

      assert.deepEqual(messages[2].ruleId, 'vue/no-parsing-error')
      assert.deepEqual(messages[2].line, 5)
      assert.deepEqual(messages[3].ruleId, 'vue/no-duplicate-attributes')
      assert.deepEqual(messages[3].line, 5)
    })

    it('dont report used <!-- eslint-disable-next-line vue/no-duplicate-attributes, vue/no-parsing-error -->', async () => {
      const code = `
        <template>
          <!-- eslint-disable-next-line vue/no-duplicate-attributes, vue/no-parsing-error -->
          <div id id="a">Hello</div>
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })

    it('dont report used, with duplicate eslint-disable', async () => {
      const code = `
        <template>
          <!-- eslint-disable -->
          <!-- eslint-disable-next-line vue/no-duplicate-attributes, vue/no-parsing-error -->
          <div id id="a">Hello</div><!-- eslint-disable-line vue/no-duplicate-attributes, vue/no-parsing-error -->
        </template>
      `

      const messages = await lintMessages(code)

      assert.deepEqual(messages.length, 0)
    })
  })
})
