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
      output: `
        export default {
          components: {
            FooBar: fooBar
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
      ]
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
      output: `
        export default {
          components: {
            FooBar: FooBar
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
      ]
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
      output: `
        export default {
          components: {
            FooBar: fooBar
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
      ]
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
      output: `
        export default {
          components: {
            FooBar: FooBar
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
      ]
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
      output: `
        export default {
          components: {
            FooBar: FooBar
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
      ]
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
      output: null,
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
      ]
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
      output: null,
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
      ]
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
      output: null,
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
      ]
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
      output: null,
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
      ]
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
      output: null,
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
      ]
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
      output: null,
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
      ]
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
      output: null,
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
      ]
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
      output: null,
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
      ]
    }
  ]
})
