/**
 * @fileoverview flat configs test
 * @author 唯然<weiran.zsd@outlook.com>
 */

'use strict'

const plugin = require('../../../lib/index')
const { strict: assert } = require('assert') // node v14 does not support 'assert/strict'

describe('flat configs', () => {
  it('should export base config', () => {
    const base = plugin.configs['flat/base']
    assert.ok(base)
    assert.equal(typeof base, 'object')
    assert.strictEqual(base.plugins.vue, plugin)
    assert.strictEqual(base.rules['vue/comment-directive'], 'error')
  })
  it('should export essential config', () => {
    const essential = plugin.configs['flat/essential']
    assert.ok(essential)
    assert.equal(typeof essential, 'object')
    assert.strictEqual(essential.plugins.vue, plugin)
    assert.strictEqual(essential.rules['vue/comment-directive'], 'error')
    assert.strictEqual(
      essential.rules['vue/multi-word-component-names'],
      'error'
    )
  })

  it('should export strongly-recommended config', () => {
    const stronglyRecommended = plugin.configs['flat/vue2-strongly-recommended']
    assert.ok(stronglyRecommended)
    assert.equal(typeof stronglyRecommended, 'object')
    assert.strictEqual(stronglyRecommended.plugins.vue, plugin)
    assert.strictEqual(
      stronglyRecommended.rules['vue/comment-directive'],
      'error'
    )
    assert.strictEqual(
      stronglyRecommended.rules['vue/multi-word-component-names'],
      'error'
    )
  })

  it('should export recommended config', () => {
    const recommended = plugin.configs['flat/recommended']
    assert.ok(recommended)
    assert.equal(typeof recommended, 'object')
    assert.strictEqual(recommended.plugins.vue, plugin)
    assert.strictEqual(recommended.rules['vue/comment-directive'], 'error')
    assert.strictEqual(
      recommended.rules['vue/multi-word-component-names'],
      'error'
    )
    assert.strictEqual(recommended.rules['vue/attributes-order'], 'warn')
  })

  it('should export vue2-essential config', () => {
    const essential = plugin.configs['flat/vue2-essential']
    assert.ok(essential)
    assert.equal(typeof essential, 'object')
    assert.strictEqual(essential.plugins.vue, plugin)
    assert.strictEqual(essential.rules['vue/comment-directive'], 'error')
    assert.strictEqual(
      essential.rules['vue/multi-word-component-names'],
      'error'
    )
  })

  it('should export vue2-strongly-recommended config', () => {
    const stronglyRecommended = plugin.configs['flat/vue2-strongly-recommended']
    assert.ok(stronglyRecommended)
    assert.equal(typeof stronglyRecommended, 'object')
    assert.strictEqual(stronglyRecommended.plugins.vue, plugin)
    assert.strictEqual(
      stronglyRecommended.rules['vue/comment-directive'],
      'error'
    )
    assert.strictEqual(
      stronglyRecommended.rules['vue/multi-word-component-names'],
      'error'
    )
  })

  it('should export vue2-recommended config', () => {
    const recommended = plugin.configs['flat/vue2-recommended']
    assert.ok(recommended)
    assert.equal(typeof recommended, 'object')
    assert.strictEqual(recommended.plugins.vue, plugin)
    assert.strictEqual(recommended.rules['vue/comment-directive'], 'error')
    assert.strictEqual(
      recommended.rules['vue/multi-word-component-names'],
      'error'
    )
    assert.strictEqual(recommended.rules['vue/attributes-order'], 'warn')
  })
})
