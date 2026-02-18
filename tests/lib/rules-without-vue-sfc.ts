/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
import { Linter } from '../eslint-compat.ts'
import parser from 'vue-eslint-parser'
import { rules } from '../..'

describe("Don't crash even if without vue SFC.", () => {
  const code = 'var a = 1'

  for (const key of Object.keys(rules)) {
    const ruleId = `vue/${key}`

    it(ruleId, () => {
      const linter = new Linter()
      const config = {
        languageOptions: {
          parser,
          ecmaVersion: 2015
        },
        plugins: {
          vue: {
            rules: {
              [key]: rules[key]
            }
          }
        },
        rules: {
          [ruleId]: 'error'
        }
      }
      linter.verifyAndFix(code, config, 'test.js')
    })
  }
})
