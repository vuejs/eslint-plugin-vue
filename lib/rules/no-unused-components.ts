/**
 * @fileoverview Report used components
 * @author Michał Sajnóg
 */
import utils from '../utils/index.ts'
import { capitalize } from '../utils/casing.ts'

/**
 * Get the registered names that Vue tries, in order, to resolve a component used as `name`.
 * Like Vue's `resolveAsset`: the name itself, its camelized form, and its capitalized camelized form.
 * e.g. `<my-comp>` and `<MyComp>` find a `MyComp` registration, but `<MyComp>` does not find `myComp`.
 */
function getResolvableNames(name: string): string[] {
  const camelized = name.replaceAll(/-(\w)/gu, (_, c: string) =>
    c.toUpperCase()
  )
  return [name, camelized, capitalize(camelized)]
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow registering components that are not used inside templates',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-unused-components.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreWhenBindingPresent: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unused: 'The "{{name}}" component has been registered but not used.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const ignoreWhenBindingPresent = options.ignoreWhenBindingPresent ?? true
    const usedComponents = new Set<string>()
    let registeredComponents: { node: Property; name: string }[] = []
    let shouldIgnoreReporting = false
    let templateLocation: Position

    return utils.defineTemplateBodyVisitor(
      context,
      {
        VElement(node) {
          if (
            (!utils.isHtmlElementNode(node) &&
              !utils.isSvgElementNode(node) &&
              !utils.isMathElementNode(node)) ||
            utils.isHtmlWellKnownElementName(node.rawName) ||
            utils.isSvgWellKnownElementName(node.rawName) ||
            utils.isMathWellKnownElementName(node.rawName)
          ) {
            return
          }

          usedComponents.add(node.rawName)
        },
        "VAttribute[directive=true][key.name.name='bind'][key.argument.name='is'], VAttribute[directive=true][key.name.name='is']"(
          node: VDirective
        ) {
          if (
            !node.value || // `<component :is>`
            node.value.type !== 'VExpressionContainer' ||
            !node.value.expression // `<component :is="">`
          )
            return

          if (node.value.expression.type === 'Literal') {
            // `:is="null"` renders nothing, so only a string names a component
            if (typeof node.value.expression.value === 'string') {
              usedComponents.add(node.value.expression.value)
            }
          } else if (ignoreWhenBindingPresent) {
            shouldIgnoreReporting = true
          }
        },
        "VAttribute[directive=false][key.name='is']"(node: VAttribute) {
          if (!node.value) {
            return
          }
          const value = node.value.value.startsWith('vue:') // Usage on native elements 3.1+
            ? node.value.value.slice(4)
            : node.value.value
          usedComponents.add(value)
        },
        "VElement[name='template']"(node: VElement) {
          templateLocation ||= node.loc.start
        },
        "VElement[name='template']:exit"(node: VElement) {
          if (
            shouldIgnoreReporting ||
            node.loc.start !== templateLocation ||
            utils.hasAttribute(node, 'src')
          )
            return

          const resolvableNames = new Set(
            [...usedComponents].flatMap(getResolvableNames)
          )
          for (const { node, name } of registeredComponents) {
            if (resolvableNames.has(name)) {
              continue
            }

            context.report({
              node,
              messageId: 'unused',
              data: {
                name
              }
            })
          }
        }
      },
      utils.executeOnVue(context, (obj) => {
        registeredComponents = utils.getRegisteredComponents(obj)
      })
    )
  }
}
