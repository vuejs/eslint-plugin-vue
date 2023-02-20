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
    template('type: Object as Prop<{}>'),
    template('type: String'),
    template('type: Number'),
    template('type: Boolean'),
    template('type: [String, Number, Boolean]')
  ],
  invalid: [
    {
      code: template('type: Object'),
      errors: [
        {
          message: 'Object props has to contains type.'
        }
      ]
    },
    {
      code: template('type: Object as any'),
      errors: [
        {
          message: 'Object props has to contains type.'
        }
      ]
    },
    {
      code: template('type: Object as {}'),
      errors: [
        {
          message: 'Object props has to contains type.'
        }
      ]
    },
    {
      code: template('type: Object as unknown'),
      errors: [
        {
          message: 'Object props has to contains type.'
        }
      ]
    },
    {
      code: template('type: Object as string'),
      errors: [
        {
          message: 'Object props has to contains type.'
        }
      ]
    }
  ]
})