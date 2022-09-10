/**
 * @author dev1437
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/space-between-siblings')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('space-between-siblings', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div></div>

          <div>
          </div>

          <div />
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <p>Foo <b>bar</b> baz.</p>
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div></div>
          <div>
          </div>
          <div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <div></div>

          <div>
          </div>

          <div />
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line after this tag.',
          line: 5,
          column: 11
        },
        {
          message: 'Expected blank line after this tag.',
          line: 7,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <ul>
            <li>
            </li>
            <li>
            </li>
            <br />
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <ul>
            <li>
            </li>

            <li>
            </li>

            <br />

            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line after this tag.',
          line: 7,
          column: 13
        },
        {
          message: 'Expected blank line after this tag.',
          line: 9,
          column: 13
        },
        {
          message: 'Expected blank line after this tag.',
          line: 10,
          column: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <ul>
          </ul>
          <ul>
            <li>
              Test Text
            </li>
          </ul>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <ul>
          </ul>

          <ul>
            <li>
              Test Text
            </li>
          </ul>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line after this tag.',
          line: 6,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <ul>
          </ul>
          <ul>
            <li>
              <p>
              </p>
              <p>
              </p>
            </li>
          </ul>
        </div>
        <div>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <ul>
          </ul>

          <ul>
            <li>
              <p>
              </p>

              <p>
              </p>
            </li>
          </ul>
        </div>

        <div>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line after this tag.',
          line: 6,
          column: 11
        },
        {
          message: 'Expected blank line after this tag.',
          line: 10,
          column: 15
        },
        {
          message: 'Expected blank line after this tag.',
          line: 15,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <ul>
            <li>
            </li>
            <br />
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <ul>
            <li>
            </li>

            <br />
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line after this tag.',
          line: 7,
          column: 13
        },
      ],
      options: [{ ignoreNewlinesAfter: ['br'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <ul>
            <li>
            </li>
            <br />
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <ul>
            <li>
            </li>
            <br />

            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line after this tag.',
          line: 7,
          column: 13
        },
        {
          message: 'Expected blank line after this tag.',
          line: 8,
          column: 13
        }
      ],
      options: [{ ignoreNewlinesBefore: ['br'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <ul>
            <li>
            </li>
            <br />
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <ul>
            <li>
            </li>
            <br />
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line after this tag.',
          line: 7,
          column: 13
        },
      ],
      options: [{ ignoreNewlinesBefore: ['br'], ignoreNewlinesAfter: ['br'] }]
    }
  ]
})
