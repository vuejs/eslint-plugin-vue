/**
 * @author Yosuke Ota
 */

import { wrapStylisticOrCoreRule } from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default wrapStylisticOrCoreRule('object-property-newline', {
  skipDynamicArguments: true
})
