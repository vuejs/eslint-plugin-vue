import assert from 'node:assert'
import plugin from '../..'
import packageJson from '../../package.json'

const expectedMeta = {
  name: 'eslint-plugin-vue',
  version: packageJson.version
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
