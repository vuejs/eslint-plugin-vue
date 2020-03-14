---
pageClass: rule-details
sidebarDepth: 0
title: vue/attributes-order
description: enforce order of attributes
---
# vue/attributes-order
> enforce order of attributes

- :gear: This rule is included in `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce ordering of component attributes. The default order is specified in the [Vue styleguide](https://vuejs.org/v2/style-guide/#Element-attribute-order-recommended) and is:

- `DEFINITION`
  e.g. 'is'
- `LIST_RENDERING`
  e.g. 'v-for item in items'
- `CONDITIONALS`
  e.g. 'v-if', 'v-else-if', 'v-else', 'v-show', 'v-cloak'
- `RENDER_MODIFIERS`
  e.g. 'v-once', 'v-pre'
- `GLOBAL`
  e.g. 'id'
- `UNIQUE`
  e.g. 'ref', 'key', 'v-slot', 'slot'
- `TWO_WAY_BINDING`
  e.g. 'v-model'
- `OTHER_DIRECTIVES`
  e.g. 'v-custom-directive'
- `OTHER_ATTR`
  e.g. 'custom-prop="foo"', 'v-bind:prop="foo"', ':prop="foo"'
- `EVENTS`
  e.g. '@click="functionCall"', 'v-on="event"'
- `CONTENT`
  e.g. 'v-text', 'v-html'

### the default order

<eslint-code-block fix :rules="{'vue/attributes-order': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div
    is="header"
    v-for="item in items"
    v-if="!visible"
    v-once
    id="uniqueID"
    ref="header"
    v-model="headerData"
    my-prop="prop"
    @click="functionCall"
    v-text="textContent">
  </div>
  <div
    v-for="item in items"
    v-if="!visible"
    prop-one="prop"
    :prop-two="prop"
    prop-three="prop"
    @click="functionCall"
    v-text="textContent">
  </div>
  <div
    prop-one="prop"
    :prop-two="prop"
    prop-three="prop">
  </div>

  <!-- ✗ BAD -->
  <div
    ref="header"
    v-for="item in items"
    v-once
    id="uniqueID"
    v-model="headerData"
    my-prop="prop"
    v-if="!visible"
    is="header"
    @click="functionCall"
    v-text="textContent">
  </div>
</template>
```

</eslint-code-block>

## :wrench: Options
```json
{
  "vue/attributes-order": ["error", {
    "order": [
      "DEFINITION",
      "LIST_RENDERING",
      "CONDITIONALS",
      "RENDER_MODIFIERS",
      "GLOBAL",
      "UNIQUE",
      "TWO_WAY_BINDING",
      "OTHER_DIRECTIVES",
      "OTHER_ATTR",
      "EVENTS",
      "CONTENT"
    ],
    "alphabetical": false
  }]
}
```

### `"alphabetical": true` 

<eslint-code-block fix :rules="{'vue/attributes-order': ['error', {alphabetical: true}]}">

```vue
<template>
  <!-- ✓ GOOD -->
    <div
      a-custom-prop="value"
      :another-custom-prop="value"
      :blue-color="false"
      boolean-prop
      class="foo"
      :class="bar"
      z-prop="Z"
      v-on:[c]="functionCall"
      @change="functionCall"
      v-on:click="functionCall"
      @input="functionCall"
      v-text="textContent">
    </div>

  <!-- ✗ BAD -->
    <div
      z-prop="Z"
      a-prop="A">
    </div>

    <div
      @input="bar"
      @change="foo">
    </div>

    <div
      v-on:click="functionCall"
      v-on:[c]="functionCall">
    </div>

    <div
      :z-prop="Z"
      :a-prop="A">
    </div>

    <div
      :class="foo"
      class="bar">
    </div>

</template>
```

</eslint-code-block>

### Custom orders

#### `['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'DEFINITION', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT']`

<eslint-code-block fix :rules="{'vue/attributes-order': ['error', {order: ['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'DEFINITION', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT']}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div
    ref="header"
    is="header"
    prop-one="prop"
    prop-two="prop">
  </div>

  <!-- ✗ BAD -->
  <div
    ref="header"
    prop-one="prop"
    is="header">
  </div>
</template>
```

</eslint-code-block>

#### `[['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS'], ['DEFINITION', 'GLOBAL', 'UNIQUE'], 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT']`

<eslint-code-block fix :rules="{'vue/attributes-order': ['error', {order: [['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS'], ['DEFINITION', 'GLOBAL', 'UNIQUE'], 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT']}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div
    ref="header"
    is="header"
    prop-one="prop"
    prop-two="prop">
  </div>
  <div
    is="header"
    ref="header"
    prop-one="prop"
    prop-two="prop">
  </div>
</template>
```

</eslint-code-block>

## :books: Further reading

- [Style guide - Element attribute order](https://vuejs.org/v2/style-guide/#Element-attribute-order-recommended)

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/attributes-order.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/attributes-order.js)
