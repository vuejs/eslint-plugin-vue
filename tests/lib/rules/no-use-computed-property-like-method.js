/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-use-computed-property-like-method')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
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
        'Use this.computedReturnDataString instead of this.computedReturnDataString().',
        'Use this.computedReturnDataNumber instead of this.computedReturnDataNumber().',
        'Use this.computedReturnDataObject instead of this.computedReturnDataObject().',
        'Use this.computedReturnDataArray instead of this.computedReturnDataArray().',
        'Use this.computedReturnDataBoolean instead of this.computedReturnDataBoolean().'
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
        'Use this.computedReturnPropsString instead of this.computedReturnPropsString().',
        'Use this.computedReturnPropsNumber instead of this.computedReturnPropsNumber().',
        'Use this.computedReturnPropsObject instead of this.computedReturnPropsObject().',
        'Use this.computedReturnPropsArray instead of this.computedReturnPropsArray().',
        'Use this.computedReturnPropsBoolean instead of this.computedReturnPropsBoolean().'
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
        'Use this.computedReturnPropsString instead of this.computedReturnPropsString().',
        'Use this.computedReturnPropsNumber instead of this.computedReturnPropsNumber().',
        'Use this.computedReturnPropsObject instead of this.computedReturnPropsObject().',
        'Use this.computedReturnPropsArray instead of this.computedReturnPropsArray().',
        'Use this.computedReturnPropsBoolean instead of this.computedReturnPropsBoolean().'
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
        'Use this.computedReturnString instead of this.computedReturnString().',
        'Use this.computedReturnNumber instead of this.computedReturnNumber().',
        'Use this.computedReturnObject instead of this.computedReturnObject().',
        'Use this.computedReturnArray instead of this.computedReturnArray().',
        'Use this.computedReturnBoolean instead of this.computedReturnBoolean().'
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
        'Use this.computedReturnComputedReturnString instead of this.computedReturnComputedReturnString().'
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
        'Use this.computedReturnObject instead of this.computedReturnObject().'
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
        'Use this.computedReturnNothing instead of this.computedReturnNothing().'
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
        'Use this.computedReturnString instead of this.computedReturnString().'
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
        'Use this.computedReturnArray instead of this.computedReturnArray().',
        'Use this.computedReturnArray2 instead of this.computedReturnArray2().'
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
      errors: ['Use this.x instead of this.x().']
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
      errors: ['Use this.x instead of this.x().']
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
      errors: ['Use this.x instead of this.x().']
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
      errors: ['Use this.x instead of this.x().']
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
      errors: ['Use this.x instead of this.x().']
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
      errors: ['Use this.x instead of this.x().']
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
      errors: ['Use this.x instead of this.x().']
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
      errors: ['Use x instead of x().']
    }
  ]
})
