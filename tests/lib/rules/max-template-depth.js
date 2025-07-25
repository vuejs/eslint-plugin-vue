/**
 * @author kevsommer Kevin Sommer
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/max-template-depth')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('max-template-depth', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
      <main-container>
        <child-component>
          <div />
        </child-component>
      </main-container>
      </template>
      `,
      options: [{ maxDepth: 3 }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      <main-container>
        <ul>
          <li>Item 1</li>
        </ul>
      </main-container>
      </template>
      `,
      options: [{ maxDepth: 4 }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      <main-container>
        <child-component>
          <sub-child-component>
            <div />
          </sub-child-component>
        </child-component>
      </main-container>
      </template>
      `,
      options: [{ maxDepth: 4 }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      <div>
      </div>
      <main-container>
        <child-component>
          <ul>
            <li />
          </ul>
        </child-component>
      </main-container>
      </template>
      `,
      options: [{ maxDepth: 4 }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
      <div>
        <div>
          <div>
            <div />
          </div>
        </div>
      </div>
      </template>
      `,
      options: [{ maxDepth: 3 }],
      errors: [
        {
          message:
            'Element is nested too deeply (depth of 4, maximum allowed is 3).',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      <side-container>
        <child-component />
      </side-container>
      <main-container>
        <child-component>
          <nested-component>
            <h1 />
          </nested-component>
        </child-component>
      </main-container>
      </template>
      `,
      options: [{ maxDepth: 3 }],
      errors: [
        {
          message:
            'Element is nested too deeply (depth of 4, maximum allowed is 3).',
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      <main-container>
        <nav-bar>
          <div />
        </nav-bar>
        <child-component>
          <nested-component>
            <div>
              <div />
            <div>
          </nested-component>
        </child-component>
      </main-container>
      </template>
      `,
      options: [{ maxDepth: 3 }],
      errors: [
        {
          message:
            'Element is nested too deeply (depth of 4, maximum allowed is 3).',
          line: 9,
          endLine: 12,
          column: 13,
          endColumn: 11
        },
        {
          message:
            'Element is nested too deeply (depth of 5, maximum allowed is 3).',
          line: 10,
          endLine: 10,
          column: 15,
          endColumn: 22
        },
        {
          message:
            'Element is nested too deeply (depth of 5, maximum allowed is 3).',
          line: 11,
          endLine: 12,
          column: 13,
          endColumn: 11
        }
      ]
    }
  ]
})
