/**
 * @author Yosuke Ota
 */
import semver from 'semver'
import { RuleTester } from 'eslint'
import rule from '../../../lib/rules/dot-location'
import { eslintStylisticVersion } from '../../test-utils/eslint-stylistic'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

const dotAfterObject = `
      <template>
        <div
          :attr="foo.
            bar"
        />
      </template>`
const dotBeforeProperty = `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`
const expectedDotAfterObjectError = {
  message: 'Expected dot to be on same line as object.',
  line: 5,
  column: 13,
  endLine: 5,
  endColumn: 14
}
const expectedDotBeforePropertyError = {
  message: 'Expected dot to be on same line as property.',
  line: 4,
  column: 21,
  endLine: 4,
  endColumn: 22
}

// ESLint Stylistic v6 changed the default option from "object" to "property"
const isDefaultProperty =
  eslintStylisticVersion !== undefined &&
  semver.gte(eslintStylisticVersion, '6.0.0') &&
  !semver.satisfies(process.version, '<19.0.0 || ^21.0.0')

tester.run('dot-location', rule, {
  valid: [
    {
      code: dotAfterObject,
      options: ['object']
    },
    {
      code: dotBeforeProperty,
      options: ['property']
    },
    isDefaultProperty ? dotBeforeProperty : dotAfterObject
  ],
  invalid: [
    {
      code: dotBeforeProperty,
      output: dotAfterObject,
      options: ['object'],
      errors: [expectedDotAfterObjectError]
    },
    {
      code: dotAfterObject,
      output: dotBeforeProperty,
      options: ['property'],
      errors: [expectedDotBeforePropertyError]
    },
    isDefaultProperty
      ? {
          code: dotAfterObject,
          output: dotBeforeProperty,
          errors: [expectedDotBeforePropertyError]
        }
      : {
          code: dotBeforeProperty,
          output: dotAfterObject,
          errors: [expectedDotAfterObjectError]
        }
  ]
})
