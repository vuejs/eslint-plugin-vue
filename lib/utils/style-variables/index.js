const { isVElement } = require('..')

class StyleVariablesContext {
  /**
   * @param {RuleContext} context
   * @param {VElement[]} styles
   */
  constructor(context, styles) {
    this.context = context
    this.styles = styles
    /** @type {VReference[]} */
    this.references = []
    /** @type {VExpressionContainer[]} */
    this.vBinds = []
    for (const style of styles) {
      for (const node of style.children) {
        if (node.type === 'VExpressionContainer') {
          this.vBinds.push(node)
          for (const ref of node.references.filter(
            (ref) => ref.variable == null
          )) {
            this.references.push(ref)
          }
        }
      }
    }
  }
}

module.exports = {
  getStyleVariablesContext,
  StyleVariablesContext
}

/** @type {Map<VElement, StyleVariablesContext>} */
const cache = new Map()
/**
 * Get the style vars context
 * @param {RuleContext} context
 * @returns {StyleVariablesContext | null}
 */
function getStyleVariablesContext(context) {
  const df =
    context.parserServices.getDocumentFragment &&
    context.parserServices.getDocumentFragment()
  if (!df) {
    return null
  }
  const styles = df.children
    .filter(isVElement)
    .filter((e) => e.name === 'style')
  if (!styles.length) {
    return null
  }
  let ctx = cache.get(styles[0])
  if (ctx) {
    return ctx
  }
  ctx = new StyleVariablesContext(context, styles)
  cache.set(styles[0], ctx)
  return ctx
}
