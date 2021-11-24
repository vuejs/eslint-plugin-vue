/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/component-options-name-casing')

const tester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('component-options-name-casing', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...components
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            FooBar
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            FooBar: fooBar
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            FooBar
          }
        }
      `,
      options: ['PascalCase']
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            fooBar
          }
        }
      `,
      options: ['camelCase']
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            fooBar: FooBar
          }
        }
      `,
      options: ['camelCase']
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            'foo-bar': fooBar
          }
        }
      `,
      options: ['kebab-case']
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            'foo-bar': FooBar
          }
        }
      `,
      options: ['kebab-case']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            fooBar
          }
        }
      `,
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'fooBar',
            caseType: 'PascalCase'
          },
          line: 4,
          column: 13,
          endColumn: 19
        }
      ],
      output: `
        export default {
          components: {
            FooBar: fooBar
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            fooBar: FooBar
          }
        }
      `,
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'fooBar',
            caseType: 'PascalCase'
          },
          line: 4,
          column: 13,
          endColumn: 19
        }
      ],
      output: `
        export default {
          components: {
            FooBar: FooBar
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            fooBar
          }
        }
      `,
      options: ['PascalCase'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'fooBar',
            caseType: 'PascalCase'
          },
          line: 4,
          column: 13,
          endColumn: 19
        }
      ],
      output: `
        export default {
          components: {
            FooBar: fooBar
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            fooBar: FooBar
          }
        }
      `,
      options: ['PascalCase'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'fooBar',
            caseType: 'PascalCase'
          },
          line: 4,
          column: 13,
          endColumn: 19
        }
      ],
      output: `
        export default {
          components: {
            FooBar: FooBar
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            'foo-bar': FooBar
          }
        }
      `,
      options: ['PascalCase'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'foo-bar',
            caseType: 'PascalCase'
          },
          line: 4,
          column: 13,
          endColumn: 22
        }
      ],
      output: `
        export default {
          components: {
            FooBar: FooBar
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            FooBar
          }
        }
      `,
      options: ['camelCase'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'FooBar',
            caseType: 'camelCase'
          },
          line: 4,
          column: 13,
          endColumn: 19,
          suggestions: [
            {
              messageId: 'possibleRenaming',
              data: { caseType: 'camelCase' },
              output: `
        export default {
          components: {
            fooBar: FooBar
          }
        }
      `
            }
          ]
        }
      ],
      output: null
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            FooBar: fooBar
          }
        }
      `,
      options: ['camelCase'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'FooBar',
            caseType: 'camelCase'
          },
          line: 4,
          column: 13,
          endColumn: 19,
          suggestions: [
            {
              messageId: 'possibleRenaming',
              data: { caseType: 'camelCase' },
              output: `
        export default {
          components: {
            fooBar: fooBar
          }
        }
      `
            }
          ]
        }
      ],
      output: null
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            'foo-bar': fooBar
          }
        }
      `,
      options: ['camelCase'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'foo-bar',
            caseType: 'camelCase'
          },
          line: 4,
          column: 13,
          endColumn: 22,
          suggestions: [
            {
              messageId: 'possibleRenaming',
              data: { caseType: 'camelCase' },
              output: `
        export default {
          components: {
            fooBar: fooBar
          }
        }
      `
            }
          ]
        }
      ],
      output: null
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            FooBar
          }
        }
      `,
      options: ['kebab-case'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'FooBar',
            caseType: 'kebab-case'
          },
          line: 4,
          column: 13,
          endColumn: 19,
          suggestions: [
            {
              messageId: 'possibleRenaming',
              data: { caseType: 'kebab-case' },
              output: `
        export default {
          components: {
            'foo-bar': FooBar
          }
        }
      `
            }
          ]
        }
      ],
      output: null
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            FooBar: fooBar
          }
        }
      `,
      options: ['kebab-case'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'FooBar',
            caseType: 'kebab-case'
          },
          line: 4,
          column: 13,
          endColumn: 19,
          suggestions: [
            {
              messageId: 'possibleRenaming',
              data: { caseType: 'kebab-case' },
              output: `
        export default {
          components: {
            'foo-bar': fooBar
          }
        }
      `
            }
          ]
        }
      ],
      output: null
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            fooBar
          }
        }
      `,
      options: ['kebab-case'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'fooBar',
            caseType: 'kebab-case'
          },
          line: 4,
          column: 13,
          endColumn: 19,
          suggestions: [
            {
              messageId: 'possibleRenaming',
              data: { caseType: 'kebab-case' },
              output: `
        export default {
          components: {
            'foo-bar': fooBar
          }
        }
      `
            }
          ]
        }
      ],
      output: null
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            fooBar: FooBar
          }
        }
      `,
      options: ['kebab-case'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'fooBar',
            caseType: 'kebab-case'
          },
          line: 4,
          column: 13,
          endColumn: 19,
          suggestions: [
            {
              messageId: 'possibleRenaming',
              data: { caseType: 'kebab-case' },
              output: `
        export default {
          components: {
            'foo-bar': FooBar
          }
        }
      `
            }
          ]
        }
      ],
      output: null
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          components: {
            FooBar,
            'my-component': MyComponent
          }
        }
      `,
      options: ['kebab-case'],
      errors: [
        {
          messageId: 'caseNotMatched',
          data: {
            component: 'FooBar',
            caseType: 'kebab-case'
          },
          line: 4,
          column: 13,
          endColumn: 19,
          suggestions: [
            {
              messageId: 'possibleRenaming',
              data: { caseType: 'kebab-case' },
              output: `
        export default {
          components: {
            'foo-bar': FooBar,
            'my-component': MyComponent
          }
        }
      `
            }
          ]
        }
      ],
      output: null
    }
  ]
})
