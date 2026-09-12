/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import vue3ExportNamesList from '../utils/vue3-export-names.json' with { type: 'json' }

const vue3ExportNames = new Set(vue3ExportNamesList)

const TARGET_AT_VUE_MODULES = new Set([
  '@vue/runtime-dom',
  '@vue/runtime-core',
  '@vue/reactivity',
  '@vue/shared'
])

/**
 * @param {ImportDeclaration['specifiers'][number]} specifier
 * @returns {IterableIterator<string | null>}
 */
function* extractSpecifierNames(specifier) {
  switch (specifier.type) {
    case 'ImportDefaultSpecifier': {
      yield 'default'
      break
    }
    case 'ImportNamespaceSpecifier': {
      yield null // all
      break
    }
    case 'ImportSpecifier': {
      yield specifier.imported.name
      break
    }
  }
}

/**
 * @param {ImportDeclaration} node
 */
function* extractImportNames(node) {
  for (const specifier of node.specifiers) {
    yield* extractSpecifierNames(specifier)
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: "enforce import from 'vue' instead of import from '@vue/*'",
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/prefer-import-from-vue.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      importedAtVue: "Import from 'vue' instead of '{{source}}'."
    }
  },
  /**
   * @param {RuleContext} context
   * @returns {RuleListener}
   */
  create(context) {
    /**
     *
     * @param {Literal & { value: string }} source
     * @param { () => boolean } fixable
     * @param {string[]} names Named bindings imported or exported from the source.
     */
    function verifySource(source, fixable, names) {
      if (!TARGET_AT_VUE_MODULES.has(source.value)) {
        return
      }
      // Don't report when none of the named bindings are re-exported by 'vue'.
      if (
        names.length > 0 &&
        names.every((name) => !vue3ExportNames.has(name))
      ) {
        return
      }

      context.report({
        node: source,
        messageId: 'importedAtVue',
        data: { source: source.value },
        fix: fixable()
          ? (fixer) =>
              fixer.replaceTextRange(
                [source.range[0] + 1, source.range[1] - 1],
                'vue'
              )
          : null
      })
    }

    return {
      ImportDeclaration(node) {
        // Skip imports without specifiers in `.d.ts` files
        if (node.specifiers.length === 0 && context.filename.endsWith('.d.ts'))
          return

        const hasOnlyNamedSpecifiers = node.specifiers.every(
          (specifier) => specifier.type === 'ImportSpecifier'
        )
        const importedNames = hasOnlyNamedSpecifiers
          ? node.specifiers.map(
              (specifier) =>
                /** @type {ImportSpecifier} */ (specifier).imported.name
            )
          : []

        verifySource(
          node.source,
          () => {
            for (const name of extractImportNames(node)) {
              if (name == null) {
                return false // import all
              }
              if (!vue3ExportNames.has(name)) {
                // If there is a name that is not exported from 'vue', it will not be auto-fixed.
                return false
              }
            }
            return true
          },
          importedNames
        )
      },
      ExportNamedDeclaration(node) {
        if (node.source) {
          verifySource(
            node.source,
            () => {
              for (const specifier of node.specifiers) {
                if (!vue3ExportNames.has(specifier.local.name)) {
                  // If there is a name that is not exported from 'vue', it will not be auto-fixed.
                  return false
                }
              }
              return true
            },
            node.specifiers.map((specifier) => specifier.local.name)
          )
        }
      },
      ExportAllDeclaration(node) {
        verifySource(
          node.source,
          // If we change it to `from 'vue'`, it will export more, so it will not be auto-fixed.
          () => false,
          []
        )
      }
    }
  }
}
