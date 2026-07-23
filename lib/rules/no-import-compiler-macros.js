/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */

import utils from '../utils/index.js'

const COMPILER_MACROS = new Set([
  'defineProps',
  'defineEmits',
  'defineExpose',
  'withDefaults',
  'defineModel',
  'defineOptions',
  'defineSlots'
])

const VUE_MODULES = new Set(['@vue/runtime-core', '@vue/runtime-dom', 'vue'])

/**
 * @param {Token} node
 */
function isComma(node) {
  return node.type === 'Punctuator' && node.value === ','
}

export default {
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
        "'{{name}}' is a compiler macro and doesn't need to be imported.",
      onlyValidInScriptSetup:
        "'{{name}}' is a compiler macro and can only be used inside <script setup>."
    }
  },
  /**
   * @param {RuleContext} context
   * @returns {RuleListener}
   */
  create(context) {
    const sourceCode = context.sourceCode

    return {
      ImportDeclaration(node) {
        if (node.specifiers.length === 0 || !VUE_MODULES.has(node.source.value))
          return

        for (const specifier of node.specifiers) {
          if (
            specifier.type !== 'ImportSpecifier' ||
            !COMPILER_MACROS.has(specifier.imported.name)
          ) {
            continue
          }

          context.report({
            node: specifier,
            messageId: utils.isScriptSetup(context)
              ? 'noImportCompilerMacros'
              : 'onlyValidInScriptSetup',
            data: {
              name: specifier.imported.name
            },
            fix: (fixer) => {
              const isOnlySpecifier = node.specifiers.length === 1
              const isLastSpecifier = specifier === node.specifiers.at(-1)

              if (isOnlySpecifier) {
                return fixer.remove(node)
              }
              if (isLastSpecifier) {
                const precedingComma = sourceCode.getTokenBefore(
                  specifier,
                  isComma
                )
                return fixer.removeRange([
                  (precedingComma || specifier).range[0],
                  specifier.range[1]
                ])
              }
              const subsequentComma = sourceCode.getTokenAfter(
                specifier,
                isComma
              )
              return fixer.removeRange([
                specifier.range[0],
                (subsequentComma || specifier).range[1]
              ])
            }
          })
        }
      }
    }
  }
}
