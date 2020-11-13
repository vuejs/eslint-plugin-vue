/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-use-computed-property-like-method')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

tester.run('no-use-computed-property-like-method', rule, {
  valid: [
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
              return this.computedReturnArray
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
    }
  ],
  invalid: [
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
    }
  ]
})
