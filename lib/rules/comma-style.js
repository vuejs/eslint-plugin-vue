/**
 * @author Yosuke Ota
 */

import wrapStylisticOrCoreRuleModule from '../utils/index.js'

const { wrapStylisticOrCoreRule } = wrapStylisticOrCoreRuleModule

// eslint-disable-next-line internal/no-invalid-meta
export default wrapStylisticOrCoreRule('comma-style', {
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
