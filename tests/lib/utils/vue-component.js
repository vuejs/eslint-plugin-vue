/**
 * @author Armano
 */
'use strict'

const utils = require('../../../lib/utils/index')

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = {
  create(context) {
    return utils.executeOnVueComponent(context, (obj) => {
      context.report({
        node: obj,
        message: 'Component detected.'
      })
    })
  },
  meta: {
    fixable: null,
    schema: []
  }
}

const RuleTester = require('eslint').RuleTester
const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
}

function makeError(line) {
  return {
    message: 'Component detected.',
    line,
    type: 'ObjectExpression'
  }
}

function validTests(ext) {
  return [
    {
      filename: `test.${ext}`,
      code: `export const foo = {}`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `export var foo = {}`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `const foo = {}`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `var foo = {}`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `let foo = {}`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `foo({ })`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `foo(() => { return {} })`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `Vue.component('async-example', function (resolve, reject) { })`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `Vue.component('async-example', function (resolve, reject) { resolve({}) })`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `new Vue({ })`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `{
        foo: {}
      }`,
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `export default (Foo as FooConstructor<Foo>).extend({})`,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `export default Foo.extend({})`,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions
    },
    {
      filename: `test.${ext}`,
      code: `export default Foo.extend({} as ComponentOptions)`,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions
    }
  ]
}

function invalidTests(ext) {
  return [
    {
      filename: `test.${ext}`,
      code: `
        Vue.component('async-example', function (resolve, reject) {
          // @vue/component
          resolve({})
        })
        // ${ext}
      `,
      parserOptions,
      errors: [makeError(4)]
    },
    {
      filename: `test.${ext}`,
      code: `Vue.component({})`,
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `Vue.mixin({})`,
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `Vue.extend({})`,
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `app.component('name', {})`,
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `app.mixin({})`,
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `export default (Vue as VueConstructor<Vue>).extend({})`,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `export default Vue.extend({})`,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `export default Vue.extend({} as ComponentOptions)`,
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `createApp({})`,
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: `test.${ext}`,
      code: `
        // @vue/component
        export default { }
        // ${ext}
      `,
      parserOptions,
      errors: [makeError(3)]
    },
    {
      filename: `test.${ext}`,
      code: `
        /* @vue/component */
        export default { }
        // ${ext}
      `,
      parserOptions,
      errors: [makeError(3)]
    },
    {
      filename: `test.${ext}`,
      code: `
        /*
        * ext: ${ext}
        * @vue/component
        */
        export default { }
        // ${ext}
      `,
      parserOptions,
      errors: [makeError(6)]
    },
    {
      filename: `test.${ext}`,
      code: `
        // @vue/component
        export default { }
        // @vue/component
        export var a = { }
        // ${ext}
      `,
      parserOptions,
      errors: [makeError(3), makeError(5)]
    },
    {
      filename: `test.${ext}`,
      code: `
        /* @vue/component */
        export const foo = { }
        /* @vue/component */
        export default { }
        // ${ext}
      `,
      parserOptions,
      errors: [makeError(3), makeError(5)]
    },
    {
      filename: `test.${ext}`,
      code: `
        export default { }
        // @vue/component
        export let foo = { }
        // ${ext}
      `,
      parserOptions,
      errors: [...(ext === 'js' ? [] : [makeError(2)]), makeError(4)]
    },
    {
      filename: `test.${ext}`,
      code: `
        let foo = { }
        // @vue/component
        export let bar = { }
        // ${ext}
      `,
      parserOptions,
      errors: [makeError(4)]
    },
    {
      filename: `test.${ext}`,
      code: `
        export var dar = { }
        // @vue/component
        foo({ })
        bar({ })
        // ${ext}
      `,
      parserOptions,
      errors: [makeError(4)]
    },
    {
      filename: `test.${ext}`,
      code: `
        foo({ })
        export default {
          test: {},
          // @vue/component
          foo: { }
        }
        bar({ })
        // ${ext}
      `,
      parserOptions,
      errors: [...(ext === 'js' ? [] : [makeError(3)]), makeError(6)]
    },
    {
      filename: `test.${ext}`,
      code: `
        export default {
          bar () {
            return {}
          },
          foo () {
            // @vue/component
            return {}
          }
        }
        // ${ext}
      `,
      parserOptions,
      errors: [...(ext === 'js' ? [] : [makeError(2)]), makeError(8)]
    },
    {
      filename: `test.${ext}`,
      code: `export default defineComponent({})`,
      parserOptions,
      errors: [makeError(1)]
    }
  ]
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('vue-component', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `export default { }`,
      parserOptions
    },
    ...validTests('js'),
    ...validTests('jsx'),
    ...validTests('vue')
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `export default { }`,
      parserOptions,
      errors: [makeError(1)]
    },
    {
      filename: 'test.jsx',
      code: `export default { }`,
      parserOptions,
      errors: [makeError(1)]
    },
    ...invalidTests('js'),
    ...invalidTests('jsx'),
    ...invalidTests('vue')
  ]
})
