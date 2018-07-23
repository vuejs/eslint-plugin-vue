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
- BINDING
ex: 'v-model', 'v-bind', ':property="foo"'
- OTHER_ATTR
ex: 'customProp="foo"'
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
  myProp="prop"
  @click="functionCall"
  v-text="textContent">
</div>
```

```html
<div
  v-for="item in items"
  v-if="!visible"
  propOne="prop"
  propTwo="prop"
  propThree="prop"
  @click="functionCall"
  v-text="textContent">
</div>
```

```html
<div
  propOne="prop"
  propTwo="prop"
  propThree="prop">
</div>
```

:-1: Examples of **incorrect** code`:

```html
<div
  ref="header"
  v-for="item in items"
  v-once id="uniqueID"
  v-model="headerData"
  myProp="prop"
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
<!-- 'vue/attributes-order': [2, { order: ['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'BINDING', 'OTHER_ATTR', 'EVENTS', 'CONTENT', 'DEFINITION'] }] -->
<div
  propOne="prop"
  propTwo="prop"
  is="header">
</div>
```

```html
<!-- 'vue/attributes-order': [2, { order: ['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'BINDING', 'DEFINITION', 'OTHER_ATTR', 'EVENTS', 'CONTENT'] }] -->
<div
  ref="header"
  is="header"
  propOne="prop"
  propTwo="prop">
</div>
```

:-1: Examples of **incorrect** code with custom order`:

```html
<!-- 'vue/attributes-order': [2, { order: ['LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'BINDING', 'DEFINITION', 'OTHER_ATTR', 'EVENTS', 'CONTENT'] }] -->
<div
  ref="header"
  propOne="prop"
  is="header">
</div>
```

## Related links

- [Style guide - Element attribute order](https://vuejs.org/v2/style-guide/#Element-attribute-order-recommended)
