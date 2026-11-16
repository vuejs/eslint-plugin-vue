import flatBase from './flat/base.ts'
import flatVue2Essential from './flat/vue2-essential.ts'
import flatVue2StronglyRecommended from './flat/vue2-strongly-recommended.ts'
import flatVue2StronglyRecommendedError from './flat/vue2-strongly-recommended-error.ts'
import flatVue2Recommended from './flat/vue2-recommended.ts'
import flatVue2RecommendedError from './flat/vue2-recommended-error.ts'
import flatVue3Essential from './flat/vue3-essential.ts'
import flatVue3StronglyRecommended from './flat/vue3-strongly-recommended.ts'
import flatVue3StronglyRecommendedError from './flat/vue3-strongly-recommended-error.ts'
import flatVue3Recommended from './flat/vue3-recommended.ts'
import flatVue3RecommendedError from './flat/vue3-recommended-error.ts'
import noLayoutRules from './no-layout-rules.ts'

const configs = {
  'flat/base': flatBase,

  'flat/vue2-essential': flatVue2Essential,
  'flat/vue2-strongly-recommended': flatVue2StronglyRecommended,
  'flat/vue2-strongly-recommended-error': flatVue2StronglyRecommendedError,
  'flat/vue2-recommended': flatVue2Recommended,
  'flat/vue2-recommended-error': flatVue2RecommendedError,

  'flat/essential': flatVue3Essential,
  'flat/strongly-recommended': flatVue3StronglyRecommended,
  'flat/strongly-recommended-error': flatVue3StronglyRecommendedError,
  'flat/recommended': flatVue3Recommended,
  'flat/recommended-error': flatVue3RecommendedError,

  'no-layout-rules': noLayoutRules
}

export default configs
