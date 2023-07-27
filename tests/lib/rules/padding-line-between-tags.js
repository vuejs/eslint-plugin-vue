/**
 * @author dev1437
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/padding-line-between-tags')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('padding-line-between-tags', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div />

          <div />

          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>

          <div />

          <div />
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'consistent', prev: '*', next: '*' },
          { blankLine: 'never', prev: 'br', next: 'br' }
        ]
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'consistent', prev: '*', next: '*' }]]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div />

          <div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'consistent', prev: '*', next: '*' }]]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <header>
          <div></div>

          <div></div>

          <div></div>
        </header>
        <div></div>
        <div />
        <footer></footer>
      </template>
      `,
      options: [[{ blankLine: 'consistent', prev: '*', next: '*' }]]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <header>
          <div></div>
          <div></div>
          <div></div>
        </header>

        <div></div>

        <div />

        <footer></footer>
      </template>
      `,
      options: [[{ blankLine: 'consistent', prev: '*', next: '*' }]]
    },
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
    },
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
      options: [[{ blankLine: 'never', prev: '*', next: '*' }]]
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
      options: [
        [
          { blankLine: 'always', prev: '*', next: '*' },
          { blankLine: 'never', prev: '*', next: 'br' },
          { blankLine: 'never', prev: 'br', next: '*' }
        ]
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
            <div></div>

            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*', next: '*' },
          { blankLine: 'never', prev: 'br', next: 'div' }
        ]
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

            <div></div>
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'never', prev: '*', next: '*' },
          { blankLine: 'always', prev: 'br', next: 'div' }
        ]
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

            <img />
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      options: [[{ blankLine: 'always', prev: 'br', next: 'img' }]]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      </template>
      <script>
      </script>
      `
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

            <img />
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'never', prev: 'br', next: 'img' },
          { blankLine: 'always', prev: 'br', next: 'img' }
        ]
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          </div>A
          B
          C<div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'never', prev: '*', next: '*' }]]
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
          message: 'Expected blank line before this tag.',
          line: 5,
          column: 11
        },
        {
          message: 'Expected blank line before this tag.',
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
          message: 'Expected blank line before this tag.',
          line: 7,
          column: 13
        },
        {
          message: 'Expected blank line before this tag.',
          line: 9,
          column: 13
        },
        {
          message: 'Expected blank line before this tag.',
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
          message: 'Expected blank line before this tag.',
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
          message: 'Expected blank line before this tag.',
          line: 6,
          column: 11
        },
        {
          message: 'Expected blank line before this tag.',
          line: 10,
          column: 15
        },
        {
          message: 'Expected blank line before this tag.',
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
      options: [
        [
          { blankLine: 'always', prev: '*', next: '*' },
          { blankLine: 'never', prev: 'br', next: '*' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 7,
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
      options: [
        [
          { blankLine: 'always', prev: '*', next: '*' },
          { blankLine: 'never', prev: '*', next: 'br' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 8,
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
      options: [[{ blankLine: 'never', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 9,
          column: 13
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 11,
          column: 13
        }
      ]
    },
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
      options: [[{ blankLine: 'never', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 6,
          column: 11
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 9,
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
            <br />
            <div></div>
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

            <div></div>
            <li>
            </li>
          </ul>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'never', prev: '*', next: '*' },
          { blankLine: 'always', prev: 'br', next: 'div' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 8,
          column: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <h1></h1>
          <br />
          <div></div>
          <br />
          <img />
          <h1></h1>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <h1></h1>

          <br />
          <div></div>

          <br />
          <img />

          <h1></h1>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*', next: '*' },
          { blankLine: 'never', prev: 'br', next: 'div' },
          { blankLine: 'never', prev: 'br', next: 'img' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 5,
          column: 11
        },
        {
          message: 'Expected blank line before this tag.',
          line: 7,
          column: 11
        },
        {
          message: 'Expected blank line before this tag.',
          line: 9,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <img />
          <br />

          <div></div>
          <br />
          <ul></ul>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <img />
          <br />

          <div></div>

          <br />
          <ul></ul>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: 'br', next: 'div' },
          { blankLine: 'always', prev: 'div', next: 'br' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 8,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <img />
          <br />

          <div></div>
          <br />
          <br />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <img />
          <br />

          <div></div>
          <br />

          <br />
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: 'br', next: 'div' },
          { blankLine: 'always', prev: 'br', next: 'br' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 9,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <img />
          <br />

          <div></div>
          <br />

          <br />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <img />

          <br />

          <div></div>

          <br />
          <br />
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*', next: '*' },
          { blankLine: 'never', prev: 'br', next: 'br' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 5,
          column: 11
        },
        {
          message: 'Expected blank line before this tag.',
          line: 8,
          column: 11
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 10,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <img />
          <br />

          <div></div>

          <br />

          <br />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <img />
          <br />

          <div></div>

          <br />
          <br />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'never', prev: 'br', next: 'br' }]],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 11,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div></div>
          <div>
          </div>
          <br />
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

          <br />
          <div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'always', prev: '*', next: 'br' }]],
      errors: [
        {
          message: 'Expected blank line before this tag.',
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
          <div /><div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <div />

          <div />
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 4,
          column: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          Foo  <div /><div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          Foo  <div />

          <div />
        </div>
      </template>
      `,
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 4,
          column: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          </div>A

          C<div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          </div>A
          C<div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'never', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 6,
          column: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          </div>A
          B

          C<div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          </div>A
          B
          C<div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'never', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 7,
          column: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          </div>A


          B
          C<div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          </div>A
          B
          C<div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'never', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 8,
          column: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          </div>A


          B


          C<div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          </div>A
          B
          C<div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'never', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 10,
          column: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <header>
          <div></div>

          <div></div>
          <div></div>
        </header>
        <div></div>
        <div />
        <footer></footer>
      </template>
      `,
      output: `
      <template>
        <header>
          <div></div>

          <div></div>

          <div></div>
        </header>
        <div></div>
        <div />
        <footer></footer>
      </template>
      `,
      options: [[{ blankLine: 'consistent', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 7,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <header>
          <div></div>

          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </header>
        <div></div>
        <div />
        <footer></footer>
      </template>
      `,
      output: `
      <template>
        <header>
          <div></div>

          <div></div>

          <div></div>

          <div></div>

          <div></div>
        </header>
        <div></div>
        <div />
        <footer></footer>
      </template>
      `,
      options: [[{ blankLine: 'consistent', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 7,
          column: 11
        },
        {
          message: 'Expected blank line before this tag.',
          line: 8,
          column: 11
        },
        {
          message: 'Expected blank line before this tag.',
          line: 9,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div />
          <div />

          <br/>
          <br/>

          <div />
          <div />

          <div />
          <div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <div />
          <div />
          <br/>
          <br/>
          <div />
          <div />
          <div />
          <div />
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'consistent', prev: '*', next: '*' },
          { blankLine: 'never', prev: 'br', next: 'br' }
        ]
      ],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 7,
          column: 11
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 10,
          column: 11
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 13,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div />
          <div />

          <div />
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <div />
          <div />
          <div />
        </div>
      </template>
      `,
      options: [[{ blankLine: 'consistent', prev: '*', next: '*' }]],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 7,
          column: 11
        }
      ]
    }
  ]
})
