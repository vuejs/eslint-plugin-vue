/**
 * @author Yosuke Ota
 */

import wrapCoreRuleModule from '../utils/index.js'

const { wrapCoreRule } = wrapCoreRuleModule

// eslint-disable-next-line internal/no-invalid-meta
export default wrapCoreRule('prefer-template', {
  applyDocument: true
})
