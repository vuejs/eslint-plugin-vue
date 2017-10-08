# prevent variables used in JSX to be marked as unused (jsx-uses-vars)

Since 0.17.0 the ESLint `no-unused-vars` rule does not detect variables used in JSX ([see details](http://eslint.org/blog/2015/03/eslint-0.17.0-released#changes-to-jsxreact-handling)).
This rule will find variables used in JSX and mark them as used.

This rule only has an effect when the `no-unused-vars` rule is enabled.

## Rule Details

Without this rule this code triggers warning:

```js
import Hello from './Hello';

export default {
  render () {
    return (
      <Hello msg="world"></Hello>
    )
  },
};
```

After turning on, `Hello` is being marked as used and `no-unused-vars` rule doesn't report an issue.

## When Not To Use It

If you are not using JSX or if you do not use the `no-unused-vars` rule then you can disable this rule.
