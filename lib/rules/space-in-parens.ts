/**
 * @author Yosuke Ota
 */
import utils from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapStylisticOrCoreRule('space-in-parens', {
  skipDynamicArguments: true,
  skipDynamicArgumentsReport: true,
  applyDocument: true
})
