const configs = {
  // eslintrc configs
  base: require('./base'),

  'vue2-essential': require('./vue2-essential'),
  'vue2-strongly-recommended': require('./vue2-strongly-recommended'),
  'vue2-recommended': require('./vue2-recommended'),

  essential: require('./vue3-essential'),
  'strongly-recommended': require('./vue3-strongly-recommended'),
  recommended: require('./vue3-recommended'),

  // flat configs
  'flat/base': require('./flat/base.js'),

  'flat/vue2-essential': require('./flat/vue2-essential.js'),
  'flat/vue2-strongly-recommended': require('./flat/vue2-strongly-recommended.js'),
  'flat/vue2-recommended': require('./flat/vue2-recommended.js'),

  'flat/essential': require('./flat/vue3-essential.js'),
  'flat/strongly-recommended': require('./flat/vue3-strongly-recommended.js'),
  'flat/recommended': require('./flat/vue3-recommended.js'),

  // config-format-agnostic configs
  'no-layout-rules': require('./no-layout-rules')
}

module.exports = configs
