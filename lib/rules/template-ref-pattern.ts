/**
 * @author Diogo Esteves
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { isRegExp, toRegExp } from '../utils/regexp.ts'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce a naming pattern for template refs',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/template-ref-pattern.html'
    },
    fixable: null,
    schema: [{ type: 'string' }],
    messages: {
      invalidRefName:
        "Template ref name '{{name}}' does not match the pattern '{{pattern}}'."
    }
  },
  create(context: RuleContext) {
    if (context.options[0] == null) {
      return {}
    }
    const pattern: string = context.options[0]
    const regExp = isRegExp(pattern)
      ? toRegExp(pattern, { remove: 'g' })
      : new RegExp(pattern, 'u')

    function verify(name: string, node: ASTNode) {
      if (regExp.test(name)) {
        return
      }
      context.report({
        node,
        messageId: 'invalidRefName',
        data: { name, pattern }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=false][key.name='ref'][value!=null]"(
        node: VAttribute & { value: VLiteral }
      ) {
        verify(node.value.value, node.value)
      },
      "VAttribute[directive=true][key.name.name='bind'][key.argument.name='ref'] > VExpressionContainer.value"(
        node: VExpressionContainer
      ) {
        const expression = node.expression
        if (!expression || !utils.isStringLiteral(expression)) {
          return
        }
        const name = utils.getStringLiteralValue(expression)
        if (name != null) {
          verify(name, expression)
        }
      }
    })
  }
}
