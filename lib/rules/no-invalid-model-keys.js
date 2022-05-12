'use strict'

const baseRule = require('./valid-model-definition')

module.exports = {
  meta: {
    ...baseRule.meta,
    type: baseRule.meta.type,
    docs: {
      description: baseRule.meta.docs.description,
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-invalid-model-keys.html'
    },
    deprecated: true,
    replacedBy: ['valid-model-definition'],
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    return baseRule.create(context)
  }
}
