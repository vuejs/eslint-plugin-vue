---
pageClass: rule-details
sidebarDepth: 0
title: vue/html-indent
description: enforce consistent indentation in `<template>`
---
# vue/html-indent
> enforce consistent indentation in `<template>`

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces a consistent indentation style in `<template>`. The default style is 2 spaces.

- This rule checks all tags, also all expressions in directives and mustaches.
- In the expressions, this rule supports ECMAScript 2017 syntaxes. It ignores unknown AST nodes, but it might be confused by non-standard syntaxes.

<eslint-code-block fix :rules="{'vue/html-indent': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div class="foo">
    Hello.
  </div>
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

  <!-- ✗ BAD -->
 <div class="foo">
   Hello.
    </div>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/html-indent": ["error", type, {
    "attribute": 1,
    "baseIndent": 1,
    "closeBracket": 0,
    "alignAttributesVertically": true,
    "ignores": []
  }]
}
```

- `type` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.
- `attribute` (`integer`) ... The multiplier of indentation for attributes. Default is `1`.
- `baseIndent` (`integer`) ... The multiplier of indentation for top-level statements. Default is `1`.
- `closeBracket` (`integer`) ... The multiplier of indentation for right brackets. Default is `0`.
- `alignAttributesVertically` (`boolean`) ... Condition for whether attributes should be vertically aligned to the first attribute in multiline case or not. Default is `true`
- `ignores` (`string[]`) ... The selector to ignore nodes. The AST spec is [here](https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md). You can use [esquery](https://github.com/estools/esquery#readme) to select nodes. Default is an empty array.

### `2, {"attribute": 1, "closeBracket": 1}`

<eslint-code-block fix :rules="{'vue/html-indent': ['error', 2, {attribute: 1, closeBracket: 1}]}">

```vue
<template>
  <!-- ✓ GOOD -->
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

</eslint-code-block>

### `2, {"attribute": 2, "closeBracket": 1}`

<eslint-code-block fix :rules="{'vue/html-indent': ['error', 2, {attribute: 2, closeBracket: 1}]}">

```vue
<template>
  <!-- ✓ GOOD -->
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

</eslint-code-block>

### `2, {"ignores": ["VAttribute"]}`

<eslint-code-block fix :rules="{'vue/html-indent': ['error', 2, {ignores: ['VAttribute']}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div
  id=""
    class=""
  />
</template>
```

</eslint-code-block>

### `2, {"alignAttributesVertically": false}`

<eslint-code-block fix :rules="{'vue/html-indent': ['error', 2, {alignAttributesVertically: false}]}">

```vue
<template>
  <!-- ✓ GOOD -->
  <div id=""
    class=""
    some-attr=""
  />

  <!-- ✗ BAD -->
  <div id=""
       class=""
       some-attr=""
  />
</template>
```

</eslint-code-block>

### `2, {"baseIndent": 0}`

<eslint-code-block fix :rules="{'vue/html-indent': ['error', 2, {baseIndent: 0}]}">

```vue
<template>
<!-- ✓ GOOD -->
<div>
  <span>
    Hello!
  </span>
</div>

  <!-- ✗ BAD -->
  <div>
    <span>
      Hello!
    </span>
  </div>
</template>
```

</eslint-code-block>

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/html-indent.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/html-indent.js)
