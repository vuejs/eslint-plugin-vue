/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import type { TSESTree } from '@typescript-eslint/types'
import utils from '../utils/index.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow `export` in `<script setup>`',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-export-in-script-setup.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      forbidden: '`<script setup>` cannot contain ES module exports.',
      removeExportKeyword: 'Remove the `export` keyword.',
      removeExportStatement: 'Remove this export statement.'
    }
  },
  create(context: RuleContext) {
    type ExportNode =
      | TSESTree.ExportAllDeclaration
      | TSESTree.ExportDefaultDeclaration
      | TSESTree.ExportNamedDeclaration

    const sourceCode = context.sourceCode

    /**
     * Get the range to remove the given statement together with its lines if it is alone on them.
     */
    function getStatementRemovalRange(statement: ExportNode): Range {
      const text = sourceCode.text
      let start = statement.range[0]
      let end = statement.range[1]
      const lineStart = text.lastIndexOf('\n', start - 1) + 1
      if (text.slice(lineStart, start).trim() === '') {
        start = lineStart
      }
      const lineEnd = text.indexOf('\n', end)
      if (
        text.slice(end, lineEnd === -1 ? text.length : lineEnd).trim() === ''
      ) {
        end = lineEnd === -1 ? text.length : lineEnd + 1
      }
      return [start, end]
    }

    function getSuggestion(
      statement: ExportNode
    ): Rule.SuggestionReportDescriptor {
      if (
        statement.type === 'ExportNamedDeclaration' &&
        statement.declaration
      ) {
        const exportToken = sourceCode.getFirstToken(statement)
        const text = sourceCode.text
        let end = exportToken.range[1]
        while (text[end] === ' ' || text[end] === '\t') {
          end++
        }
        return {
          messageId: 'removeExportKeyword',
          fix: (fixer: RuleFixer) =>
            fixer.removeRange([exportToken.range[0], end])
        }
      }
      return {
        messageId: 'removeExportStatement',
        fix: (fixer: RuleFixer) =>
          fixer.removeRange(getStatementRemovalRange(statement))
      }
    }

    function verify(
      node:
        | ExportAllDeclaration
        | ExportDefaultDeclaration
        | ExportNamedDeclaration,
      loc: SourceLocation
    ) {
      const statement = node as ExportNode
      if (
        statement.exportKind === 'type' ||
        (statement.type === 'ExportNamedDeclaration' &&
          statement.specifiers.length > 0 &&
          statement.specifiers.every((spec) => spec.exportKind === 'type'))
      ) {
        return
      }
      context.report({
        node,
        loc,
        messageId: 'forbidden',
        suggest: [getSuggestion(statement)]
      })
    }

    return utils.defineScriptSetupVisitor(context, {
      ExportAllDeclaration: (node) => verify(node, node.loc),
      ExportDefaultDeclaration: (node) => verify(node, node.loc),
      ExportNamedDeclaration: (node) => {
        verify(
          node,
          node.declaration
            ? context.sourceCode.getFirstToken(node).loc // export let foo = 'foo', export class Foo {}, export function foo() {}
            : node.loc // export { foo }, export { foo } from 'bar'
        )
      }
    })
  }
}
