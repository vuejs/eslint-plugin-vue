---
pageClass: rule-details
sidebarDepth: 0
title: vue/padding-line-between-tags
description: require or disallow newlines between sibling tags in template
since: v9.5.0
---

# vue/padding-line-between-tags

> require or disallow newlines between sibling tags in template

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fix-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule requires or disallows newlines between sibling HTML tags.

<eslint-code-block fix :rules="{'vue/padding-line-between-tags': ['error']}">

```vue
<template>
  <div>
    <!-- ✓ GOOD: -->
    <div></div>

    <div>
    </div>
    
    <div />

    <div />
    <!-- ✗ BAD: -->
    <div></div>
    <div>
    </div>
    <div /><div />
  </div>
</template>
```

</eslint-code-block>

## :wrench: Options

```json
{
  "vue/padding-line-between-tags": ["error", [
    { "blankLine": "always", "prev": "*", "next": "*" }
  ]]
}
```

This rule requires blank lines between each sibling HTML tag by default.

A configuration is an object which has 3 properties; `blankLine`, `prev` and `next`. For example, `{ blankLine: "always", prev: "br", next: "div" }` means “one or more blank lines are required between a `br` tag and a `div` tag.” You can supply any number of configurations. If a tag pair matches multiple configurations, the last matched configuration will be used.

- `blankLine` is one of the following:
  - `always` requires one or more blank lines.
  - `never` disallows blank lines.
  - `consistent` requires or disallows a blank line based on the first sibling element.
- Tag selectors (use one of the following for each of `prev` and `next`):
  - `prev` / `next` - any tag name without brackets (e.g., `"div"`, `"br"`), or `"*"` to match any tag.
  - `prevSingle` / `nextSingle` - matches only single-line tags (tags where the opening and closing tags are on the same line).
  - `prevMulti` / `nextMulti` - matches only multi-line tags (tags that span multiple lines).

**Note:** You must use either `prev` OR `prevSingle`/`prevMulti` (but not both), and either `next` OR `nextSingle`/`nextMulti` (but not both).

### Disallow blank lines between all tags

`{ blankLine: 'never', prev: '*', next: '*' }`

<eslint-code-block fix :rules="{'vue/padding-line-between-tags': ['error', [
  { blankLine: 'never', prev: '*', next: '*' }
]]}">

```vue
<template>
  <div>
    <div></div>
    <div>
    </div>
    <div />
  </div>
</template>
```

</eslint-code-block>

### Require newlines after `<br>`

`{ blankLine: 'always', prev: 'br', next: '*' }`

<eslint-code-block fix :rules="{'vue/padding-line-between-tags': ['error', [
  { blankLine: 'always', prev: 'br', next: '*' }
]]}">

```vue
<template>
  <div>
    <ul>
      <li>
      </li>
      <br />

      <li>
      </li>
    </ul>
  </div>
</template>
```

</eslint-code-block>

### Require newlines between `<br>` and `<img>`

`{ blankLine: 'always', prev: 'br', next: 'img' }`

<eslint-code-block fix :rules="{'vue/padding-line-between-tags': ['error', [
  { blankLine: 'always', prev: 'br', next: 'img' }
]]}">

```vue
<template>
  <div>
    <ul>
      <li>
      </li>
      <br />

      <img />
      <li>
      </li>
    </ul>
  </div>
</template>
```

</eslint-code-block>

### Require consistent newlines

`{ blankLine: 'consistent', prev: '*', next: '*' }`

<eslint-code-block fix :rules="{'vue/padding-line-between-tags': ['error', [
  { blankLine: 'consistent', prev: '*', next: '*' }
]]}">

```vue
<template>
  <div>
    <ul>
      <li />
      <li />
      <li />
    </ul>
    
    <div />
    
    <div />
  </div>
</template>
```

</eslint-code-block>

### Distinguish between single-line and multi-line tags

You can use `prevSingle`, `prevMulti`, `nextSingle`, and `nextMulti` to enforce different spacing rules based on whether tags are single-line or multi-line.

<eslint-code-block fix :rules="{'vue/padding-line-between-tags': ['error', [
  { blankLine: 'always', prevSingle: '*', nextMulti: '*' },
  { blankLine: 'always', prevMulti: '*', nextSingle: '*' },
  { blankLine: 'always', prevMulti: '*', nextMulti: '*' },
  { blankLine: 'never', prevSingle: '*', nextSingle: '*' }
]]}">

```vue
<template>
  <div>
    <!-- ✓ GOOD: No blank lines between single-line tags -->
    <span>This is a single-line tag</span>
    <span>This is a single-line tag</span>

    <!-- ✓ GOOD: Blank line before multi-line tag -->
    <div>
      This is a multi-line tag
    </div>

    <!-- ✓ GOOD: Blank line before single-line tag after multi-line tag -->
    <span>This is a single-line tag</span>

    <!-- ✓ GOOD: Blank line before multi-line tag -->
    <div>
      This is a multi-line tag
    </div>
  </div>
</template>
```

</eslint-code-block>

## :rocket: Version

This rule was introduced in eslint-plugin-vue v9.5.0

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/padding-line-between-tags.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/padding-line-between-tags.js)
