# disallow variable declarations from shadowing variables declared in the outer scope (vue/no-template-shadow)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.

`no-template-shadow` should report variable definitions of v-for directives or scope attributes if those shadows the variables in parent scopes.

## :book: Rule Details

This rule aims to eliminate shadowed variable declarations of v-for directives or scope attributes.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
   <div>
     <div v-for="i in 5">
       <div v-for="i in 10"></div>
     </div>
   </div>
 </template>
 ```

 ```html
<template>
   <div>
     <div v-for="i in 5"></div>
   </div>
 </template>
<script>
  export default {
    data () {
      return {
        i: 10
      }
    }
  }
</script>
 ```

:+1: Examples of **correct** code for this rule:

```html
<template>
  <div v-for="i in 5"></div>
  <div v-for="i in 5"></div>
</template>
<script>
  export default {
    computed: {
      f () { }
    }
  }
</script>
```

## :wrench: Options

Nothing.
