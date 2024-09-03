---
pageClass: rule-details
sidebarDepth: 0
title: vue/max-template-depth
description: enforce maximum depth of template
since: v9.28.0
---

# vue/max-template-depth

> enforce maximum depth of template

## :book: Rule Details

This rule enforces a maximum depth of the template in a Vue SFC, in order to aid in maintainability and reduce complexity.

## :wrench: Options

This rule takes an object, where you can specify the maximum depth allowed in a Vue SFC template block.
There is one property that can be specified for the object.

- `maxDepth` ... Specify the maximum template depth `template` block.

### `{ maxDepth: 3 }`

<eslint-code-block :rules="{'vue/max-template-depth': ['error', { maxDepth: 3 }]}">

```vue
<!-- ✗ BAD -->
<template>
  <main-container>
    <child-component>
      <div />
    </child-component>
    <child-component>
      <nested-component>
        <div>
          <div />
        </div>
      </nested-component>
    </child-component>
  </main-container>
</template>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/max-template-depth': ['error', { maxDepth: 3 }]}">

```vue
<!-- ✓ GOOD -->
<template>
  <main-container>
    <child-component>
      <div />
    </child-component>
  </main-container>
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.28.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/max-template-depth.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/max-template-depth.js)
