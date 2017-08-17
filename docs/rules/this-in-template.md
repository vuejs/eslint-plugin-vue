# enforce usage of `this` in template. (this-in-template)

## :book: Rule Details

:-1: Examples of **incorrect** code for this rule:

```html
<template>
     <a :href="this.link">{{this.text}}</a>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
     <a :href="link">{{text}}</a>
</template>
```

## :wrench: Options

Default is set to `never`.

```
'vue/this-in-template': [2, 'always'|'never']
```

### `"always"` - Always use `this` while accessing properties from vue

:+1: Examples of **correct** code`:

```html
<template>
  <div :class="{'show': this.showFoo}">
    {{ this.foo }}
  </div>
</template>
```

:-1: Examples of **incorrect** code`:

```html
<template>
  <div :class="{'show': showFoo}">
    {{ foo }}
  </div>
</template>
```

### `"never"` - Never use expresions that contain `this` keyword in expressions

:+1: Examples of **correct** code`:

```html
<template>
  <div :class="{'show': this.showFoo}">
    {{ this.foo }}
  </div>
</template>
```

:-1: Examples of **incorrect** code`:

```html
<template>
  <div :class="{'show': showFoo}">
    {{ foo }}
  </div>
</template>
```
