/**
 * @fileoverview disallow the use of reserved names in component definitions
 * @author Jake Hassel <https://github.com/shadskii>
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')

const kebabCaseElements = [
  'annotation-xml',
  'color-profile',
  'font-face',
  'font-face-src',
  'font-face-uri',
  'font-face-format',
  'font-face-name',
  'missing-glyph'
]

const elementNames = [
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
  'xmp'
]

const RESERVED_NAMES = new Set(
  [
    ...kebabCaseElements,
    ...kebabCaseElements.map(name => casing.pascalCase(name)),
    ...elementNames,
    ...elementNames.map(name => name[0].toUpperCase() + name.substring(1, name.length))
  ])

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of reserved names in component definitions',
      category: 'essential',
      url: 'https://eslint.vuejs.org/rules/no-reserved-component-names.html'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    function canVerify (node) {
      return node.type === 'Literal' || (
        node.type === 'TemplateLiteral' &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
      )
    }

    function reportIfInvalid (node) {
      let nodeValue
      if (node.type === 'TemplateLiteral') {
        const quasis = node.quasis[0]
        nodeValue = quasis.value.cooked
      } else {
        nodeValue = node.value
      }
      if (RESERVED_NAMES.has(nodeValue)) {
        context.report({
          node: node,
          message: 'Name "{{value}}" is reserved.',
          data: {
            value: nodeValue
          }
        })
      }
    }

    return Object.assign({},
      {
        "CallExpression > MemberExpression > Identifier[name='component']" (node) {
          const parent = node.parent.parent
          const calleeObject = utils.unwrapTypes(parent.callee.object)

          if (calleeObject.type === 'Identifier' && calleeObject.name === 'Vue') {
            if (parent.arguments && parent.arguments.length === 2) {
              const argument = parent.arguments[0]

              if (canVerify(argument)) {
                reportIfInvalid(argument)
              }
            }
          }
        }
      },
      utils.executeOnVue(context, (obj) => {
        const node = obj.properties
          .find(item => (
            item.type === 'Property' &&
            item.key.name === 'name' &&
            canVerify(item.value)
          ))

        if (!node) return
        reportIfInvalid(node.value)
      })
    )
  }
}
