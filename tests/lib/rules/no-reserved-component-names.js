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

const htmlElements = require('../../../lib/utils/html-elements.json')
const RESERVED_NAMES_IN_HTML = new Set([
  ...htmlElements,
  ...htmlElements.map(
    (word) => word[0].toUpperCase() + word.substring(1, word.length)
  )
])

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
  'html',
  'Html',
  'body',
  'Body',
  'base',
  'Base',
  'head',
  'Head',
  'link',
  'Link',
  'meta',
  'Meta',
  'style',
  'Style',
  'title',
  'Title',
  'address',
  'Address',
  'article',
  'Article',
  'aside',
  'Aside',
  'footer',
  'Footer',
  'header',
  'Header',
  'h1',
  'H1',
  'h2',
  'H2',
  'h3',
  'H3',
  'h4',
  'H4',
  'h5',
  'H5',
  'h6',
  'H6',
  'hgroup',
  'Hgroup',
  'nav',
  'Nav',
  'section',
  'Section',
  'div',
  'Div',
  'dd',
  'Dd',
  'dl',
  'Dl',
  'dt',
  'Dt',
  'figcaption',
  'Figcaption',
  'figure',
  'Figure',
  'hr',
  'Hr',
  'img',
  'Img',
  'li',
  'Li',
  'main',
  'Main',
  'ol',
  'Ol',
  'p',
  'P',
  'pre',
  'Pre',
  'ul',
  'Ul',
  'a',
  'A',
  'b',
  'B',
  'abbr',
  'Abbr',
  'bdi',
  'Bdi',
  'bdo',
  'Bdo',
  'br',
  'Br',
  'cite',
  'Cite',
  'code',
  'Code',
  'data',
  'Data',
  'dfn',
  'Dfn',
  'em',
  'Em',
  'i',
  'I',
  'kbd',
  'Kbd',
  'mark',
  'Mark',
  'q',
  'Q',
  'rp',
  'Rp',
  'rt',
  'Rt',
  'rtc',
  'Rtc',
  'ruby',
  'Ruby',
  's',
  'S',
  'samp',
  'Samp',
  'small',
  'Small',
  'span',
  'Span',
  'strong',
  'Strong',
  'sub',
  'Sub',
  'sup',
  'Sup',
  'time',
  'Time',
  'u',
  'U',
  'var',
  'Var',
  'wbr',
  'Wbr',
  'area',
  'Area',
  'audio',
  'Audio',
  'map',
  'Map',
  'track',
  'Track',
  'video',
  'Video',
  'embed',
  'Embed',
  'object',
  'Object',
  'param',
  'Param',
  'source',
  'Source',
  'canvas',
  'Canvas',
  'script',
  'Script',
  'noscript',
  'Noscript',
  'del',
  'Del',
  'ins',
  'Ins',
  'caption',
  'Caption',
  'col',
  'Col',
  'colgroup',
  'Colgroup',
  'table',
  'Table',
  'thead',
  'Thead',
  'tbody',
  'Tbody',
  'tfoot',
  'Tfoot',
  'td',
  'Td',
  'th',
  'Th',
  'tr',
  'Tr',
  'button',
  'Button',
  'datalist',
  'Datalist',
  'fieldset',
  'Fieldset',
  'form',
  'Form',
  'input',
  'Input',
  'label',
  'Label',
  'legend',
  'Legend',
  'meter',
  'Meter',
  'optgroup',
  'Optgroup',
  'option',
  'Option',
  'output',
  'Output',
  'progress',
  'Progress',
  'select',
  'Select',
  'textarea',
  'Textarea',
  'details',
  'Details',
  'dialog',
  'Dialog',
  'menu',
  'Menu',
  'menuitem',
  'menuitem',
  'summary',
  'Summary',
  'content',
  'Content',
  'element',
  'Element',
  'shadow',
  'Shadow',
  'template',
  'Template',
  'slot',
  'Slot',
  'blockquote',
  'Blockquote',
  'iframe',
  'Iframe',
  'noframes',
  'Noframes',
  'picture',
  'Picture',

  // SVG elements
  'animate',
  'Animate',
  'animateMotion',
  'animateTransform',
  'circle',
  'Circle',
  'clipPath',
  'defs',
  'Defs',
  'desc',
  'Desc',
  'discard',
  'Discard',
  'ellipse',
  'Ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'Filter',
  'foreignObject',
  'g',
  'G',
  'image',
  'Image',
  'line',
  'Line',
  'linearGradient',
  'marker',
  'Marker',
  'mask',
  'Mask',
  'metadata',
  'Metadata',
  'mpath',
  'Mpath',
  'path',
  'Path',
  'pattern',
  'Pattern',
  'polygon',
  'Polygon',
  'polyline',
  'Polyline',
  'radialGradient',
  'rect',
  'Rect',
  'set',
  'Set',
  'stop',
  'Stop',
  'svg',
  'Svg',
  'switch',
  'Switch',
  'symbol',
  'Symbol',
  'text',
  'Text',
  'textPath',
  'tspan',
  'Tspan',
  'unknown',
  'Unknown',
  'use',
  'Use',
  'view',
  'View',

  // Deprecated
  'acronym',
  'Acronym',
  'applet',
  'Applet',
  'basefont',
  'Basefont',
  'bgsound',
  'Bgsound',
  'big',
  'Big',
  'blink',
  'Blink',
  'center',
  'Center',
  'command',
  'Command',
  'dir',
  'Dir',
  'font',
  'Font',
  'frame',
  'Frame',
  'frameset',
  'Frameset',
  'isindex',
  'Isindex',
  'keygen',
  'Keygen',
  'listing',
  'Listing',
  'marquee',
  'Marquee',
  'multicol',
  'Multicol',
  'nextid',
  'Nextid',
  'nobr',
  'Nobr',
  'noembed',
  'Noembed',
  'plaintext',
  'Plaintext',
  'spacer',
  'Spacer',
  'strike',
  'Strike',
  'tt',
  'Tt',
  'xmp',
  'Xmp'
]

const vue2BuiltInComponents = [
  'component',
  'Component',
  'transition',
  'Transition',
  'transition-group',
  'TransitionGroup',
  'keep-alive',
  'KeepAlive'
]

const vue3BuiltInComponents = ['teleport', 'Teleport', 'suspense', 'Suspense']

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
      code: `
        export default {
          name: 'FooBar'
        }
      `,
      options: [
        {
          disallowVueBuiltInComponents: true,
          disallowVue3BuiltInComponents: true
        }
      ],
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `Vue.component('FooBar', {})`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `app.component('FooBar', {})`,
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
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            template: '<template><div /></template>'
          }
        </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            template: '<template><div><slot></slot></div></template>'
          }
        </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions
    },
    // https://github.com/vuejs/eslint-plugin-vue/issues/1018
    {
      filename: 'test.js',
      code: `fn1(component.data)`,
      parserOptions
    },
    ...vue2BuiltInComponents.map((name) => {
      return {
        filename: `${name}.vue`,
        code: `
          export default {
            name: '${name}'
          }
        `,
        parserOptions
      }
    }),
    ...vue3BuiltInComponents.map((name) => {
      return {
        filename: `${name}.vue`,
        code: `
          export default {
            name: '${name}'
          }
        `,
        parserOptions
      }
    }),
    ...vue3BuiltInComponents.map((name) => {
      return {
        filename: `${name}.vue`,
        code: `
          export default {
            name: '${name}'
          }
        `,
        parserOptions,
        options: [{ disallowVueBuiltInComponents: true }]
      }
    })
  ],

  invalid: [
    ...invalidElements.map((name) => {
      return {
        filename: `${name}.vue`,
        code: `
          export default {
            name: '${name}'
          }
        `,
        parserOptions,
        errors: [
          {
            messageId: RESERVED_NAMES_IN_HTML.has(name)
              ? 'reservedInHtml'
              : 'reserved',
            data: { name },
            type: 'Literal',
            line: 3
          }
        ]
      }
    }),
    ...invalidElements.map((name) => {
      return {
        filename: 'test.vue',
        code: `Vue.component('${name}', component)`,
        parserOptions,
        errors: [
          {
            messageId: RESERVED_NAMES_IN_HTML.has(name)
              ? 'reservedInHtml'
              : 'reserved',
            data: { name },
            type: 'Literal',
            line: 1
          }
        ]
      }
    }),
    ...invalidElements.map((name) => {
      return {
        filename: 'test.vue',
        code: `app.component('${name}', component)`,
        parserOptions,
        errors: [
          {
            messageId: RESERVED_NAMES_IN_HTML.has(name)
              ? 'reservedInHtml'
              : 'reserved',
            data: { name },
            type: 'Literal',
            line: 1
          }
        ]
      }
    }),
    ...invalidElements.map((name) => {
      return {
        filename: 'test.vue',
        code: `Vue.component(\`${name}\`, {})`,
        parserOptions,
        errors: [
          {
            messageId: RESERVED_NAMES_IN_HTML.has(name)
              ? 'reservedInHtml'
              : 'reserved',
            data: { name },
            type: 'TemplateLiteral',
            line: 1
          }
        ]
      }
    }),
    ...invalidElements.map((name) => {
      return {
        filename: 'test.vue',
        code: `app.component(\`${name}\`, {})`,
        parserOptions,
        errors: [
          {
            messageId: RESERVED_NAMES_IN_HTML.has(name)
              ? 'reservedInHtml'
              : 'reserved',
            data: { name },
            type: 'TemplateLiteral',
            line: 1
          }
        ]
      }
    }),
    ...invalidElements.map((name) => {
      return {
        filename: 'test.vue',
        code: `export default {
          components: {
            '${name}': {},
          }
        }`,
        parserOptions,
        errors: [
          {
            messageId: RESERVED_NAMES_IN_HTML.has(name)
              ? 'reservedInHtml'
              : 'reserved',
            data: { name },
            type: 'Property',
            line: 3
          }
        ]
      }
    }),
    ...vue2BuiltInComponents.map((name) => {
      return {
        filename: `${name}.vue`,
        code: `
          export default {
            name: '${name}'
          }
        `,
        parserOptions,
        options: [{ disallowVueBuiltInComponents: true }],
        errors: [
          {
            messageId: 'reservedInVue',
            data: { name },
            type: 'Literal',
            line: 3
          }
        ]
      }
    }),
    ...vue2BuiltInComponents.map((name) => {
      return {
        filename: `${name}.vue`,
        code: `
          export default {
            name: '${name}'
          }
        `,
        parserOptions,
        options: [{ disallowVue3BuiltInComponents: true }],
        errors: [
          {
            messageId: 'reservedInVue',
            data: { name },
            type: 'Literal',
            line: 3
          }
        ]
      }
    }),
    ...vue3BuiltInComponents.map((name) => {
      return {
        filename: `${name}.vue`,
        code: `
          export default {
            name: '${name}'
          }
        `,
        parserOptions,
        options: [{ disallowVue3BuiltInComponents: true }],
        errors: [
          {
            messageId: 'reservedInVue3',
            data: { name },
            type: 'Literal',
            line: 3
          }
        ]
      }
    })
  ]
})
