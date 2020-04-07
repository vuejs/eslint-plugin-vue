---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-potential-component-option-typo
description: disallow a potential typo in your component property
---
# vue/no-potential-component-option-typo
> disallow a potential typo in your component property

## :book: Rule Details

This Rule disallow a potential typo in your component options

**Here is the config**
```js
{'vue/no-potential-component-option-typo': ['error', {presets: ['all'], custom: ['test']}]}
```

<eslint-code-block :rules="{'vue/no-potential-component-option-typo': ['error', {presets: ['all'], custom: ['test']}]}">

```vue
<script>
export default {
  /* ✓ GOOD */
  props: {
    
  },
  /* × BAD */
  method: {

  },
  /* ✓ GOOD */
  data: {
    
  },
  /* × BAD */
  beforeRouteEnteR() {

  },
  /* × BAD due to custom option 'test'*/
  testt: {

  }
}
</script>
```

</eslint-code-block>

> we use editdistance to compare two string similarity, threshold is an option to control upper bound of editdistance to report

**Here is the another example about config option `threshold`**
```js
{'vue/no-potential-component-option-typo': ['error', {presets: ['vue', 'nuxt'], threshold: 5}]}
```

<eslint-code-block :rules="{'vue/no-potential-component-option-typo': ['error', {presets: ['vue', 'nuxt'], threshold: 5}]}">

```vue
<script>
export default {
  /* ✓ BAD, due to threshold is 5 */
  props: {
    
  },
  /* ✓ BAD, due to threshold is 5 */
  method: {

  },
  /* ✓ BAD, due to threshold is 5 */
  data: {
    
  },
  /* × GOOD, due to we don't choose vue-router preset or add a custom option */
  beforeRouteEnteR() {

  }
}
</script>
```

</eslint-code-block>

## :wrench: Options
```js
{
    "vue/no-unsed-vars": [{
      presets: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['all', 'vue', 'vue-router', 'nuxt']
        },
        uniqueItems: true,
        minItems: 0
      },
      custom: {
        type: 'array',
        minItems: 0,
        items: { type: 'string' },
        uniqueItems: true
      },
      threshold: {
        type: 'number',
        'minimum': 1
      }
    }]
}
```
- `presets` ... `enum type`, contains several common vue component option set, `['all']` is the same as `['vue', 'vue-router', 'nuxt']`. **default** `[]`
- `custom` ... `array type`, a list store your custom component option want to detect. **default** `[]`
- `threshold` ... `number type`, a number used to control the upper limit of the reported editing distance, we recommend don't change this config option, even if it is required, not bigger than `2`. **default** `1`
## :rocket: Suggestion
- We provide all the possible component option that editdistance between your vue component option and configuration options is greater than 0 and lessEqual than threshold

## :books: Further reading
- [Edit_distance](https://en.wikipedia.org/wiki/Edit_distance)
## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-potential-component-option-typo.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-potential-component-option-typo.js)
