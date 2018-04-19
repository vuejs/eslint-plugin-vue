/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow `key` attribute on `<template>`',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.5.0/docs/rules/no-template-key.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='template']" (node) {
        if (utils.hasAttribute(node, 'key') || utils.hasDirective(node, 'bind', 'key')) {
          context.report({
            node: node,
            loc: node.loc,
            message: "'<template>' cannot be keyed. Place the key on real elements instead."
          })
        }
      }
    })
  }
}
