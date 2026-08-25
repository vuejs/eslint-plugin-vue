/**
 * @author Toru Nagashima
 */

import { wrapCoreRule } from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default wrapCoreRule('eqeqeq', {
  applyDocument: true
})
