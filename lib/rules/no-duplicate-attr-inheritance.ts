/**
 * @fileoverview Disable inheritAttrs when using v-bind="$attrs"
 * @author Hiroki Osame
 */
import utils from '../utils/index.js'

function isConditionalGroup(elements: VElement[]) {
  const firstElement = elements[0]
  const lastElement = elements.at(-1)

  if (!lastElement || elements.length < 2) {
    return false
  }

  const inBetweenElements = elements.slice(1, -1)

  return (
    utils.hasDirective(firstElement, 'if') &&
    (utils.hasDirective(lastElement, 'else-if') ||
      utils.hasDirective(lastElement, 'else')) &&
    inBetweenElements.every((element) => utils.hasDirective(element, 'else-if'))
  )
}

function isMultiRootNodes(elements: VElement[]) {
  return elements.length > 1 && !isConditionalGroup(elements)
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce `inheritAttrs` to be set to `false` when using `v-bind="$attrs"`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-duplicate-attr-inheritance.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          checkMultiRootNodes: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      noDuplicateAttrInheritance: 'Set "inheritAttrs" to false.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const shouldCheckMultiRootNodes = options.checkMultiRootNodes === true

    let inheritAttrsValue: Literal['value'] = true
    const attrsRefs: VReference[] = []

    function processOptions(node: ObjectExpression) {
      const inheritAttrsProp = utils.findProperty(node, 'inheritAttrs')

      if (inheritAttrsProp && inheritAttrsProp.value.type === 'Literal') {
        inheritAttrsValue = inheritAttrsProp.value.value
      }
    }

    return utils.compositingVisitors(
      utils.executeOnVue(context, processOptions),
      utils.defineScriptSetupVisitor(context, {
        onDefineOptionsEnter(node) {
          if (node.arguments.length === 0) return
          const define = node.arguments[0]
          if (define.type !== 'ObjectExpression') return
          processOptions(define)
        }
      }),
      utils.defineTemplateBodyVisitor(context, {
        "VAttribute[directive=true][key.name.name='bind'][key.argument=null] > VExpressionContainer"(
          node: VExpressionContainer
        ) {
          if (!inheritAttrsValue) {
            return
          }
          const reference = node.references.find(
            (reference) =>
              reference.variable == null && reference.id.name === '$attrs'
          )

          if (reference) {
            attrsRefs.push(reference)
          }
        }
      }),
      {
        'Program:exit'(program) {
          const element = program.templateBody
          if (element == null) {
            return
          }

          const rootElements = element.children.filter(utils.isVElement)

          if (!shouldCheckMultiRootNodes && isMultiRootNodes(rootElements))
            return

          for (const attrsRef of attrsRefs) {
            context.report({
              node: attrsRef.id,
              messageId: 'noDuplicateAttrInheritance'
            })
          }
        }
      }
    )
  }
}
