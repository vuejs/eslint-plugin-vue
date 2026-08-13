/**
 * @author Toru Nagashima
 */

import { wrapStylisticOrCoreRule } from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default wrapStylisticOrCoreRule('space-infix-ops', {
  skipDynamicArguments: true,
  applyDocument: true
})
