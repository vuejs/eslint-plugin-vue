/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/force-types-on-object-props')

const template = (prop) => `
<script lang="ts">
import { Prop } from 'vue/types/options';
export default {
	props: {
		prop: {
			${prop}
		}
	}
}
</script>  
`

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  }
})

ruleTester.run('force-types-on-object-props', rule, {
  valid: [
    `
  <script lang="ts">
  export default {
  }
  </script>  	
`,
    `
  <script lang="ts">
  export default {
    props: {}
  }
  </script>  	
`,
    template('type: String'),
    template('foo: String,'),
    template('type: Number'),
    template('type: Boolean'),
    template('type: [String, Number, Boolean]'),
    template('foo: someFunction(),'),
    template('foo: { type: Object as () => User }'),
    template('type: Object as Prop<{}>'),
    template('foo: { type: Object as PropType<User> },'),
  ],
  invalid: [
    {
      code: template('type: Object'),
      errors: [
        {
          message: 'Expected type annotation on object prop.'
        }
      ]
    },
    {
      code: template('type: Object as any'),
      errors: [
        {
          message: 'Expected type annotation on object prop.'
        }
      ]
    },
    {
      code: template('type: Object as {}'),
      errors: [
        {
          message: 'Expected type annotation on object prop.'
        }
      ]
    },
    {
      code: template('type: Object as unknown'),
      errors: [
        {
          message: 'Expected type annotation on object prop.'
        }
      ]
    },
    {
      code: template('type: Object as string'),
      errors: [
        {
          message: 'Expected type annotation on object prop.'
        }
      ]
    }
  ]
})
