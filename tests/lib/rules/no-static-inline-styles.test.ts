/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-static-inline-styles'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2019 }
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
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 36
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
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 19
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
          line: 3,
          column: 14,
          endLine: 5,
          endColumn: 11
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
          line: 3,
          column: 14,
          endLine: 5,
          endColumn: 11
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
          line: 3,
          column: 14,
          endLine: 5,
          endColumn: 11
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
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 47
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
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 47
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
          line: 3,
          column: 14,
          endLine: 6,
          endColumn: 11
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
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 46
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
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 46
        },
        {
          message: 'Static inline `style` are forbidden.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 46
        },
        {
          message: 'Static inline `style` are forbidden.',
          line: 5,
          column: 55,
          endLine: 5,
          endColumn: 66
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
          line: 3,
          column: 14,
          endLine: 7,
          endColumn: 11
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
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 46
        }
      ]
    }
  ]
})
