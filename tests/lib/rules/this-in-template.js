/**
 * @fileoverview disallow usage of `this` in template.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/this-in-template')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2020 }
})

function createValidTests(prefix, options) {
  const comment = options.join('')
  return [
    {
      code: `<template><div>{{ ${prefix}foo.bar }}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-for="foo in ${prefix}bar">{{ foo }}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-if="${prefix}foo">{{ ${prefix}foo }}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div :class="${prefix}foo">{{ ${prefix}foo }}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div :class="{this: ${prefix}foo}">{{ ${prefix}foo }}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-for="bar in ${prefix}foo" v-if="bar">{{ bar }}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-if="${prefix}foo()">{{ ${prefix}bar }}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-for="x of ${prefix}xs">{{this.x}}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-for="x of ${prefix}xs">{{this.x()}}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-for="x of ${prefix}xs">{{this.x.y()}}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-for="x of ${prefix}xs">{{this.x['foo']}}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template><div v-for="x of ${prefix}xs">{{this['x']}}</div></template><!-- ${comment} -->`,
      options
    },
    {
      code: `<template>
        <div>
          <div v-for="bar in ${prefix}foo" v-if="bar">{{ bar }}</div>
          <div v-for="ssa in ${prefix}sss" v-if="ssa">
            <div v-for="ssf in ssa" v-if="ssa">{{ ssf }}</div>
          </div>
        </div>
      </template><!-- ${comment} -->`,
      options
    }
  ]
}

function createInvalidTests(prefix, options, message) {
  const comment = options.join('')
  const errorLength = options[0] === 'always' ? 3 : 4
  return [
    {
      code: `<template><div>{{ ${prefix}foo }}</div></template><!-- ${comment} -->`,
      output: `<template><div>{{ ${suggestionPrefix(
        prefix,
        options
      )}foo }}</div></template><!-- ${comment} -->`,
      errors: [
        {
          message,
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 19 + errorLength
        }
      ],
      options
    },
    {
      code: `<template><div>{{ ${prefix}foo() }}</div></template><!-- ${comment} -->`,
      output: `<template><div>{{ ${suggestionPrefix(
        prefix,
        options
      )}foo() }}</div></template><!-- ${comment} -->`,
      errors: [
        {
          message,
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 19 + errorLength
        }
      ],
      options
    },
    {
      code: `<template><div>{{ ${prefix}foo.bar() }}</div></template><!-- ${comment} -->`,
      output: `<template><div>{{ ${suggestionPrefix(
        prefix,
        options
      )}foo.bar() }}</div></template><!-- ${comment} -->`,
      errors: [
        {
          message,
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 19 + errorLength
        }
      ],
      options
    },
    {
      code: `<template><div :class="${prefix}foo"></div></template><!-- ${comment} -->`,
      output: `<template><div :class="${suggestionPrefix(
        prefix,
        options
      )}foo"></div></template><!-- ${comment} -->`,
      errors: [
        {
          message,
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 24 + errorLength
        }
      ],
      options
    },
    {
      code: `<template><div :class="{foo: ${prefix}foo}"></div></template><!-- ${comment} -->`,
      output: `<template><div :class="{foo: ${suggestionPrefix(
        prefix,
        options
      )}foo}"></div></template><!-- ${comment} -->`,
      errors: [
        {
          message,
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 30 + errorLength
        }
      ],
      options
    },
    {
      code: `<template><div :class="{foo: ${prefix}foo()}"></div></template><!-- ${comment} -->`,
      output: `<template><div :class="{foo: ${suggestionPrefix(
        prefix,
        options
      )}foo()}"></div></template><!-- ${comment} -->`,
      errors: [
        {
          message,
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 30 + errorLength
        }
      ],
      options
    },
    {
      code: `<template><div v-if="${prefix}foo"></div></template><!-- ${comment} -->`,
      output: `<template><div v-if="${suggestionPrefix(
        prefix,
        options
      )}foo"></div></template><!-- ${comment} -->`,
      errors: [
        {
          message,
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 22 + errorLength
        }
      ],
      options
    },
    {
      code: `<template><div v-for="foo in ${prefix}bar"></div></template><!-- ${comment} -->`,
      output: `<template><div v-for="foo in ${suggestionPrefix(
        prefix,
        options
      )}bar"></div></template><!-- ${comment} -->`,
      errors: [
        {
          message,
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 30 + errorLength
        }
      ],
      options
    }

    // We cannot use `.` in dynamic arguments because the right of the `.` becomes a modifier.
    // {
    //   code: `<template><div v-on:[${prefix}name]="1"></div></template><!-- ${comment} -->`,
    //   errors: [{ message, line: 1, column: 22, endLine: 1, endColumn: 22 + errorLength }],
    //   options
    // }
  ]
}

ruleTester.run('this-in-template', rule, {
  valid: [
    '',
    '<template></template>',
    '<template><div></div></template>',
    ...createValidTests('', []),
    ...createValidTests('', ['never']),
    ...createValidTests('this.', ['always']),
    ...createValidTests('this?.', ['always']),
    ...[[], ['never'], ['always']].flatMap((options) => {
      const comment = options.join('')
      return [
        {
          code: `<template><div :parent="this"></div></template><!-- ${comment} -->`,
          options
        },
        {
          code: `<template><div>{{ this.class }}</div></template><!-- ${comment} -->`,
          options
        },
        {
          code: `<template><div>{{ this['0'] }}</div></template><!-- ${comment} -->`,
          options
        },
        {
          code: `<template><div>{{ this['this'] }}</div></template><!-- ${comment} -->`,
          options
        },
        {
          code: `<template><div>{{ this['foo bar'] }}</div></template><!-- ${comment} -->`,
          options
        },
        {
          code: `<template><div>{{ }}</div></template><!-- ${comment} -->`,
          options
        },
        // We cannot use `.` in dynamic arguments because the right of the `.` becomes a modifier.
        {
          code: `<template><div v-on:[x]="1"></div></template><!-- ${comment} -->`,
          options
        }
      ]
    })
  ],
  invalid: [
    ...createInvalidTests('this.', [], "Unexpected usage of 'this'."),
    ...createInvalidTests('this?.', [], "Unexpected usage of 'this'."),
    ...createInvalidTests('this.', ['never'], "Unexpected usage of 'this'."),
    ...createInvalidTests('this?.', ['never'], "Unexpected usage of 'this'."),
    ...createInvalidTests('', ['always'], "Expected 'this'.", 'Identifier'),
    ...[[], ['never']].flatMap((options) => {
      const comment = options.join('')
      const message = "Unexpected usage of 'this'."
      return [
        {
          code: `<template><div>{{ this['xs'] }}</div></template><!-- ${comment} -->`,
          output: `<template><div>{{ xs }}</div></template><!-- ${comment} -->`,
          errors: [{ message, line: 1, column: 19, endLine: 1, endColumn: 23 }],
          options
        },
        {
          code: `<template><div>{{ this['xs0AZ_foo'] }}</div></template><!-- ${comment} -->`,
          output: `<template><div>{{ xs0AZ_foo }}</div></template><!-- ${comment} -->`,
          errors: [{ message, line: 1, column: 19, endLine: 1, endColumn: 23 }],
          options
        }
      ]
    }),
    {
      code: `<template><div v-if="fn(this.$foo)"></div></template><!-- never -->`,
      output: `<template><div v-if="fn($foo)"></div></template><!-- never -->`,
      options: ['never'],
      errors: [
        {
          message: "Unexpected usage of 'this'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `<template><div :class="{ foo: this.$foo }"></div></template><!-- never -->`,
      output: `<template><div :class="{ foo: $foo }"></div></template><!-- never -->`,
      options: ['never'],
      errors: [
        {
          message: "Unexpected usage of 'this'.",
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 35
        }
      ]
    }
  ]
})

function suggestionPrefix(prefix, options) {
  return options[0] === 'always' && !['this.', 'this?.'].includes(prefix)
    ? 'this.'
    : ''
}
