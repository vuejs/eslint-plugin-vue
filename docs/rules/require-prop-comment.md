---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-prop-comment
description: require props to have a comment
since: v9.8.0
---
# vue/require-prop-comment

> require props to have a comment

## :book: Rule Details

This rule enforces that every prop has a comment that documents it.

<eslint-code-block :rules="{'vue/require-prop-comment': ['error']}">

```vue
<script>
export default defineComponent({
  props: {
    // ✓ GOOD

    /** JSDoc comment */
    a: Number,

    // ✗ BAD

    // line comment
    b: Number,

    /* block comment */
    c: Number,

    d: Number,
  }
})
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/require-prop-comment": ["error", {
    "type": "JSDoc"
  }]
}
```

- `type` ... Type of comment. Default is `"JSDoc"`
  - `"JSDoc"` ... Only JSDoc comment are allowed.
  - `"line"` ... Only line comment are allowed.
  - `"block"` ... Only block comment are allowed.
  - `"any"` ... All comment types are allowed.

### `"type": "block"`

<eslint-code-block :rules="{'vue/require-prop-comment': ['error', {type: 'block'}]}">

```vue
<script setup>
// ✓ GOOD
const goodProps = defineProps({
  /* block comment */
  a: Number,
})

// ✗ BAD
const badProps = defineProps({
  /** JSDoc comment */
  b: Number,

  // line comment
  c: Number,

  d: Number,
})
</script>
```

</eslint-code-block>

### `"type": "line"`

<eslint-code-block :rules="{'vue/require-prop-comment': ['error', {type: 'line'}]}">

```vue
<script setup>
// ✓ GOOD
const goodProps = defineProps({
  // line comment
  a: Number,
})

// ✗ BAD
const badProps = defineProps({
  /** JSDoc comment */
  b: Number,

  /* block comment */
  c: Number,

  d: Number,
})
</script>
```

</eslint-code-block>

### `"type": "any"`

<eslint-code-block :rules="{'vue/require-prop-comment': ['error', {type: 'any'}]}">

```vue
<script setup>
// ✓ GOOD
const goodProps = defineProps({
  /** JSDoc comment */
  a: Number,

  /* block comment */
  b: Number,

  // line comment
  c: Number,
})

// ✗ BAD
const badProps = defineProps({
  d: Number,
})
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.8.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-prop-comment.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-prop-comment.js)
