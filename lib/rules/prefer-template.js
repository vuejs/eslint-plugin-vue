/**
 * @author Yosuke Ota
 */

import { wrapCoreRule } from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default wrapCoreRule('prefer-template', {
  applyDocument: true
})
