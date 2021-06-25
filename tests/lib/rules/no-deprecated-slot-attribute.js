'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-deprecated-slot-attribute.js')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015
  }
})

tester.run('no-deprecated-slot-attribute', rule, {
  valid: [
    `<template>
      <LinkList>
        <template v-slot:name><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <template #name><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <template v-slot="{a}"><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList v-slot="{a}">
        <a />
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <template #default="{a}"><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <template><a /></template>
      </LinkList>
    </template>`,
    `<template>
      <LinkList>
        <a />
      </LinkList>
    </template>`
  ],
  invalid: [
    {
      code: `
      <template>
        <LinkList>
          <template slot ><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot ><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot="name" ><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot:name ><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot="name" unknown slot-scope="{a}" ><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot:name="{a}" unknown  ><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot="name" scope="{a}"><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot:name="{a}" ><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot="nameFoo"><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot:nameFoo><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template slot="f o o" ><a /></template>
          <template slot="obj.prop" ><a /></template>
          <template slot="a/b" ><a /></template>
          <template slot="a=b" ><a /></template>
          <template slot="a>b" ><a /></template>
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 5
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 6
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 7
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 8
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template v-bind:slot=name><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot:[name]><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template :slot="slot.name"><a /></template>
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template :slot="  slotName  "><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot:[slotName]><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template :slot="slot. name"><a /></template>
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template :slot="a>b?c:d"><a /></template>
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template :slot="  "><a /></template>
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template :slot="  .error  "><a /></template>
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <template :slot><a /></template>
        </LinkList>
      </template>`,
      output: `
      <template>
        <LinkList>
          <template v-slot><a /></template>
        </LinkList>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a slot="name" />
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <LinkList>
          <a :slot="name" />
        </LinkList>
      </template>`,
      output: null,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <MyComponent>
          <template slot="foo-bar">
            <a/>
          </template>
        </MyComponent>
      </template>`,
      output: `
      <template>
        <MyComponent>
          <template v-slot:foo-bar>
            <a/>
          </template>
        </MyComponent>
      </template>`,
      errors: ['`slot` attributes are deprecated.']
    },
    {
      code: `
      <template>
        <MyComponent>
          <template slot="foo_bar">
            <a/>
          </template>
        </MyComponent>
      </template>`,
      output: `
      <template>
        <MyComponent>
          <template v-slot:foo_bar>
            <a/>
          </template>
        </MyComponent>
      </template>`,
      errors: ['`slot` attributes are deprecated.']
    },
    {
      code: `
      <template>
        <MyComponent>
          <template slot="123">
            <a/>
          </template>
        </MyComponent>
      </template>`,
      output: `
      <template>
        <MyComponent>
          <template v-slot:123>
            <a/>
          </template>
        </MyComponent>
      </template>`,
      errors: ['`slot` attributes are deprecated.']
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1499
      code: `
      <template>
        <some-component>
          <template slot="some-slot">
            This works 1
          </template>

          <template v-if="true"> <!-- some arbitrary conditional -->
            <template slot="some-slot">
              This works 2
            </template>
          </template>
        </some-component>
      </template>`,
      output: `
      <template>
        <some-component>
          <template v-slot:some-slot>
            This works 1
          </template>

          <template v-if="true"> <!-- some arbitrary conditional -->
            <template slot="some-slot">
              This works 2
            </template>
          </template>
        </some-component>
      </template>`,
      errors: [
        {
          message: '`slot` attributes are deprecated.',
          line: 4
        },
        {
          message: '`slot` attributes are deprecated.',
          line: 9
        }
      ]
    },
    {
      code: `
      <template>
        <my-component>
          <template v-for="x in xs" slot="one">
            A
          </template>
          <template v-for="x in xs" :slot="x">
            B
          </template>
        </my-component>
      </template>`,
      output: `
      <template>
        <my-component>
          <template v-for="x in xs" slot="one">
            A
          </template>
          <template v-for="x in xs" v-slot:[x]>
            B
          </template>
        </my-component>
      </template>`,
      errors: [
        '`slot` attributes are deprecated.',
        '`slot` attributes are deprecated.'
      ]
    },
    {
      code: `
      <template>
        <my-component>
          <template slot="one">
            A
          </template>
          <template slot="one">
            B
          </template>
        </my-component>
      </template>`,
      output: `
      <template>
        <my-component>
          <template slot="one">
            A
          </template>
          <template slot="one">
            B
          </template>
        </my-component>
      </template>`,
      errors: [
        '`slot` attributes are deprecated.',
        '`slot` attributes are deprecated.'
      ]
    },
    {
      code: `
      <template>
        <my-component>
          <template v-if="c" slot="one">
            A
          </template>
          <template v-else slot="one">
            B
          </template>
        </my-component>
      </template>`,
      output: `
      <template>
        <my-component>
          <template v-if="c" v-slot:one>
            A
          </template>
          <template v-else v-slot:one>
            B
          </template>
        </my-component>
      </template>`,
      errors: [
        '`slot` attributes are deprecated.',
        '`slot` attributes are deprecated.'
      ]
    },
    {
      code: `
      <template>
        <my-component>
          <template v-for="x in xs" :slot="x">
            A
          </template>
          <template v-for="x in xs" :slot="x">
            B
          </template>
        </my-component>
      </template>`,
      output: null,
      errors: [
        '`slot` attributes are deprecated.',
        '`slot` attributes are deprecated.'
      ]
    },
    {
      code: `
      <template>
        <my-component>
          <template v-for="x in ys" :slot="x">
            A
          </template>
          <template v-for="x in xs" :slot="x">
            B
          </template>
        </my-component>
      </template>`,
      output: `
      <template>
        <my-component>
          <template v-for="x in ys" v-slot:[x]>
            A
          </template>
          <template v-for="x in xs" v-slot:[x]>
            B
          </template>
        </my-component>
      </template>`,
      errors: [
        '`slot` attributes are deprecated.',
        '`slot` attributes are deprecated.'
      ]
    },
    {
      code: `
      <template>
        <my-component>
          <template v-for="(x,y) in xs" :slot="x+y">
            A
          </template>
          <template v-for="x in xs" :slot="x">
            B
          </template>
        </my-component>
      </template>`,
      output: `
      <template>
        <my-component>
          <template v-for="(x,y) in xs" :slot="x+y">
            A
          </template>
          <template v-for="x in xs" v-slot:[x]>
            B
          </template>
        </my-component>
      </template>`,
      errors: [
        '`slot` attributes are deprecated.',
        '`slot` attributes are deprecated.'
      ]
    }
  ]
})
