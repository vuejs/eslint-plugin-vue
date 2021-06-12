/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/block-tag-newline')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('block-tag-newline', rule, {
  valid: [
    '<template><input></template>\n<script>let a</script>',
    '<template>\n<input>\n</template>\n<script>\nlet a\n</script>',
    '<template>\n<div>\n</div>\n</template>\n<script>\nlet a\nlet b\n</script>',
    '<template></template>\n<script></script>',
    '<template>\n\n</template>\n<script>\n\n</script>',
    '<template />\n<script />',
    {
      code: '<template><div>\n</div></template>\n<script>let a</script>',
      options: [{ singleline: 'never', multiline: 'never' }]
    },
    {
      code: '<template>\n<input>\n</template>\n<script>\nlet a\nlet b\n</script>',
      options: [{ singleline: 'always', multiline: 'always' }]
    },
    {
      code: '<template>\n\n<input>\n\n</template>\n<script>\n\nlet a\nlet b\n\n</script>',
      options: [{ singleline: 'always', multiline: 'always', maxEmptyLines: 1 }]
    },
    {
      code: '<template>\n<input></template>\n<script>let a\nlet b\n</script>',
      options: [{ singleline: 'ignore', multiline: 'ignore' }]
    },
    {
      code: '<template><input></template>\n<script>\nlet a\n</script>',
      options: [{ multiline: 'never' }]
    },
    {
      code: '<template>\n<div>\n</div>\n</template>\n<script>\nlet a\nlet b\n</script>',
      options: [{ singleline: 'never' }]
    },
    // invalid
    '<template><div a="></div>\n</template>\n<script>\nlet a</script>'
  ],
  invalid: [
    {
      code: '<template><input>\n</template>\n<script>let a\n</script>',
      output: '<template>\n<input>\n</template>\n<script>\nlet a\n</script>',
      errors: [
        {
          message: "A line break is required after '<template>'.",
          line: 1,
          column: 11
        },
        {
          message: "A line break is required after '<script>'.",
          line: 3,
          column: 9
        }
      ]
    },
    {
      code: '<template>\n<input></template>\n<script>\nlet a</script>',
      output: '<template>\n<input>\n</template>\n<script>\nlet a\n</script>',
      errors: [
        {
          message: "A line break is required before '</template>'.",
          line: 2,
          column: 8
        },
        {
          message: "A line break is required before '</script>'.",
          line: 4,
          column: 6
        }
      ]
    },
    {
      code: '<template><div>\n</div></template>\n<script>let a\nlet b</script>',
      output:
        '<template>\n<div>\n</div>\n</template>\n<script>\nlet a\nlet b\n</script>',
      errors: [
        {
          message: "A line break is required after '<template>'.",
          line: 1,
          column: 11
        },
        {
          message: "A line break is required before '</template>'.",
          line: 2,
          column: 7
        },
        {
          message: "A line break is required after '<script>'.",
          line: 3,
          column: 9
        },
        {
          message: "A line break is required before '</script>'.",
          line: 4,
          column: 6
        }
      ]
    },
    {
      code: '<template>\n<div>\n</div>\n</template>\n<script>\nlet a\n</script>',
      output: '<template><div>\n</div></template>\n<script>let a</script>',
      options: [{ singleline: 'never', multiline: 'never' }],
      errors: [
        {
          message: "There should be no line break after '<template>'.",
          line: 1,
          column: 11
        },
        {
          message: "There should be no line break after '<template>'.",
          line: 3,
          column: 7
        },
        {
          message: "There should be no line break after '<script>'.",
          line: 5,
          column: 9
        },
        {
          message: "There should be no line break after '<script>'.",
          line: 6,
          column: 6
        }
      ]
    },
    {
      code: '<template><div>\n</div></template>\n<script>let a</script>',
      output:
        '<template>\n<div>\n</div>\n</template>\n<script>\nlet a\n</script>',
      options: [{ singleline: 'always', multiline: 'always' }],
      errors: [
        {
          message: "A line break is required after '<template>'.",
          line: 1,
          column: 11
        },
        {
          message: "A line break is required before '</template>'.",
          line: 2,
          column: 7
        },
        {
          message: "A line break is required after '<script>'.",
          line: 3,
          column: 9
        },
        {
          message: "A line break is required before '</script>'.",
          line: 3,
          column: 14
        }
      ]
    },
    {
      code: '<template>\n\n<input>\n\n</template>\n<script>\n\nlet a\nlet b\n\n</script>',
      output:
        '<template>\n<input>\n</template>\n<script>\nlet a\nlet b\n</script>',
      options: [{ singleline: 'always', multiline: 'always' }],
      errors: [
        {
          message:
            "Expected 1 line break after '<template>', but 2 line breaks found.",
          line: 1,
          column: 11
        },
        {
          message:
            "Expected 1 line break  before '</template>', but 2 line breaks found.",
          line: 3,
          column: 8
        },
        {
          message:
            "Expected 1 line break after '<script>', but 2 line breaks found.",
          line: 6,
          column: 9
        },
        {
          message:
            "Expected 1 line break  before '</script>', but 2 line breaks found.",
          line: 9,
          column: 6
        }
      ]
    },
    {
      code: '<template>\n\n\n<input>\n\n</template>\n<script>\n\nlet a\nlet b\n\n\n</script>',
      output:
        '<template>\n\n<input>\n\n</template>\n<script>\n\nlet a\nlet b\n\n</script>',
      options: [
        { singleline: 'always', multiline: 'always', maxEmptyLines: 1 }
      ],
      errors: [
        {
          message:
            "Expected 2 line breaks after '<template>', but 3 line breaks found.",
          line: 1,
          column: 11
        },
        {
          message:
            "Expected 2 line breaks  before '</script>', but 3 line breaks found.",
          line: 10,
          column: 6
        }
      ]
    },
    {
      code: '<template><input>\n\n</template>\n<script>let a\nlet b\n\n\n</script><docs>\n#</docs>',
      output:
        '<template><input>\n\n</template>\n<script>let a\nlet b</script><docs>\n#\n</docs>',
      options: [
        {
          blocks: {
            template: {
              singleline: 'ignore'
            },
            script: {
              multiline: 'never'
            }
          }
        }
      ],
      errors: [
        "There should be no line break after '<script>'.",
        "A line break is required before '</docs>'."
      ]
    }
  ]
})
