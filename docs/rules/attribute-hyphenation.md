# enforce attribute naming style on custom components in template (vue/attribute-hyphenation)

- :gear: This rule is included in `"plugin:vue/strongly-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :wrench: Options

Default casing is set to `always` with `['data-', 'aria-', 'slot-scope']` set to be ignored

```
'vue/attribute-hyphenation': [2, 'always'|'never', { 'ignore': ['custom-prop'] }]
```

### `["error", "always"]` - Use hyphenated name. (It errors on upper case letters.)

<eslint-code-block :rules="{'vue/attribute-hyphenation': ['error', 'always']}" code="
&lt;template&gt;
  &lt;!-- ✔ GOOD --&gt;
  &lt;MyComponent my-prop=&quot;prop&quot; /&gt;

  &lt;!-- ✘ BAD --&gt;
  &lt;MyComponent myProp=&quot;prop&quot; /&gt;
&lt;/template&gt;
" />

### `["error", "never"]` - Don't use hyphenated name. (It errors on hyphens except `data-`, `aria-` and `slot-scope`.)

<eslint-code-block :rules="{'vue/attribute-hyphenation': ['error', 'never']}" code="
&lt;template&gt;
  &lt;!-- ✔ GOOD --&gt;
  &lt;MyComponent myProp=&quot;prop&quot; /&gt;
  &lt;MyComponent data-id=&quot;prop&quot; /&gt;
  &lt;MyComponent aria-role=&quot;button&quot; /&gt;
  &lt;MyComponent slot-scope=&quot;prop&quot; /&gt;

  &lt;!-- ✘ BAD --&gt;
  &lt;MyComponent my-prop=&quot;prop&quot; /&gt;
&lt;/template&gt;
" />

### `["error", "never", { "ignore": ["custom-prop"] }]` - Don't use hyphenated name but allow custom attributes

<eslint-code-block :rules="{'vue/attribute-hyphenation': ['error', 'never', {'ignore': ['custom-prop']}]}" code="
&lt;template&gt;
  &lt;!-- ✔ GOOD --&gt;
  &lt;MyComponent myProp=&quot;prop&quot; /&gt;
  &lt;MyComponent custom-prop=&quot;prop&quot; /&gt;
  &lt;MyComponent data-id=&quot;prop&quot; /&gt;
  &lt;MyComponent aria-role=&quot;button&quot; /&gt;
  &lt;MyComponent slot-scope=&quot;prop&quot; /&gt;

  &lt;!-- ✘ BAD --&gt;
  &lt;MyComponent my-prop=&quot;prop&quot; /&gt;
&lt;/template&gt;
" />
