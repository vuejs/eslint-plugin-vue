/**
 * @author Toru Nagashima
 */
import utils from '../utils/index.ts'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapStylisticOrCoreRule('array-bracket-spacing', {
  skipDynamicArguments: true
})
