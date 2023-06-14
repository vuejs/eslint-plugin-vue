---
pageClass: rule-details
sidebarDepth: 0
title: vue/max-lines-per-block
description: checking the maximum number of lines in Vue SFC blocks
---
# vue/max-lines-per-block

> checking the maximum number of lines in Vue SFC blocks

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule enforces a maximum number of lines per block, in order to aid in maintainability and reduce complexity.

## :wrench: Options

This rule takes an object, where you can specify the maximum number of lines in each type of SFC block and customize the line counting behavior.
The following properties can be specified for the object.

- `script` ... Specify the maximum number of lines in &lt;script&gt; block. Won't enforce limitation if not specified.
- `template` ... Specify the maximum number of lines in &lt;template&gt; block. Won't enforce limitation if not specified.
- `style` ... Specify the maximum number of lines in &lt;style&gt; block. Won't enforce limitation if not specified.
- `skipBlankLines` ... Ignore lines made up purely of whitespaces.

<eslint-code-block :rules="{'vue/max-lines-per-block': ['error', { template: 2 }]}">

```vue
<!-- BAD -->
<template>
  <div>
    hi
  </div>
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/max-lines-per-block': ['error', { template: 1 }]}">

```vue
<!-- GOOD -->
<script>
  console.log(1)
</script>
```

</eslint-code-block>


