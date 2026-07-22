/**
 * @fileoverview Prevents invalid keys in model option.
 * @author Alex Sokolov
 */
import rule from '../../../lib/rules/valid-model-definition'
import { RuleTester } from '../../eslint-compat'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})
ruleTester.run('valid-model-definition', rule, {
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
      errors: [
        {
          message: "Invalid key 'props' in model option.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 26
        }
      ]
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
      errors: [
        {
          message: "Invalid key 'events' in model option.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 29
        }
      ]
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
      errors: [
        {
          message: "Invalid key 'props' in model option.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 26
        }
      ]
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
      errors: [
        {
          message: "Invalid key 'events' in model option.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 29
        }
      ]
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
        {
          message: "Invalid key 'props' in model option.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 26
        },
        {
          message: "Invalid key 'events' in model option.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 29
        }
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
      errors: [
        {
          message: "Invalid key 'props' in model option.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 26
        }
      ]
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
        {
          message: "Invalid key 'name' in model option.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 28
        },
        {
          message: "Invalid key 'props' in model option.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 26
        }
      ]
    }
  ]
})
