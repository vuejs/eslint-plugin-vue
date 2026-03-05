/**
 * @fileoverview Report used components
 * @author Michał Sajnóg
 */
import utils from '../utils/index.js'
import {
  isPascalCase,
  isCamelCase,
  pascalCase,
  camelCase
} from '../utils/casing.ts'

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
    const ignoreWhenBindingPresent =
      options.ignoreWhenBindingPresent === undefined
        ? true
        : options.ignoreWhenBindingPresent
    const usedComponents = new Set<string>()
    let registeredComponents: { node: Property; name: string }[] = []
    let ignoreReporting = false
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
            usedComponents.add(node.value.expression.value as string)
          } else if (ignoreWhenBindingPresent) {
            ignoreReporting = true
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
          templateLocation = templateLocation || node.loc.start
        },
        "VElement[name='template']:exit"(node: VElement) {
          if (
            node.loc.start !== templateLocation ||
            ignoreReporting ||
            utils.hasAttribute(node, 'src')
          )
            return

          for (const { node, name } of registeredComponents) {
            // If the component name is PascalCase or camelCase
            // it can be used in various of ways inside template,
            // like "theComponent", "The-component" etc.
            // but except snake_case
            if (isPascalCase(name) || isCamelCase(name)) {
              if (
                [...usedComponents].some(
                  (n) =>
                    !n.includes('_') &&
                    (name === pascalCase(n) || name === camelCase(n))
                )
              ) {
                continue
              }
            } else {
              // In any other case the used component name must exactly match
              // the registered name
              if (usedComponents.has(name)) {
                continue
              }
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
