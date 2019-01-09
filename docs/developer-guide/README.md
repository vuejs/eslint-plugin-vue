# Developer Guide

Contributing is welcome.

## :bug: Bug reporting

If you think you’ve found a bug in ESLint, please [create a new issue](https://github.com/vuejs/eslint-plugin-vue/issues/new?labels=&template=bug_report.md) or a pull request on GitHub.

Please include as much detail as possible to help us properly address your issue. If we need to triage issues and constantly ask people for more detail, that’s time taken away from actually fixing issues. Help us be as efficient as possible by including a lot of detail in your issues.

## :sparkles: Proposing a new rule or a rule change

In order to add a new rule or a rule change, you should:

- Create issue on GitHub with description of proposed rule
- Generate a new rule using the [official yeoman generator](https://github.com/eslint/generator-eslint)
- Run `npm start`
- Write test scenarios & implement logic
- Describe the rule in the generated `docs` file
- Make sure all tests are passing
- Run `npm run lint` and fix any errors
- Run `npm run update` in order to update readme and recommended configuration
- Create PR and link created issue in description

We're more than happy to see potential contributions, so don't hesitate. If you have any suggestions, ideas or problems feel free to add new [issue](https://github.com/vuejs/eslint-plugin-vue/issues), but first please make sure your question does not repeat previous ones.

## :fire: Working with rules

Before you start writing new rule, please read the [official ESLint guide](https://eslint.org/docs/developer-guide/working-with-rules).

Next in order to get an idea how does the AST of the code that you want to check looks like, you can use one of the following applications:
- [astexplorer.net](https://astexplorer.net/) - best tool to inspect ASTs, but it doesn't support Vue templates yet
- [ast.js.org](https://ast.js.org/) - not fully featured, but supports Vue templates syntax

Since single file components in Vue are not plain JavaScript, we can't use the default parser, and we had to introduce additional one: `vue-eslint-parser`, that generates enhanced AST with nodes that represent specific parts of the template syntax, as well as what's inside the `<script>` tag.

To know more about certain nodes in produced ASTs, go here:
- [ESTree docs](https://github.com/estree/estree)
- [vue-eslint-parser AST docs](https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md)

The `vue-eslint-parser` provides few useful parser services, to help traverse the produced AST and access tokens of the template:
- `context.parserServices.defineTemplateBodyVisitor(visitor, scriptVisitor)`
- `context.parserServices.getTemplateBodyTokenStore()`

Check out an [example rule](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/mustache-interpolation-spacing.js) to get a better understanding of how these work.

Please be aware that regarding what kind of code examples you'll write in tests, you'll have to accordingly setup the parser in `RuleTester` (you can do it on per test case basis though). [See an example here](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/attribute-hyphenation.js#L19)

If you'll stuck, remember there are plenty of rules you can learn from already, and if you can't find the right solution - don't hesitate to reach out in issues. We're happy to help!
