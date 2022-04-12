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

By default, this rule will validate that the imported name matches the name of the components object property identifer. Note that "matches" means that the imported name matches either the PascalCase or kebab-case version of the components object property identifer. If you would like to enforce that it must match only one of PascalCase or kebab-case, use this rule in conjunction with the rule [vue/component-definition-name-casing](./component-definition-name-casing.md).

<eslint-code-block :rules="{'vue/match-component-file-name': ['error']}">

```vue
<script>
export default {
  components: {
    /* ✓ GOOD */
    AppButton,
    AppButton: AppButton,
    'app-button': AppButton,

    /* ✗ BAD */
    SomeOtherName: AppButton,
    'some-other-name': AppButton
  }
}
</script>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/component-definition-name-casing](./component-definition-name-casing.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/match-component-import-name.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/match-component-import-name.js)
