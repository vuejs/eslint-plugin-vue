/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapCoreRule('no-negated-condition', {
  applyDocument: true
})
