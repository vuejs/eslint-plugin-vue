/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-static-inline-styles')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019
  }
})

tester.run('no-static-inline-styles', rule, {
  valid: [
    `
    <template>
      <div class="hidden">
    </template>
    `,
    `
    <template>
      <div :style="prop">
    </template>
    `,
    `
    <template>
      <div :style="{
        backgroundImage: 'url('+data.img+')'
      }">
    </template>
    `,
    `
    <template>
      <div :style="{
       [backgroundImage]: 'url(./img.png)'
      }" }>
    </template>
    `,
    `
    <template>
      <div v-bind:style>
    </template>
    `,
    {
      code: `
      <template>
        <div :style="{
          backgroundImage: 'url(./img.png)'
        }">
      </template>
      `,
      options: [{ allowBinding: true }]
    },
    // has unknown key name
    `
    <template>
      <div :style="{
        [computed]: 'url(./img.png)',
        'background-image': 'url(./img.png)',
        color: 'red',
      }">
    </template>
    `,
    `
    <template>
      <div :style="{
        ...spread,
        'background-image': 'url(./img.png)',
        color: 'red',
      }">
    </template>
    `,
    // array
    `
    <template>
      <div :style="[
        { ...propStyle },
        { backgroundImage: 'url(./img.png)' },
      ]">
    </template>
    `,
    // parse error
    `
    <template>
      <div v-bind:style="{
        'background-image': 'url(./img.png)'
        ">
    </template>
    `
  ],
  invalid: [
    {
      code: `
      <template>
        <div style="display: none;">
      </template>`,
      errors: [
        {
          message: '`style` attributes are forbidden.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div style>
      </template>`,
      errors: [
        {
          message: '`style` attributes are forbidden.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :style="{
          backgroundImage: 'url(./img.png)'
        }">
      </template>`,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :style="{
          'background-image': 'url(./img.png)'
        }">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div v-bind:style="{
          'background-image': 'url(./img.png)'
        }">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 3
        }
      ]
    },
    // property
    {
      code: `
      <template>
        <div :style="{
          color: color,
          'background-image': 'url(./img.png)'
        }">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 5
        }
      ]
    },
    {
      code: `
      <template>
        <div :style="{
          'background-image': 'url(./img.png)',
          color,
        }">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 4
        }
      ]
    },
    // array
    {
      code: `
      <template>
        <div :style="[
          { 'background-image': 'url(./img.png)' },
          { color: 'red' }
        ]">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :style="[
          { backgroundImage: 'url(./img.png)' },
          { ...propStyle },
          { backgroundImage: 'url(./img.png)' },
        ]">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <div :style="[
          { backgroundImage: 'url(./img.png)' },
          { backgroundImage: 'url(./img.png)', color, font: 'xxx', },
          { backgroundImage: 'url(./img.png)' },
        ]">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 4
        },
        {
          message: 'Static inline `style` are forbidden.',
          line: 5
        },
        {
          message: 'Static inline `style` are forbidden.',
          line: 5
        }
      ]
    },
    {
      code: `
      <template>
        <div :style="[
          { backgroundImage: 'url(./img.png)' },
          ,
          { backgroundImage: 'url(./img.png)' },
        ]">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :style="[
          { backgroundImage: 'url(./img.png)' },
          'string',
          { backgroundImage: 'url(./img.png)' },
        ]">
      </template>
      `,
      errors: [
        {
          message: 'Static inline `style` are forbidden.',
          line: 4
        }
      ]
    }
  ]
})
