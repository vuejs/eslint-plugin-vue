---
pageClass: rule-details
sidebarDepth: 0
title: vue/sort-keys
description: enforce sort-keys in a manner that is compatible with order-in-components
---
# vue/sort-keys
> enforce sort-keys within components after the top level details

This rule is almost the same rule as core [sorts-keys] rule but it will not error on top component properties allowing that order to be enforced with `order-in-components`.

## Options

```json
{
    "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}]
}
```

The 1st option is `"asc"` or `"desc"`.

* `"asc"` (default) - enforce properties to be in ascending order.
* `"desc"` - enforce properties to be in descending order.

The 2nd option is an object which has 3 properties.

* `caseSensitive` - if `true`, enforce properties to be in case-sensitive order. Default is `true`.
* `minKeys` - Specifies the minimum number of keys that an object should have in order for the object's unsorted keys to produce an error. Default is `2`, which means by default all objects with unsorted keys will result in lint errors.
* `natural` - if `true`, enforce properties to be in natural order. Default is `false`. Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically. So the number 10 comes after the number 3 in Natural Sorting.

While using this rule, you may disable the normal `sort-keys` rule.  This rule will apply to plain js files as well as Vue component scripts.

## :books: Further reading

- [sorts-keys]

[sorts-keys]: https://eslint.org/docs/rules/sorts-keys

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/sort-keys.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/sort-keys.js)
