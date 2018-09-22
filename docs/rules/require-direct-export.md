# require the component to be directly exported (require-direct-export)

- :gear: This rule is included in `"plugin:vue/essentials"`.

## Rule Details

This rule aims to...

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

export default Component A
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
