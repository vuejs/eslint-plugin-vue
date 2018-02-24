/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update it's content execute "npm run update"
 */
'use strict'

module.exports = {
  rules: {
    'attribute-hyphenation': require('./rules/attribute-hyphenation'),
    'attributes-order': require('./rules/attributes-order'),
    'comment-directive': require('./rules/comment-directive'),
    'html-closing-bracket-newline': require('./rules/html-closing-bracket-newline'),
    'html-closing-bracket-spacing': require('./rules/html-closing-bracket-spacing'),
    'html-end-tags': require('./rules/html-end-tags'),
    'html-indent': require('./rules/html-indent'),
    'html-quotes': require('./rules/html-quotes'),
    'html-self-closing': require('./rules/html-self-closing'),
    'jsx-uses-vars': require('./rules/jsx-uses-vars'),
    'max-attributes-per-line': require('./rules/max-attributes-per-line'),
    'mustache-interpolation-spacing': require('./rules/mustache-interpolation-spacing'),
    'name-property-casing': require('./rules/name-property-casing'),
    'no-async-in-computed-properties': require('./rules/no-async-in-computed-properties'),
    'no-confusing-v-for-v-if': require('./rules/no-confusing-v-for-v-if'),
    'no-dupe-keys': require('./rules/no-dupe-keys'),
    'no-duplicate-attributes': require('./rules/no-duplicate-attributes'),
    'no-multi-spaces': require('./rules/no-multi-spaces'),
    'no-parsing-error': require('./rules/no-parsing-error'),
    'no-reserved-keys': require('./rules/no-reserved-keys'),
    'no-shared-component-data': require('./rules/no-shared-component-data'),
    'no-side-effects-in-computed-properties': require('./rules/no-side-effects-in-computed-properties'),
    'no-template-key': require('./rules/no-template-key'),
    'no-textarea-mustache': require('./rules/no-textarea-mustache'),
    'no-unused-vars': require('./rules/no-unused-vars'),
    'order-in-components': require('./rules/order-in-components'),
    'prop-name-casing': require('./rules/prop-name-casing'),
    'require-component-is': require('./rules/require-component-is'),
    'require-default-prop': require('./rules/require-default-prop'),
    'require-prop-types': require('./rules/require-prop-types'),
    'require-render-return': require('./rules/require-render-return'),
    'require-v-for-key': require('./rules/require-v-for-key'),
    'require-valid-default-prop': require('./rules/require-valid-default-prop'),
    'return-in-computed-property': require('./rules/return-in-computed-property'),
    'script-indent': require('./rules/script-indent'),
    'this-in-template': require('./rules/this-in-template'),
    'v-bind-style': require('./rules/v-bind-style'),
    'v-on-style': require('./rules/v-on-style'),
    'valid-template-root': require('./rules/valid-template-root'),
    'valid-v-bind': require('./rules/valid-v-bind'),
    'valid-v-cloak': require('./rules/valid-v-cloak'),
    'valid-v-else-if': require('./rules/valid-v-else-if'),
    'valid-v-else': require('./rules/valid-v-else'),
    'valid-v-for': require('./rules/valid-v-for'),
    'valid-v-html': require('./rules/valid-v-html'),
    'valid-v-if': require('./rules/valid-v-if'),
    'valid-v-model': require('./rules/valid-v-model'),
    'valid-v-on': require('./rules/valid-v-on'),
    'valid-v-once': require('./rules/valid-v-once'),
    'valid-v-pre': require('./rules/valid-v-pre'),
    'valid-v-show': require('./rules/valid-v-show'),
    'valid-v-text': require('./rules/valid-v-text')
  },
  configs: {
    'base': require('./configs/base'),
    'essential': require('./configs/essential'),
    'strongly-recommended': require('./configs/strongly-recommended'),
    'recommended': require('./configs/recommended')
  },
  processors: {
    '.vue': require('./processor')
  }
}
