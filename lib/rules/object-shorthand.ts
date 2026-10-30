/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapCoreRule('object-shorthand', {
  skipDynamicArguments: true
})
