/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
 */
import { toRegExpGroupMatcher } from '../utils/regexp.ts'
import utils from '../utils/index.js'

type PreferOption = 'always' | 'never'

function getAttributeName(node: VDirective | VAttribute): string | null {
  if (!node.directive) {
    return node.key.rawName
  }

  if (
    (node.key.name.name === 'bind' || node.key.name.name === 'model') &&
    node.key.argument &&
    node.key.argument.type === 'VIdentifier'
  ) {
    return node.key.argument.rawName
  }

  return null
}

function shouldConvertToLongForm(
  node: VAttribute | VDirective,
  isExcepted: boolean,
  option: PreferOption
): node is VAttribute {
  return (
    !node.directive &&
    !node.value &&
    (option === 'always' ? isExcepted : !isExcepted)
  )
}

function shouldConvertToShortForm(
  node: VAttribute | VDirective,
  isExcepted: boolean,
  option: PreferOption
): node is VDirective {
  const isLiteralTrue =
    node.directive &&
    node.value?.expression?.type === 'Literal' &&
    node.value.expression.value === true &&
    Boolean(node.key.argument)

  return isLiteralTrue && (option === 'always' ? !isExcepted : isExcepted)
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require shorthand form attribute when `v-bind` value is `true`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-true-attribute-shorthand.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [
      { enum: ['always', 'never'] },
      {
        type: 'object',
        properties: {
          except: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      expectShort:
        "Boolean prop with 'true' value should be written in shorthand form.",
      expectLong:
        "Boolean prop with 'true' value should be written in long form.",
      rewriteIntoShort: 'Rewrite this prop into shorthand form.',
      rewriteIntoLongVueProp:
        'Rewrite this prop into long-form Vue component prop.',
      rewriteIntoLongHtmlAttr:
        'Rewrite this prop into long-form HTML attribute.'
    }
  },
  create(context: RuleContext) {
    const option: PreferOption = context.options[0] || 'always'
    const exceptMatcher = toRegExpGroupMatcher(context.options[1]?.except)

    function reportLongForm(
      node: VAttribute | VDirective,
      messageId: string,
      longVuePropText: string,
      longHtmlAttrText: string
    ) {
      context.report({
        node,
        messageId,
        suggest: [
          {
            messageId: 'rewriteIntoLongVueProp',
            fix: (fixer) => fixer.replaceText(node, longVuePropText)
          },
          {
            messageId: 'rewriteIntoLongHtmlAttr',
            fix: (fixer) => fixer.replaceText(node, longHtmlAttrText)
          }
        ]
      })
    }

    function reportShortForm(
      node: VAttribute | VDirective,
      messageId: string,
      shortFormText: string
    ) {
      context.report({
        node,
        messageId,
        suggest: [
          {
            messageId: 'rewriteIntoShort',
            fix: (fixer) => fixer.replaceText(node, shortFormText)
          }
        ]
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      VAttribute(node) {
        if (!utils.isCustomComponent(node.parent.parent)) return

        const name = getAttributeName(node)
        if (name === null) return

        const isExcepted = exceptMatcher(name)

        if (shouldConvertToLongForm(node, isExcepted, option)) {
          const key = node.key
          reportLongForm(
            node,
            'expectLong',
            `:${key.rawName}="true"`,
            `${key.rawName}="${key.rawName}"`
          )
        } else if (shouldConvertToShortForm(node, isExcepted, option)) {
          const directiveKey = node.key
          if (
            directiveKey.argument &&
            directiveKey.argument.type === 'VIdentifier'
          ) {
            reportShortForm(node, 'expectShort', directiveKey.argument.rawName)
          }
        }
      }
    })
  }
}
