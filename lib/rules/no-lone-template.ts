/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

// https://github.com/vuejs/vue-next/blob/64e2f4643602c5980361e66674141e61ba60ef70/packages/compiler-core/src/parse.ts#L405
const SPECIAL_TEMPLATE_DIRECTIVES = new Set([
  'if',
  'else',
  'else-if',
  'for',
  'slot'
])

function getKeyName(attr: VAttribute | VDirective) {
  if (attr.directive) {
    return attr.key.name.name !== 'bind' ||
      !attr.key.argument ||
      attr.key.argument.type === 'VExpressionContainer'
      ? null
      : attr.key.argument.name
  }
  return attr.key.name
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unnecessary `<template>`',
      categories: ['vue3-recommended', 'vue2-recommended'],
      url: 'https://eslint.vuejs.org/rules/no-lone-template.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreAccessible: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      requireDirective: '`<template>` require directive.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const shouldIgnoreAccessible = options.ignoreAccessible === true

    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='template'][parent.type='VElement'] > VStartTag"(
        node: VStartTag
      ) {
        if (
          node.attributes.some((attr) => {
            if (attr.directive) {
              const directiveName = attr.key.name.name
              if (
                directiveName === 'slot-scope' ||
                directiveName === 'scope' ||
                SPECIAL_TEMPLATE_DIRECTIVES.has(directiveName)
              ) {
                return true
              }
            }

            const keyName = getKeyName(attr)
            // `slot` is deprecated in Vue.js 2.6
            return keyName === 'slot'
          }) ||
          (shouldIgnoreAccessible &&
            node.attributes.some((attr) => {
              const keyName = getKeyName(attr)
              return keyName === 'id' || keyName === 'ref'
            }))
        ) {
          return
        }

        context.report({
          node,
          messageId: 'requireDirective'
        })
      }
    })
  }
}
