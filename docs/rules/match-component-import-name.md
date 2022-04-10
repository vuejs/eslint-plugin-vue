---
pageClass: rule-details
sidebarDepth: 0
title: vue/match-component-import-name
description: require the registered component name to match the imported component name
---
# vue/match-component-import-name

> require the registered component name to match the imported component name

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

By default, this rule will validate that the imported name matches the name of the components object property identifer. Note that "matches" means that the imported name matches either the PascalCase or kebab-case version of the components object property identifer. If you would like to enforce that it must match only one of PascalCase or kebab-case, use this rule in conjunction with the rule `component-definition-name-casing`.

<eslint-code-block :rules="{'vue/match-component-file-name': ['error']}">

```vue
<script>
export default {
  components: {
    /* ✓ GOOD */
    AppButton,
    AppButton: AppButton,

    /* ✗ BAD */
    SomeOtherName: AppButton,
    'app-button': AppButton
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/match-component-import-name": [
    "error",
    {
      "prefix": "prefix-"
    }
  ]
}
```

- `"prefix": ""` ... required prefix for registered component names. Default is set to an empty string (no prefix).

</eslint-code-block>

### `{ prefix: 'Prefix' }`

<eslint-code-block :rules="{'vue/match-component-file-name': ['error', { prefix: 'Prefix' }]}">

```vue
<script>
export default {
  components: {
    /* ✓ GOOD */
    PrefixAppButton: AppButton,
    'Prefix-app-button': AppButton,
    
    /* ✗ BAD */
    AppButton,
    SomeOtherName: AppButton,
    'app-button': AppButton,
  }
}
</script>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/match-component-import-name.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/match-component-import-name.js)
