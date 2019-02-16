/**
 * @fileoverview Prevents boolean defaults from being set
 * @author Hiroki Osame
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-boolean-default')

var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})
ruleTester.run('no-boolean-default', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: Boolean
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: Boolean
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: Boolean
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const props = {};
        export default {
          props: {
            ...props,
            enabled: Boolean
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const props = {};
        export default {
          props: {
            ...props,
            enabled: Boolean
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        const props = {};
        export default {
          props: {
            ...props,
            enabled: Boolean
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              type: Boolean,
              ...data
            }
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              type: Boolean,
              ...data
            }
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              type: Boolean,
              ...data
            }
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: false,
              ...data
            }
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: data
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: data
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: data
          }
        }
      `,
      options: ['default-false']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              ...data
            }
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              ...data
            }
          }
        }
      `,
      options: ['no-default']
    },
    {
      filename: 'test.vue',
      code: `
        const data = {};
        export default {
          props: {
            enabled: {
              ...data
            }
          }
        }
      `,
      options: ['default-false']
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: true,
            }
          }
        }
      `,
      options: ['default-false'],
      errors: [{
        message: 'Boolean prop should only be defaulted to false.',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: null,
            }
          }
        }
      `,
      options: ['default-false'],
      errors: [{
        message: 'Boolean prop should only be defaulted to false.',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: false,
            }
          }
        }
      `,
      options: ['no-default'],
      errors: [{
        message: 'Boolean prop should not set a default (Vue defaults it to false).',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            enabled: {
              type: Boolean,
              default: true,
            }
          }
        }
      `,
      options: ['no-default'],
      errors: [{
        message: 'Boolean prop should not set a default (Vue defaults it to false).',
        line: 6
      }]
    }
  ]
})
