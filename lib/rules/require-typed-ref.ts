/**
 * @author Ivan Demchuk <https://github.com/Demivan>
 * See LICENSE file in root directory for full license.
 */
import { iterateDefineRefs } from '../utils/ref-object-references.ts'
import utils from '../utils/index.js'

function isNullOrUndefined(node: Expression | SpreadElement) {
  return (
    (node.type === 'Literal' && node.value === null) ||
    (node.type === 'Identifier' && node.name === 'undefined')
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require `ref` and `shallowRef` functions to be strongly typed',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-typed-ref.html'
    },
    fixable: null,
    schema: [],
    messages: {
      noType:
        'Specify type parameter for `{{name}}` function, otherwise created variable will not be typechecked.'
    }
  },
  create(context: RuleContext) {
    const filename = context.filename
    if (!utils.isVueFile(filename) && !utils.isTypeScriptFile(filename)) {
      return {}
    }

    if (utils.isVueFile(filename)) {
      const sourceCode = context.sourceCode
      const documentFragment =
        sourceCode.parserServices.getDocumentFragment &&
        sourceCode.parserServices.getDocumentFragment()
      if (!documentFragment) {
        return {}
      }
      const scripts = documentFragment.children.filter(
        (element): element is VElement =>
          utils.isVElement(element) && element.name === 'script'
      )
      if (
        scripts.every((script) => !utils.hasAttribute(script, 'lang', 'ts'))
      ) {
        return {}
      }
    }

    const defines = iterateDefineRefs(
      context.sourceCode.scopeManager.globalScope!
    )

    function report(name: string, node: CallExpression) {
      context.report({
        node,
        messageId: 'noType',
        data: {
          name
        }
      })
    }

    return {
      Program() {
        for (const ref of defines) {
          if (ref.name !== 'ref' && ref.name !== 'shallowRef') {
            continue
          }

          if (
            ref.node.arguments.length > 0 &&
            !isNullOrUndefined(ref.node.arguments[0])
          ) {
            continue
          }

          const typeArguments =
            'typeArguments' in ref.node
              ? ref.node.typeArguments
              : ref.node.typeParameters
          if (typeArguments == null) {
            if (
              ref.node.parent.type === 'VariableDeclarator' &&
              ref.node.parent.id.type === 'Identifier'
            ) {
              if (ref.node.parent.id.typeAnnotation == null) {
                report(ref.name, ref.node)
              }
            } else {
              report(ref.name, ref.node)
            }
          }
        }
      }
    }
  }
}
