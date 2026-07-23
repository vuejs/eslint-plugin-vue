/* eslint-disable unicorn/no-top-level-side-effects -- CLI entry point. */
/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

await import('./update-no-layout-rules-config.js')
await import('./update-lib-configs.js')
await import('./update-lib-flat-configs.js')
await import('./update-lib-plugin.js')
await import('./update-docs.js')
await import('./update-docs-rules-index.js')

export {}
