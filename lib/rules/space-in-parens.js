/**
 * @author Yosuke Ota
 */

import { wrapStylisticOrCoreRule } from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default wrapStylisticOrCoreRule('space-in-parens', {
  skipDynamicArguments: true,
  skipDynamicArgumentsReport: true,
  applyDocument: true
})
