/**
 * @author Yosuke Ota
 */
import utils from '../utils/index.ts'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapStylisticOrCoreRule('brace-style', {
  skipDynamicArguments: true
})
