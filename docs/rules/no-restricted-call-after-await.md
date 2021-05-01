---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-restricted-call-after-await
description: disallow asynchronously called restricted methods
since: v7.4.0
---
# vue/no-restricted-call-after-await

> disallow asynchronously called restricted methods

## :book: Rule Details

This rule reports your restricted calls after the `await` expression.
In `setup()` function, you need to call your restricted functions synchronously.

## :wrench: Options

This rule takes a list of objects, where each object specifies a restricted module name and an exported name:

```json5
{
  "vue/no-restricted-call-after-await": ["error",
    { "module": "vue-i18n", "path": "useI18n" },
    { ... } // You can specify more...
  ]
}
```

<eslint-code-block :rules="{'vue/no-restricted-call-after-await': ['error', { module: 'vue-i18n', path: ['useI18n'] }]}">

```vue
<script>
import { useI18n } from 'vue-i18n'
export default {
  async setup() {
    /* ✓ GOOD */
    useI18n({})

    await doSomething()

    /* ✗ BAD */
    useI18n({})
  }
}
</script>
```

</eslint-code-block>

The following properties can be specified for the object.

- `module` ... Specify the module name.
- `path` ... Specify the imported name or the path that points to the method.
- `message` ... Specify an optional custom message.

For examples:

```json5
{
  "vue/no-restricted-call-after-await": ["error",
    { "module": "a", "path": "foo" },
    { "module": "b", "path": ["bar", "baz"] },
    { "module": "c" }, // Checks the default import.
    { "module": "d", "path": "default" }, // Checks the default import.
  ]
}
```

<eslint-code-block :rules="{'vue/no-restricted-call-after-await': ['error', { module: 'a', path: 'foo' }, { module: 'b', path: ['bar', 'baz'] }, { module: 'c' }, { module: 'd', path: 'default' }]}">

```vue
<script>
import { foo as fooOfA } from 'a'
import { bar as barOfB } from 'b'
import defaultOfC from 'c'
import defaultOfD from 'd'
export default {
  async setup() {
    await doSomething()

    /* ✗ BAD */
    fooOfA()
    barOfB.baz()
    defaultOfC()
    defaultOfD()
  }
}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.4.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-restricted-call-after-await.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-restricted-call-after-await.js)
