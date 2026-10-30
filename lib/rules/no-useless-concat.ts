/**
 * @author Yosuke Ota
 */
import utils from '../utils/index.ts'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapCoreRule('no-useless-concat', {
  applyDocument: true
})
