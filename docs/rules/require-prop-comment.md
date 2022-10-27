---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-prop-comment
description: require that props have a comment
---
# vue/require-prop-comment

> require that props have a comment

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>

## :book: Rule Details

This rule enforces that every prop has a comment that documents it.

<eslint-code-block :rules="{'vue/require-prop-comment': ['error']}">

```vue
<!-- ✓ GOOD -->
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    /**
     * a comment
     */
    a: Number,
    // b comment
    b: Number,
    // c
    // comment
    c: Number
  }
})
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-prop-comment': ['error']}">

```vue
<!-- ✗ BAD -->
<script setup>
const props = defineProps({
  a: Number,
})
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/require-prop-comment": ["error", {
    "type": "block"
  }]
}
```

- `type` ... Type of comment.Default is `"JSDoc"`
  - `"JSDoc"` ... Only JSDoc comment are allowed.
  - `"line"` ... Only line comment are allowed.
  - `"block"` ... Only block comment are allowed.
  - `"unlimited"` ... There is no limit to the type.

### `"type":"block"`

<eslint-code-block :rules="{'vue/require-prop-comment': ['error', {type: 'block'}]}">

<!-- ✓ GOOD -->
<script setup>
const props = defineProps({
  /*
   * a comment
   */
  a: Number,
})
</script>

<!-- ✗ BAD -->
<script setup>
const props = defineProps({
  /*
   * a comment
   */
  /*
   *a other comment
   */
  a: Number,
})
</script>

<!-- ✗ BAD -->
<script setup>
const props = defineProps({
  // a comment
  a: Number,
})
</script>

</eslint-code-block>

### `"type":"line"`

<eslint-code-block :rules="{'vue/require-prop-comment': ['error', {type: 'line'}]}">

<!-- ✓ GOOD -->
<script setup>
const props = defineProps({
  // a comment
  a: Number,
})
</script>

<!-- ✓ GOOD -->
<script setup>
const props = defineProps({
  // a first comment
  // a second comment
  // a other comment
  a: Number,
})
</script>

<!-- ✗ BAD -->
<script setup>
const props = defineProps({
  /**
   * a comment
   */
  a: Number,
})
</script>

</eslint-code-block>

### `"type":"unlimited"`

<eslint-code-block :rules="{'vue/require-prop-comment': ['error', {type: 'unlimited'}]}">

<!-- ✓ GOOD -->
<script setup>
const props = defineProps({
  /**
   * a comment
   */
  a: Number,
})
</script>

<!-- ✓ GOOD -->
<script setup>
const props = defineProps({
  // a first comment
  // a second comment
  // a other comment
  a: Number,
})
</script>

<!-- ✗ BAD -->
<script setup>
const props = defineProps({
  a: Number,
})
</script>

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-prop-comment.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-prop-comment.js)
