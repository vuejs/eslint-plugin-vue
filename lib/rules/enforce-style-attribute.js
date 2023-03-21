/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { isVElement } = require('../utils')

/**
 * check whether a tag has the `scoped` attribute
 * @param {VElement} componentBlock
 */
function isScoped(componentBlock) {
  return componentBlock.startTag.attributes.some(
    (attribute) => !attribute.directive && attribute.key.name === 'scoped'
  )
}

/**
 * check whether a tag has the `module` attribute
 * @param {VElement} componentBlock
 */
function isModule(componentBlock) {
  return componentBlock.startTag.attributes.some(
    (attribute) => !attribute.directive && attribute.key.name === 'module'
  )
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce either the `scoped` or `module`  attribute in SFC top level style tags',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/enforce-style-attribute.html'
    },
    fixable: 'code',
    schema: [{ enum: ['scoped', 'module', 'either'] }],
    messages: {
      needsScoped: 'The <style> tag should have the scoped attribute.',
      needsModule: 'The <style> tag should have the module attribute.',
      needsEither:
        'The <style> tag should have either the scoped or module attribute.'
    }
  },

  /** @param {RuleContext} context */
  create(context) {
    if (!context.parserServices.getDocumentFragment) {
      return {}
    }
    const documentFragment = context.parserServices.getDocumentFragment()
    if (!documentFragment) {
      return {}
    }

    const topLevelElements = documentFragment.children.filter(isVElement)
    const topLevelStyleTags = topLevelElements.filter(
      (element) => element.rawName === 'style'
    )

    if (topLevelStyleTags.length === 0) {
      return {}
    }

    const mode = context.options[0] || 'either'
    const needsScoped = mode === 'scoped'
    const needsModule = mode === 'module'
    const needsEither = mode === 'either'

    return {
      Program() {
        for (const styleTag of topLevelStyleTags) {
          if (needsScoped && !isScoped(styleTag)) {
            context.report({
              node: styleTag,
              messageId: 'needsScoped'
            })
            return
          }

          if (needsModule && !isModule(styleTag)) {
            context.report({
              node: styleTag,
              messageId: 'needsModule'
            })
            return
          }

          if (needsEither && !isScoped(styleTag) && !isModule(styleTag)) {
            context.report({
              node: styleTag,
              messageId: 'needsEither'
            })
            return
          }
        }
      }
    }
  }
}
