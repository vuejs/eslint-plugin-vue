---
pageClass: rule-details
sidebarDepth: 0
title: vue/force-types-on-object-props
description: xxx
---
# vue/force-types-on-object-props

> xxx

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

Prevent missing type declaration of not primitive objects in a TypeScript projects.

Bad:

<eslint-code-block :rules="{'vue/force-types-on-object-props': ['error']}">

```js
export default {
  props: {
    prop: {
      type: Object,
    },
  },
}
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/force-types-on-object-props': ['error']}">

```ts
export default {
  props: {
    prop: {
      type: Array
    }
  }
}
```

</eslint-code-block>

Good:

<eslint-code-block :rules="{'vue/force-types-on-object-props': ['error']}">

```ts
export default {
  props: {
    prop: {
      type: Object as Props<Anything>,
    }
  }
}
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/force-types-on-object-props': ['error']}">

```ts
export default {
  props: {
    prop: {
      type: String, // or any other primitive type
    }
  }
}
```

</eslint-code-block>


### Options

Nothing.

## When Not To Use It

When you're not using TypeScript in the project****.

## Further Reading

Nothing

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/force-types-on-object-props.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/force-types-on-object-props.js)
