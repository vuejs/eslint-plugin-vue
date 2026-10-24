/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

/**
 * check whether has attribute `src`
 */
function hasAttributeSrc(componentBlock: VElement) {
  const hasAttribute = componentBlock.startTag.attributes.length > 0

  const hasSrc = componentBlock.startTag.attributes.some(
    (attribute) =>
      !attribute.directive &&
      attribute.key.name === 'src' &&
      attribute.value &&
      attribute.value.value !== ''
  )

  return hasAttribute && hasSrc
}

/**
 * check whether value under the component block is only whitespaces or break lines
 */
function isValueOnlyWhiteSpacesOrLineBreaks(componentBlock: VElement) {
  return (
    componentBlock.children.length === 1 &&
    componentBlock.children[0].type === 'VText' &&
    !componentBlock.children[0].value.trim()
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow the `<template>` `<script>` `<style>` block to be empty',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-empty-component-block.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      unexpected: '`<{{ blockName }}>` is empty. Empty block is not allowed.'
    }
  },

  create(context: RuleContext): RuleListener {
    const sourceCode = context.sourceCode
    if (!sourceCode.parserServices.getDocumentFragment) {
      return {}
    }
    const documentFragment = sourceCode.parserServices.getDocumentFragment()
    if (!documentFragment) {
      return {}
    }

    const componentBlocks = documentFragment.children.filter(utils.isVElement)

    return {
      Program() {
        for (const componentBlock of componentBlocks) {
          if (
            (componentBlock.name !== 'template' &&
              componentBlock.name !== 'script' &&
              componentBlock.name !== 'style') ||
            hasAttributeSrc(componentBlock) // https://vue-loader.vuejs.org/spec.html#src-imports
          ) {
            continue
          }

          if (
            isValueOnlyWhiteSpacesOrLineBreaks(componentBlock) ||
            componentBlock.children.length === 0
          ) {
            context.report({
              node: componentBlock,
              loc: componentBlock.loc,
              messageId: 'unexpected',
              data: {
                blockName: componentBlock.name
              },
              fix(fixer) {
                return fixer.remove(componentBlock)
              }
            })
          }
        }
      }
    }
  }
}
