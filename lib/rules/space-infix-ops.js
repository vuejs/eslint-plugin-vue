/**
 * @author Toru Nagashima
 */

import wrapStylisticOrCoreRuleModule from '../utils/index.js'

const { wrapStylisticOrCoreRule } = wrapStylisticOrCoreRuleModule

// eslint-disable-next-line internal/no-invalid-meta
export default wrapStylisticOrCoreRule('space-infix-ops', {
  skipDynamicArguments: true,
  applyDocument: true
})
