# vue/no-reserved-component-names
> disallow the use of reserved names in component definitions

- :gear: This rule is included in all of `"plugin:vue/essential"`, `"plugin:vue/recommended"`, and `"plugin:vue/strongly-recommended"`.

## :book: Rule Details

This rule prevents name collisions between vue components and standard html elements. 

<eslint-code-block :rules="{'vue/no-reserved-component-names': ['error']}">

```vue
<script>
/* ✗ BAD */
export default {
  name: 'div'
}
</script>
```

</eslint-code-block>

## :books: Further reading

- [List of html elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [Kebab case elements](https://stackoverflow.com/questions/22545621/do-custom-elements-require-a-dash-in-their-name/22545622#22545622)