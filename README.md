# eslint-plugin-vue

ESLint plugin for Vue.js projects

## Usage

1. `npm install --save-dev eslint-plugin-vue`
2. create a file named `.eslintrc` in your project:

```js
{
  extends: [ /* your usual extends */ ],
  plugins: ["vue"],
  rules: {
    'vue/jsx-uses-vars': 2,
  },
}
```
3. OPTIONAL: install [eslint-config-vue](https://github.com/vuejs/eslint-config-vue): `npm install --save-dev eslint-config-vue`
4. OPTIONAL: then use the recommended configurations in your `.eslintrc`:

```js
{
  extends: ["vue", /* your other extends */],
  plugins: ["vue"],
  rules: {
    /* your overrides -- vue/jsx-uses-vars is included in eslint-config-vue */
  },
}
```

## License

[MIT](http://opensource.org/licenses/MIT)
