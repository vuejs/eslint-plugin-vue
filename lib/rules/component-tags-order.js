'use strict'

const baseRule = require('./block-order')

module.exports = {
  // eslint-disable-next-line eslint-plugin/require-meta-schema -- inherit schema from base rule
  meta: {
    ...baseRule.meta,
    type: baseRule.meta.type,
    docs: {
      description: baseRule.meta.docs.description,
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/component-tags-order.html'
    },
    deprecated: true,
    replacedBy: ['block-order']
  },
  /** @param {RuleContext} context */
  create(context) {
    return baseRule.create(context)
  }
}
