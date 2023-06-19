/**
 * @author Ivan Demchuk <https://github.com/Demivan>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { iterateDefineRefs } = require('../utils/ref-object-references')
const utils = require('../utils')

/**
 * @param {Expression|SpreadElement} node
 */
function isNullOrUndefined(node) {
  return (
    (node.type === 'Literal' && node.value === null) ||
    (node.type === 'Identifier' && node.name === 'undefined')
  )
}

/**
 * @typedef {import('../utils/ref-object-references').RefObjectReferences} RefObjectReferences
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require `ref` and `shallowRef` functions to be strongly typed',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-typed-ref.html'
    },
    fixable: null,
    messages: {
      noType:
        'Specify type parameter for `{{name}}` function, otherwise created variable will not be typechecked.'
    },
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    const filename = context.getFilename()
    if (!utils.isVueFile(filename) && !utils.isTypeScriptFile(filename)) {
      return {}
    }

    const scriptSetup = utils.getScriptSetupElement(context)
    if (
      scriptSetup &&
      !utils.hasAttribute(scriptSetup, 'lang', 'ts') &&
      !utils.hasAttribute(scriptSetup, 'lang', 'typescript')
    ) {
      return {}
    }

    const defines = iterateDefineRefs(context.getScope())

    /**
     * @param {string} name
     * @param {CallExpression} node
     */
    function report(name, node) {
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

          if (ref.node.typeParameters == null) {
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
