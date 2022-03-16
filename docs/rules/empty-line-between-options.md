---
pageClass: rule-details
sidebarDepth: 0
title: vue/empty-line-between-options
description: enforce empty lines between top-level options
---
# vue/empty-line-between-options

> enforce empty lines between top-level options

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces consistent format of empty lines between Vue component options by either adding or removing them.

<eslint-code-block fix :rules="{'vue/empty-line-between-options': ['error', 'always']}">

```vue
<script>
  <!-- ✓ GOOD -->
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

  <!-- ✗ BAD -->
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

<eslint-code-block fix :rules="{'vue/empty-line-between-options': ['error', 'never']}">

```vue
<script>
  <!-- ✓ GOOD -->
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
  
  <!-- ✗ BAD -->
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
  "vue/empty-line-between-options": ["error", "always" | "never"]
}
```

- `"always"` (default) ... add an empty line between options.
- `"never"` ... remove empty lines between options.

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/empty-line-between-options.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/empty-line-between-options.js)
