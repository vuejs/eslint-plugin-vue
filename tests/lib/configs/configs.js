'use strict'

const { ESLint } = require('../../eslint-compat')
const plugin = require('../../../lib/index')

describe('configs', () => {
  for (const name of Object.keys(plugin.configs)) {
    const configName = `plugin:vue/${name}`
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: {
        extends: [configName]
      },
      plugins: { vue: plugin },
      fix: true
    })
    describe(`test for ${configName}`, () => {
      it('without error', async () => {
        await eslint.lintText('', {
          filePath: 'test.vue'
        })
      })
    })
  }
})
