/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/html-element-name-kebab-casing')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser'
})

tester.run('html-element-name-kebab-casing', rule, {
  valid: [
    '<template><div/></template>',
    '<template><img></template>',
    '<template><the-component/></template>',
    '<template><svg><path/></svg></template>',
    '<template><svg><clipPath></clipPath></svg></template>',
    '<template><math><mspace/></math></template>',
    '<template><math><MSPACE/></math></template>',
    '<template><div><slot></slot></div></template>',
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
      errors: ['Element name "TheComponent" is not kebab-case.']
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
      errors: ['Element name "TheComponent" is not kebab-case.']
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
      errors: ['Element name "TheComponent" is not kebab-case.']
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
      errors: ['Element name "TheComponent" is not kebab-case.']
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
      errors: ['Element name "TheComponent" is not kebab-case.']
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
      errors: ['Element name "theComponent" is not kebab-case.']
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
      errors: ['Element name "The-component" is not kebab-case.']
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
      errors: ['Element name "Thecomponent" is not kebab-case.']
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
      errors: ['Element name "TheComponent" is not kebab-case.']
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
      errors: ['Element name "TheComponent" is not kebab-case.']
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
      errors: ['Element name "TheComponent" is not kebab-case.']
    },
    {
      code: `
<template>
  <Div/><INPUT>
</template>
`,
      output: `
<template>
  <div/><input>
</template>
`,
      errors: [
        'Element name "Div" is not kebab-case.',
        'Element name "INPUT" is not kebab-case.'
      ]
    }
  ]
})
