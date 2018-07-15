# enforce order of attributes (vue/attributes-order)

- :gear: This rule is included in `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule aims to enforce ordering of component attributes. The default order is specified in the [Vue styleguide](https://vuejs.org/v2/style-guide/#Element-attribute-order-recommended) and is:
- DEFINITION
ex: 'is'
- LIST_RENDERING
ex: 'v-for item in items'
- CONDITIONALS
ex: 'v-if', 'v-else-if', 'v-else', 'v-show', 'v-cloak'
- RENDER_MODIFIERS
ex: 'v-once', 'v-pre'
- GLOBAL
ex: 'id'
- UNIQUE
ex: 'ref', 'key', 'slot'
- TWO\_WAY\_BINDING
ex: 'v-model'
- OTHER_DIRECTIVES
ex: 'v-custom-directive'
- OTHER_ATTR
ex: 'custom-prop="foo"', 'v-bind:prop="foo"', ':prop="foo"'
- EVENTS
ex: '@click="functionCall"', 'v-on="event"'
- CONTENT
ex: 'v-text', 'v-html'

:+1: Examples of **correct** code`:

```html
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
```

```html
<div
  v-for="item in items"
  v-if="!visible"
  prop-one="prop"
  :prop-two="prop"
  prop-three="prop"
  @click="functionCall"
  v-text="textContent">
</div>
```

```html
<div
  prop-one="prop"
  :prop-two="prop"
  prop-three="prop">
</div>
```

:-1: Examples of **incorrect** code`:

```html
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
```

### `order`

Specify custom order of attribute groups

:+1: Examples of **correct** code with custom order`:

```html
<!-- 'vue/attributes-order': [2, { order: ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', ['BINDING', 'OTHER_ATTR'], 'EVENTS', 'CONTENT'] }] -->
<div
  is="header"
  prop-one="prop"
  :prop-two="prop">
</div>
```

```html
<!-- 'vue/attributes-order': [2, { order: ['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'BINDING', 'OTHER_ATTR', 'EVENTS', 'CONTENT', 'DEFINITION'] }] -->
<div
  prop-one="prop"
  prop-two="prop"
  is="header">
</div>
```

```html
<!-- 'vue/attributes-order': [2, { order: ['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'DEFINITION', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT'] }] -->
<div
  ref="header"
  is="header"
  prop-one="prop"
  prop-two="prop">
</div>
```

:-1: Examples of **incorrect** code with custom order`:

```html
<!-- 'vue/attributes-order': [2, { order: ['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'DEFINITION', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT'] }] -->
<div
  ref="header"
  prop-one="prop"
  is="header">
</div>
```

## Related links

- [Style guide - Element attribute order](https://vuejs.org/v2/style-guide/#Element-attribute-order-recommended)
