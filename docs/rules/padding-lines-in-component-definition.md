---
pageClass: rule-details
sidebarDepth: 0
title: vue/padding-lines-in-component-definition
description: require or disallow padding lines in component definition
since: v9.9.0
---
# vue/padding-lines-in-component-definition

> require or disallow padding lines in component definition

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule requires or disallows blank lines in the component definition. Properly blank lines help developers improve code readability and code style flexibility.

<eslint-code-block fix :rules="{'vue/padding-lines-in-component-definition': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      count: 0,
    };
  }
}
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/padding-lines-in-component-definition': ['error']}">

```vue
<script>
/* ✓ GOOD */
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      count: 0,
    };
  }
}
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/padding-lines-in-component-definition": ["error", {
    "betweenOptions": "always" | "never",
    
    "withinOption": { 
      "props": {
        "betweenItems": "always" | "never" | "ignore",
        "withinEach": "always" | "never" | "ignore",
      } | "always" | "never" | "ignore", // shortcut to set both
      
      "data": {
        "betweenItems": "always" | "never" | "ignore",
        "withinEach": "always" | "never" | "ignore",
      } | "always" | "never" | "ignore" // shortcut to set both
        
      // ... all options
    } | "always" | "never" | "ignore",
    
    "groupSingleLineProperties": true | false
  }]
}
```

- `betweenOptions` ... Setting padding lines between options. default `always`
- `withinOption` ... Setting padding lines within option
  - `emits` ... Setting padding between lines between `emits` and `defineEmits`. default `always`
  - `props` ... Setting padding between lines between `props` and `defineProps`. default `always`
  - ...
- `groupSingleLineProperties` ... Setting groupings of multiple consecutive single-line properties (e.g. `name`, `inheritAttrs`), default `true`

### Group single-line properties

<eslint-code-block fix :rules="{'vue/padding-lines-in-component-definition': ['error', { betweenOptions: 'always', withinOption: 'always', groupSingleLineProperties: true}]}">

```vue
<script>
export default {
  name: 'GroupSingleLineProperties',
  inheritAttrs: false,
  
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  
  data() {
    return {
      count: 0,
    };
  }
}
</script>
```

</eslint-code-block>

### With custom options

<eslint-code-block fix :rules="{'vue/padding-lines-in-component-definition': ['error', { betweenOptions: 'always', withinOption: { props: { betweenItems: 'always', withinEach: 'never' }, customOption: { betweenItems: 'always', withinEach: 'ignore' } }, groupSingleLineProperties: true}]}">

```vue
<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  
  customOption: {
    foo: () => {
      return 'foo'
    },
    
    bar: () => {
      return 'bar'
    }
  },
}
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.9.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/padding-lines-in-component-definition.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/padding-lines-in-component-definition.js)
