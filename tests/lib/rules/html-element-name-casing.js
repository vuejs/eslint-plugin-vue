/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-element-name-casing')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser'
})

tester.run('html-element-name-casing', rule, {
  valid: [
    // default
    '<template><div/></template>',
    '<template><img></template>',
    '<template><the-component/></template>',
    '<template><svg><path/></svg></template>',
    '<template><math><mspace/></math></template>',
    '<template><div><slot></slot></div></template>',

    // PascalCase
    {
      code: '<template><TheComponent></TheComponent></template>',
      output: null,
      options: ['PascalCase']
    },
    {
      code: '<template><div/></template>',
      output: null,
      options: ['PascalCase']
    },
    {
      code: '<template><img></template>',
      output: null,
      options: ['PascalCase']
    },
    {
      code: '<template><svg><path/></svg></template>',
      output: null,
      options: ['PascalCase']
    },
    {
      code: '<template><math><mspace/></math></template>',
      output: null,
      options: ['PascalCase']
    },
    // Invalid EOF
    '<template><TheComponent a=">test</TheComponent></template>',
    '<template><TheComponent><!--test</TheComponent></template>'
  ],
  invalid: [
    {
      code: `
<template>
  <TheComponent id="id">
    <!-- comment -->
  </TheComponent>
</template>
`,
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
  <the-component id="id">
    <!-- comment -->
  </the-component>
</template>
`,
      options: ['PascalCase'],
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
      options: ['PascalCase'],
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
  <TheComponent
    id="id"/>
</template>
`,
      output: `
<template>
  <the-component
    id="id"/>
</template>
`,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
<template>
  <TheComponent/>
</template>
`,
      output: `
<template>
  <the-component/>
</template>
`,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
<template>
  <TheComponent></TheComponent>
</template>
`,
      output: `
<template>
  <the-component></the-component>
</template>
`,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
<template>
  <theComponent/>
</template>
`,
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
  <theComponent/>
</template>
`,
      options: ['PascalCase'],
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
  <The-component/>
</template>
`,
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
  <The-component/>
</template>
`,
      options: ['PascalCase'],
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
  <Thecomponent/>
</template>
`,
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
  <TheComponent></TheComponent  >
</template>
`,
      output: `
<template>
  <the-component></the-component  >
</template>
`,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
<template>
  <TheComponent></TheComponent
  >
</template>
`,
      output: `
<template>
  <the-component></the-component
  >
</template>
`,
      errors: ['Component name "TheComponent" is not kebab-case.']
    },
    {
      code: `
<template>
  <TheComponent></TheComponent end-tag-attr="attr" >
</template>
`,
      output: `
<template>
  <the-component></the-component end-tag-attr="attr" >
</template>
`,
      errors: ['Component name "TheComponent" is not kebab-case.']
    }
  ]
})
