/**
 * @fileoverview Enforces component's data property to be a function.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/filename-case')

const RuleTester = require('eslint').RuleTester
// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

function testCase (filename, chosenCase, errorMessage) {
  return {
    code: 'foo()',
    filename,
    options: [{ case: chosenCase }],
    errors: errorMessage && [{
      ruleId: 'filename-case',
      message: errorMessage
    }]
  }
}

ruleTester.run('filename-case', rule, {
  valid: [
    testCase('src/foo/bar.js', 'camelCase'),
    testCase('src/foo/fooBar.js', 'camelCase'),
    testCase('src/foo/bar.test.js', 'camelCase'),
    testCase('src/foo/fooBar.test.js', 'camelCase'),
    testCase('src/foo/fooBar.testUtils.js', 'camelCase'),
    testCase('src/foo/foo.js', 'snakeCase'),
    testCase('src/foo/foo_bar.js', 'snakeCase'),
    testCase('src/foo/foo.test.js', 'snakeCase'),
    testCase('src/foo/foo_bar.test.js', 'snakeCase'),
    testCase('src/foo/foo_bar.test_utils.js', 'snakeCase'),
    testCase('src/foo/foo.js', 'kebabCase'),
    testCase('src/foo/foo-bar.js', 'kebabCase'),
    testCase('src/foo/foo.test.js', 'kebabCase'),
    testCase('src/foo/foo-bar.test.js', 'kebabCase'),
    testCase('src/foo/foo-bar.test-utils.js', 'kebabCase'),
    testCase('src/foo/Foo.js', 'pascalCase'),
    testCase('src/foo/FooBar.js', 'pascalCase'),
    testCase('src/foo/Foo.Test.js', 'pascalCase'),
    testCase('src/foo/FooBar.Test.js', 'pascalCase'),
    testCase('src/foo/FooBar.TestUtils.js', 'pascalCase'),
    testCase('spec/iss47Spec.js', 'camelCase'),
    testCase('spec/iss47Spec100.js', 'camelCase'),
    testCase('spec/i18n.js', 'camelCase'),
    testCase('spec/iss47-spec.js', 'kebabCase'),
    testCase('spec/iss-47-spec.js', 'kebabCase'),
    testCase('spec/iss47-100spec.js', 'kebabCase'),
    testCase('spec/i18n.js', 'kebabCase'),
    testCase('spec/iss47_spec.js', 'snakeCase'),
    testCase('spec/iss_47_spec.js', 'snakeCase'),
    testCase('spec/iss47_100spec.js', 'snakeCase'),
    testCase('spec/i18n.js', 'snakeCase'),
    testCase('spec/Iss47Spec.js', 'pascalCase'),
    testCase('spec/Iss47.100Spec.js', 'pascalCase'),
    testCase('spec/I18n.js', 'pascalCase'),
    testCase('spec/index.js', 'pascalCase'),
    testCase('<text>', 'camelCase'),
    testCase('<text>', 'snakeCase'),
    testCase('<text>', 'kebabCase'),
    testCase('<text>', 'pascalCase'),
    testCase('src/foo/_fooBar.js', 'camelCase'),
    testCase('src/foo/___fooBar.js', 'camelCase'),
    testCase('src/foo/_foo_bar.js', 'snakeCase'),
    testCase('src/foo/___foo_bar.js', 'snakeCase'),
    testCase('src/foo/_foo-bar.js', 'kebabCase'),
    testCase('src/foo/___foo-bar.js', 'kebabCase'),
    testCase('src/foo/_FooBar.js', 'pascalCase'),
    testCase('src/foo/___FooBar.js', 'pascalCase'),
    testCase('App.vue', 'kebabCase'),
    testCase('HelloWorld.vue', 'kebabCase')
  ],
  invalid: [
    testCase('src/foo/foo_bar.js',
      undefined,
      'Filename is not in camel case. Rename it to `fooBar.js`.'
    ),
    testCase('src/foo/foo_bar.js',
      'camelCase',
      'Filename is not in camel case. Rename it to `fooBar.js`.'
    ),
    testCase('src/foo/foo_bar.test.js',
      'camelCase',
      'Filename is not in camel case. Rename it to `fooBar.test.js`.'
    ),
    testCase('test/foo/foo_bar.test_utils.js',
      'camelCase',
      'Filename is not in camel case. Rename it to `fooBar.testUtils.js`.'
    ),
    testCase('test/foo/fooBar.js',
      'snakeCase',
      'Filename is not in snake case. Rename it to `foo_bar.js`.'
    ),
    testCase('test/foo/fooBar.test.js',
      'snakeCase',
      'Filename is not in snake case. Rename it to `foo_bar.test.js`.'
    ),
    testCase('test/foo/fooBar.testUtils.js',
      'snakeCase',
      'Filename is not in snake case. Rename it to `foo_bar.test_utils.js`.'
    ),
    testCase('test/foo/fooBar.js',
      'kebabCase',
      'Filename is not in kebab case. Rename it to `foo-bar.js`.'
    ),
    testCase('test/foo/fooBar.test.js',
      'kebabCase',
      'Filename is not in kebab case. Rename it to `foo-bar.test.js`.'
    ),
    testCase('test/foo/fooBar.testUtils.js',
      'kebabCase',
      'Filename is not in kebab case. Rename it to `foo-bar.test-utils.js`.'
    ),
    testCase('test/foo/fooBar.js',
      'pascalCase',
      'Filename is not in pascal case. Rename it to `FooBar.js`.'
    ),
    testCase('test/foo/foo_bar.test.js',
      'pascalCase',
      'Filename is not in pascal case. Rename it to `FooBar.Test.js`.'
    ),
    testCase('test/foo/foo-bar.test-utils.js',
      'pascalCase',
      'Filename is not in pascal case. Rename it to `FooBar.TestUtils.js`.'
    ),
    testCase('src/foo/_FOO-BAR.js',
      'camelCase',
      'Filename is not in camel case. Rename it to `_fooBar.js`.'
    ),
    testCase('src/foo/___FOO-BAR.js',
      'camelCase',
      'Filename is not in camel case. Rename it to `___fooBar.js`.'
    ),
    testCase('src/foo/_FOO-BAR.js',
      'snakeCase',
      'Filename is not in snake case. Rename it to `_foo_bar.js`.'
    ),
    testCase('src/foo/___FOO-BAR.js',
      'snakeCase',
      'Filename is not in snake case. Rename it to `___foo_bar.js`.'
    ),
    testCase('src/foo/_FOO-BAR.js',
      'kebabCase',
      'Filename is not in kebab case. Rename it to `_foo-bar.js`.'
    ),
    testCase('src/foo/___FOO-BAR.js',
      'kebabCase',
      'Filename is not in kebab case. Rename it to `___foo-bar.js`.'
    ),
    testCase('src/foo/_FOO-BAR.js',
      'pascalCase',
      'Filename is not in pascal case. Rename it to `_FooBar.js`.'
    ),
    testCase('src/foo/___FOO-BAR.js',
      'pascalCase',
      'Filename is not in pascal case. Rename it to `___FooBar.js`.'
    )
  ]
})
