/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow `export` in `<script setup>`',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-export-in-script-setup.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: '`<script setup>` cannot contain ES module exports.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @param {ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration} node */
    function report(node) {
      context.report({
        node,
        messageId: 'forbidden'
      })
    }

    return utils.defineScriptSetupVisitor(context, {
      ExportAllDeclaration: report,
      ExportDefaultDeclaration: report,
      ExportNamedDeclaration: report
    })
  }
}
