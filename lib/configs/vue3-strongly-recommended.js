/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
const ruleLevel =
  process.env.VUE_ESLINT_ALWAYS_ERROR === 'true' ? 'error' : 'warn'

module.exports = {
  extends: require.resolve('./vue3-essential'),
  rules: {
    'vue/attribute-hyphenation': ruleLevel,
    'vue/component-definition-name-casing': ruleLevel,
    'vue/first-attribute-linebreak': ruleLevel,
    'vue/html-closing-bracket-newline': ruleLevel,
    'vue/html-closing-bracket-spacing': ruleLevel,
    'vue/html-end-tags': ruleLevel,
    'vue/html-indent': ruleLevel,
    'vue/html-quotes': ruleLevel,
    'vue/html-self-closing': ruleLevel,
    'vue/max-attributes-per-line': ruleLevel,
    'vue/multiline-html-element-content-newline': ruleLevel,
    'vue/mustache-interpolation-spacing': ruleLevel,
    'vue/no-multi-spaces': ruleLevel,
    'vue/no-spaces-around-equal-signs-in-attribute': ruleLevel,
    'vue/no-template-shadow': ruleLevel,
    'vue/one-component-per-file': ruleLevel,
    'vue/prop-name-casing': ruleLevel,
    'vue/require-default-prop': ruleLevel,
    'vue/require-explicit-emits': ruleLevel,
    'vue/require-prop-types': ruleLevel,
    'vue/singleline-html-element-content-newline': ruleLevel,
    'vue/v-bind-style': ruleLevel,
    'vue/v-on-event-hyphenation': [
      ruleLevel,
      'always',
      {
        autofix: true
      }
    ],
    'vue/v-on-style': ruleLevel,
    'vue/v-slot-style': ruleLevel
  }
}
