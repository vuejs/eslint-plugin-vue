---
pageClass: rule-details
sidebarDepth: 0
title: vue/component-api-style
description: enforce component API style
since: v7.18.0
---
# vue/component-api-style

> enforce component API style

## :book: Rule Details

This rule aims to make the API style you use to define Vue components consistent in your project.

For example, if you want to allow only `<script setup>` and Composition API.  
(This is the default for this rule.)

<eslint-code-block :rules="{'vue/component-api-style': ['error']}">

```vue
<!-- ✓ GOOD -->
<script setup>
import { ref } from 'vue'
const msg = ref('Hello World!')
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/component-api-style': ['error']}">

```vue
<script>
import { ref } from 'vue'
export default {
  /* ✓ GOOD */
  setup() {
    const msg = ref('Hello World!')
    // ...
    return {
      msg,
      // ...
    }
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/component-api-style': ['error']}">

```vue
<script>
export default {
  /* ✗ BAD */
  data () {
    return {
      msg: 'Hello World!',
      // ...
    }
  },
  // ...
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/component-api-style": ["error",
    ["script-setup", "composition"] // "script-setup", "composition", "composition-vue2", or "options"
  ]
}
```

- Array options ... Defines the API styles you want to allow. Default is `["script-setup", "composition"]`. You can use the following values.
  - `"script-setup"` ... If set, allows [`<script setup>`](https://v3.vuejs.org/api/sfc-script-setup.html).
  - `"composition"` ... If set, allows [Composition API](https://v3.vuejs.org/api/composition-api.html) (not `<script setup>`).
  - `"composition-vue2"` ... If set, allows [Composition API for Vue 2](https://github.com/vuejs/composition-api) (not `<script setup>`). In particular, it allows `render`, `renderTracked` and `renderTriggered` alongside `setup`.
  - `"options"` ... If set, allows Options API.

### `["options"]`

<eslint-code-block :rules="{'vue/component-api-style': ['error', ['options']]}">

```vue
<script>
export default {
  /* ✓ GOOD */
  data () {
    return {
      msg: 'Hello World!',
      // ...
    }
  },
  // ...
}
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/component-api-style': ['error', ['options']]}">

```vue
<!-- ✗ BAD -->
<script setup>
import { ref } from 'vue'
const msg = ref('Hello World!')
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/component-api-style': ['error', ['options']]}">

```vue
<script>
import { ref } from 'vue'
export default {
  /* ✗ BAD */
  setup() {
    const msg = ref('Hello World!')
    // ...
    return {
      msg,
      // ...
    }
  }
}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.18.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/component-api-style.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/component-api-style.js)
