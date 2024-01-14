/**
 * @fileoverview Prevent variables used in JSX to be marked as unused
 * @author Michał Sajnóg
 */
'use strict'

const eslint = require('../../eslint-compat')
const rule = require('../../../lib/rules/jsx-uses-vars')
const { getCoreRule } = require('../../../lib/utils')
const ruleNoUnusedVars = getCoreRule('no-unused-vars')

const RuleTester = eslint.RuleTester
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  plugins: {
    vue: {
      rules: {
        'jsx-uses-vars': rule
      }
    }
  }
})

ruleTester.run('jsx-uses-vars', rule, {
  // Visually check that there are no warnings in the console.
  valid: [
    `
      import SomeComponent from './SomeComponent.jsx';
      export default {
        render () {
          return (
            <SomeComponent msg="Hello world"></SomeComponent>
          )
        },
      };
    `
  ],
  invalid: []
})

describe('jsx-uses-vars', () => {
  ruleTester.run('no-unused-vars', ruleNoUnusedVars, {
    valid: [
      `
        /* eslint vue/jsx-uses-vars: 1 */
        import SomeComponent from './SomeComponent.jsx';
        export default {
          render () {
            return (
              <SomeComponent msg="Hello world"></SomeComponent>
            )
          },
        };
      `,
      `
        /* eslint vue/jsx-uses-vars: 1 */
        import SomeComponent from './SomeComponent.vue';
        import OtherComponent from './OtherComponent.vue';

        const wrapper = {
          testComponent: SomeComponent,
          group: {
            otherComponent: OtherComponent,
          },
        };

        export default {
          render () {
            return (
              <div>
                <wrapper.testComponent msg="asdasdasdasdas"></wrapper.testComponent>
                <wrapper.group.otherComponent></wrapper.group.otherComponent>
              </div>
            )
          }
        }
      `,
      `
        /* eslint vue/jsx-uses-vars: 1 */
        export default {
          render () {
            return (
              <div>Lorem ipsum</div>
            )
          }
        }
      `
    ],

    invalid: [
      {
        code: `
        /* eslint vue/jsx-uses-vars: 1 */
        import SomeComponent from './SomeComponent.jsx';
        export default {
          render () {
            return <div></div>;
          },
        };
      `,
        errors: [
          {
            message: "'SomeComponent' is defined but never used."
          }
        ]
      },
      {
        code: `
        /* eslint vue/jsx-uses-vars: 1 */
        import SomeComponent from './SomeComponent.jsx';
        const wrapper = {
          something: SomeComponent,
        };

        export default {
          render () {
            return <div></div>;
          },
        };
      `,
        errors: [
          {
            message: "'wrapper' is assigned a value but never used."
          }
        ]
      }
    ]
  })
})
