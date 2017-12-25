# enforce file-name conventions (filename-case)

eslint-plugin-unicorn has a rule to check filename formats. However Vue apps have a convention of .vue files being `pascalCase` and and .js files not being `pascalCase`. This rule can be used as an alternative allowing the file format for files to be configured, but all .vue files will be set to pascalCase.

## :book: Rule Details

This ruleall linted files to have their names in a certain case style. Default is `kebabCase`.

Files named `index.js` are ignored as they can't change case (Only a problem with `pascalCase`).

### `kebabCase`

- `foo-bar.js`
- `foo-bar.test.js`
- `foo-bar.test-utils.js`

### `camelCase`

- `fooBar.js`
- `fooBar.test.js`
- `fooBar.testUtils.js`

### `snakeCase`

- `foo_bar.js`
- `foo_bar.test.js`
- `foo_bar.test_utils.js`

### `pascalCase`

- `FooBar.js`
- `FooBar.Test.js`
- `FooBar.TestUtils.js`


## Options

## :wrench: Options

```json
{
    "vue/filename-case": [
        "error",
        {
            "case": "kebabCase"
        }
    ]
}
```

- `case` (`string"`) ... The filename case. Default is `kebabCase`.