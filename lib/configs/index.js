const configs = {
  // eslintrc configs
  base: require('./base'),

  'vue2-essential': require('./vue2-essential'),
  'vue2-strongly-recommended': require('./vue2-strongly-recommended'),
  'vue2-strongly-recommended-error': require('./vue2-strongly-recommended-error'),
  'vue2-recommended': require('./vue2-recommended'),
  'vue2-recommended-error': require('./vue2-recommended-error'),

  essential: require('./vue3-essential'),
  'strongly-recommended': require('./vue3-strongly-recommended'),
  'strongly-recommended-error': require('./vue3-strongly-recommended-error'),
  recommended: require('./vue3-recommended'),
  'recommended-error': require('./vue3-recommended-error'),

  // flat configs
  'flat/base': require('./flat/base.js'),

  'flat/vue2-essential': require('./flat/vue2-essential.js'),
  'flat/vue2-strongly-recommended': require('./flat/vue2-strongly-recommended.js'),
  'flat/vue2-strongly-recommended-error': require('./flat/vue2-strongly-recommended-error.js'),
  'flat/vue2-recommended': require('./flat/vue2-recommended.js'),
  'flat/vue2-recommended-error': require('./flat/vue2-recommended-error.js'),

  'flat/essential': require('./flat/vue3-essential.js'),
  'flat/strongly-recommended': require('./flat/vue3-strongly-recommended.js'),
  'flat/strongly-recommended-error': require('./flat/vue3-strongly-recommended-error.js'),
  'flat/recommended': require('./flat/vue3-recommended.js'),
  'flat/recommended-error': require('./flat/vue3-recommended-error.js'),

  // config-format-agnostic configs
  'no-layout-rules': require('./no-layout-rules')
}

module.exports = configs
