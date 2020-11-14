---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-use-computed-property-like-method
description: disallow use computed property like method
---
# vue/no-use-computed-property-like-method
> disallow use computed property like method

## :book: Rule Details

This rule disallows to use computed property like method.  

<eslint-code-block :rules="{'vue/no-use-computed-property-like-method': ['error']}">

```vue
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
        dataFunction() {
          alert('dataFunction')
        }
      }
    },
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
      },
      propsFunction: {
        type: Function
      },
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
      },
      computedReturnDataFunction() {
        return this.dataFunction
      },

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
      },

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
      },
      computedReturnFunction() {
        const fn = () => alert('computedReturnFunction')
        return fn
      },

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
      computedReturnMethodsReturnFunction() {
        return this.methodsReturnFunction
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
      methodsReturnFunction() {
        const fn = () => alert('methodsReturnFunction')
        return fn
      },

      fn() {
        /* Reference data */
        /* ✓ GOOD */
        this.computedReturnDataString
        this.computedReturnDataNumber
        this.computedReturnDataObject
        this.computedReturnDataArray
        this.computedReturnDataBoolean
        this.computedReturnDataFunction
        this.computedReturnDataFunction()
        /* ✗ BAD */
        this.computedReturnDataString()
        this.computedReturnDataNumber()
        this.computedReturnDataObject()
        this.computedReturnDataArray()
        this.computedReturnDataBoolean()

        /* Reference props */
        /* ✓ GOOD */
        this.computedReturnPropsString
        this.computedReturnPropsNumber
        this.computedReturnPropsObject
        this.computedReturnPropsArray
        this.computedReturnPropsBoolean
        this.computedReturnPropsFunction
        this.computedReturnPropsFunction()
        /* ✗ BAD */
        this.computedReturnPropsString()
        this.computedReturnPropsNumber()
        this.computedReturnPropsObject()
        this.computedReturnPropsArray()
        this.computedReturnPropsBoolean()

        /* ✓ GOOD */
        this.computedReturnString
        this.computedReturnNumber
        this.computedReturnObject
        this.computedReturnArray
        this.computedReturnBoolean
        this.computedReturnFunction
        this.computedReturnFunction()
        /* ✗ BAD */
        this.computedReturnString()
        this.computedReturnNumber()
        this.computedReturnObject()
        this.computedReturnArray()
        this.computedReturnBoolean()

        /* Reference methods */
        /* ✓ GOOD */
        this.computedReturnMethodsReturnString
        this.computedReturnMethodsReturnNumber
        this.computedReturnMethodsReturnObject
        this.computedReturnMethodsReturnArray
        this.computedReturnMethodsReturnBoolean
        this.computedReturnMethodsReturnFunction
        this.computedReturnMethodsReturnFunction()
        /* ✗ BAD */
        this.computedReturnMethodsReturnString()
        this.computedReturnMethodsReturnNumber()
        this.computedReturnMethodsReturnObject()
        this.computedReturnMethodsReturnArray()
        this.computedReturnMethodsReturnBoolean()
      }
    }
  }
</script>
```

</eslint-code-block>

This rule can't check if props is used as array:

<eslint-code-block :rules="{'vue/no-use-computed-property-like-method': ['error']}">

```vue
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
      },
    },
    methods: {
      fn() {
        /* Reference props */
        /* ✓ GOOD */
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
        /* ✗ BAD */
        /* Nope. everything is GOOD!! */
      }
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

Nothing.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-use-computed-property-like-method.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-use-computed-property-like-method.js)
