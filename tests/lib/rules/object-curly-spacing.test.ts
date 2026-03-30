/**
 * @author Toru Nagashima
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/object-curly-spacing'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('object-curly-spacing', rule, {
  valid: [
    '<template><div :attr="{a: 1}" /></template>',
    {
      code: '<template><div :attr="{a: 1}" /></template>',
      options: ['never']
    },
    {
      code: '<template><div :attr="{ a: 1 }" /></template>',
      options: ['always']
    },
    '<template><div :[{a:1}]="a" /></template>',
    {
      code: '<template><div :[{a:1}]="a" /></template>',
      options: ['always']
    },
    {
      code: `
      <template>
        <div v-bind="{foo: {bar: 'baz'} }">
          Hello World
        </div>
      </template>`,
      options: [
        'never',
        {
          objectsInObjects: true
        }
      ]
    }
  ],
  invalid: [
    {
      code: '<template><div :attr="{ a: 1}" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      errors: [
        {
          message: "There should be no space after '{'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div :attr="{a: 1 }" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      errors: [
        {
          message: "There should be no space before '}'.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: '<template><div :attr="{ a: 1 }" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      errors: [
        {
          message: "There should be no space after '{'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        },
        {
          message: "There should be no space before '}'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: '<template><div :attr="{ a: 1}" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no space after '{'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div :attr="{a: 1 }" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no space before '}'.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: '<template><div :attr="{ a: 1 }" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no space after '{'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        },
        {
          message: "There should be no space before '}'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: '<template><div :attr="{ a: 1}" /></template>',
      output: '<template><div :attr="{ a: 1 }" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A space is required before '}'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: '<template><div :attr="{a: 1 }" /></template>',
      output: '<template><div :attr="{ a: 1 }" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A space is required after '{'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><div :attr="{a: 1}" /></template>',
      output: '<template><div :attr="{ a: 1 }" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A space is required after '{'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        },
        {
          message: "A space is required before '}'.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: '<template><div :[{a:1}]="{a:1}" /></template>',
      output: '<template><div :[{a:1}]="{ a:1 }" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A space is required after '{'.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 27
        },
        {
          message: "A space is required before '}'.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `
      <template>
        <div v-bind="{ foo: { bar: 'baz' }}">
          Hello World
        </div>
      </template>`,
      output: `
      <template>
        <div v-bind="{foo: {bar: 'baz'} }">
          Hello World
        </div>
      </template>`,
      options: [
        'never',
        {
          objectsInObjects: true
        }
      ],
      errors: [
        {
          message: "There should be no space after '{'.",
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 24
        },
        {
          message: "There should be no space after '{'.",
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 31
        },
        {
          message: "There should be no space before '}'.",
          line: 3,
          column: 41,
          endLine: 3,
          endColumn: 42
        },
        {
          message: "A space is required before '}'.",
          line: 3,
          column: 43,
          endLine: 3,
          endColumn: 44
        }
      ]
    },
    {
      code: `
      <template>
        <div v-bind="{ foo: { bar: 'baz' }}">
          Hello World
        </div>
      </template>`,
      output: `
      <template>
        <div v-bind="{foo: {bar: 'baz'}}">
          Hello World
        </div>
      </template>`,
      options: ['never'],
      errors: [
        {
          message: "There should be no space after '{'.",
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 24
        },
        {
          message: "There should be no space after '{'.",
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 31
        },
        {
          message: "There should be no space before '}'.",
          line: 3,
          column: 41,
          endLine: 3,
          endColumn: 42
        }
      ]
    }
  ]
})
