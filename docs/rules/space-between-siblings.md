---
pageClass: rule-details
sidebarDepth: 0
title: vue/space-between-siblings
description: Insert newlines between sibling tags in template 
---
# vue/space-between-siblings

> Insert newlines between sibling tags in template

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule requires newlines between sibling HTML tags

<eslint-code-block fix :rules="{'vue/space-between-siblings': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>
    <ul>
      <li>
      </li>

      <li>
      </li>

      <li>
      </li>
    </ul>
  </div>
</template>
```

```vue
<!-- ✗ BAD -->
<template>
  <div>
    <ul>
      <li>
      </li>
      <li>
      </li>
      <li>
      </li>
    </ul>
  </div>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/space-between-siblings": ["error", {
      "ignoreNewlinesBefore": [],
      "ignoreNewlinesAfter": []
  }]
}
```

- `ignoreNewlinesBefore` ignores newlines before specified elements.
    default `[]`
- `ignoreNewlinesAfter` ignores newlines after specified elements.
    default `[]`

### `"ignoreNewlinesBefore": ["br"]`

<eslint-code-block fix :rules="{'vue/space-between-siblings': ['error', { ignoreNewlinesBefore: ['br'] }]}">

```vue
<template>
  <div>
    <ul>
      <li>
      </li>

      <li>
      </li>
      <br />

      <li>
      </li>
    </ul>
  </div>
</template>
```

</eslint-code-block>

### `"ignoreNewlinesAfter": ["br"]`

<eslint-code-block fix :rules="{'vue/space-between-siblings': ['error', { ignoreNewlinesAfter: ['br'] }]}">

```vue
<template>
  <div>
    <ul>
      <li>
      </li>

      <li>
      </li>
      
      <br />
      <li>
      </li>
    </ul>
  </div>
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/space-between-siblings.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/space-between-siblings.js)
