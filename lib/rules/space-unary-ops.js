/**
 * @author Toru Nagashima
 */

import { wrapStylisticOrCoreRule } from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default wrapStylisticOrCoreRule('space-unary-ops', {
  skipDynamicArguments: true,
  applyDocument: true
})
