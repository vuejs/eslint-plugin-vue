import { isVElement } from '../index.ts'

export class StyleVariablesContext {
  context: RuleContext
  styles: VElement[]
  references: VReference[]
  vBinds: VExpressionContainer[]

  constructor(context: RuleContext, styles: VElement[]) {
    this.context = context
    this.styles = styles
    this.references = []
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

const cache = new WeakMap<VElement, StyleVariablesContext>()
/**
 * Get the style vars context
 */
export function getStyleVariablesContext(
  context: RuleContext
): StyleVariablesContext | null {
  const sourceCode = context.sourceCode
  const df =
    sourceCode.parserServices.getDocumentFragment &&
    sourceCode.parserServices.getDocumentFragment()
  if (!df) {
    return null
  }
  const styles = df.children.filter(
    (e): e is VElement => isVElement(e) && e.name === 'style'
  )
  if (styles.length === 0) {
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
