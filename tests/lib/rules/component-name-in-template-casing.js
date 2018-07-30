/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/component-name-in-template-casing')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser'
})

tester.run('component-name-in-template-casing', rule, {
  valid: [
    // default
    '<template><div/></template>',
    '<template><img></template>',
    '<template><TheComponent/></template>',
    '<template><svg><path/></svg></template>',
    '<template><math><mspace/></math></template>',
    '<template><div><slot></slot></div></template>',

    // kebab-case
    {
      code: '<template><the-component></the-component></template>',
      options: ['kebab-case']
    },
    {
      code: '<template><div/></template>',
      options: ['kebab-case']
    },
    {
      code: '<template><img></template>',
      options: ['kebab-case']
    },
    {
      code: '<template><svg><path/></svg></template>',
      options: ['kebab-case']
    },
    {
      code: '<template><math><mspace/></math></template>',
      options: ['kebab-case']
    },
    // ignores
    {
      code: '<template><custom-element></custom-element></template>',
      options: ['PascalCase', { ignores: ['custom-element'] }]
    },
    {
      code: '<template><custom-element><TheComponent/></custom-element></template>',
      options: ['PascalCase', { ignores: ['custom-element'] }]
    },
    // Invalid EOF
    '<template><the-component a=">test</the-component></template>',
    '<template><the-component><!--test</the-component></template>'
  ],
  invalid: [
    {
      code: `
      <template>
        <the-component id="id">
          <!-- comment -->
        </the-component>
      </template>
      `,
      output: `
      <template>
        <TheComponent id="id">
          <!-- comment -->
        </TheComponent>
      </template>
      `,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <the-component id="id"/>
      </template>
      `,
      output: `
      <template>
        <TheComponent id="id"/>
      </template>
      `,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <TheComponent id="id">
          <!-- comment -->
        </TheComponent>
      </template>
      `,
      options: ['kebab-case'],
      output: `
      <template>
        <the-component id="id">
          <!-- comment -->
        </the-component>
      </template>
      `,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
      <template>
        <TheComponent id="id"/>
      </template>
      `,
      options: ['kebab-case'],
      output: `
      <template>
        <the-component id="id"/>
      </template>
      `,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
      <template>
        <the-component
          id="id"/>
      </template>
      `,
      output: `
      <template>
        <TheComponent
          id="id"/>
      </template>
      `,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <the-component/>
      </template>
      `,
      output: `
      <template>
        <TheComponent/>
      </template>
      `,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <the-component></the-component>
      </template>
      `,
      output: `
      <template>
        <TheComponent></TheComponent>
      </template>
      `,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <theComponent/>
      </template>
      `,
      output: `
      <template>
        <TheComponent/>
      </template>
      `,
      errors: ['Component name "theComponent" is not PascalCase.']
    },
    {
      code: `
      <template>
        <theComponent/>
      </template>
      `,
      options: ['kebab-case'],
      output: `
      <template>
        <the-component/>
      </template>
      `,
      errors: ['Component name "theComponent" is not kebab-case.']
    },
    {
      code: `
      <template>
        <The-component/>
      </template>
      `,
      output: `
      <template>
        <TheComponent/>
      </template>
      `,
      errors: ['Component name "The-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <The-component/>
      </template>
      `,
      options: ['kebab-case'],
      output: `
      <template>
        <the-component/>
      </template>
      `,
      errors: ['Component name "The-component" is not kebab-case.']
    },
    {
      code: `
      <template>
        <Thecomponent/>
      </template>
      `,
      options: ['kebab-case'],
      output: `
      <template>
        <thecomponent/>
      </template>
      `,
      errors: ['Component name "Thecomponent" is not kebab-case.']
    },
    {
      code: `
      <template>
        <the-component></the-component  >
      </template>
      `,
      output: `
      <template>
        <TheComponent></TheComponent  >
      </template>
      `,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <the-component></the-component
        >
      </template>
      `,
      output: `
      <template>
        <TheComponent></TheComponent
        >
      </template>
      `,
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <the-component></the-component end-tag-attr="attr" >
      </template>
      `,
      output: `
      <template>
        <TheComponent></TheComponent end-tag-attr="attr" >
      </template>
      `,
      errors: ['Component name "the-component" is not PascalCase.']
    },

    // ignores
    {
      code: `
      <template>
        <custom-element>
          <the-component />
        </custom-element>
      </template>`,
      output: `
      <template>
        <custom-element>
          <TheComponent />
        </custom-element>
      </template>`,
      options: ['PascalCase', { ignores: ['custom-element'] }],
      errors: ['Component name "the-component" is not PascalCase.']
    },
    {
      code: `
      <template>
        <custom-element1>
          <the-component />
        </custom-element1>
        <custom-element2 />
        <the-component />
      </template>`,
      output: `
      <template>
        <custom-element1>
          <TheComponent />
        </custom-element1>
        <custom-element2 />
        <TheComponent />
      </template>`,
      options: ['PascalCase', { ignores: ['custom-element1', 'custom-element2'] }],
      errors: [
        'Component name "the-component" is not PascalCase.',
        'Component name "the-component" is not PascalCase.'
      ]
    }
  ]
})
