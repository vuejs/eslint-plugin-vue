/**
 * @fileoverview flat configs test
 * @author 唯然<weiran.zsd@outlook.com>
 */

'use strict'

const plugin = require('../../../lib/index')
const { strict: assert } = require('assert') // node v14 does not support 'assert/strict'
const { FlatESLint } = require('../../eslint-compat')

function mergeConfig(configs) {
  let config = { rules: {}, plugins: {} }
  for (const item of configs) {
    config = {
      ...config,
      ...item,
      plugins: {
        ...config.plugins,
        ...item?.plugins
      },
      rules: {
        ...config.rules,
        ...item?.rules
      }
    }
  }
  return config
}

describe('flat configs', () => {
  it('should export base config', () => {
    const base = plugin.configs['flat/base']
    assert.ok(base)
    assert.equal(typeof base, 'object')

    const forVue = mergeConfig(
      base.filter((config) => config.files?.includes('*.vue') || !config.files)
    )
    assert.strictEqual(forVue.plugins.vue, plugin)
    assert.strictEqual(forVue.processor, 'vue/vue')
    assert.strictEqual(forVue.rules['vue/comment-directive'], 'error')

    const forOtherThanVue = mergeConfig(
      base.filter((config) => !config.files?.includes('*.vue'))
    )
    assert.strictEqual(forOtherThanVue.plugins.vue, plugin)
    assert.strictEqual(
      forOtherThanVue.rules['vue/comment-directive'],
      undefined
    )
  })

  it('should export essential config', () => {
    const essential = plugin.configs['flat/essential']
    assert.ok(essential)
    assert.equal(typeof essential, 'object')

    const forVue = mergeConfig(
      essential.filter(
        (config) => config.files?.includes('*.vue') || !config.files
      )
    )
    assert.strictEqual(forVue.plugins.vue, plugin)
    assert.strictEqual(forVue.rules['vue/comment-directive'], 'error')
    assert.strictEqual(forVue.rules['vue/multi-word-component-names'], 'error')

    const forOtherThanVue = mergeConfig(
      essential.filter((config) => !config.files?.includes('*.vue'))
    )
    assert.strictEqual(forOtherThanVue.plugins.vue, plugin)
    assert.strictEqual(
      forOtherThanVue.rules['vue/comment-directive'],
      undefined
    )
    assert.strictEqual(
      forOtherThanVue.rules['vue/multi-word-component-names'],
      'error'
    )
  })

  it('should export strongly-recommended config', () => {
    const stronglyRecommended = plugin.configs['flat/vue2-strongly-recommended']
    assert.ok(stronglyRecommended)
    assert.equal(typeof stronglyRecommended, 'object')

    const forVue = mergeConfig(
      stronglyRecommended.filter(
        (config) => config.files?.includes('*.vue') || !config.files
      )
    )
    assert.strictEqual(forVue.plugins.vue, plugin)
    assert.strictEqual(forVue.rules['vue/comment-directive'], 'error')
    assert.strictEqual(forVue.rules['vue/multi-word-component-names'], 'error')

    const forOtherThanVue = mergeConfig(
      stronglyRecommended.filter((config) => !config.files?.includes('*.vue'))
    )
    assert.strictEqual(forOtherThanVue.plugins.vue, plugin)
    assert.strictEqual(
      forOtherThanVue.rules['vue/comment-directive'],
      undefined
    )
    assert.strictEqual(
      forOtherThanVue.rules['vue/multi-word-component-names'],
      'error'
    )
  })

  it('should export recommended config', () => {
    const recommended = plugin.configs['flat/recommended']
    assert.ok(recommended)
    assert.equal(typeof recommended, 'object')

    const forVue = mergeConfig(
      recommended.filter(
        (config) => config.files?.includes('*.vue') || !config.files
      )
    )
    assert.strictEqual(forVue.plugins.vue, plugin)
    assert.strictEqual(forVue.rules['vue/comment-directive'], 'error')
    assert.strictEqual(forVue.rules['vue/multi-word-component-names'], 'error')
    assert.strictEqual(forVue.rules['vue/attributes-order'], 'warn')

    const forOtherThanVue = mergeConfig(
      recommended.filter((config) => !config.files?.includes('*.vue'))
    )
    assert.strictEqual(forOtherThanVue.plugins.vue, plugin)
    assert.strictEqual(
      forOtherThanVue.rules['vue/comment-directive'],
      undefined
    )
    assert.strictEqual(
      forOtherThanVue.rules['vue/multi-word-component-names'],
      'error'
    )
    assert.strictEqual(forOtherThanVue.rules['vue/attributes-order'], 'warn')
  })

  it('should export vue2-essential config', () => {
    const essential = plugin.configs['flat/vue2-essential']
    assert.ok(essential)
    assert.equal(typeof essential, 'object')

    const forVue = mergeConfig(
      essential.filter(
        (config) => config.files?.includes('*.vue') || !config.files
      )
    )
    assert.strictEqual(forVue.plugins.vue, plugin)
    assert.strictEqual(forVue.rules['vue/comment-directive'], 'error')
    assert.strictEqual(forVue.rules['vue/multi-word-component-names'], 'error')

    const forOtherThanVue = mergeConfig(
      essential.filter((config) => !config.files?.includes('*.vue'))
    )
    assert.strictEqual(forOtherThanVue.plugins.vue, plugin)
    assert.strictEqual(
      forOtherThanVue.rules['vue/comment-directive'],
      undefined
    )
    assert.strictEqual(
      forOtherThanVue.rules['vue/multi-word-component-names'],
      'error'
    )
  })

  it('should export vue2-strongly-recommended config', () => {
    const stronglyRecommended = plugin.configs['flat/vue2-strongly-recommended']
    assert.ok(stronglyRecommended)
    assert.equal(typeof stronglyRecommended, 'object')

    const forVue = mergeConfig(
      stronglyRecommended.filter(
        (config) => config.files?.includes('*.vue') || !config.files
      )
    )
    assert.strictEqual(forVue.plugins.vue, plugin)
    assert.strictEqual(forVue.rules['vue/comment-directive'], 'error')
    assert.strictEqual(forVue.rules['vue/multi-word-component-names'], 'error')

    const forOtherThanVue = mergeConfig(
      stronglyRecommended.filter((config) => !config.files?.includes('*.vue'))
    )
    assert.strictEqual(forOtherThanVue.plugins.vue, plugin)
    assert.strictEqual(
      forOtherThanVue.rules['vue/comment-directive'],
      undefined
    )
    assert.strictEqual(
      forOtherThanVue.rules['vue/multi-word-component-names'],
      'error'
    )
  })

  it('should export vue2-recommended config', () => {
    const recommended = plugin.configs['flat/vue2-recommended']
    assert.ok(recommended)
    assert.equal(typeof recommended, 'object')

    const forVue = mergeConfig(
      recommended.filter(
        (config) => config.files?.includes('*.vue') || !config.files
      )
    )
    assert.strictEqual(forVue.plugins.vue, plugin)
    assert.strictEqual(forVue.rules['vue/comment-directive'], 'error')
    assert.strictEqual(forVue.rules['vue/multi-word-component-names'], 'error')
    assert.strictEqual(forVue.rules['vue/attributes-order'], 'warn')

    const forOtherThanVue = mergeConfig(
      recommended.filter((config) => !config.files?.includes('*.vue'))
    )
    assert.strictEqual(forOtherThanVue.plugins.vue, plugin)
    assert.strictEqual(
      forOtherThanVue.rules['vue/comment-directive'],
      undefined
    )
    assert.strictEqual(
      forOtherThanVue.rules['vue/multi-word-component-names'],
      'error'
    )
    assert.strictEqual(forOtherThanVue.rules['vue/attributes-order'], 'warn')
  })

  it('should work the suppress comments with base config', async () => {
    if (!FlatESLint) return
    const base = plugin.configs['flat/base']
    const eslint = new FlatESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...base,
        {
          rules: {
            'vue/no-duplicate-attributes': 'error'
          }
        }
      ]
    })
    const code = `
      <template>
        <!-- eslint-disable -->
        <div id id="a">Hello</div>
      </template>
    `
    const result = await eslint.lintText(code, { filePath: 'test.vue' })

    assert.deepStrictEqual(result[0].messages, [])
  })

  it('should work the suppress comments with recommended config', async () => {
    if (!FlatESLint) return
    const recommended = plugin.configs['flat/recommended']
    const eslint = new FlatESLint({
      overrideConfigFile: true,
      overrideConfig: recommended
    })
    const code = `
<template>
  <!-- eslint-disable -->
  <div id id="a">Hello</div>
</template>
`
    const result = await eslint.lintText(code, { filePath: 'MyComponent.vue' })

    assert.deepStrictEqual(result[0].messages, [])
  })

  it('should error with recommended config', async () => {
    if (!FlatESLint) return
    const recommended = plugin.configs['flat/recommended']
    const eslint = new FlatESLint({
      overrideConfigFile: true,
      overrideConfig: recommended
    })
    const code = `
<template>
  <div id id="a">Hello</div>
</template>
`
    const result = await eslint.lintText(code, { filePath: 'MyComponent.vue' })

    assert.deepStrictEqual(
      result[0].messages.map((message) => message.ruleId),
      [
        'vue/no-parsing-error',
        'vue/max-attributes-per-line',
        'vue/no-duplicate-attributes',
        'vue/singleline-html-element-content-newline',
        'vue/singleline-html-element-content-newline'
      ]
    )
  })
})
