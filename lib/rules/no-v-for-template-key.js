/**
 * @author Yosuke Ota
 */
'use strict'

const {
  defineTemplateBodyVisitor,
  getAttribute,
  getDirective
} = require('../utils/index.ts')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow `key` attribute on `<template v-for>`',
      categories: ['vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-v-for-template-key.html'
    },
    fixable: null,
    deprecated: true,
    schema: [],
    messages: {
      disallow:
        "'<template v-for>' cannot be keyed. Place the key on real elements instead."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VElement[name='template'] > VStartTag > VAttribute[directive=true][key.name.name='for']"(
        node
      ) {
        const element = node.parent.parent
        const keyNode =
          getAttribute(element, 'key') || getDirective(element, 'bind', 'key')
        if (keyNode) {
          context.report({
            node: keyNode,
            loc: keyNode.loc,
            messageId: 'disallow'
          })
        }
      }
    })
  }
}
