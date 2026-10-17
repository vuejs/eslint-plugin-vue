/**
 * @author Toru Nagashima
 */
import utils from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapStylisticOrCoreRule('space-infix-ops', {
  skipDynamicArguments: true,
  applyDocument: true
})
