/**
 * @fileoverview disallow the use of reserved names in component definitions
 * @author Jake Hassel <https://github.com/shadskii>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-reserved-component-names')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const invalidElements = [
  'annotation-xml',
  'AnnotationXml',
  'color-profile',
  'ColorProfile',
  'font-face',
  'FontFace',
  'font-face-src',
  'FontFaceSrc',
  'font-face-uri',
  'FontFaceUri',
  'font-face-format',
  'FontFaceFormat',
  'font-face-name',
  'FontFaceName',
  'missing-glyph',
  'MissingGlyph',
  'a',
  'abbr',
  'acronym',
  'address',
  'applet',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'basefont',
  'bdi',
  'bdo',
  'bgsound',
  'big',
  'blink',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'command',
  'content',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'element',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'font',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'image',
  'img',
  'input',
  'ins',
  'isindex',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'listing',
  'main',
  'map',
  'mark',
  'marquee',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'multicol',
  'nav',
  'nextid',
  'nobr',
  'noembed',
  'noframes',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'plaintext',
  'pre',
  'progress',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'shadow',
  'slot',
  'small',
  'source',
  'spacer',
  'span',
  'strike',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'tt',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
  'xmp',

  'A',
  'Abbr',
  'Acronym',
  'Address',
  'Applet',
  'Area',
  'Article',
  'Aside',
  'Audio',
  'B',
  'Base',
  'Basefont',
  'Bdi',
  'Bdo',
  'Bgsound',
  'Big',
  'Blink',
  'Blockquote',
  'Body',
  'Br',
  'Button',
  'Canvas',
  'Caption',
  'Center',
  'Cite',
  'Code',
  'Col',
  'Colgroup',
  'Command',
  'Content',
  'Data',
  'Datalist',
  'Dd',
  'Del',
  'Details',
  'Dfn',
  'Dialog',
  'Dir',
  'Div',
  'Dl',
  'Dt',
  'Element',
  'Em',
  'Embed',
  'Fieldset',
  'Figcaption',
  'Figure',
  'Font',
  'Footer',
  'Form',
  'Frame',
  'Frameset',
  'H1',
  'Head',
  'Header',
  'Hgroup',
  'Hr',
  'Html',
  'I',
  'Iframe',
  'Image',
  'Img',
  'Input',
  'Ins',
  'Isindex',
  'Kbd',
  'Keygen',
  'Label',
  'Legend',
  'Li',
  'Link',
  'Listing',
  'Main',
  'Map',
  'Mark',
  'Marquee',
  'Menu',
  'Menuitem',
  'Meta',
  'Meter',
  'Multicol',
  'Nav',
  'Nextid',
  'Nobr',
  'Noembed',
  'Noframes',
  'Noscript',
  'Object',
  'Ol',
  'Optgroup',
  'Option',
  'Output',
  'P',
  'param',
  'Picture',
  'Plaintext',
  'Pre',
  'Progress',
  'Q',
  'Rb',
  'Rp',
  'Rt',
  'Rtc',
  'Ruby',
  'S',
  'Samp',
  'Script',
  'Section',
  'Select',
  'Shadow',
  'Slot',
  'Small',
  'Source',
  'Spacer',
  'Span',
  'Strike',
  'Strong',
  'Style',
  'Sub',
  'Summary',
  'Sup',
  'Table',
  'Tbody',
  'Td',
  'Template',
  'Textarea',
  'Tfoot',
  'Th',
  'Thead',
  'Time',
  'Title',
  'Tr',
  'Track',
  'Tt',
  'U',
  'Ul',
  'Var',
  'Video',
  'Wbr',
  'Xmp'
]

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('no-reserved-component-names', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...name
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          name: 'FooBar'
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', {})`,
      parserOptions
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          name: 'foo!bar'
        })
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component(\`fooBar\${foo}\`, component)`,
      parserOptions
    }
  ],

  invalid: [
    ...invalidElements.map(name => {
      return {
        filename: `${name}.vue`,
        code: `
          export default {
            name: '${name}'
          }
        `,
        parserOptions,
        errors: [{
          message: `Name "${name}" is reserved.`,
          type: 'Literal',
          line: 3
        }]
      }
    }),
    ...invalidElements.map(name => {
      return {
        filename: 'test.vue',
        code: `Vue.component('${name}', component)`,
        parserOptions,
        errors: [{
          message: `Name "${name}" is reserved.`,
          type: 'Literal',
          line: 1
        }]
      }
    }),
    ...invalidElements.map(name => {
      return {
        filename: 'test.vue',
        code: `Vue.component(\`${name}\`, {})`,
        parserOptions,
        errors: [{
          message: `Name "${name}" is reserved.`,
          type: 'TemplateLiteral',
          line: 1
        }]
      }
    })
  ]
})
