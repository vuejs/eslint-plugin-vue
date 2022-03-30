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

This rule has some options.

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

By default, this rule will validate that the imported name is the same casing.

Case can be one of: `"kebab-case"` or `"PascalCase"`

An optional prefix can be provided that must be prepended to all imports.

If you are not registering components, this rule will be ignored.

<eslint-code-block :rules="{'vue/match-component-file-name': ['error']}">

```javascript
/* ✓ GOOD */
export default { components: { AppButton } }

/* ✗ BAD */
export default { components: { SomeOtherName: AppButton } }
export default { components: { 'app-button': AppButton } }
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/match-component-file-name': ['error', { case: 'kebab-case' }]}">

```javascript
/* ✓ GOOD */
export default { components: { 'app-button': AppButton } }

/* ✗ BAD */
export default { components: { SomeOtherName: AppButton } }
export default { components: { AppButton } }
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/match-component-file-name': ['error', { prefix: 'Prefix' }]}">

```javascript
/* ✓ GOOD */
export default { components: { PrefixAppButton: AppButton } }

/* ✗ BAD */
export default { components: { SomeOtherName: AppButton } }
export default { components: { 'app-button': AppButton } }
export default { components: { 'prefix-app-button': PrefixAppButton } }
```

</eslint-code-block>

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

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/match-component-import-name.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/match-component-import-name.js)
