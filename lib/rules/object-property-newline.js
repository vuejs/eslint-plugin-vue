/**
 * @author Yosuke Ota
 */

import wrapStylisticOrCoreRuleModule from '../utils/index.js'

const { wrapStylisticOrCoreRule } = wrapStylisticOrCoreRuleModule

// eslint-disable-next-line internal/no-invalid-meta
export default wrapStylisticOrCoreRule('object-property-newline', {
  skipDynamicArguments: true
})
