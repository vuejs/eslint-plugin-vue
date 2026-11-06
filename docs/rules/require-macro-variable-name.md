---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-macro-variable-name
description: require a certain macro variable name
since: v9.15.0
---

# vue/require-macro-variable-name

> require a certain macro variable name

- :bulb: Some problems reported by this rule are manually fixable by editor [suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

## :book: Rule Details

This rule reports macro variables not corresponding to the specified name.

<eslint-code-block :rules="{'vue/require-macro-variable-name': ['error']}">

```vue
<!-- ✓ GOOD -->
<script setup>
const props = defineProps({ msg: String })
const modelValue = defineModel()
const title = defineModel('title')
const emit = defineEmits(['update:msg'])
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/require-macro-variable-name': ['error']}">

```vue
<!-- ✗ BAD  -->
<script setup>
const propsDefined = defineProps({ msg: String })
const model = defineModel()
const emitsDefined = defineEmits(['update:msg'])
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/require-macro-variable-name": ["error", {
    "defineModel": "modelValue",
    "defineProps": "props",
    "defineEmits": "emit",
    "defineSlots": "slots",
    "useSlots": "slots",
    "useAttrs": "attrs"
  }]
}
```

- `defineModel` - The name of the macro variable for `defineModel()` called without a model name. A named model such as `defineModel('title')` must be assigned to a variable with that name. default: `modelValue`
- `defineProps` - The name of the macro variable for `defineProps`. default: `props`
- `defineEmits` - The name of the macro variable for `defineEmits`. default: `emit`
- `defineSlots` - The name of the macro variable for `defineSlots`. default: `slots`
- `useSlots` - The name of the macro variable for `useSlots`. default: `slots`
- `useAttrs` - The name of the macro variable for `useAttrs`. default: `attrs`

### With custom macro variable names

<eslint-code-block :rules="{'vue/require-macro-variable-name': ['error', {
    'defineModel': 'modelCustom',
    'defineProps': 'propsCustom',
    'defineEmits': 'emitCustom',
    'defineSlots': 'slotsCustom',
    'useSlots': 'slotsCustom',
    'useAttrs': 'attrsCustom'
  }]}">

```vue
<script setup>
const modelCustom = defineModel()
const slotsCustom = defineSlots()
const attrsCustom = useAttrs()
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.15.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-macro-variable-name.ts)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-macro-variable-name.test.ts)
