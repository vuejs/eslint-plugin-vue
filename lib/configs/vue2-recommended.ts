/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import { fileURLToPath } from 'node:url'

export default {
  extends: fileURLToPath(
    new URL('vue2-strongly-recommended.js', import.meta.url)
  ),
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
