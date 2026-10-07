/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

/**
 * Checks whether the given variable only exists in the type space.
 * e.g. `type Foo = {}`, `interface Foo {}`, `import type { Foo } from './foo'`
 * Such a declaration cannot be referenced from the template,
 * so it never shadows a prop.
 */
function isTypeOnlyVariable(variable: Variable): boolean {
  if (variable.defs.length === 0) return true

  // e.g. `type Foo = {}`, `interface Foo {}`
  if (variable.isTypeVariable && !variable.isValueVariable) return true

  // Type-only imports have `isValueVariable` set to true,
  // so the actual nodes need to be checked.
  return variable.defs.every((def) => {
    if (def.type !== 'ImportBinding') {
      return false
    }
    if (def.parent.importKind === 'type') {
      // e.g. `import type Foo from './foo'`
      return true
    }
    // e.g. `import { type Foo } from './foo'`
    return def.node.type === 'ImportSpecifier' && def.node.importKind === 'type'
  })
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow declarations that shadow props in `<script setup>`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-props-shadow.html'
    },
    fixable: null,
    schema: [],
    messages: {
      shadow: "Declaration of '{{name}}' shadows the prop with the same name."
    }
  },
  create(context: RuleContext) {
    const propNames = new Set<string>()
    // Declarators that hold the `defineProps()` result.
    // Their bindings are the props themselves, not a shadowing declaration.
    const propsDeclarators = new Set<VariableDeclarator>()

    return utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(node, props) {
        for (const prop of props) {
          if (prop.propName != null) {
            propNames.add(prop.propName)
          }
        }

        // e.g. `const props = defineProps()`
        //      `const { foo } = withDefaults(defineProps<Props>(), {})`
        const target = utils.hasWithDefaults(node) ? node.parent : node
        if (target.parent?.type === 'VariableDeclarator') {
          propsDeclarators.add(target.parent)
        }
      },
      'Program:exit'() {
        if (propNames.size === 0) return

        const globalScope = context.sourceCode.scopeManager.globalScope
        if (!globalScope) return
        // Only the top level scope of the script is exposed to the template.
        const moduleScope =
          globalScope.childScopes.find((scope) => scope.type === 'module') ||
          globalScope

        for (const variable of moduleScope.variables) {
          if (!propNames.has(variable.name)) continue
          if (isTypeOnlyVariable(variable)) continue
          if (
            variable.defs.some(
              (def) => def.type === 'Variable' && propsDeclarators.has(def.node)
            )
          ) {
            continue
          }

          context.report({
            node: variable.defs[0].name,
            messageId: 'shadow',
            data: { name: variable.name }
          })
        }
      }
    })
  }
}
