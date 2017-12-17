/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-indent')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
* Prevents leading spaces in a multiline template literal from appearing in the resulting string
* @param {string[]} strings The strings in the template literal
* @returns {string} The template literal, with spaces removed from all lines
*/
function unIndent (strings) {
  const templateValue = strings[0]
  const lines = templateValue.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n')
  const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */)[0].length)
  const minLineIndent = Math.min.apply(null, lineIndents)

  return lines.map(line => line.slice(minLineIndent)).join('\n')
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      globalReturn: true
    }
  }
})

tester.run('html-indent', rule, {
  valid: [
    // Examples in docs.
    unIndent`
      <template>
        <div class="foo">
          Hello.
        </div>
        <div
          id="a"
          class="b"
          :other-attr="{
            aaa: 1,
            bbb: 2
          }"
          @other-attr2="
            foo()
            bar()
          "
        >
          {{
            displayMessage
          }}
        </div>
      </template>
    `,

    // VAttribute
    unIndent`
      <template>
        <div
          a="a"
          b="b"
          c=
            "c"
          d
            ="d"
          e
          f
            =
        ></div>
      </template>
    `,
    unIndent`
      <template>
        <div a="a"
             b="b"
             c=
               "c"
             d
               ="d"
             e
             f
               =
        ></div>
      </template>
    `,
    unIndent`
      <template>
        <div a="
        a" b="b"></div>
      </template>
    `,

    // VExpressionContainer
    unIndent`
      <template>
        <div
          :foo="
            value
          "
        ></div>
      </template>
    `,

    // VForExpression
    unIndent`
      <template>
        <div
          v-for="
            x
              in
                xs
          "
        ></div>
        <div
          v-for="
            (
              x
              ,
              y
              ,
              z
            )
              of
                xs
          "
        ></div>
      </template>
    `,

    // VOnExpression
    unIndent`
      <template>
        <div
          v-on:a="
            foo(); bar();
          "
          v-on:b="
            foo()
            bar()
          "
          v-on:c="foo()
                  bar()"
        ></div>
      </template>
    `,

    // VStartTag
    unIndent`
      <template>
        <div
          aaa
          bbb
    `,

    // VText
    unIndent`
      <template>
        aaa
        bbb
        ccc
      </template>
    `,

    // ArrayExpression
    unIndent`
      <template>
        <div v-on:a="
          [
            1
            ,
            2
            ,
            [
              3
            ],
            [ 4,
              5 ]
          ]
        "></div>
      </template>
    `,

    // ArrowFunctionExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            (
            ) =>
              1
          "
          v-bind:b="
            a =>
              1
          "
          v-bind:c="
            (
              a
            ) =>
              1
          "
          v-bind:d="
            (
              a
              ,
              b
            ) =>
              1
          "
          v-bind:e="
            a =>
            {
              a
            }
          "
        ></div>
      </template>
    `,

    // AssignmentExpression / BinaryExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            a
              +
              b
          "
          v-bind:b="
            a
              +
              b
              +
              c
          "
          v-bind:c="
            a
              =
              b
                +
                c
                +
                d
          "
        ></div>
      </template>
    `,

    // AwaitExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            async () =>
              await
                1
          "
        ></div>
      </template>
    `,

    // BreakStatement, LabeledStatement
    unIndent`
      <template>
        <div
          v-on:a="
            while(1)
              break
              ;
          "
          v-on:b="
            A
              :
              break A
              ;
          "
        ></div>
      </template>
    `,

    // CallExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            foo(
            )
          "
          v-bind:b="
            foo(
              1
            )
          "
          v-bind:c="
            foo(
              1
              ,
              2
              ,
              bar(
                3
              )
            )
          "
          v-bind:d="
            f(1, 2,
              3, 4)
          "
        ></div>
      </template>
    `,

    // ClassExpression / ClassDeclaration
    unIndent`
      <template>
        <div
          v-on:a="
            class
              A
            {
              foo(){}
              bar(){}
            }
          "
          v-on:b="
            class
              A
              extends
                B
            {
              ;
              foo(){}
              ;
              bar(){}
              ;
            }
          "
          v-on:b="
            !class
              extends
                B
            {
              ;
              foo(){}
              ;
              bar(){}
              ;
            }
          "
        ></div>
      </template>
    `,

    // ConditionalExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            a
              ? b
              : c
          "
          v-bind:b="
            a ?
              b :
              c
          "
          v-bind:c="
            a
              ?
                b
              :
                c
          "
          v-bind:d="
            a
              ? b
              : c
                ? d
                : e
          "
          v-bind:e="
            a ? 1 :
            b ? 2 :
            /*else*/ 3
          "
        ></div>
      </template>
    `,

    // DoWhileStatement
    unIndent`
      <template>
        <div
          v-on:a="
            do
              ;
            while
              (
                a
              )
          "
          v-on:b="
            do
            {
              ;
            }
            while
              (
                a
              )
          "
          v-on:c="
            do {
              ;
            } while (
              a
            )
          "
        ></div>
      </template>
    `,

    // ForInStatement, ForOfStatement
    unIndent`
      <template>
        <div
          v-on:a="
            for
              (
                a
                  in
                  b
              )
            {
              ;
            }
          "
          v-on:b="
            for (
              a
                of
                b
            )
            {
              ;
            }
          "
          v-on:c="
            for (
              a
                in
                b
            ) {
              ;
            }
          "
        ></div>
      </template>
    `,

    // ForStatement
    unIndent`
      <template>
        <div
          v-on:a="
            for
              (
                a
                ;
                b
                ;
                c
              )
            {
              ;
            }
          "
          v-on:b="
            for
              (
                ;
                b
                ;
                c
              )
            {
              ;
            }
          "
          v-on:c="
            for
              (
                a
                ;
                ;
                c
              )
            {
              ;
            }
          "
          v-on:d="
            for
              (
                a
                ;
                d
                ;
              )
            {
              ;
            }
          "
          v-on:e="
            for
              (
                ;
                ;
              )
            {
              ;
            }
          "
        ></div>
      </template>
    `,

    // FunctionDeclaration, FunctionExpression
    unIndent`
      <template>
        <div
          v-on:a="
            function
              foo
              (
                a
                ,
                b
              )
            {
              ;
            }
          "
          v-on:b="
            !function
              (
                a
                ,
                b
              )
            {
              ;
            }
          "
          v-on:c="
            function
              *
              foo
              (
                a
                ,
                b
              )
            {
              ;
            }
          "
          v-on:d="
            !function
              *
              (
                a
                ,
                b
              )
            {
              ;
            }
          "
          v-on:e="
            async function
              foo
              (
                a
                ,
                b
              )
            {
              ;
            }
          "
        ></div>
      </template>
    `,

    // IfStatement
    unIndent`
      <template>
        <div
          v-on:a="
            if
              (
                a
              )
            {
              ;
            }
          "
          v-on:b="
            if
              (
                a
              )
            {
              ;
            }
            else
            {
              ;
            }
          "
          v-on:c="
            if (a)
              ;
            else if (b)
              ;
            else
              ;
          "
        ></div>
      </template>
    `,

    // MemberExpression, MetaProperty
    unIndent`
      <template>
        <div
          v-bind:a="
            obj
              .aaa
              .bbb
              .ccc
          "
          v-bind:b="
            obj.
              aaa.
              bbb.
              ccc
          "
          v-bind:c="
            obj
              [
                0
              ]
              [
                1
              ]
              [
                2
              ]
          "
          v-bind:d="
            function wrap() {
              new
                .
                target
            }
          "
        ></div>
      </template>
    `,

    // MethodDefinition, Property
    unIndent`
      <template>
        <div
          v-bind:a="{
            aaa
              :
              1
            ,
            bbb
              (
                a
                ,
                b
              )
            {
              ;
            }
            ,
            get
            ccc
              (
              )
            {
              ;
            },
            [
              d
            ]
              :
              1,
            get
            [
              e
            ]
              (
              )
            {
              ;
            }
          }"
          v-bind:b="class {
            bbb
              (
                a
                ,
                b
              )
            {
              ;
            }
            static
            get
            ccc
              (
              )
            {
              ;
            }
            [
              d
            ]
              (
              )
            {
              ;
            }
            get
            [
              e
            ]
              (
              )
            {
              ;
            }
          }"
        ></div>
      </template>
    `,

    // NewExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            new
              foo
                (
                  a,
                  b
                )
          "
          v-bind:b="
            new (
              foo
            )
          "
          v-bind:c="
            new (
              foo
            )(
              a
            )
          "
          v-bind:d="
            new foo(
              a
            )
          "
          v-bind:d="
            new foo(a,
                    b)
          "
        ></div>
      </template>
    `,

    // ObjectExpression
    unIndent`
      <template>
        <div v-bind:a="
          {
            a: 1
            ,
            b: 2
            ,
            c: {
              ca: 3
            },
            d: { da: 4,
                 db: 5 }
          }
        "></div>
      </template>
    `,

    // RestElement / SpreadElement
    unIndent`
      <template>
        <div
          v-bind:a="
            [
              a,
              ...
                b
            ] = [
              a,
              ...
                b
            ]
          "
        ></div>
      </template>
    `,

    // SequenceExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            1
            ,
            2
            ,
            3
          "
          v-bind:b="
            1,
            2,
            3
          "
          v-bind:c="
            a +
              b,
            2
          "
        ></div>
      </template>
    `,
    unIndent`
      <template>
        {{
          a,
          b,
          c
        }}
      </template>
    `,

    // SwitchStatement, SwitchCase
    unIndent`
      <template>
        <div
          v-on:a="
            switch
              (
                a
              )
            {
            case
              1
              :
              foo;
            case (
              2
            ):
              foo;
            case 3:
              foo;
            case 4:
            {
              foo;
            }
            default
              :
              foo;
            }
          "
          v-on:b="
            switch (a) {
            case 1:
              foo;
            }
          "
        ></div>
      </template>
    `,

    // TaggedTemplateExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            foo\`test\`
          "
          v-bind:b="
            foo
              \`test\`
          "
          v-bind:c="
            (
              foo
            )
              \`test\`
          "
        ></div>
      </template>
    `,

    // TemplateLiteral
    unIndent`
      <template>
        <div
          v-bind:a="
            \`hello, \${
              aaa
            }, \${
              (
                bbb
              )
            }\`
          "
          v-bind:b="
            \`
            test
          test
            test
            \`
          "
        ></div>
      </template>
    `,

    // ReturnStatement
    unIndent`
      <template>
        <div
          v-on:a="
            return
            ;
          "
          v-on:b="
            return a
            ;
          "
        ></div>
      </template>
    `,

    // TryStatement / CatchClause
    unIndent`
      <template>
        <div
          v-on:a="
            try
            {
            }
            catch
              (
                err
              )
            {
            }
          "
          v-on:b="
            try
            {
            }
            finally
            {
            }
          "
          v-on:c="
            try
            {
            }
            catch
              (
                err
              )
            {
            }
            finally
            {
            }
          "
        ></div>
      </template>
    `,

    // UnaryExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            +
              a
          "
        ></div>
      </template>
    `,

    // UpdateExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            ++
              a
          "
        ></div>
      </template>
    `,

    // VariableDeclaration, VariableDeclarator
    unIndent`
      <template>
        <div
          v-on:a="
            var aaa
            var bbb = 1,
                ccc = 2
            const ddd = 3,
                  eee = 4
          "
          v-on:b="
            var aaa
                  =
                  1,
                ccc
                  =
                  2
            const ddd
                    =
                    3,
                  eee
                    =
                    4
          "
          v-on:c="
            var aaa = {
              test: 1
            }
            var bbb = {
                  test: 1
                },
                ccc = {
                  test: 1
                }
            const ddd = {
                    test: 1
                  },
                  eee = (a) => {
                    foo(a)
                  }
          "
        ></div>
      </template>
    `,

    // YieldExpression
    unIndent`
      <template>
        <div
          v-bind:a="
            function*(){
              yield
            }
          "
          v-bind:b="
            function*(){
              yield
              a
            }
          "
          v-bind:c="
            function*(){
              yield*
                a
            }
          "
        ></div>
      </template>
    `,

    // 2 spaces
    {
      code: unIndent`
        <template>
          <div
            v-on:a="
              var aaa = {
                test: 1
              }
              var bbb = {
                    test: 1
                  },
                  ccc = {
                    test: 1
                  }
              const ddd = {
                      test: 1
                    },
                    eee = (a) => {
                      foo(a)
                    }
              const
                fff = {
                  test: 1
                },
                ggg = (a) =>
                {
                  foo(a)
                }
            "
          ></div>
        </template>
      `,
      options: [2]
    },

    // Tabs
    {
      code: unIndent`
        <template>
        \t<div
        \t\tv-on:a="
        \t\t\tvar aaa = {
        \t\t\t\ttest: 1
        \t\t\t}
        \t\t\tvar bbb = {
        \t\t\t\t\ttest: 1
        \t\t\t\t},
        \t\t\t\tccc = {
        \t\t\t\t\ttest: 1
        \t\t\t\t}
        \t\t\tconst ddd = {
        \t\t\t\t\ttest: 1
        \t\t\t\t},
        \t\t\t\teee = (a) => {
        \t\t\t\t\tfoo(a)
        \t\t\t\t}
        \t\t"
        \t></div>
        </template>
      `,
      options: ['tab']
    },

    // options.attribute
    {
      code: unIndent`
        <template>
            <div
            id=""
            class=""
            />
        </template>
      `,
      options: [4, { attribute: 0 }]
    },
    {
      code: unIndent`
        <template>
            <div
                    id=""
                    class=""
            />
        </template>
      `,
      options: [4, { attribute: 2 }]
    },

    // options.closeBracket
    {
      code: unIndent`
        <template>
            <div
                id=""
                class=""
                />
        </template>
      `,
      options: [4, { closeBracket: 1 }]
    },
    {
      code: unIndent`
        <template>
            <div
                id=""
                class=""
                    />
        </template>
      `,
      options: [4, { closeBracket: 2 }]
    },

    // options.switchCase
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                    switch
                        (
                            a
                        )
                    {
                        case
                            1
                            :
                            foo;
                        case (
                            2
                        ):
                            foo;
                        case 3:
                            foo;
                        case 4:
                        {
                            foo;
                        }
                        default
                            :
                            foo;
                    }
                "
                v-on:b="
                    switch (a) {
                        case 1:
                            foo;
                    }
                "
            ></div>
        </template>
      `,
      options: [4, { switchCase: 1 }]
    },

    // Comments
    unIndent`
      <template>
        <!-- comment -->
        {{
          // comment
          // comment
          message
        }}
      </template>
    `,
    unIndent`
      <template>
        {{
          /*
           * comment
           */
          message
        }}
      </template>
    `,
    unIndent`
      <template>
        {{
          message
          // comment
          // comment
        }}
        <!-- comment -->
      </template>
    `,
    unIndent`
      <template>
        {{
          message
          /*
           * comment
           */
        }}
      </template>
    `,
    unIndent`
      <template>
        {{
          message
        // comment
        // comment
        }}
        <!-- comment -->
      </template>
    `,
    unIndent`
      <template>
        {{
          message
        /*
         * comment
         */
        }}
      </template>
    `,

    // Ignores
    {
      code: unIndent`
        <template>
              <div
            id
          =
            >
          Hello
        <span>
        </template>
      `,
      options: [4, {
        // Ignore all :D
        ignores: ['*']
      }]
    }
  ],

  invalid: [
    // VAttribute
    {
      code: unIndent`
        <template>
            <div
              a="a"
              b="b"
              c=
                  "c"
              d
                  ="d"
              e
              f
                  =
            >
                Text
            </div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                a="a"
                b="b"
                c=
                    "c"
                d
                    ="d"
                e
                f
                    =
            >
                Text
            </div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 3 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 4 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 9 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 11 }
      ]
    },

    // VEndTag
    {
      code: unIndent`
        <template>
          </template
      `,
      output: unIndent`
        <template>
        </template
      `,
      errors: [
        { message: 'Expected indentation of 0 spaces but found 2 spaces.', line: 2 }
      ]
    },

    // VExpressionContainer
    {
      code: unIndent`
        <template>
            <div
                :a="
                  value
              "
                :b=
                  value
                :c=
                  'value'
            >
                {{
                  value
              }}
            </div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                :a="
                    value
                "
                :b=
                    value
                :c=
                    'value'
            >
                {{
                    value
                }}
            </div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 13 }
      ]
    },

    // VForExpression
    {
      code: unIndent`
        <template>
            <div
                v-for="
                  x
                  in
                  xs
                "
            ></div>
            <div
                v-for="
                  (
                  x
                  ,
                  y
                  ,
                  z
                  )
                  of
                  xs
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-for="
                    x
                        in
                            xs
                "
            ></div>
            <div
                v-for="
                    (
                        x
                        ,
                        y
                        ,
                        z
                    )
                        of
                            xs
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 19 }
      ]
    },

    // VOnExpression
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  foo(); bar();
                "
                v-on:b="
                  foo()
                  bar()
                "
                v-on:c="foo()
                  bar()"
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    foo(); bar();
                "
                v-on:b="
                    foo()
                    bar()
                "
                v-on:c="foo()
                        bar()"
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 11 }
      ]
    },

    // VText
    {
      code: unIndent`
        <template>
          aaa
          bbb
            ccc
        </template>
      `,
      output: unIndent`
        <template>
            aaa
            bbb
            ccc
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 2 },
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 3 }
      ]
    },
    // Mix of texts and mustaches
    {
      code: unIndent`
        <template>
          aaa
          {{bbb}}
          ccc {{
          ddd
          }}
        </template>
      `,
      output: unIndent`
        <template>
            aaa
            {{bbb}}
            ccc {{
                ddd
            }}
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 2 },
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 4 },
        { message: 'Expected indentation of 8 spaces but found 2 spaces.', line: 5 },
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 6 }
      ]
    },

    // ArrayExpression
    {
      code: unIndent`
        <template>
            <div v-on:a="
              [
              1
              ,
              2
              ,
              [
              3
              ],
              [ 4,
              5 ]
              ]
            "></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div v-on:a="
                [
                    1
                    ,
                    2
                    ,
                    [
                        3
                    ],
                    [ 4,
                      5 ]
                ]
            "></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 3 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 6 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 11 },
        { message: 'Expected indentation of 14 spaces but found 6 spaces.', line: 12 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 13 }
      ]
    },

    // ArrowFunctionExpression
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  (
                  ) =>
                  1
                "
                v-bind:b="
                  a =>
                  1
                "
                v-bind:c="
                  (
                  a
                  ) =>
                  1
                "
                v-bind:d="
                  (
                  a
                  ,
                  b
                  ) =>
                  1
                "
                v-bind:e="
                  a =>
                  {
                  a
                  }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    (
                    ) =>
                        1
                "
                v-bind:b="
                    a =>
                        1
                "
                v-bind:c="
                    (
                        a
                    ) =>
                        1
                "
                v-bind:d="
                    (
                        a
                        ,
                        b
                    ) =>
                        1
                "
                v-bind:e="
                    a =>
                    {
                        a
                    }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 27 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 28 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 30 }
      ]
    },

    // AssignmentExpression / BinaryExpression
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  a
                  +
                  b
                "
                v-bind:b="
                  a
                  +
                  b
                  +
                  c
                "
                v-bind:c="
                  a
                  =
                  b
                  +
                  c
                  +
                  d
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    a
                        +
                        b
                "
                v-bind:b="
                    a
                        +
                        b
                        +
                        c
                "
                v-bind:c="
                    a
                        =
                        b
                            +
                            c
                            +
                            d
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 22 }
      ]
    },

    // AwaitExpression
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                    async () =>
                      await
                      1
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    async () =>
                        await
                            1
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 16 spaces but found 14 spaces.', line: 5 },
        { message: 'Expected indentation of 20 spaces but found 14 spaces.', line: 6 }
      ]
    },

    // BreakExpression / LabeledStatement
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                    while(1)
                  break
                  ;
                "
                v-on:b="
                  A
                  :
                  break A
                  ;
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    while(1)
                        break
                        ;
                "
                v-on:b="
                    A
                        :
                        break A
                        ;
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 12 }
      ]
    },

    // CallExpression
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  foo(
                  )
                "
                v-bind:b="
                  foo(
                  1
                  )
                "
                v-bind:c="
                  foo(
                  1
                  ,
                  2
                  ,
                  bar(
                  3
                  )
                  )
                "
                v-bind:d="
                  f(1, 2,
                  3, 4)
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    foo(
                    )
                "
                v-bind:b="
                    foo(
                        1
                    )
                "
                v-bind:c="
                    foo(
                        1
                        ,
                        2
                        ,
                        bar(
                            3
                        )
                    )
                "
                v-bind:d="
                    f(1, 2,
                      3, 4)
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 14 spaces but found 10 spaces.', line: 25 }
      ]
    },

    // ClassExpression / ClassDeclaration
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  class
                  A
                  {
                  foo(){}
                  bar(){}
                  }
                "
                v-on:b="
                  class
                  A
                  extends
                  B
                  {
                  ;
                  foo(){}
                  ;
                  bar(){}
                  ;
                  }
                "
                v-on:b="
                  !class
                  extends
                  B
                  {
                  ;
                  foo(){}
                  ;
                  bar(){}
                  ;
                  }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    class
                        A
                    {
                        foo(){}
                        bar(){}
                    }
                "
                v-on:b="
                    class
                        A
                        extends
                            B
                    {
                        ;
                        foo(){}
                        ;
                        bar(){}
                        ;
                    }
                "
                v-on:b="
                    !class
                        extends
                            B
                    {
                        ;
                        foo(){}
                        ;
                        bar(){}
                        ;
                    }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 26 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 27 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 28 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 31 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 32 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 33 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 34 }
      ]
    },

    // ConditionalExpression
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  a
                  ? b
                  : c
                "
                v-bind:b="
                  a ?
                  b :
                  c
                "
                v-bind:c="
                  a
                  ?
                  b
                  :
                  c
                "
                v-bind:d="
                  a
                  ? b
                  : c
                  ? d
                  : e
                "
                v-bind:e="
                  a ? 1 :
                  b ? 2 :
                  /*else*/ 3
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    a
                        ? b
                        : c
                "
                v-bind:b="
                    a ?
                        b :
                        c
                "
                v-bind:c="
                    a
                        ?
                            b
                        :
                            c
                "
                v-bind:d="
                    a
                        ? b
                        : c
                            ? d
                            : e
                "
                v-bind:e="
                    a ? 1 :
                    b ? 2 :
                    /*else*/ 3
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 28 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 30 }
      ]
    },

    // DoWhileStatement
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  do
                  ;
                  while
                  (
                  a
                  )
                "
                v-on:b="
                  do
                  {
                  ;
                  }
                  while
                  (
                  a
                  )
                "
                v-on:c="
                  do {
                  ;
                  } while (
                  a
                  )
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    do
                        ;
                    while
                        (
                            a
                        )
                "
                v-on:b="
                    do
                    {
                        ;
                    }
                    while
                        (
                            a
                        )
                "
                v-on:c="
                    do {
                        ;
                    } while (
                        a
                    )
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 26 }
      ]
    },

    // ForInStatement, ForOfStatement
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  for
                  (
                  a
                  in
                  b
                  )
                  {
                  ;
                  }
                "
                v-on:b="
                  for (
                  a
                  of
                  b
                  )
                  {
                  ;
                  }
                "
                v-on:c="
                  for (
                  a
                  in
                  b
                  ) {
                  ;
                  }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    for
                        (
                            a
                                in
                                b
                        )
                    {
                        ;
                    }
                "
                v-on:b="
                    for (
                        a
                            of
                            b
                    )
                    {
                        ;
                    }
                "
                v-on:c="
                    for (
                        a
                            in
                            b
                    ) {
                        ;
                    }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 24 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 24 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 26 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 27 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 28 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 31 }
      ]
    },

    // ForStatement
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  for
                  (
                  a
                  ;
                  b
                  ;
                  c
                  )
                  {
                  ;
                  }
                "
                v-on:b="
                  for
                  (
                  ;
                  b
                  ;
                  c
                  )
                  {
                  ;
                  }
                "
                v-on:c="
                  for
                  (
                  a
                  ;
                  ;
                  c
                  )
                  {
                  ;
                  }
                "
                v-on:d="
                  for
                  (
                  a
                  ;
                  d
                  ;
                  )
                  {
                  ;
                  }
                "
                v-on:e="
                  for
                  (
                  ;
                  ;
                  )
                  {
                  ;
                  }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    for
                        (
                            a
                            ;
                            b
                            ;
                            c
                        )
                    {
                        ;
                    }
                "
                v-on:b="
                    for
                        (
                            ;
                            b
                            ;
                            c
                        )
                    {
                        ;
                    }
                "
                v-on:c="
                    for
                        (
                            a
                            ;
                            ;
                            c
                        )
                    {
                        ;
                    }
                "
                v-on:d="
                    for
                        (
                            a
                            ;
                            d
                            ;
                        )
                    {
                        ;
                    }
                "
                v-on:e="
                    for
                        (
                            ;
                            ;
                        )
                    {
                        ;
                    }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 26 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 31 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 32 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 33 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 34 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 35 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 36 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 37 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 38 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 41 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 42 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 43 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 44 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 45 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 46 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 47 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 48 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 49 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 50 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 53 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 54 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 55 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 56 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 57 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 58 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 59 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 60 }
      ]
    },

    // FunctionDeclaration, FunctionExpression
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  function
                  foo
                  (
                  a
                  ,
                  b
                  )
                  {
                  ;
                  }
                "
                v-on:b="
                  !function
                  (
                  a
                  ,
                  b
                  )
                  {
                  ;
                  }
                "
                v-on:c="
                  function
                  *
                  foo
                  (
                  a
                  ,
                  b
                  )
                  {
                  ;
                  }
                "
                v-on:d="
                  !function
                  *
                  (
                  a
                  ,
                  b
                  )
                  {
                  ;
                  }
                "
                v-on:e="
                  async function
                  foo
                  (
                  a
                  ,
                  b
                  )
                  {
                  ;
                  }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    function
                        foo
                        (
                            a
                            ,
                            b
                        )
                    {
                        ;
                    }
                "
                v-on:b="
                    !function
                        (
                            a
                            ,
                            b
                        )
                    {
                        ;
                    }
                "
                v-on:c="
                    function
                        *
                        foo
                        (
                            a
                            ,
                            b
                        )
                    {
                        ;
                    }
                "
                v-on:d="
                    !function
                        *
                        (
                            a
                            ,
                            b
                        )
                    {
                        ;
                    }
                "
                v-on:e="
                    async function
                        foo
                        (
                            a
                            ,
                            b
                        )
                    {
                        ;
                    }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 27 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 28 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 31 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 32 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 33 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 34 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 35 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 36 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 37 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 40 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 41 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 42 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 43 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 44 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 45 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 46 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 47 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 48 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 49 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 52 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 53 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 54 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 55 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 56 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 57 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 58 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 59 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 60 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 61 }
      ]
    },

    // IfStatement
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  if
                  (
                  a
                  )
                  {
                  ;
                  }
                "
                v-on:b="
                  if
                  (
                  a
                  )
                  {
                  ;
                  }
                  else
                  {
                  ;
                  }
                "
                v-on:c="
                  if (a)
                  ;
                  else if (b)
                  ;
                  else
                  ;
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    if
                        (
                            a
                        )
                    {
                        ;
                    }
                "
                v-on:b="
                    if
                        (
                            a
                        )
                    {
                        ;
                    }
                    else
                    {
                        ;
                    }
                "
                v-on:c="
                    if (a)
                        ;
                    else if (b)
                        ;
                    else
                        ;
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 26 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 27 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 28 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 31 }
      ]
    },

    // MemberExpression, MetaProperty
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  obj
                  .aaa
                  .bbb
                  .ccc
                "
                v-bind:b="
                  obj.
                  aaa.
                  bbb.
                  ccc
                "
                v-bind:c="
                  obj
                  [
                  0
                  ]
                  [
                  1
                  ]
                  [
                  2
                  ]
                "
                v-bind:d="
                    function wrap() {
                  new
                  .
                  target
                    }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    obj
                        .aaa
                        .bbb
                        .ccc
                "
                v-bind:b="
                    obj.
                        aaa.
                        bbb.
                        ccc
                "
                v-bind:c="
                    obj
                        [
                            0
                        ]
                        [
                            1
                        ]
                        [
                            2
                        ]
                "
                v-bind:d="
                    function wrap() {
                        new
                            .
                            target
                    }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 31 }
      ]
    },

    // MethodDefinition, Property
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="{
                  aaa
                  :
                  1
                  ,
                  bbb
                  (
                  a
                  ,
                  b
                  )
                  {
                  ;
                  }
                  ,
                  get
                  ccc
                  (
                  )
                  {
                  ;
                  },
                  [
                  d
                  ]
                  :
                  1,
                  get
                  [
                  e
                  ]
                  (
                  )
                  {
                  ;
                  }
                }"
                v-bind:b="class {
                  bbb
                  (
                  a
                  ,
                  b
                  )
                  {
                  ;
                  }
                  static
                  get
                  ccc
                  (
                  )
                  {
                  ;
                  }
                  [
                  d
                  ]
                  (
                  )
                  {
                  ;
                  }
                  get
                  [
                  e
                  ]
                  (
                  )
                  {
                  ;
                  }
                }"
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="{
                    aaa
                        :
                        1
                    ,
                    bbb
                        (
                            a
                            ,
                            b
                        )
                    {
                        ;
                    }
                    ,
                    get
                    ccc
                        (
                        )
                    {
                        ;
                    },
                    [
                        d
                    ]
                        :
                        1,
                    get
                    [
                        e
                    ]
                        (
                        )
                    {
                        ;
                    }
                }"
                v-bind:b="class {
                    bbb
                        (
                            a
                            ,
                            b
                        )
                    {
                        ;
                    }
                    static
                    get
                    ccc
                        (
                        )
                    {
                        ;
                    }
                    [
                        d
                    ]
                        (
                        )
                    {
                        ;
                    }
                    get
                    [
                        e
                    ]
                        (
                        )
                    {
                        ;
                    }
                }"
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 26 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 27 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 28 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 31 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 32 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 33 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 34 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 35 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 36 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 37 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 38 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 41 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 42 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 43 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 44 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 45 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 46 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 47 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 48 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 49 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 50 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 51 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 52 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 53 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 54 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 55 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 56 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 57 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 58 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 59 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 60 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 61 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 62 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 63 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 64 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 65 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 66 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 67 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 68 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 69 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 70 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 71 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 72 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 73 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 74 }
      ]
    },

    // NewExpression
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  new
                  foo
                  (
                  a,
                  b
                  )
                "
                v-bind:b="
                  new (
                  foo
                  )
                "
                v-bind:c="
                  new (
                  foo
                  )(
                  a
                  )
                "
                v-bind:d="
                  new foo(
                  a
                  )
                "
                v-bind:e="
                  new foo(a,
                  b)
                "
                v-bind:f="
                  new foo
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    new
                        foo
                            (
                                a,
                                b
                            )
                "
                v-bind:b="
                    new (
                        foo
                    )
                "
                v-bind:c="
                    new (
                        foo
                    )(
                        a
                    )
                "
                v-bind:d="
                    new foo(
                        a
                    )
                "
                v-bind:e="
                    new foo(a,
                            b)
                "
                v-bind:f="
                    new foo
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 24 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 24 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 26 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 33 }
      ]
    },

    // ObjectExpression
    {
      code: unIndent`
        <template>
            <div v-bind:a="
              {
              a: 1
              ,
              b: 2
              ,
              c: {
              ca: 3
              },
              d: { da: 4,
              db: 5 }
              }
            "></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div v-bind:a="
                {
                    a: 1
                    ,
                    b: 2
                    ,
                    c: {
                        ca: 3
                    },
                    d: { da: 4,
                         db: 5 }
                }
            "></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 3 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 6 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 6 spaces.', line: 11 },
        { message: 'Expected indentation of 17 spaces but found 6 spaces.', line: 12 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 13 }
      ]
    },

    // SequenceExpression
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  1
                  ,
                  2
                  ,
                  3
                "
                v-bind:b="
                  1,
                  2,
                  3
                "
                v-bind:c="
                  a +
                  b,
                  2
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    1
                    ,
                    2
                    ,
                    3
                "
                v-bind:b="
                    1,
                    2,
                    3
                "
                v-bind:c="
                    a +
                        b,
                    2
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 18 }
      ]
    },
    {
      code: unIndent`
        <template>
          {{
          a,
          b,
          c
          }}
        </template>
      `,
      output: unIndent`
        <template>
          {{
            a,
            b,
            c
          }}
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 4 },
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 5 }
      ]
    },

    // SwitchStatement, SwitchCase
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  switch
                  (
                  a
                  )
                  {
                  case
                  1
                  :
                  foo;
                  case (
                  2
                  ):
                  foo;
                  case 3:
                  foo;
                  case 4:
                  {
                  foo;
                  }
                  default
                  :
                  foo;
                  }
                "
                v-on:b="
                  switch (a) {
                  case 1:
                  foo;
                  }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    switch
                        (
                            a
                        )
                    {
                    case
                        1
                        :
                        foo;
                    case (
                        2
                    ):
                        foo;
                    case 3:
                        foo;
                    case 4:
                    {
                        foo;
                    }
                    default
                        :
                        foo;
                    }
                "
                v-on:b="
                    switch (a) {
                    case 1:
                        foo;
                    }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 23 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 24 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 26 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 31 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 32 }
      ]
    },

    // TaggedTemplateExpression
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  foo\`test\`
                "
                v-bind:b="
                  foo
                  \`test\`
                "
                v-bind:c="
                  (
                  foo
                  )
                  \`test\`
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    foo\`test\`
                "
                v-bind:b="
                    foo
                        \`test\`
                "
                v-bind:c="
                    (
                        foo
                    )
                        \`test\`
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 }
      ]
    },

    // TemplateLiteral
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                  \`hello, \${
                  aaa
                  }, \${
                  (
                  bbb
                  )
                  }\`
                "
                v-bind:b="
                  \`
                    test
                  test
                      test
                    \`
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    \`hello, \${
                        aaa
                    }, \${
                        (
                            bbb
                        )
                    }\`
                "
                v-bind:b="
                    \`
                    test
                  test
                      test
                    \`
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 9 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 13 }
      ]
    },

    // RestElement / SpreadElement
    {
      code: unIndent`
        <template>
            <div
                v-bind:a="
                    [
                        a,
                      ...
                      b
                    ] = [
                        a,
                      ...
                      b
                    ]
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-bind:a="
                    [
                        a,
                        ...
                            b
                    ] = [
                        a,
                        ...
                            b
                    ]
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 16 spaces but found 14 spaces.', line: 6 },
        { message: 'Expected indentation of 20 spaces but found 14 spaces.', line: 7 },
        { message: 'Expected indentation of 16 spaces but found 14 spaces.', line: 10 },
        { message: 'Expected indentation of 20 spaces but found 14 spaces.', line: 11 }
      ]
    },

    // ReturnStatement
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  return
                  ;
                "
                v-on:b="
                  return a
                  ;
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    return
                    ;
                "
                v-on:b="
                    return a
                    ;
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 9 }
      ]
    },

    // TryStatement / CatchClause
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                try
                {
                }
                catch
                (
                err
                )
                {
                }
                "
                v-on:b="
                try
                {
                }
                finally
                {
                }
                "
                v-on:c="
                try
                {
                }
                catch
                (
                err
                )
                {
                }
                finally
                {
                }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    try
                    {
                    }
                    catch
                        (
                            err
                        )
                    {
                    }
                "
                v-on:b="
                    try
                    {
                    }
                    finally
                    {
                    }
                "
                v-on:c="
                    try
                    {
                    }
                    catch
                        (
                            err
                        )
                    {
                    }
                    finally
                    {
                    }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 5 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 7 },
        { message: 'Expected indentation of 16 spaces but found 8 spaces.', line: 8 },
        { message: 'Expected indentation of 20 spaces but found 8 spaces.', line: 9 },
        { message: 'Expected indentation of 16 spaces but found 8 spaces.', line: 10 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 11 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 12 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 15 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 16 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 17 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 18 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 19 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 20 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 23 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 24 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 25 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 26 },
        { message: 'Expected indentation of 16 spaces but found 8 spaces.', line: 27 },
        { message: 'Expected indentation of 20 spaces but found 8 spaces.', line: 28 },
        { message: 'Expected indentation of 16 spaces but found 8 spaces.', line: 29 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 30 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 31 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 32 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 33 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 34 }
      ]
    },

    // UnaryExpression
    {
      code: unIndent`
        <template>
          <div
            v-bind:a="
                +
              a
            "
          ></div>
        </template>
      `,
      output: unIndent`
        <template>
          <div
            v-bind:a="
              +
                a
            "
          ></div>
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 6 spaces but found 8 spaces.', line: 4 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 5 }
      ]
    },

    // UpdateExpression
    {
      code: unIndent`
        <template>
          <div
            v-bind:a="
                ++
              a
            "
          ></div>
        </template>
      `,
      output: unIndent`
        <template>
          <div
            v-bind:a="
              ++
                a
            "
          ></div>
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 6 spaces but found 8 spaces.', line: 4 },
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 5 }
      ]
    },

    // VariableDeclaration, VariableDeclarator
    {
      code: unIndent`
        <template>
            <div
                v-on:a="
                  var aaa
                  var bbb = 1,
                  ccc = 2
                  const ddd = 3,
                  eee = 4
                "
                v-on:b="
                  var aaa
                  =
                  1,
                  ccc
                  =
                  2
                  const ddd
                  =
                  3,
                  eee
                  =
                  4
                "
                v-on:c="
                  var aaa = {
                  test: 1
                  }
                  var bbb = {
                  test: 1
                  },
                  ccc = {
                  test: 1
                  }
                  const ddd = {
                  test: 1
                  },
                  eee = (a) => {
                  foo(a)
                  }
                "
            ></div>
        </template>
      `,
      output: unIndent`
        <template>
            <div
                v-on:a="
                    var aaa
                    var bbb = 1,
                        ccc = 2
                    const ddd = 3,
                          eee = 4
                "
                v-on:b="
                    var aaa
                            =
                            1,
                        ccc
                            =
                            2
                    const ddd
                              =
                              3,
                          eee
                              =
                              4
                "
                v-on:c="
                    var aaa = {
                        test: 1
                    }
                    var bbb = {
                            test: 1
                        },
                        ccc = {
                            test: 1
                        }
                    const ddd = {
                              test: 1
                          },
                          eee = (a) => {
                              foo(a)
                          }
                "
            ></div>
        </template>
      `,
      options: [4],
      errors: [
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 6 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 7 },
        { message: 'Expected indentation of 18 spaces but found 10 spaces.', line: 8 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 12 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 13 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 14 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 15 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 17 },
        { message: 'Expected indentation of 22 spaces but found 10 spaces.', line: 18 },
        { message: 'Expected indentation of 22 spaces but found 10 spaces.', line: 19 },
        { message: 'Expected indentation of 18 spaces but found 10 spaces.', line: 20 },
        { message: 'Expected indentation of 22 spaces but found 10 spaces.', line: 21 },
        { message: 'Expected indentation of 22 spaces but found 10 spaces.', line: 22 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 25 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 26 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 27 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 28 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 29 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 30 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 31 },
        { message: 'Expected indentation of 20 spaces but found 10 spaces.', line: 32 },
        { message: 'Expected indentation of 16 spaces but found 10 spaces.', line: 33 },
        { message: 'Expected indentation of 12 spaces but found 10 spaces.', line: 34 },
        { message: 'Expected indentation of 22 spaces but found 10 spaces.', line: 35 },
        { message: 'Expected indentation of 18 spaces but found 10 spaces.', line: 36 },
        { message: 'Expected indentation of 18 spaces but found 10 spaces.', line: 37 },
        { message: 'Expected indentation of 22 spaces but found 10 spaces.', line: 38 },
        { message: 'Expected indentation of 18 spaces but found 10 spaces.', line: 39 }
      ]
    },

    // YieldExpression
    {
      code: unIndent`
        <template>
          <div
            v-bind:a="
              function*(){
                  yield
              }
            "
            v-bind:b="
              function*(){
                  yield
                  a
              }
            "
            v-bind:c="
              function*(){
                  yield*
                      a
              }
            "
          ></div>
        </template>
      `,
      output: unIndent`
        <template>
          <div
            v-bind:a="
              function*(){
                yield
              }
            "
            v-bind:b="
              function*(){
                yield
                a
              }
            "
            v-bind:c="
              function*(){
                yield*
                  a
              }
            "
          ></div>
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 8 spaces but found 10 spaces.', line: 5 },
        { message: 'Expected indentation of 8 spaces but found 10 spaces.', line: 10 },
        { message: 'Expected indentation of 8 spaces but found 10 spaces.', line: 11 },
        { message: 'Expected indentation of 8 spaces but found 10 spaces.', line: 16 },
        { message: 'Expected indentation of 10 spaces but found 14 spaces.', line: 17 }
      ]
    },

    // Tabs
    {
      code: unIndent`
        <template>
        \t<div
        \t\tv-on:a="
        \t\tvar aaa = {
        \t\ttest: 1
        \t\t}
        \t\tvar bbb = {
        \t\ttest: 1
        \t\t},
        \t\tccc = {
        \t\ttest: 1
        \t\t}
        \t\tconst ddd = {
        \t\ttest: 1
        \t\t},
        \t\teee = (a) => {
        \t\tfoo(a)
        \t\t}
        \t\t"
        \t></div>
        </template>
      `,
      output: unIndent`
        <template>
        \t<div
        \t\tv-on:a="
        \t\t\tvar aaa = {
        \t\t\t\ttest: 1
        \t\t\t}
        \t\t\tvar bbb = {
        \t\t\t\t\ttest: 1
        \t\t\t\t},
        \t\t\t\tccc = {
        \t\t\t\t\ttest: 1
        \t\t\t\t}
        \t\t\tconst ddd = {
        \t\t\t\t\ttest: 1
        \t\t\t\t},
        \t\t\t\teee = (a) => {
        \t\t\t\t\tfoo(a)
        \t\t\t\t}
        \t\t"
        \t></div>
        </template>
      `,
      options: ['tab'],
      errors: [
        { message: 'Expected indentation of 3 tabs but found 2 tabs.', line: 4 },
        { message: 'Expected indentation of 4 tabs but found 2 tabs.', line: 5 },
        { message: 'Expected indentation of 3 tabs but found 2 tabs.', line: 6 },
        { message: 'Expected indentation of 3 tabs but found 2 tabs.', line: 7 },
        { message: 'Expected indentation of 5 tabs but found 2 tabs.', line: 8 },
        { message: 'Expected indentation of 4 tabs but found 2 tabs.', line: 9 },
        { message: 'Expected indentation of 4 tabs but found 2 tabs.', line: 10 },
        { message: 'Expected indentation of 5 tabs but found 2 tabs.', line: 11 },
        { message: 'Expected indentation of 4 tabs but found 2 tabs.', line: 12 },
        { message: 'Expected indentation of 3 tabs but found 2 tabs.', line: 13 },
        { message: 'Expected indentation of 5 tabs but found 2 tabs.', line: 14 },
        { message: 'Expected indentation of 4 tabs but found 2 tabs.', line: 15 },
        { message: 'Expected indentation of 4 tabs but found 2 tabs.', line: 16 },
        { message: 'Expected indentation of 5 tabs but found 2 tabs.', line: 17 },
        { message: 'Expected indentation of 4 tabs but found 2 tabs.', line: 18 }
      ]
    },

    // A mix of spaces and tabs.
    {
      code: unIndent`
        <template>
          <div>
          \tHello
          </div>
        </template>
      `,
      output: unIndent`
        <template>
          <div>
            Hello
          </div>
        </template>
      `,
      errors: [
        { message: 'Expected " " character, but found "\\t" character.', line: 3 }
      ]
    },
    {
      code: unIndent`
        <template>
        \t<div>
        \t    Hello
        \t</div>
        </template>
      `,
      output: unIndent`
        <template>
        \t<div>
        \t\tHello
        \t</div>
        </template>
      `,
      options: ['tab'],
      errors: [
        { message: 'Expected "\\t" character, but found " " character.', line: 3 }
      ]
    },

    // Comments
    {
      code: unIndent`
        <template>
        <!-- comment -->
        {{
        // comment
        // comment
        message
        }}
        </template>
      `,
      output: unIndent`
        <template>
          <!-- comment -->
          {{
            // comment
            // comment
            message
          }}
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 2 },
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 4 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 5 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 6 },
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 7 }
      ]
    },
    {
      code: unIndent`
        <template>
          {{
          /*
           * comment
           */
          message
          }}
        </template>
      `,
      output: unIndent`
        <template>
          {{
            /*
             * comment
             */
            message
          }}
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 2 spaces.', line: 6 }
      ]
    },
    {
      code: unIndent`
        <template>
        {{
        message
        // comment
        // comment
        }}
        <!-- comment -->
        </template>
      `,
      output: unIndent`
        <template>
          {{
            message
            // comment
            // comment
          }}
        <!-- comment -->
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 2 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 4 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 5 },
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 6 }
      ]
    },
    {
      code: unIndent`
        <template>
        {{
        message
        /*
         * comment
         */
        }}
        </template>
      `,
      output: unIndent`
        <template>
          {{
            message
            /*
             * comment
             */
          }}
        </template>
      `,
      errors: [
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 2 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 0 spaces.', line: 4 },
        { message: 'Expected indentation of 2 spaces but found 0 spaces.', line: 7 }
      ]
    },

    // Ignores
    {
      code: unIndent`
        <template>
            <div
            id=""
              class=""
                />
        </template>
      `,
      output: unIndent`
        <template>
            <div
            id=""
              class=""
            />
        </template>
      `,
      options: [4, {
        ignores: ['VAttribute']
      }],
      errors: [
        { message: 'Expected indentation of 4 spaces but found 8 spaces.', line: 5 }
      ]
    },
    {
      code: unIndent`
        <template>
            {{
              obj
                .foo[
                "bar"
                ].baz
            }}
        </template>
      `,
      output: unIndent`
        <template>
            {{
                obj
                    .foo[
                "bar"
                    ].baz
            }}
        </template>
      `,
      options: [4, {
        // Ignore inside of computed properties.
        ignores: ['MemberExpression[computed=true] *.property']
      }],
      errors: [
        { message: 'Expected indentation of 8 spaces but found 6 spaces.', line: 3 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 4 },
        { message: 'Expected indentation of 12 spaces but found 8 spaces.', line: 6 }
      ]
    }
  ]
})
