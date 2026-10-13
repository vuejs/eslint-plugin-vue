/**
 * @fileoverview This rule warns about the usage of extra whitespaces between attributes
 * @author Armano
 */
import rule from '../../../lib/rules/no-multi-spaces'
import { RuleTester } from '../../eslint-compat'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2015,
    sourceType: 'module'
  }
})

ruleTester.run('no-multi-spaces', rule, {
  valid: [
    '',
    '<template></template>',
    '<template><div /></template>',
    '<template><div class="foo"></div></template>',
    '<template><div class="     foo   " style="     foo   "></div></template>',
    '<template><div class="foo" @click="bar"></div></template>',
    '<template><div class="foo"\n          :style="foo"></div></template>',
    '<template><div class="foo"\n\t\t\t:style="foo"></div></template>',
    '<template><div class="foo"\n      :style="foo"\n      ></div></template>',
    '<template><div class="foo"\n                       :style="foo" /></template>',
    '<template><div class="foo"\n                       :style="foo"\n                            /></template>',
    '<template><div>{{ test }}</div></template>',
    '<template><div>{{test}}</div></template>',
    '<template><div>{{test}}<!-- fooo --></div></template>',
    '<template><div>{{test}} <!--        fooo           --></div></template>',
    '<template><div v-for="i in b">{{ i }}</div></template>',
    '<template><div v-for=" i in b ">{{ i }}</div></template>',
    '<template><div :test="`           `"> {{ a }} </div></template>',
    '<template><div :test="`           `">          \n        {{ a }} </div></template>',
    '<template><div /></template>\n<script setup lang="ts"></script>\n<style scoped></style>',
    '<script\n  setup\n  lang="ts"\n>\n</script\n>\n<style\n  scoped\n></style>',
    '<script>\nconst a  =  1\n</script>\n<style>\n.a  { color:  red }\n</style>\n<i18n>\n{ "a":  1 }\n</i18n>',
    '<template lang="pug">\ndiv(class="a"  id="b")\n</template>',
    {
      filename: 'test.js',
      code: 'export default { }'
    },
    {
      code: `
      <template>
        <i
          :class="{
            'fa-angle-up'   : isExpanded,
            'fa-angle-down' : !isExpanded,
          }"
        />
      </template>
      `,
      options: [
        {
          ignoreProperties: true
        }
      ]
    },
    {
      code: `
      <template>
        <i
          :class="{
            'fa-angle-up':   isExpanded,
            'fa-angle-down': !isExpanded,
          }"
        />
      </template>
      `,
      options: [
        {
          ignoreProperties: true
        }
      ]
    },
    {
      code: `
      <template>
        <div
          :class="{
           'foo': foo,   // comment
          }"
        ></div>
      </template>
      `,
      options: [
        {
          ignoreEOLComments: true
        }
      ]
    },
    {
      code: `
      <template>
        <div
          :class="{
            'foo': foo   /* multiline comment */
          }"
        ></div>
      </template>
      `,
      options: [
        {
          ignoreEOLComments: true
        }
      ]
    }
  ],
  invalid: [
    {
      code: '<template><div     /></template>',
      output: '<template><div /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: '<template><div   class="foo"  /></template>',
      output: '<template><div class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before 'class'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18
        },
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: '<template><div\t\tclass="foo"\t\t/></template>',
      output: '<template><div class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before 'class'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 17
        },
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: '<template><div   :class="foo"  /></template>',
      output: '<template><div :class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before ':'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18
        },
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: '<template><div :foo="" class="foo"  /></template>',
      output: '<template><div :foo="" class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 35,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: '<template><div foo="" class="foo"  /></template>',
      output: '<template><div foo="" class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: '<template><foo v-foo="" class="foo"  /></template>',
      output: '<template><foo v-foo="" class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      code: '<template><foo v-foo="" \n         class="foo"    /></template>',
      output: '<template><foo v-foo="" \n         class="foo" /></template>',
      errors: [
        {
          message: "Multiple spaces found before '/>'.",
          line: 2,
          column: 21,
          endLine: 2,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div>{{  test  }}</div></template>',
      output: '<template><div>{{ test }}</div></template>',
      errors: [
        {
          message: "Multiple spaces found before 'test'.",
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 20
        },
        {
          message: "Multiple spaces found before '}}'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: '<template><div               ></div></template>',
      output: '<template><div ></div></template>',
      errors: [
        {
          message: "Multiple spaces found before '>'.",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: '<template><div v-for="      i    in    b       ">{{ test }}</div></template>',
      output: '<template><div v-for=" i in b ">{{ test }}</div></template>',
      errors: [
        {
          message: "Multiple spaces found before 'i'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 29
        },
        {
          message: "Multiple spaces found before 'in'.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "Multiple spaces found before 'b'.",
          line: 1,
          column: 36,
          endLine: 1,
          endColumn: 40
        },
        {
          message: "Multiple spaces found before '\"'.",
          line: 1,
          column: 41,
          endLine: 1,
          endColumn: 48
        }
      ]
    },
    {
      code: `
      <template>
        <i
          :class="{
            'fa-angle-up'   : isExpanded,
            'fa-angle-down' : !isExpanded,
          }"
        />
      </template>
      `,
      output: `
      <template>
        <i
          :class="{
            'fa-angle-up' : isExpanded,
            'fa-angle-down' : !isExpanded,
          }"
        />
      </template>
      `,
      errors: [
        {
          message: "Multiple spaces found before ':'.",
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 29
        }
      ]
    },
    {
      code: `
      <template>
        <i
          :class="{
            'fa-angle-up':   isExpanded,
            'fa-angle-down': !isExpanded,
          }"
        />
      </template>
      `,
      output: `
      <template>
        <i
          :class="{
            'fa-angle-up': isExpanded,
            'fa-angle-down': !isExpanded,
          }"
        />
      </template>
      `,
      errors: [
        {
          message: "Multiple spaces found before 'isExpanded'.",
          line: 5,
          column: 27,
          endLine: 5,
          endColumn: 30
        }
      ]
    },
    {
      code: `
      <template>
        <div
          :class="{
            'foo': foo  // comment
          }"
        ></div>
      </template>
      `,
      output: `
      <template>
        <div
          :class="{
            'foo': foo // comment
          }"
        ></div>
      </template>
      `,
      errors: [
        {
          message: "Multiple spaces found before '// comment'.",
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 25
        }
      ]
    },
    {
      code: `
      <template>
        <div
          :class="{
            'foo': foo  /* multiline comment */
          }"
        ></div>
      </template>
      `,
      output: `
      <template>
        <div
          :class="{
            'foo': foo /* multiline comment */
          }"
        ></div>
      </template>
      `,
      errors: [
        {
          message: "Multiple spaces found before '/* multiline comment */'.",
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 25
        }
      ]
    },
    {
      code: `
      <template>
        <div
          :class="{
            'foo': foo  // comment
          }"
        ></div>
      </template>
      `,
      output: `
      <template>
        <div
          :class="{
            'foo': foo // comment
          }"
        ></div>
      </template>
      `,
      options: [
        {
          ignoreEOLComments: false
        }
      ],
      errors: [
        {
          message: "Multiple spaces found before '// comment'.",
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 25
        }
      ]
    },
    {
      code: `
      <template>
        <div
          :class="{
            'foo': foo  /* multiline comment */
          }"
        ></div>
      </template>
      `,
      output: `
      <template>
        <div
          :class="{
            'foo': foo /* multiline comment */
          }"
        ></div>
      </template>
      `,
      options: [
        {
          ignoreEOLComments: false
        }
      ],
      errors: [
        {
          message: "Multiple spaces found before '/* multiline comment */'.",
          line: 5,
          column: 23,
          endLine: 5,
          endColumn: 25
        }
      ]
    },
    {
      code: `
      <template>
        <div></div>
      </template>

      <script   ></script>

      <style    ></style>
      `,
      output: `
      <template>
        <div></div>
      </template>

      <script ></script>

      <style ></style>
      `,
      errors: [
        {
          message: "Multiple spaces found before '>'.",
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 17
        },
        {
          message: "Multiple spaces found before '>'.",
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 17
        }
      ]
    },
    {
      code: `
      <script  setup   lang="ts">
      const a = 1
      </script   >
      `,
      output: `
      <script setup lang="ts">
      const a = 1
      </script >
      `,
      errors: [
        {
          message: "Multiple spaces found before 'setup'.",
          line: 2,
          column: 14,
          endLine: 2,
          endColumn: 16
        },
        {
          message: "Multiple spaces found before 'lang'.",
          line: 2,
          column: 21,
          endLine: 2,
          endColumn: 24
        },
        {
          message: "Multiple spaces found before '>'.",
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: `
      <style  scoped>
      .a { color: red }
      </style  >
      `,
      output: `
      <style scoped>
      .a { color: red }
      </style >
      `,
      errors: [
        {
          message: "Multiple spaces found before 'scoped'.",
          line: 2,
          column: 13,
          endLine: 2,
          endColumn: 15
        },
        {
          message: "Multiple spaces found before '>'.",
          line: 4,
          column: 14,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    {
      code: `
      <i18n  lang="json"   >
      { "en": { "hello": "Hello" } }
      </i18n  >
      <i18n   src="./locales.json"   />
      `,
      output: `
      <i18n lang="json" >
      { "en": { "hello": "Hello" } }
      </i18n >
      <i18n src="./locales.json" />
      `,
      errors: [
        {
          message: "Multiple spaces found before 'lang'.",
          line: 2,
          column: 12,
          endLine: 2,
          endColumn: 14
        },
        {
          message: "Multiple spaces found before '>'.",
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 28
        },
        {
          message: "Multiple spaces found before '>'.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 15
        },
        {
          message: "Multiple spaces found before 'src'.",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 15
        },
        {
          message: "Multiple spaces found before '/>'.",
          line: 5,
          column: 35,
          endLine: 5,
          endColumn: 38
        }
      ]
    },
    {
      code: `
      <template  lang="pug"   >
      div
      </template  >
      `,
      output: `
      <template lang="pug" >
      div
      </template >
      `,
      errors: [
        {
          message: "Multiple spaces found before 'lang'.",
          line: 2,
          column: 16,
          endLine: 2,
          endColumn: 18
        },
        {
          message: "Multiple spaces found before '>'.",
          line: 2,
          column: 28,
          endLine: 2,
          endColumn: 31
        },
        {
          message: "Multiple spaces found before '>'.",
          line: 4,
          column: 17,
          endLine: 4,
          endColumn: 19
        }
      ]
    },
    {
      code: `
      <template  >
        <div  class="foo"></div>
      </template  >
      <script   setup></script>
      `,
      output: `
      <template >
        <div class="foo"></div>
      </template >
      <script setup></script>
      `,
      errors: [
        {
          message: "Multiple spaces found before '>'.",
          line: 2,
          column: 16,
          endLine: 2,
          endColumn: 18
        },
        {
          message: "Multiple spaces found before 'class'.",
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 15
        },
        {
          message: "Multiple spaces found before '>'.",
          line: 4,
          column: 17,
          endLine: 4,
          endColumn: 19
        },
        {
          message: "Multiple spaces found before 'setup'.",
          line: 5,
          column: 14,
          endLine: 5,
          endColumn: 17
        }
      ]
    }
  ]
})
