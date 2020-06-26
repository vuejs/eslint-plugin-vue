/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
/**
 * check whether has attribute `src`
 */
function hasAttributeSrc(componentBlock) {
  const hasAttribute = componentBlock.startTag.attributes.length > 0

  const hasSrc =
    componentBlock.startTag.attributes.filter(
      (attribute) =>
        attribute.key.name === 'src' && attribute.value.value !== ''
    ).length > 0

  return hasAttribute && hasSrc
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow the `<template>` `<script>` `<style>` block to be empty',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-empty-component-block.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: '`<{{ blockName }}>` is empty. Empty block is not allowed.'
    }
  },

  /**
   * @param {RuleContext} context - The rule context.
   * @returns {RuleListener} AST event handlers.
   */
  create(context) {
    return {
      Program(node) {
        const componentBlocks = node.templateBody.parent.children

        for (const componentBlock of componentBlocks) {
          if (
            componentBlock.name !== 'template' &&
            componentBlock.name !== 'script' &&
            componentBlock.name !== 'style'
          )
            return

          // https://vue-loader.vuejs.org/spec.html#src-imports
          if (hasAttributeSrc(componentBlock)) return

          if (componentBlock.children.length === 0) {
            context.report({
              node: componentBlock,
              loc: componentBlock.loc,
              messageId: 'unexpected',
              data: {
                blockName: componentBlock.name
              }
            })
          }
        }
      }
    }
  }
}
