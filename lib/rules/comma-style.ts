/**
 * @author Yosuke Ota
 */
import utils from '../utils/index.js'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapStylisticOrCoreRule('comma-style', {
  create(_context, { baseHandlers }) {
    return {
      VSlotScopeExpression(node) {
        if (baseHandlers.FunctionExpression) {
          // @ts-expect-error -- Process params of VSlotScopeExpression as FunctionExpression.
          baseHandlers.FunctionExpression(node)
        }
      }
    }
  }
})
