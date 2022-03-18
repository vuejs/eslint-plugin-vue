---
pageClass: rule-details
sidebarDepth: 0
title: vue/padding-line-between-component-options
description: require or disallow padding lines between top-level component options
---
# vue/padding-line-between-component-options

> require or disallow padding lines between top-level component options

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces consistent format of empty lines between Vue component options by either adding or removing them.

<eslint-code-block fix :rules="{'vue/padding-line-between-component-options': ['error', 'always']}">

```vue
<script>
  /* ✓ GOOD */
  export default {
    name: 'a-button',

    /**
     * Ceci n'est pas un commentaire
     * @return {{}}
     */
    data() {
      return {
        // ...
      }
    },
    
    computed: {
      // ...
    }
  }
</script>
```

```vue
<script>
  /* ✗ BAD */
  export default {
    name: 'a-button',
    /**
     * Ceci n'est pas un commentaire
     * @return {{}}
     */
    data() {
      return {
        // ...
      }
    },
    computed: {
      // ...
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block fix :rules="{'vue/padding-line-between-component-options': ['error', 'never']}">

```vue
<script>
  /* ✓ GOOD */
  export default {
    name: 'a-button',
    /**
     * Ceci n'est pas un commentaire
     * @return {{}}
     */
    data() {
      return {
        // ...
      }
    },
    computed: {
      // ...
    }
  }
</script>
```

```vue
<script>
  /* ✗ BAD */
  export default {
    name: 'a-button',
    
    /**
     * Ceci n'est pas un commentaire
     * @return {{}}
     */
    data() {
      return {
        // ...
      }
    },

    computed: {
      // ...
    }
  }
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/padding-line-between-component-options": ["error", "always" | "never"]
}
```

- `"always"` (default) ... add an empty line between options.
- `"never"` ... remove empty lines between options.

## :couple: Related Rules

- [vue/padding-line-between-blocks](./padding-line-between-blocks.md)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/padding-line-between-component-options.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/padding-line-between-component-options.js)
