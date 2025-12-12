/**
 * @author Armano
 */
'use strict'

const utils = require('../../../lib/utils/index')

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

const RuleTester = require('../../eslint-compat').RuleTester
const languageOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
}

function makeError(line, column, endLine, endColumn) {
  return {
    message: 'Component detected.',
    line,
    column,
    endLine,
    endColumn
  }
}

function validTests(ext) {
  return [
    {
      filename: `test.${ext}`,
      code: `export const foo = {}`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `export var foo = {}`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `const foo = {}`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `var foo = {}`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `let foo = {}`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `foo({ })`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `foo(() => { return {} })`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `Vue.component('async-example', function (resolve, reject) { })`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `Vue.component('async-example', function (resolve, reject) { resolve({}) })`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `new Vue({ })`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `{
        foo: {}
      }`,
      languageOptions
    },
    {
      filename: `test.${ext}`,
      code: `export default (Foo as FooConstructor<Foo>).extend({})`,
      languageOptions: {
        ...languageOptions,
        parser: require('@typescript-eslint/parser')
      }
    },
    {
      filename: `test.${ext}`,
      code: `export default Foo.extend({})`,
      languageOptions: {
        ...languageOptions,
        parser: require('@typescript-eslint/parser')
      }
    },
    {
      filename: `test.${ext}`,
      code: `export default Foo.extend({} as ComponentOptions)`,
      languageOptions: {
        ...languageOptions,
        parser: require('@typescript-eslint/parser')
      }
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
      languageOptions,
      errors: [makeError(4, 19, 4, 21)]
    },
    {
      filename: `test.${ext}`,
      code: `Vue.component({})`,
      languageOptions,
      errors: [makeError(1, 15, 1, 17)]
    },
    {
      filename: `test.${ext}`,
      code: `Vue.mixin({})`,
      languageOptions,
      errors: [makeError(1, 11, 1, 13)]
    },
    {
      filename: `test.${ext}`,
      code: `Vue.extend({})`,
      languageOptions,
      errors: [makeError(1, 12, 1, 14)]
    },
    {
      filename: `test.${ext}`,
      code: `app.component('name', {})`,
      languageOptions,
      errors: [makeError(1, 23, 1, 25)]
    },
    {
      filename: `test.${ext}`,
      code: `app.mixin({})`,
      languageOptions,
      errors: [makeError(1, 11, 1, 13)]
    },
    {
      filename: `test.${ext}`,
      code: `export default (Vue as VueConstructor<Vue>).extend({})`,
      languageOptions: {
        ...languageOptions,
        parser: require('@typescript-eslint/parser')
      },
      errors: [makeError(1, 52, 1, 54)]
    },
    {
      filename: `test.${ext}`,
      code: `export default Vue.extend({})`,
      languageOptions: {
        ...languageOptions,
        parser: require('@typescript-eslint/parser')
      },
      errors: [makeError(1, 27, 1, 29)]
    },
    {
      filename: `test.${ext}`,
      code: `export default Vue.extend({} as ComponentOptions)`,
      languageOptions: {
        ...languageOptions,
        parser: require('@typescript-eslint/parser')
      },
      errors: [makeError(1, 27, 1, 29)]
    },
    {
      filename: `test.${ext}`,
      code: `createApp({})`,
      languageOptions,
      errors: [makeError(1, 11, 1, 13)]
    },
    {
      filename: `test.${ext}`,
      code: `
        // @vue/component
        export default { }
        // ${ext}
      `,
      languageOptions,
      errors: [makeError(3, 24, 3, 27)]
    },
    {
      filename: `test.${ext}`,
      code: `
        /* @vue/component */
        export default { }
        // ${ext}
      `,
      languageOptions,
      errors: [makeError(3, 24, 3, 27)]
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
      languageOptions,
      errors: [makeError(6, 24, 6, 27)]
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
      languageOptions,
      errors: [makeError(3, 24, 3, 27), makeError(5, 24, 5, 27)]
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
      languageOptions,
      errors: [makeError(3, 28, 3, 31), makeError(5, 24, 5, 27)]
    },
    {
      filename: `test.${ext}`,
      code: `
        export default { }
        // @vue/component
        export let foo = { }
        // ${ext}
      `,
      languageOptions,
      errors: [
        ...(ext === 'js' ? [] : [makeError(2, 24, 2, 27)]),
        makeError(4, 26, 4, 29)
      ]
    },
    {
      filename: `test.${ext}`,
      code: `
        let foo = { }
        // @vue/component
        export let bar = { }
        // ${ext}
      `,
      languageOptions,
      errors: [makeError(4, 26, 4, 29)]
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
      languageOptions,
      errors: [makeError(4, 13, 4, 16)]
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
      languageOptions,
      errors: [
        ...(ext === 'js' ? [] : [makeError(3, 24, 7, 10)]),
        makeError(6, 16, 6, 19)
      ]
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
      languageOptions,
      errors: [
        ...(ext === 'js' ? [] : [makeError(2, 24, 10, 10)]),
        makeError(8, 20, 8, 22)
      ]
    },
    {
      filename: `test.${ext}`,
      code: `export default defineComponent({})`,
      languageOptions,
      errors: [makeError(1, 32, 1, 34)]
    },
    {
      filename: `test.${ext}`,
      code: `export default defineNuxtComponent({})`,
      languageOptions,
      errors: [makeError(1, 36, 1, 38)]
    }
  ]
}

const ruleTester = new RuleTester()
ruleTester.run('vue-component', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `export default { }`,
      languageOptions
    },
    ...validTests('js'),
    ...validTests('jsx'),
    ...validTests('tsx'),
    ...validTests('vue')
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `export default { }`,
      languageOptions,
      errors: [makeError(1, 16, 1, 19)]
    },
    {
      filename: 'test.jsx',
      code: `export default { }`,
      languageOptions,
      errors: [makeError(1, 16, 1, 19)]
    },
    ...invalidTests('js'),
    ...invalidTests('jsx'),
    ...invalidTests('tsx'),
    ...invalidTests('vue')
  ]
})
