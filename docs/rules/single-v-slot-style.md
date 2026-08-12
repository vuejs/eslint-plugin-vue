---
pageClass: rule-details
sidebarDepth: 0
title: vue/single-v-slot-style
description: enforce a consistent style for components with a single `v-slot`
---

# vue/single-v-slot-style

> enforce a consistent style for components with a single `v-slot`

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> _**This rule has not been released yet.**_ </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

When a component is given exactly one slot and has no other children, the `<template>` wrapper around that slot is optional. The following pairs render the same output:

```vue
<template>
  <my-component>
    <template #foo>content</template>
  </my-component>
  <my-component #foo>content</my-component>
</template>
```

```vue
<template>
  <my-component>
    <template #default>content</template>
  </my-component>
  <my-component>content</my-component>
</template>
```

This rule enforces one of those styles consistently. By default it prefers the shorter form without the `<template>` wrapper.

<eslint-code-block fix :rules="{'vue/single-v-slot-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component #foo>content</my-component>
  <my-component>content</my-component>
  <my-component v-slot="{ bar }">{{ bar }}</my-component>

  <!-- ✗ BAD -->
  <my-component>
    <template #foo>content</template>
  </my-component>
  <my-component>
    <template #default>content</template>
  </my-component>
</template>
```

</eslint-code-block>

The rule only reports a component whose slot is its **only** significant child. A component that distributes several slots, or that mixes a slot with other content, is always left alone.

<eslint-code-block fix :rules="{'vue/single-v-slot-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component>
    <template #foo>foo</template>
    <template #bar>bar</template>
  </my-component>
  <my-component>
    <template #foo>foo</template>
    <span>other content</span>
  </my-component>
</template>
```

</eslint-code-block>

A `<template>` that carries anything besides the `v-slot` directive is never reported either, because removing the wrapper would change what the code means.

<eslint-code-block fix :rules="{'vue/single-v-slot-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component>
    <template #foo v-if="condition">content</template>
  </my-component>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/single-v-slot-style": ["error", {
    "namedSlotStyle": "any" | "with-wrapper" | "without-wrapper",
    "defaultSlotStyle": "any" | "with-wrapper" | "without-wrapper",
    "treatCommentsAsInsignificant": false
  }]
}
```

| Name | Type | Default Value | Description
|:-----|:-----|:--------------|:------------
| `namedSlotStyle` | `"any"` \| `"with-wrapper"` \| `"without-wrapper"` | `"without-wrapper"` | The style for a single named slot (E.g. `#foo`).
| `defaultSlotStyle` | `"any"` \| `"with-wrapper"` \| `"without-wrapper"` | inherited from `namedSlotStyle` | The style for a single default slot (E.g. `#default`).
| `treatCommentsAsInsignificant` | `boolean` | `false` | Whether HTML comments next to the slot are ignored when deciding if the slot is the only child.

Each style value means:

- `"without-wrapper"` ... put the `v-slot` directive on the component itself. E.g. `<my-component #foo>`.
- `"with-wrapper"` ... keep the `<template>` wrapper. E.g. `<my-component><template #foo></template></my-component>`.
- `"any"` ... do not report either form.

`defaultSlotStyle` inherits the value of `namedSlotStyle` when it is not set, so a single option value configures both.

A string option is supported as a shorthand, to be consistent with the similar [vue/v-slot-style](./v-slot-style.md) rule.

- `["error", "with-wrapper"]` is same as `["error", { namedSlotStyle: "with-wrapper", defaultSlotStyle: "with-wrapper" }]`.

### `"with-wrapper"`

<eslint-code-block fix :rules="{'vue/single-v-slot-style': ['error', 'with-wrapper']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component>
    <template #foo>content</template>
  </my-component>
  <my-component>
    <template #default="{ bar }">{{ bar }}</template>
  </my-component>

  <!-- ✗ BAD -->
  <my-component #foo>content</my-component>
  <my-component v-slot="{ bar }">{{ bar }}</my-component>
</template>
```

</eslint-code-block>

Note that a component which has no `v-slot` directive at all is never reported, so `"with-wrapper"` does not require you to wrap ordinary component content in `<template #default>`.

### `{ "defaultSlotStyle": "with-wrapper" }`

`defaultSlotStyle` can differ from `namedSlotStyle`, for example to unwrap named slots but keep the default slot explicit.

<eslint-code-block fix :rules="{'vue/single-v-slot-style': ['error', {namedSlotStyle: 'without-wrapper', defaultSlotStyle: 'with-wrapper'}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component #foo>content</my-component>
  <my-component>
    <template #default="{ bar }">{{ bar }}</template>
  </my-component>

  <!-- ✗ BAD -->
  <my-component>
    <template #foo>content</template>
  </my-component>
  <my-component v-slot="{ bar }">{{ bar }}</my-component>
</template>
```

</eslint-code-block>

### `{ "treatCommentsAsInsignificant": true }`

HTML comments are part of the rendered output, so by default a comment next to the slot makes the component ineligible. Set this option to `true` to ignore those comments and fold them into the slot content.

<eslint-code-block fix :rules="{'vue/single-v-slot-style': ['error', {treatCommentsAsInsignificant: true}]}">

```vue
<template>
  <!-- ✗ BAD -->
  <my-component>
    <!-- some comment -->
    <template #foo>content</template>
  </my-component>
</template>
```

</eslint-code-block>

With the default `false`, the same code is not reported.

<eslint-code-block fix :rules="{'vue/single-v-slot-style': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <my-component>
    <!-- some comment -->
    <template #foo>content</template>
  </my-component>
</template>
```

</eslint-code-block>

## :couple: Related Rules

- [vue/v-slot-style](./v-slot-style.md) — chooses between `#foo`, `v-slot:foo` and `v-slot` spellings. This rule chooses _where_ the directive goes, so the two are complementary. Its autofix emits the spellings that rule accepts with its default options.
- [vue/no-lone-template](./no-lone-template.md) — reports `<template>` elements without any directive. It never reports a slot wrapper, so it does not overlap with this rule.

### Conflict with `vue/valid-v-slot`

The default `"without-wrapper"` style for **named** slots contradicts the [vue/valid-v-slot](./valid-v-slot.md) rule, which is part of the `essential` preset configs.

[vue/valid-v-slot](./valid-v-slot.md) reports `Named slots must use '<template>' on a custom element.` for any named slot placed directly on a component, so with both rules enabled the following code is reported twice, with each rule asking for the opposite:

```vue
<template>
  <my-component #foo>content</my-component>
</template>
```

Vue 3 itself compiles `<my-component #foo>content</my-component>` and `<my-component><template #foo>content</template></my-component>` to exactly the same render function, so the unwrapped form works at runtime. See [vuejs/eslint-plugin-vue#1229](https://github.com/vuejs/eslint-plugin-vue/issues/1229), which tracks relaxing [vue/valid-v-slot](./valid-v-slot.md).

Until that is resolved, choose one of the following:

- keep [vue/valid-v-slot](./valid-v-slot.md) as-is and configure `{ "namedSlotStyle": "with-wrapper" }` or `{ "namedSlotStyle": "any" }`,
- or turn off [vue/valid-v-slot](./valid-v-slot.md) if you want the unwrapped form for named slots.

The **default** slot is not affected. All the forms this rule produces for it (`<my-component>`, `<my-component v-slot="{ bar }">` and `<template #default>`) are accepted by both [vue/valid-v-slot](./valid-v-slot.md) and [vue/v-slot-style](./v-slot-style.md) with their default settings.

## :books: Further Reading

- [Vue.js - Slots](https://vuejs.org/guide/components/slots.html)
- [Vue.js - Named slots](https://vuejs.org/guide/components/slots.html#named-slots)
- [Vue.js - Dynamic slot names](https://vuejs.org/guide/components/slots.html#dynamic-slot-names)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/single-v-slot-style.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/single-v-slot-style.test.ts)
