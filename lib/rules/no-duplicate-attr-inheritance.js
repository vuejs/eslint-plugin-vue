/**
 * @fileoverview Disable inheritAttrs when using v-bind="$attrs"
 * @author Hiroki Osame
 */
'use strict'

const {
  compositingVisitors,
  defineScriptSetupVisitor,
  defineTemplateBodyVisitor,
  executeOnVue,
  findProperty,
  hasDirective,
  isVElement
} = require('../utils/index.ts')

/** @param {VElement[]} elements */
function isConditionalGroup(elements) {
  const firstElement = elements[0]
  const lastElement = elements.at(-1)

  if (!lastElement || elements.length < 2) {
    return false
  }

  const inBetweenElements = elements.slice(1, -1)

  return (
    hasDirective(firstElement, 'if') &&
    (hasDirective(lastElement, 'else-if') ||
      hasDirective(lastElement, 'else')) &&
    inBetweenElements.every((element) => hasDirective(element, 'else-if'))
  )
}

/** @param {VElement[]} elements */
function isMultiRootNodes(elements) {
  if (elements.length > 1 && !isConditionalGroup(elements)) {
    return true
  }

  return false
}

module.exports = {
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
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const checkMultiRootNodes = options.checkMultiRootNodes === true

    /** @type {Literal['value']} */
    let inheritsAttrs = true
    /** @type {VReference[]} */
    const attrsRefs = []

    /** @param {ObjectExpression} node */
    function processOptions(node) {
      const inheritAttrsProp = findProperty(node, 'inheritAttrs')

      if (inheritAttrsProp && inheritAttrsProp.value.type === 'Literal') {
        inheritsAttrs = inheritAttrsProp.value.value
      }
    }

    return compositingVisitors(
      executeOnVue(context, processOptions),
      defineScriptSetupVisitor(context, {
        onDefineOptionsEnter(node) {
          if (node.arguments.length === 0) return
          const define = node.arguments[0]
          if (define.type !== 'ObjectExpression') return
          processOptions(define)
        }
      }),
      defineTemplateBodyVisitor(context, {
        /** @param {VExpressionContainer} node */
        "VAttribute[directive=true][key.name.name='bind'][key.argument=null] > VExpressionContainer"(
          node
        ) {
          if (!inheritsAttrs) {
            return
          }
          const reference = node.references.find((reference) => {
            if (reference.variable != null) {
              // Not vm reference
              return false
            }
            return reference.id.name === '$attrs'
          })

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

          const rootElements = element.children.filter(isVElement)

          if (!checkMultiRootNodes && isMultiRootNodes(rootElements)) return

          if (attrsRefs.length > 0) {
            for (const attrsRef of attrsRefs) {
              context.report({
                node: attrsRef.id,
                messageId: 'noDuplicateAttrInheritance'
              })
            }
          }
        }
      }
    )
  }
}
