/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import type { TSESTree } from '@typescript-eslint/types'
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow `export` in `<script setup>`',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-export-in-script-setup.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: '`<script setup>` cannot contain ES module exports.'
    }
  },
  create(context: RuleContext) {
    function verify(
      node:
        | ExportAllDeclaration
        | ExportDefaultDeclaration
        | ExportNamedDeclaration,
      loc: SourceLocation
    ) {
      const tsNode = node as
        | TSESTree.ExportAllDeclaration
        | TSESTree.ExportDefaultDeclaration
        | TSESTree.ExportNamedDeclaration
      if (
        tsNode.exportKind === 'type' ||
        (tsNode.type === 'ExportNamedDeclaration' &&
          tsNode.specifiers.length > 0 &&
          tsNode.specifiers.every((spec) => spec.exportKind === 'type'))
      ) {
        return
      }
      context.report({
        node,
        loc,
        messageId: 'forbidden'
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
