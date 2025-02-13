/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const COMPILER_MACROS = new Set([
  'defineProps',
  'defineEmits',
  'defineExpose',
  'withDefaults'
])

const VUE_MODULES = new Set(['@vue/runtime-core', '@vue/runtime-dom', 'vue'])

/**
 * @param {Token} node
 */
function isComma(node) {
  return node.type === 'Punctuator' && node.value === ','
}

/**
 * @param {Token} node
 */
function isLeftCurlyBrace(node) {
  return node.type === 'Punctuator' && node.value === '{'
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow importing Vue compiler macros',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-import-compiler-macros.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      noImportCompilerMacros:
        "'{{name}}' is a compiler macro and no longer needs to be imported from '{{source}}'."
    }
  },
  /**
   * @param {RuleContext} context
   * @returns {RuleListener}
   */
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      ImportDeclaration(node) {
        if (node.specifiers.length === 0) return

        if (VUE_MODULES.has(node.source.value)) {
          for (const specifier of node.specifiers) {
            if (
              specifier.type === 'ImportSpecifier' &&
              COMPILER_MACROS.has(specifier.imported.name)
            ) {
              context.report({
                node: specifier,
                messageId: 'noImportCompilerMacros',
                data: {
                  name: specifier.imported.name,
                  source: node.source.value
                },
                fix: (fixer) => {
                  const tokenAfter = sourceCode.getTokenAfter(specifier)
                  const tokenBefore = sourceCode.getTokenBefore(specifier)

                  const hasCommaAfter = isComma(tokenAfter)
                  const isFirstSpecifier = isLeftCurlyBrace(tokenBefore)

                  const codeStart = hasCommaAfter
                    ? tokenBefore.range[1]
                    : isFirstSpecifier
                      ? specifier.range[0]
                      : tokenBefore.range[0]
                  const codeEnd = hasCommaAfter
                    ? tokenAfter.range[1]
                    : specifier.range[1]

                  return fixer.removeRange([codeStart, codeEnd])
                }
              })
            }
          }
        }
      }
    }
  }
}
