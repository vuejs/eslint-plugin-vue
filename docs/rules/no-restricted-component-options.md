---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-component-options
description: disallow specific component option
---
# vue/no-restricted-component-options
> disallow specific component option

## :book: Rule Details

This rule allows you to specify component options that you don't want to use in your application.

## :wrench: Options

This rule takes a list of strings, where each string is a component option name or pattern to be restricted:

```json
{
  "vue/no-restricted-component-options": ["error", "init", "beforeCompile", "compiled", "activate", "ready", "/^(?:at|de)tached$/"]
}
```

<eslint-code-block :rules="{'vue/no-restricted-component-options': ['error', 'init', 'beforeCompile', 'compiled', 'activate', 'ready', '/^(?:at|de)tached$/']}">

```vue
<script>
export default {
  /* ✗ BAD */
  init: function () {},
  beforeCompile: function () {},
  compiled: function () {},
  activate: function () {},
  ready: function () {},
  attached: function () {},
  detached: function () {},

  /* ✓ GOOD */
  beforeCreate: function () {},
  activated: function () {},
  mounted: function () {},
}
</script>
```

</eslint-code-block>

Also, you can use an array to specify the path of object properties.

e.g. `[ "error", ["props", "/.*/", "twoWay"] ]`

<eslint-code-block :rules="{'vue/no-restricted-component-options': ['error' , ['props', '/.*/', 'twoWay'] ]}">

```vue
<script>
export default {
  props: {
    size: Number,
    name: {
      type: String,
      required: true,
      /* ✗ BAD */
      twoWay: true
    }
  }
}
</script>
```

</eslint-code-block>

You can use `"*"` to match all properties, including computed keys.

e.g. `[ "error", ["props", "*", "twoWay"] ]`

<eslint-code-block :rules="{'vue/no-restricted-component-options': ['error' , ['props', '*', 'twoWay'] ]}">

```vue
<script>
export default {
  props: {
    [foo + bar]: {
      type: String,
      required: true,
      /* ✗ BAD */
      twoWay: true
    }
  }
}
</script>
```

</eslint-code-block>

Alternatively, the rule also accepts objects.

```json
{
  "vue/no-restricted-component-options": ["error",
    {
      "name": "init",
      "message": "Use \"beforeCreate\" instead."
    },
    {
      "name": "/^(?:at|de)tached$/",
      "message": "\"attached\" and \"detached\" is deprecated."
    },
    {
      "name": ["props", "/.*/", "twoWay"],
      "message": "\"props.*.twoWay\" cannot be used."
    }
  ]
}
```

The following properties can be specified for the object.

- `name` ... Specify the component option name or pattern, or the path by its array.
- `message` ... Specify an optional custom message.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-component-options.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-component-options.js)
