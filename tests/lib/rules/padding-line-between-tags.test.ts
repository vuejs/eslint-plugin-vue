/**
 * @author dev1437
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/padding-line-between-tags'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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
    },
    // Test cases for single-line/multi-line tag support (issue #1974)
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <span>single line</span>
          <span>single line</span>
          <div>
            multi line
          </div>

          <div>
            multi line
          </div>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'never', prev: '*:single-line', next: '*:single-line' },
          { blankLine: 'always', prev: '*:multi-line', next: '*:multi-line' }
        ]
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <span>single line</span>

          <div>
            multi line
          </div>

          <span>single line</span>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*:single-line', next: '*:multi-line' },
          { blankLine: 'always', prev: '*:multi-line', next: '*:single-line' }
        ]
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div>
            multi line
          </div>

          <span>single line</span>

          <div>
            multi line
          </div>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*:multi-line', next: '*:single-line' },
          { blankLine: 'always', prev: '*:single-line', next: '*:multi-line' },
          { blankLine: 'always', prev: '*:multi-line', next: '*:multi-line' }
        ]
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <span>single</span>
          <span>single</span>

          <div>
            multi
          </div>

          <div>
            multi
          </div>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*:single-line', next: '*:multi-line' },
          { blankLine: 'always', prev: '*:multi-line', next: '*:multi-line' },
          { blankLine: 'never', prev: '*:single-line', next: '*:single-line' }
        ]
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <span>single</span>
          <span>single</span>
          <div>
            multi
          </div>

          <div>
            multi
          </div>
        </div>
      </template>
      `,
      options: [
        [
          {
            blankLine: 'never',
            prev: 'span:single-line',
            next: 'span:single-line'
          },
          {
            blankLine: 'always',
            prev: 'div:multi-line',
            next: 'div:multi-line'
          }
        ]
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <span>single</span>

          <div>
            multi
          </div>

          <span>single</span>
        </div>
      </template>
      `,
      options: [
        [
          {
            blankLine: 'always',
            prev: 'span:single-line',
            next: 'div:multi-line'
          },
          {
            blankLine: 'always',
            prev: 'div:multi-line',
            next: 'span:single-line'
          }
        ]
      ]
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
          column: 11,
          endLine: 6,
          endColumn: 17
        },
        {
          message: 'Expected blank line before this tag.',
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 18
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
          column: 13,
          endLine: 8,
          endColumn: 18
        },
        {
          message: 'Expected blank line before this tag.',
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 19
        },
        {
          message: 'Expected blank line before this tag.',
          line: 10,
          column: 13,
          endLine: 11,
          endColumn: 18
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
          column: 11,
          endLine: 10,
          endColumn: 16
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
          column: 11,
          endLine: 13,
          endColumn: 16
        },
        {
          message: 'Expected blank line before this tag.',
          line: 10,
          column: 15,
          endLine: 11,
          endColumn: 19
        },
        {
          message: 'Expected blank line before this tag.',
          line: 15,
          column: 9,
          endLine: 16,
          endColumn: 15
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
          column: 13,
          endLine: 7,
          endColumn: 19
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
          column: 13,
          endLine: 9,
          endColumn: 18
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
          column: 13,
          endLine: 9,
          endColumn: 19
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 11,
          column: 13,
          endLine: 12,
          endColumn: 18
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
          column: 11,
          endLine: 7,
          endColumn: 17
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 18
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
          column: 13,
          endLine: 8,
          endColumn: 24
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
          column: 11,
          endLine: 5,
          endColumn: 17
        },
        {
          message: 'Expected blank line before this tag.',
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 17
        },
        {
          message: 'Expected blank line before this tag.',
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 20
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
          column: 11,
          endLine: 8,
          endColumn: 17
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
          column: 11,
          endLine: 9,
          endColumn: 17
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
          column: 11,
          endLine: 5,
          endColumn: 17
        },
        {
          message: 'Expected blank line before this tag.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 17
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 10,
          column: 11,
          endLine: 10,
          endColumn: 17
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
          column: 11,
          endLine: 11,
          endColumn: 17
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
          column: 11,
          endLine: 7,
          endColumn: 17
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
          column: 18,
          endLine: 4,
          endColumn: 25
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
          column: 23,
          endLine: 4,
          endColumn: 30
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
          column: 12,
          endLine: 6,
          endColumn: 19
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
          column: 12,
          endLine: 7,
          endColumn: 19
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
          column: 12,
          endLine: 8,
          endColumn: 19
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
          column: 12,
          endLine: 10,
          endColumn: 19
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
          column: 11,
          endLine: 7,
          endColumn: 22
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
          column: 11,
          endLine: 7,
          endColumn: 22
        },
        {
          message: 'Expected blank line before this tag.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 22
        },
        {
          message: 'Expected blank line before this tag.',
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 22
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
          column: 11,
          endLine: 7,
          endColumn: 16
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 10,
          column: 11,
          endLine: 10,
          endColumn: 18
        },
        {
          message: 'Unexpected blank line before this tag.',
          line: 13,
          column: 11,
          endLine: 13,
          endColumn: 18
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
          column: 11,
          endLine: 7,
          endColumn: 18
        }
      ]
    },
    // Test cases for single-line/multi-line tag support (issue #1974)
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <span>single line</span>

          <span>single line</span>
          <div>
            multi line
          </div>
          <div>
            multi line
          </div>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <span>single line</span>
          <span>single line</span>
          <div>
            multi line
          </div>

          <div>
            multi line
          </div>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'never', prev: '*:single-line', next: '*:single-line' },
          { blankLine: 'always', prev: '*:multi-line', next: '*:multi-line' }
        ]
      ],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 35
        },
        {
          message: 'Expected blank line before this tag.',
          line: 10,
          column: 11,
          endLine: 12,
          endColumn: 17
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <span>single line</span>
          <div>
            multi line
          </div>
          <span>single line</span>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <span>single line</span>

          <div>
            multi line
          </div>

          <span>single line</span>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*:single-line', next: '*:multi-line' },
          { blankLine: 'always', prev: '*:multi-line', next: '*:single-line' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 5,
          column: 11,
          endLine: 7,
          endColumn: 17
        },
        {
          message: 'Expected blank line before this tag.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <div>
            multi line
          </div>
          <span>single line</span>
          <div>
            multi line
          </div>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <div>
            multi line
          </div>

          <span>single line</span>

          <div>
            multi line
          </div>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*:multi-line', next: '*:single-line' },
          { blankLine: 'always', prev: '*:single-line', next: '*:multi-line' },
          { blankLine: 'always', prev: '*:multi-line', next: '*:multi-line' }
        ]
      ],
      errors: [
        {
          message: 'Expected blank line before this tag.',
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 35
        },
        {
          message: 'Expected blank line before this tag.',
          line: 8,
          column: 11,
          endLine: 10,
          endColumn: 17
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <span>single</span>

          <span>single</span>
          <div>
            multi
          </div>
          <div>
            multi
          </div>
        </div>
      </template>
      `,
      output: `
      <template>
        <div>
          <span>single</span>
          <span>single</span>

          <div>
            multi
          </div>

          <div>
            multi
          </div>
        </div>
      </template>
      `,
      options: [
        [
          { blankLine: 'always', prev: '*:single-line', next: '*:multi-line' },
          { blankLine: 'always', prev: '*:multi-line', next: '*:multi-line' },
          { blankLine: 'never', prev: '*:single-line', next: '*:single-line' }
        ]
      ],
      errors: [
        {
          message: 'Unexpected blank line before this tag.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 30
        },
        {
          message: 'Expected blank line before this tag.',
          line: 7,
          column: 11,
          endLine: 9,
          endColumn: 17
        },
        {
          message: 'Expected blank line before this tag.',
          line: 10,
          column: 11,
          endLine: 12,
          endColumn: 17
        }
      ]
    }
  ]
})
