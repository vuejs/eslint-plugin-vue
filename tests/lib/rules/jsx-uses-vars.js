/**
 * @fileoverview Prevent variables used in JSX to be marked as unused
 * @author Michał Sajnóg
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint')
var rule = require('../../../lib/rules/jsx-uses-vars')
var ruleNoUnusedVars = require('eslint/lib/rules/no-unused-vars')

var RuleTester = eslint.RuleTester
var ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
})

var linter = ruleTester.linter || eslint.linter
linter.defineRule('jsx-uses-vars', rule)

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

ruleTester.run('no-unused-vars', ruleNoUnusedVars, {

  valid: [
    {
      code: `
        /* eslint jsx-uses-vars: 1 */
        import SomeComponent from './SomeComponent.jsx';
        export default {
          render () {
            return (
              <SomeComponent msg="Hello world"></SomeComponent>
            )
          },
        };
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
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
      `
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
        export default {
          render () {
            return (
              <div>Lorem ipsum</div>
            )
          }
        }
      `
    }
  ],

  invalid: [
    {
      code: `
        /* eslint jsx-uses-vars: 1 */
        import SomeComponent from './SomeComponent.jsx';
        export default {
          render () {
            return <div></div>;
          },
        };
      `,
      errors: [{
        message: "'SomeComponent' is defined but never used."
      }]
    }, {
      code: `
        /* eslint jsx-uses-vars: 1 */
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
      errors: [{
        message: "'wrapper' is assigned a value but never used."
      }]
    }
  ]
})
