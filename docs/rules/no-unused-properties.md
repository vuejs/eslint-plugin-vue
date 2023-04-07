---
pageClass: rule-details
sidebarDepth: 0
title: vue/no-unused-properties
description: disallow unused properties
since: v7.0.0
---
# vue/no-unused-properties

> disallow unused properties

## :book: Rule Details

This rule is aimed at eliminating unused properties.

::: warning Note
This rule cannot check for use of properties by other components (e.g. `mixins`, property access via `$refs`) and use in places where the scope cannot be determined. Some access to properties might be implied, for example accessing data or computed via a variable such as `this[varName]`. In this case, the default is to assume all properties, methods, etc. are 'used'. See the `unreferencedOptions` for a more strict interpretation of 'use' in these cases.
:::

<eslint-code-block :rules="{'vue/no-unused-properties': ['error']}">

```vue
<!-- ✓ GOOD -->
<template>
  <div>{{ count }}</div>
</template>
<script>
  export default {
    props: ['count']
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-unused-properties': ['error']}">

```vue
<!-- ✗ BAD (`count` property not used) -->
<template>
  <div>{{ cnt }}</div>
</template>
<script>
  export default {
    props: ['count']
  }
</script>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/no-unused-properties": ["error", {
    "groups": ["props"],
    "deepData": false,
    "ignorePublicMembers": false,
    "unreferencedOptions": []
  }]
}
```

- `groups` (`string[]`) Array of groups to search for properties. Default is `["props"]`. The value of the array is some of the following strings:
  - `"props"`
  - `"data"`
  - `"computed"`
  - `"methods"`
  - `"setup"`
- `deepData` (`boolean`) If `true`, the object of the property defined in `data` will be searched deeply. Default is `false`. Include `"data"` in `groups` to use this option.
- `ignorePublicMembers` (`boolean`) If `true`, members marked with a [JSDoc `/** @public */` tag](https://jsdoc.app/tags-public.html) will be ignored. Default is `false`.
- `unreferencedOptions` (`string[]`) Array of access methods that should be interpreted as leaving properties unreferenced. Currently, two such methods are available: `unknownMemberAsUnreferenced`, and `returnAsUnreferenced`. See examples below.

### `"groups": ["props", "data"]`

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'data']}]}">

```vue
<!-- ✓ GOOD -->
<script>
  export default {
    data() {
      return {
        count: null
      }
    },
    created() {
      this.count = 2
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'data']}]}">

```vue
<!-- ✗ BAD (`count` data not used) -->
<script>
  export default {
    data() {
      return {
        count: null
      }
    },
    created() {
      this.cnt = 2
    }
  }
</script>
```

</eslint-code-block>

### `{ "groups": ["props", "data"], "deepData": true }`

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'data'], deepData: true}]}">

```vue
<template>
  <Foo :param="state.used">
</template>
<script>
  export default {
    data() {
      return {
        state: {
          /* ✓ GOOD */
          used: null,
          /* ✗ BAD (`state.unused` data not used) */
          unused: null
        }
      }
    }
  }
</script>
```

</eslint-code-block>

### `"groups": ["props", "computed"]`

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'computed']}]}">

```vue
<!-- ✓ GOOD -->
<template>
  <p>{{ reversedMessage }}</p>
</template>
<script>
  export default {
    data() {
      return {
        message: 'Hello'
      }
    },
    computed: {
      reversedMessage() {
        return this.message.split('').reverse().join('')
      }
    }
  }
</script>
```

</eslint-code-block>

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'computed']}]}">

```vue
<!-- ✗ BAD (`reversedMessage` computed property not used) -->
<template>
  <p>{{ message }}</p>
</template>
<script>
  export default {
    data() {
      return {
        message: 'Hello'
      }
    },
    computed: {
      reversedMessage() {
        return this.message.split('').reverse().join('')
      }
    }
  }
</script>
```

</eslint-code-block>

### `{ "groups": ["props", "methods"], "ignorePublicMembers": true }`

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['props', 'methods'], ignorePublicMembers: true}]}">

```vue
<!-- ✓ GOOD -->
<template>
  <button @click="usedInTemplate()" />
</template>
<script>
  export default {
    methods: {
      /* ✓ GOOD */
      usedInTemplate() {},
      
      /* ✓ GOOD */
      /** @public */
      publicMethod() {},
      
      /* ✗ BAD */
      unusedMethod() {}
    }
  }
</script>
```

</eslint-code-block>

### `{ "groups": ["computed"], "unreferencedOptions": ["unknownMemberAsUnreferenced"] }`

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['computed'], unreferencedOptions: ['unknownMemberAsUnreferenced']}]}">

```vue
<template>
  
</template>
<script>
  export default {
    computed: {
      one () {
        return 1
      },
      two () {
        return 2
      }
    },
    methods: {
      handler () {
        /* ✓ GOOD - explicit access to computed */
        const a = this.one
        const i = 'two'
        /* ✗ BAD - unknown access via a variable, two will be reported as unreferenced */
        return this[i]
      },
    }
  }
</script>
```

</eslint-code-block>

### `{ "groups": ["computed"], "unreferencedOptions": ["returnAsUnreferenced"] }`

<eslint-code-block :rules="{'vue/no-unused-properties': ['error', {groups: ['computed'], unreferencedOptions: ['returnAsUnreferenced']}]}">

```vue
<template>
  
</template>
<script>
  export default {
    computed: {
      one () {
        return 1
      },
      two () {
        return 2
      }
    },
    methods: {
      handler () {
        /* ✓ GOOD - explicit access to computed */
        const a = this.one
        /* ✗ BAD - any property could be accessed by returning `this`, but two will still be reported as unreferenced */
        return this
      },
    }
  }
</script>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v7.0.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/no-unused-properties.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/no-unused-properties.js)
