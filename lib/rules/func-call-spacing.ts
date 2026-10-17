/**
 * @author Yosuke Ota
 */
import utils from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapStylisticOrCoreRule(
  {
    core: 'func-call-spacing',
    stylistic: 'function-call-spacing',
    vue: 'func-call-spacing'
  },
  {
    skipDynamicArguments: true,
    applyDocument: true
  }
)
