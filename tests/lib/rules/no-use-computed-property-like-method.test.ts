/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */

import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-use-computed-property-like-method'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-use-computed-property-like-method', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data() {
            return {
              dataString: 'dataString',
              dataNumber: 10,
              dataObject: {
                inside: "inside"
              },
              dataArray: [1,2,3,4,5],
              dataBoolean: true,
            }
          },
          computed: {
            computedReturnDataString() {
              return this.dataString
            },
            computedReturnDataNumber() {
              return this.dataNumber
            },
            computedReturnDataObject() {
              return this.dataObject
            },
            computedReturnDataArray() {
              return this.dataArray
            },
            computedReturnDataBoolean() {
              return this.dataBoolean
            }
          },
          methods: {
            fn() {
              this.computedReturnDataString
              this.computedReturnDataNumber
              this.computedReturnDataObject
              this.computedReturnDataArray
              this.computedReturnDataBoolean
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data() {
            return {
              dataFunction() {
                alert('dataFunction')
              }
            }
          },
          computed: {
            computedReturnDataFunction() {
              return this.dataFunction
            }
          },
          methods: {
            fn() {
              this.computedReturnDataFunction
              this.computedReturnDataFunction()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            propsString: String,
            propsNumber: Number,
            propsObject: Object,
            propsArray: Array,
            propsBoolean: Boolean
          },
          computed: {
            computedReturnPropsString() {
              return this.propsString
            },
            computedReturnPropsNumber() {
              return this.propsNumber
            },
            computedReturnPropsObject() {
              return this.propsObject
            },
            computedReturnPropsArray() {
              return this.propsArray
            },
            computedReturnPropsBoolean() {
              return this.propsBoolean
            }
          },
          methods: {
            fn() {
              this.computedReturnPropsString
              this.computedReturnPropsNumber
              this.computedReturnPropsObject
              this.computedReturnPropsArray
              this.computedReturnPropsBoolean
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            propsString: {
              type: String
            },
            propsNumber: {
              type: Number
            },
            propsObject: {
              type: Object
            },
            propsArray: {
              type: Array
            },
            propsBoolean: {
              type: Boolean
            }
          },
          computed: {
            computedReturnPropsString() {
              return this.propsString
            },
            computedReturnPropsNumber() {
              return this.propsNumber
            },
            computedReturnPropsObject() {
              return this.propsObject
            },
            computedReturnPropsArray() {
              return this.propsArray
            },
            computedReturnPropsBoolean() {
              return this.propsBoolean
            }
          },
          methods: {
            fn() {
              this.computedReturnPropsString
              this.computedReturnPropsNumber
              this.computedReturnPropsObject
              this.computedReturnPropsArray
              this.computedReturnPropsBoolean
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            propsFunction: {
              type: Function
            },
          },
          computed: {
            computedReturnPropsFunction() {
              return this.propsFunction
            }
          },
          methods: {
            fn() {
              this.computedReturnPropsFunction
              this.computedReturnPropsFunction()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: [
            "propsString",
            "propsNumber",
            "propsObject",
            "propsArray",
            "propsBoolean",
            "propsFunction"
          ],
          computed: {
            computedReturnPropsString() {
              return this.propsString
            },
            computedReturnPropsNumber() {
              return this.propsNumber
            },
            computedReturnPropsObject() {
              return this.propsObject
            },
            computedReturnPropsArray() {
              return this.propsArray
            },
            computedReturnPropsBoolean() {
              return this.propsBoolean
            },
            computedReturnPropsFunction() {
              return this.propsFunction
            }
          },
          methods: {
            fn() {
              this.computedReturnPropsString
              this.computedReturnPropsString()

              this.computedReturnPropsNumber
              this.computedReturnPropsNumber()

              this.computedReturnPropsObject
              this.computedReturnPropsObject()

              this.computedReturnPropsArray
              this.computedReturnPropsArray()

              this.computedReturnPropsBoolean
              this.computedReturnPropsBoolean()

              this.computedReturnPropsFunction
              this.computedReturnPropsFunction()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnString() {
              return 'computedReturnString'
            },
            computedReturnNumber() {
              return 10
            },
            computedReturnObject() {
              return {
                inside: "inside"
              }
            },
            computedReturnArray() {
              return [1,2,3,4,5]
            },
            computedReturnBoolean() {
              return true
            }
          },
          methods: {
            fn() {
              this.computedReturnString
              this.computedReturnNumber
              this.computedReturnObject
              this.computedReturnArray
              this.computedReturnBoolean
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnFunction() {
              const fn = () => alert('computedReturnFunction')
              return fn
            }
          },
          methods: {
            fn() {
              this.computedReturnFunction
              this.computedReturnFunction()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnMethodsReturnString() {
              return this.methodsReturnString
            },
            computedReturnMethodsReturnNumber() {
              return this.methodsReturnNumber
            },
            computedReturnMethodsReturnObject() {
              return this.methodsReturnObject
            },
            computedReturnMethodsReturnArray() {
              return this.methodsReturnArray
            },
            computedReturnMethodsReturnBoolean() {
              return this.methodsReturnBoolean
            }
          },
          methods: {
            methodsReturnString() {
              return 'methodsReturnString'
            },
            methodsReturnNumber() {
              return 'methodsReturnNumber'
            },
            methodsReturnObject() {
              return {
                inside: "inside"
              }
            },
            methodsReturnArray() {
              return [1,2,3,4,5]
            },
            methodsReturnBoolean() {
              return true
            },
            fn() {
              this.computedReturnMethodsReturnString
              this.computedReturnMethodsReturnNumber
              this.computedReturnMethodsReturnObject
              this.computedReturnMethodsReturnArray
              this.computedReturnMethodsReturnBoolean
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnMethodsReturnFunction() {
              return this.methodsReturnFunction
            }
          },
          methods: {
            methodsReturnFunction() {
              const fn = () => alert('methodsReturnFunction')
              return fn
            },
            fn() {
              this.computedReturnMethodsReturnFunction
              this.computedReturnMethodsReturnFunction()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          methods: {
            fn() {
              this.foo()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnArray() {
              return [1,2,3,4,5]
            },
            computedReturnArray2() {
              return [1,2,3,4,5]
            },
            computedReturnComputedReturnString() {
              return this.computedReturnArray.map(() => this.computedReturnArray2)
            }
          }
        }
      </script>
      `
    },
    {
      //https://github.com/vuejs/eslint-plugin-vue/issues/1649
      filename: 'test.vue',
      code: `
      <script>
      import { mapGetters } from 'vuex'

      export default {
        props: [\`user\`],
        computed: {
          ...mapGetters(\`auth\`, [\`statusForUser\`]),
          status () {
            return this.statusForUser(this.user)
          },
        },
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const s = s
        export default {
          props: {
            str: s
          },
          computed: {
            x() {
              const str = this.str
              return str
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const s = String
        export default {
          computed: {
            x() {
              return s
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            x() {
              return this.x
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            x() {
              return this.foo()
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            },
            foo () {
              return this.foo()
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            val: b ? [String] : Function
          },
          computed: {
            x() {
              return this.val
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `
    },
    {
      // expression may be a function: https://github.com/vuejs/eslint-plugin-vue/issues/2037
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            propsFunction: {
              type: Function,
              default: undefined
            },
            propsNumber: {
              type: Number,
            }
          },
          computed: {
            computedReturnPropsFunction() {
              return this.propsFunction ? this.propsFunction : this.propsFunctionDefault
            },
            computedReturnMaybeFunction() {
              return this.propsFunction ? this.propsFunction : this.propsNumber
            }
          },
          methods: {
            fn() {
              this.computedReturnPropsFunction
              this.computedReturnPropsFunction()
              this.computedReturnMaybeFunction
              this.computedReturnMaybeFunction()
            },
            propsFunctionDefault() {}
          }
        }
      </script>
      `
    },
    {
      // expression may be a function: https://github.com/vuejs/eslint-plugin-vue/issues/2037
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            propsFunction: {
              type: Function,
              default: undefined
            },
            propsNumber: {
              type: Number,
            }
          },
          computed: {
            computedReturnPropsFunction() {
              return this.propsFunction || this.propsFunctionDefault
            },
            computedReturnMaybeFunction() {
              return this.propsFunction || this.propsNumber
            }
          },
          methods: {
            fn() {
              this.computedReturnPropsFunction
              this.computedReturnPropsFunction()
              this.computedReturnMaybeFunction
              this.computedReturnMaybeFunction()
            },
            propsFunctionDefault() {}
          }
        }
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data() {
            return {
              dataString: 'dataString',
              dataNumber: 10,
              dataObject: {
                inside: "inside"
              },
              dataArray: [1,2,3,4,5],
              dataBoolean: true,
            }
          },
          computed: {
            computedReturnDataString() {
              return this.dataString
            },
            computedReturnDataNumber() {
              return this.dataNumber
            },
            computedReturnDataObject() {
              return this.dataObject
            },
            computedReturnDataArray() {
              return this.dataArray
            },
            computedReturnDataBoolean() {
              return this.dataBoolean
            }
          },
          methods: {
            fn() {
              this.computedReturnDataString()
              this.computedReturnDataNumber()
              this.computedReturnDataObject()
              this.computedReturnDataArray()
              this.computedReturnDataBoolean()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnDataString instead of this.computedReturnDataString().',
          line: 34,
          column: 15,
          endLine: 34,
          endColumn: 46
        },
        {
          message:
            'Use this.computedReturnDataNumber instead of this.computedReturnDataNumber().',
          line: 35,
          column: 15,
          endLine: 35,
          endColumn: 46
        },
        {
          message:
            'Use this.computedReturnDataObject instead of this.computedReturnDataObject().',
          line: 36,
          column: 15,
          endLine: 36,
          endColumn: 46
        },
        {
          message:
            'Use this.computedReturnDataArray instead of this.computedReturnDataArray().',
          line: 37,
          column: 15,
          endLine: 37,
          endColumn: 45
        },
        {
          message:
            'Use this.computedReturnDataBoolean instead of this.computedReturnDataBoolean().',
          line: 38,
          column: 15,
          endLine: 38,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            propsString: String,
            propsNumber: Number,
            propsObject: Object,
            propsArray: Array,
            propsBoolean: Boolean
          },
          computed: {
            computedReturnPropsString() {
              return this.propsString
            },
            computedReturnPropsNumber() {
              return this.propsNumber
            },
            computedReturnPropsObject() {
              return this.propsObject
            },
            computedReturnPropsArray() {
              return this.propsArray
            },
            computedReturnPropsBoolean() {
              return this.propsBoolean
            }
          },
          methods: {
            fn() {
              this.computedReturnPropsString()
              this.computedReturnPropsNumber()
              this.computedReturnPropsObject()
              this.computedReturnPropsArray()
              this.computedReturnPropsBoolean()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnPropsString instead of this.computedReturnPropsString().',
          line: 30,
          column: 15,
          endLine: 30,
          endColumn: 47
        },
        {
          message:
            'Use this.computedReturnPropsNumber instead of this.computedReturnPropsNumber().',
          line: 31,
          column: 15,
          endLine: 31,
          endColumn: 47
        },
        {
          message:
            'Use this.computedReturnPropsObject instead of this.computedReturnPropsObject().',
          line: 32,
          column: 15,
          endLine: 32,
          endColumn: 47
        },
        {
          message:
            'Use this.computedReturnPropsArray instead of this.computedReturnPropsArray().',
          line: 33,
          column: 15,
          endLine: 33,
          endColumn: 46
        },
        {
          message:
            'Use this.computedReturnPropsBoolean instead of this.computedReturnPropsBoolean().',
          line: 34,
          column: 15,
          endLine: 34,
          endColumn: 48
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            propsString: {
              type: String
            },
            propsNumber: {
              type: Number
            },
            propsObject: {
              type: Object
            },
            propsArray: {
              type: Array
            },
            propsBoolean: {
              type: Boolean
            }
          },
          computed: {
            computedReturnPropsString() {
              return this.propsString
            },
            computedReturnPropsNumber() {
              return this.propsNumber
            },
            computedReturnPropsObject() {
              return this.propsObject
            },
            computedReturnPropsArray() {
              return this.propsArray
            },
            computedReturnPropsBoolean() {
              return this.propsBoolean
            }
          },
          methods: {
            fn() {
              this.computedReturnPropsString()
              this.computedReturnPropsNumber()
              this.computedReturnPropsObject()
              this.computedReturnPropsArray()
              this.computedReturnPropsBoolean()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnPropsString instead of this.computedReturnPropsString().',
          line: 40,
          column: 15,
          endLine: 40,
          endColumn: 47
        },
        {
          message:
            'Use this.computedReturnPropsNumber instead of this.computedReturnPropsNumber().',
          line: 41,
          column: 15,
          endLine: 41,
          endColumn: 47
        },
        {
          message:
            'Use this.computedReturnPropsObject instead of this.computedReturnPropsObject().',
          line: 42,
          column: 15,
          endLine: 42,
          endColumn: 47
        },
        {
          message:
            'Use this.computedReturnPropsArray instead of this.computedReturnPropsArray().',
          line: 43,
          column: 15,
          endLine: 43,
          endColumn: 46
        },
        {
          message:
            'Use this.computedReturnPropsBoolean instead of this.computedReturnPropsBoolean().',
          line: 44,
          column: 15,
          endLine: 44,
          endColumn: 48
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnString() {
              return 'computedReturnString'
            },
            computedReturnNumber() {
              return 10
            },
            computedReturnObject() {
              return {
                inside: "inside"
              }
            },
            computedReturnArray() {
              return [1,2,3,4,5]
            },
            computedReturnBoolean() {
              return true
            }
          },
          methods: {
            fn() {
              this.computedReturnString()
              this.computedReturnNumber()
              this.computedReturnObject()
              this.computedReturnArray()
              this.computedReturnBoolean()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnString instead of this.computedReturnString().',
          line: 25,
          column: 15,
          endLine: 25,
          endColumn: 42
        },
        {
          message:
            'Use this.computedReturnNumber instead of this.computedReturnNumber().',
          line: 26,
          column: 15,
          endLine: 26,
          endColumn: 42
        },
        {
          message:
            'Use this.computedReturnObject instead of this.computedReturnObject().',
          line: 27,
          column: 15,
          endLine: 27,
          endColumn: 42
        },
        {
          message:
            'Use this.computedReturnArray instead of this.computedReturnArray().',
          line: 28,
          column: 15,
          endLine: 28,
          endColumn: 41
        },
        {
          message:
            'Use this.computedReturnBoolean instead of this.computedReturnBoolean().',
          line: 29,
          column: 15,
          endLine: 29,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnString() {
              return 'computedReturnString'
            },
            computedReturnComputedReturnString() {
              return this.computedReturnString
            }
          },
          methods: {
            fn() {
              this.computedReturnComputedReturnString()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnComputedReturnString instead of this.computedReturnComputedReturnString().',
          line: 14,
          column: 15,
          endLine: 14,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnObject() {
              return {
                insideFn() {
                  return "insideFn"
                }
              }
            },
          },
          methods: {
            fn() {
              this.computedReturnObject().insideFn
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnObject instead of this.computedReturnObject().',
          line: 15,
          column: 15,
          endLine: 15,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnNothing() {
              return
            },
          },
          methods: {
            fn() {
              this.computedReturnNothing()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnNothing instead of this.computedReturnNothing().',
          line: 11,
          column: 15,
          endLine: 11,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnString() {
              return 'computedReturnString'
            },
            computedReturnComputedReturnString() {
              return this.computedReturnString()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnString instead of this.computedReturnString().',
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            computedReturnArray() {
              return [1,2,3,4,5]
            },
            computedReturnArray2() {
              return [1,2,3,4,5]
            },
            computedReturnComputedReturnString() {
              return this.computedReturnArray.map([...this.computedReturnArray(), ...this.computedReturnArray2()])
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnArray instead of this.computedReturnArray().',
          line: 12,
          column: 55,
          endLine: 12,
          endColumn: 81
        },
        {
          message:
            'Use this.computedReturnArray2 instead of this.computedReturnArray2().',
          line: 12,
          column: 86,
          endLine: 12,
          endColumn: 113
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            str: String
          },
          computed: {
            x() {
              const str = this.str
              return str
            },
            y() {
              return
            }
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message: 'Use this.x instead of this.x().',
          line: 19,
          column: 15,
          endLine: 19,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const s = String
        export default {
          props: {
            str: s
          },
          computed: {
            x() {
              const str = this.str
              return str
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message: 'Use this.x instead of this.x().',
          line: 17,
          column: 15,
          endLine: 17,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const s = String
        export default {
          props: {
            val: [s, Number]
          },
          computed: {
            x() {
              return this.val
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message: 'Use this.x instead of this.x().',
          line: 16,
          column: 15,
          endLine: 16,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            x: {
              get: () => 42
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message: 'Use this.x instead of this.x().',
          line: 12,
          column: 15,
          endLine: 12,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            x() {
              return b ? this.foo() : 'str'
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            },
            foo () {
              return 42
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message: 'Use this.x instead of this.x().',
          line: 12,
          column: 15,
          endLine: 12,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            val: b ? [String] : Number
          },
          computed: {
            x() {
              return this.val
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message: 'Use this.x instead of this.x().',
          line: 15,
          column: 15,
          endLine: 15,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        let t = [String]
        if (b) {
          t = Number
        }
        let t2 = [String]
        if (b) {
          t2 = Function
        }
        export default {
          props: {
            val: t,
            f: t2
          },
          computed: {
            x() {
              return this.val
            },
            y() {
              return this.f
            },
          },
          methods: {
            fn() {
              const vm = this
              vm.x()
              vm.y()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message: 'Use this.x instead of this.x().',
          line: 27,
          column: 15,
          endLine: 27,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{x()}}
        {{y()}}
        {{y(x)}}
      </template>
      <script>
        export default {
          computed: {
            x() {
              return 42
            },
            y() {
              return String
            },
          }
        }
      </script>
      `,
      errors: [
        {
          message: 'Use x instead of x().',
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 14
        }
      ]
    },
    {
      // expression may be a function: https://github.com/vuejs/eslint-plugin-vue/issues/2037
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            propsNumber: {
              type: Number
            },
            propsString: {
              type: String
            },
          },
          computed: {
            computedReturnNotFunction1() {
              return this.propsString ? this.propsString : this.propsNumber
            },
            computedReturnNotFunction2() {
              return this.propsString || this.propsNumber
            },
          },
          methods: {
            fn() {
              this.computedReturnNotFunction1()
              this.computedReturnNotFunction2()
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'Use this.computedReturnNotFunction1 instead of this.computedReturnNotFunction1().',
          line: 22,
          column: 15,
          endLine: 22,
          endColumn: 48
        },
        {
          message:
            'Use this.computedReturnNotFunction2 instead of this.computedReturnNotFunction2().',
          line: 23,
          column: 15,
          endLine: 23,
          endColumn: 48
        }
      ]
    }
  ]
})
