---
pageClass: rule-details
sidebarDepth: 0
title: vue/max-lines-per-block
description: enforce maximum number of lines in Vue SFC blocks
since: v9.15.0
---
# vue/max-lines-per-block

> enforce maximum number of lines in Vue SFC blocks

## :book: Rule Details

This rule enforces a maximum number of lines per block, in order to aid in maintainability and reduce complexity.

## :wrench: Options

This rule takes an object, where you can specify the maximum number of lines in each type of SFC block and customize the line counting behavior.
The following properties can be specified for the object.

- `script` ... Specify the maximum number of lines in `<script>` block. Won't enforce limitation if not specified.
- `template` ... Specify the maximum number of lines in `<template>` block. Won't enforce limitation if not specified.
- `style` ... Specify the maximum number of lines in `<style>` block. Won't enforce limitation if not specified.
- `skipBlankLines` ... Ignore lines made up purely of whitespaces.

### `{ template: 2 }`

<eslint-code-block :rules="{'vue/max-lines-per-block': ['error', { template: 2 }]}">

```vue
<!-- ✗ BAD -->
<template>
  <div>
    hi
  </div>
</template>
```

</eslint-code-block>

### `{ script: 1, skipBlankLines: true }`

<eslint-code-block :rules="{'vue/max-lines-per-block': ['error', { script: 1, skipBlankLines: true }]}">

```vue
<!-- ✓ GOOD -->
<script>

  console.log(1)
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.15.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/max-lines-per-block.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/max-lines-per-block.js)
