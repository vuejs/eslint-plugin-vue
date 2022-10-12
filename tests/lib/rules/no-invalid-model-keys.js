/**
 * @fileoverview Prevents invalid keys in model option.
 * @author Alex Sokolov
 */
'use strict'

const rule = require('../../../lib/rules/no-invalid-model-keys')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})
ruleTester.run('no-invalid-model-keys', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            prop: 'list'
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            event: 'update'
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            prop: 'list',
            event: 'update'
          }
        }
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            props: 'list'
          }
        }
      `,
      errors: ["Invalid key 'props' in model option."]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            events: 'update'
          }
        }
      `,
      errors: ["Invalid key 'events' in model option."]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            props: 'list',
            event: 'update'
          }
        }
      `,
      errors: ["Invalid key 'props' in model option."]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            prop: 'list',
            events: 'update'
          }
        }
      `,
      errors: ["Invalid key 'events' in model option."]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            props: 'list',
            events: 'update'
          }
        }
      `,
      errors: [
        "Invalid key 'props' in model option.",
        "Invalid key 'events' in model option."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            prop: 'checked',
            props: 'list',
            event: 'update'
          }
        }
      `,
      errors: ["Invalid key 'props' in model option."]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          model: {
            name: 'checked',
            props: 'list',
            event: 'update'
          }
        }
      `,
      errors: [
        "Invalid key 'name' in model option.",
        "Invalid key 'props' in model option."
      ]
    }
  ]
})
