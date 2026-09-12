/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */

import { wrapCoreRule } from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default wrapCoreRule('no-loss-of-precision', {
  applyDocument: true
})
