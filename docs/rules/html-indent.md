# enforce consistent indentation in `<template>` (vue/html-indent)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a consistent indentation style in `<template>`. The default style is 2 spaces.

- This rule checks all tags, also all expressions in directives and mustaches.
- In the expressions, this rule supports ECMAScript 2017 syntaxes. It ignores unknown AST nodes, but it might be confused by non-standard syntaxes.

:-1: Examples of **incorrect** code for this rule:

```html
<template>
 <div class="foo">
   Hello.
    </div>
</template>
```

:+1: Examples of **correct** code for this rule:

```html
<template>
  <div class="foo">
    Hello.
  </div>
</template>
```

```html
<template>
  <div class="foo">
    Hello.
  </div>
  <div class="foo"
       :foo="bar"
  >
    World.
  </div>
  <div
    id="a"
    class="b"
    :other-attr="{
      aaa: 1,
      bbb: 2
    }"
    @other-attr2="
      foo();
      bar();
    "
  >
    {{
      displayMessage
    }}
  </div>
</template>
```

## :wrench: Options

```json
{
  "vue/html-indent": ["error", type, {
    "attribute": 1,
    "closeBracket": 0,
    "alignAttributesVertically": true,
    "ignores": []
  }]
}
```

- `type` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.
- `attribute` (`integer`) ... The multiplier of indentation for attributes. Default is `1`.
- `closeBracket` (`integer`) ... The multiplier of indentation for right brackets. Default is `0`.
- `alignAttributesVertically` (`boolean`) ... Condition for whether attributes should be vertically aligned to the first attribute in multiline case or not. Default is `true`
- `ignores` (`string[]`) ... The selector to ignore nodes. The AST spec is [here](https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md). You can use [esquery](https://github.com/estools/esquery#readme) to select nodes. Default is an empty array.

:+1: Examples of **correct** code for `{attribute: 1, closeBracket: 1}`:

```html
<template>
  <div
    id="a"
    class="b"
    other-attr=
      "{longname: longvalue}"
    other-attr2
      ="{longname: longvalue}"
    >
    Text
  </div>
</template>
```

:+1: Examples of **correct** code for `{attribute: 2, closeBracket: 1}`:

```html
<template>
  <div
      id="a"
      class="b"
      other-attr=
        "{longname: longvalue}"
      other-attr2
        ="{longname: longvalue}"
    >
    Text
  </div>
</template>
```

:+1: Examples of **correct** code for `{ignores: ["VAttribute"]}`:

```html
<template>
  <div
  id=""
    class=""
  />
</template>
```

:+1: Examples of **correct** code for `{alignAttributesVertically: true}`:

```html
<template>
  <div id=""
       class=""
       some-attr=""
  />
</template>
```

:+1: Examples of **correct** code for `{alignAttributesVertically: false}`:

```html
<template>
  <div id=""
    class=""
    some-attr=""
  />
</template>
```
