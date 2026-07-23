/**
 * @author lozinsky <https://github.com/lozinsky>
 * See LICENSE file in root directory for full license.
 */

import utils from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapCoreRule('no-implicit-coercion', {
  applyDocument: true
})
