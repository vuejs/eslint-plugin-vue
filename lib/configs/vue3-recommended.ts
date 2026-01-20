/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export default {
  extends: require.resolve('./vue3-strongly-recommended.js'),
  rules: {
    'vue/attributes-order': 'warn',
    'vue/block-order': 'warn',
    'vue/no-lone-template': 'warn',
    'vue/no-multiple-slot-args': 'warn',
    'vue/no-required-prop-with-default': 'warn',
    'vue/no-v-html': 'warn',
    'vue/order-in-components': 'warn',
    'vue/this-in-template': 'warn'
  }
}
