'use strict'

const assert = require('assert')
const plugin = require('../..')
const expectedMeta = {
  name: 'eslint-plugin-vue',
  version: require('../../package.json').version
}

describe('Test for meta object', () => {
  it('A plugin should have a meta object.', () => {
    assert.deepStrictEqual(plugin.meta, expectedMeta)
  })

  for (const [name, processor] of Object.entries(plugin.processors)) {
    it(`"${name}" processor should have a meta object.`, () => {
      assert.deepStrictEqual(processor.meta, expectedMeta)
    })
  }
})
