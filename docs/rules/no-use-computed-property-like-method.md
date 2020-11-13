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
<template>
  <div>
  </div>
</template>

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
        console.log(this.dataObject.inside);
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
