/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

/**
 * check whether a tag has the `scoped` attribute
 */
function isScoped(componentBlock: VElement) {
  return componentBlock.startTag.attributes.some(
    (attribute) => !attribute.directive && attribute.key.name === 'scoped'
  )
}

/**
 * check whether a tag has the `module` attribute
 */
function isModule(componentBlock: VElement) {
  return componentBlock.startTag.attributes.some(
    (attribute) => !attribute.directive && attribute.key.name === 'module'
  )
}

/**
 * check if a tag doesn't have either the `scoped` nor `module` attribute
 */
function isPlain(componentBlock: VElement) {
  return !isScoped(componentBlock) && !isModule(componentBlock)
}

function getUserDefinedAllowedAttrs(context: RuleContext) {
  return context.options[0] && context.options[0].allow
    ? context.options[0].allow
    : []
}

const defaultAllowedAttrs = ['scoped']

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce or forbid the use of the `scoped` and `module` attributes in SFC top level style tags',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/enforce-style-attribute.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
              type: 'string',
              enum: ['plain', 'scoped', 'module']
            }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      notAllowedScoped:
        'The scoped attribute is not allowed. Allowed: {{ allowedAttrsString }}.',
      notAllowedModule:
        'The module attribute is not allowed. Allowed: {{ allowedAttrsString }}.',
      notAllowedPlain:
        'Plain <style> tags are not allowed. Allowed: {{ allowedAttrsString }}.'
    }
  },

  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    if (!sourceCode.parserServices.getDocumentFragment) {
      return {}
    }
    const documentFragment = sourceCode.parserServices.getDocumentFragment()
    if (!documentFragment) {
      return {}
    }

    const topLevelStyleTags = documentFragment.children.filter(
      (element): element is VElement =>
        utils.isVElement(element) && element.rawName === 'style'
    )

    if (topLevelStyleTags.length === 0) {
      return {}
    }

    const userDefinedAllowedAttrs = getUserDefinedAllowedAttrs(context)
    const allowedAttrs =
      userDefinedAllowedAttrs.length > 0
        ? userDefinedAllowedAttrs
        : defaultAllowedAttrs

    const allowsPlain = allowedAttrs.includes('plain')
    const allowsScoped = allowedAttrs.includes('scoped')
    const allowsModule = allowedAttrs.includes('module')
    const allowedAttrsString = [...allowedAttrs]
      .sort((a, b) => a.localeCompare(b))
      .join(', ')

    return {
      Program() {
        for (const styleTag of topLevelStyleTags) {
          if (!allowsPlain && isPlain(styleTag)) {
            context.report({
              node: styleTag,
              messageId: 'notAllowedPlain',
              data: {
                allowedAttrsString
              }
            })
            return
          }

          if (!allowsScoped && isScoped(styleTag)) {
            context.report({
              node: styleTag,
              messageId: 'notAllowedScoped',
              data: {
                allowedAttrsString
              }
            })
            return
          }

          if (!allowsModule && isModule(styleTag)) {
            context.report({
              node: styleTag,
              messageId: 'notAllowedModule',
              data: {
                allowedAttrsString
              }
            })
            return
          }
        }
      }
    }
  }
}
