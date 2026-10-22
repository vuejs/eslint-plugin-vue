/**
 * @author Toru Nagashima
 */
import utils from '../utils/index.ts'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapStylisticOrCoreRule('object-curly-spacing', {
  skipDynamicArguments: true
})
