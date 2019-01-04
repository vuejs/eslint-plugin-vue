---
pageClass: rule-details
sidebarDepth: 0
title: vue/require-direct-export
description: require the component to be directly exported
---
# vue/require-direct-export
> require the component to be directly exported

## Rule Details

This rule aims to require that the component object be directly exported.

:-1: Examples of **incorrect** code:

```js
const ComponentA = {
	name: 'ComponentA',
	data() {
		return {
			state: 1
		}
	}
}

export default ComponentA
```

:+1: Examples of **correct** code:

```js
export default {
	name: 'ComponentA',
	data() {
		return {
			state: 1
		}
	}
}
```

## :mag: Implementation

- [Rule source](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/require-direct-export.js)
- [Test source](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/require-direct-export.js)
