---
pageClass: rule-details
sidebarDepth: 0
title: vue/match-component-import-name
description: require the registered component name to match the imported component name
---

# vue/match-component-import-name

> require the registered component name to match the imported component name

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>

This rule reports if the name of a registered component does not match its imported name.

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> **_This rule has not been released yet._** </badge>

## :book: Rule Details

By default, this rule will validate that the imported name is the same casing.

Case can be one of: `"kebab-case"` or `"PascalCase"`

An optional prefix can be provided that must be prepended to all imports.

If you are not registering components, this rule will be ignored.

## :wrench: Options

```json
{
  "vue/match-component-import-name": [
    "error",
    {
      "prefix": "prefix-",
      "case": "kebab-case"
    }
  ]
}
```

- `"prefix": ""` ... array of file extensions to be verified. Default is set to the empty string.
- `"case": "PascalCase"` ... one of "kebab-case" or "PascalCase", indicating the casing of the registered name. Default is set to `PascalCase`.

### `{}`

<eslint-code-block :rules="{'vue/match-component-file-name': ['error']}">

```javascript
/* ✓ GOOD */
export default { components: { AppButton } }

/* ✗ BAD */
export default { components: { SomeOtherName: AppButton } }
export default { components: { 'app-button': AppButton } }
```

</eslint-code-block>

### `{ case: 'kebab-case' }`

<eslint-code-block :rules="{'vue/match-component-file-name': ['error', { case: 'kebab-case' }]}">

```vue
<script>
export default {
  components: {
    /* ✓ GOOD */
    'app-button': AppButton,
    
    /* ✗ BAD */
    SomeOtherName: AppButton,
    AppButton
  }
}
</script>
```

</eslint-code-block>

### `{ prefix: 'Prefix' }`

<eslint-code-block :rules="{'vue/match-component-file-name': ['error', { prefix: 'Prefix' }]}">

```vue
<script>
export default {
  components: {
    /* ✓ GOOD */
    PrefixAppButton: AppButton,
    
    /* ✗ BAD */
    SomeOtherName: AppButton,
    'app-button': AppButton,
    'prefix-app-button': PrefixAppButton
  }
}
</script>
```

</eslint-code-block>

### `{ case: 'kebab-case', prefix: 'prefix-' }`

<eslint-code-block :rules="{'vue/match-component-file-name': ['error', { case: 'kebab-case', prefix: 'prefix-' }]}">

```vue
<script>
export default {
  components: {
    /* ✓ GOOD */
    'prefix-app-button': AppButton,
    
    /* ✗ BAD */
    SomeOtherName: AppButton,
    AppButton
  }
}
</script>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/match-component-import-name.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/match-component-import-name.js)
