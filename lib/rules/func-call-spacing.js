/**
 * @author Yosuke Ota
 */

import wrapStylisticOrCoreRuleModule from '../utils/index.js'

const { wrapStylisticOrCoreRule } = wrapStylisticOrCoreRuleModule

// eslint-disable-next-line internal/no-invalid-meta
export default wrapStylisticOrCoreRule(
  {
    core: 'func-call-spacing',
    stylistic: 'function-call-spacing',
    vue: 'func-call-spacing'
  },
  {
    skipDynamicArguments: true,
    applyDocument: true
  }
)
