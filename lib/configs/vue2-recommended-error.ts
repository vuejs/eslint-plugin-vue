/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export default {
  extends: require.resolve('./vue2-strongly-recommended-error.js'),
  rules: {
    'vue/attributes-order': 'error',
    'vue/block-order': 'error',
    'vue/no-lone-template': 'error',
    'vue/no-multiple-slot-args': 'error',
    'vue/no-required-prop-with-default': 'error',
    'vue/no-v-html': 'error',
    'vue/order-in-components': 'error',
    'vue/this-in-template': 'error'
  }
}
