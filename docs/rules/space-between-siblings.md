---
pageClass: rule-details
sidebarDepth: 0
title: vue/space-between-siblings
description: Require or disallow newlines between sibling tags in template
---
# vue/space-between-siblings

> Require or disallow newlines between sibling tags in template

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule requires or disallows newlines between sibling HTML tags

<eslint-code-block fix :rules="{'vue/space-between-siblings': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>
    <div></div>

    <div>
    </div>

    <div />
  </div>
</template>
```

```vue
<!-- ✗ BAD -->
<template>
  <div>
    <div></div>
    <div>
    </div>
    <div />
  </div>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/space-between-siblings": ["error", "always" | "never" , {
      "ignoreNewlinesBefore": [],
      "ignoreNewlinesAfter": []
  }]
}
```

- `always` (default) Requires one or more blank lines.
- `never` Disallows blank lines between tags
- `ignoreNewlinesBefore` ignores newlines before specified elements. Only applies when using `always`.
    default `[]`
- `ignoreNewlinesAfter` ignores newlines after specified elements. Only applies when using `always`.
    default `[]`

### `"never"`

<eslint-code-block fix :rules="{'vue/space-between-siblings': ['error', "never"]}">

```vue
<template>
  <div>
    <div></div>
    <div>
    </div>
    <div />
  </div>
</template>
```

</eslint-code-block>

### `"ignoreNewlinesBefore": ["br"]`

<eslint-code-block fix :rules="{'vue/space-between-siblings': ['error', { ignoreNewlinesBefore: ['br'] }]}">

```vue
<template>
  <div>
    <ul>
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
