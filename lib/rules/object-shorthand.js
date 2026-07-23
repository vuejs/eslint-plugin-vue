/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */

import wrapCoreRuleModule from '../utils/index.js'

const { wrapCoreRule } = wrapCoreRuleModule

// eslint-disable-next-line internal/no-invalid-meta
export default wrapCoreRule('object-shorthand', {
  skipDynamicArguments: true
})
