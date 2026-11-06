/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-deprecated-html-elements'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-deprecated-html-elements', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <s>old price</s>
          <del>removed</del>
          <span class="mono">code</span>
          <object data="movie.swf"><embed src="movie.swf" /></object>
        </div>
      </template>
      `
    },
    // components named like deprecated elements
    {
      filename: 'test.vue',
      code: `
      <template>
        <Center>
          <Font size="lg">text</Font>
          <Marquee />
          <CENTER>uppercase is compiled as a component</CENTER>
        </Center>
      </template>
      `
    },
    // `is`, `:is` and `v-is` render a component instead
    {
      filename: 'test.vue',
      code: `
      <template>
        <font is="vue:my-font">text</font>
        <center is="my-center">text</center>
        <strike :is="component">text</strike>
        <marquee v-is="'my-marquee'">text</marquee>
      </template>
      `
    },
    // SVG and MathML elements
    {
      filename: 'test.vue',
      code: `
      <template>
        <svg>
          <font horiz-adv-x="1000"></font>
        </svg>
        <math>
          <center></center>
        </math>
      </template>
      `
    },
    // deprecated names outside of tags
    {
      filename: 'test.vue',
      code: `
      <template>
        <p title="<center>">{{ '<font>' }} &lt;strike&gt;</p>
      </template>
      <script>
      export default {
        template: '<center><font>text</font></center>'
      }
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <strike>old price</strike>
      </template>
      `,
      errors: [
        {
          message: 'The `<strike>` element is deprecated.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 17
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <center>
          <font color="red">
            <strike>text</strike>
          </font>
        </center>
      </template>
      `,
      errors: [
        {
          message: 'The `<center>` element is deprecated.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 17
        },
        {
          message: 'The `<font>` element is deprecated.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 29
        },
        {
          message: 'The `<strike>` element is deprecated.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <marquee v-if="isVisible" :scrollamount="speed">news</marquee>
        <p><tt>mono</tt> and <big>big</big></p>
        <object data="movie.swf"><param name="autoplay" value="true"></object>
      </template>
      `,
      errors: [
        {
          message: 'The `<marquee>` element is deprecated.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 57
        },
        {
          message: 'The `<tt>` element is deprecated.',
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 16
        },
        {
          message: 'The `<big>` element is deprecated.',
          line: 4,
          column: 30,
          endLine: 4,
          endColumn: 35
        },
        {
          message: 'The `<param>` element is deprecated.',
          line: 5,
          column: 34,
          endLine: 5,
          endColumn: 70
        }
      ]
    },
    // HTML content inside components and foreign elements
    {
      filename: 'test.vue',
      code: `
      <template>
        <MyCard>
          <template #title><blink>new</blink></template>
        </MyCard>
        <svg>
          <foreignObject><center>text</center></foreignObject>
        </svg>
      </template>
      `,
      errors: [
        {
          message: 'The `<blink>` element is deprecated.',
          line: 4,
          column: 28,
          endLine: 4,
          endColumn: 35
        },
        {
          message: 'The `<center>` element is deprecated.',
          line: 7,
          column: 26,
          endLine: 7,
          endColumn: 34
        }
      ]
    }
  ]
})
