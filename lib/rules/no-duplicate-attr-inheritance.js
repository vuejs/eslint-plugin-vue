/**
 * @fileoverview Disable inheritAttrs when using v-bind="$attrs"
 * @author Hiroki Osame
 */
'use strict'

const utils = require('../utils')

/** @param {VElement[]} elements */
function isConditionalGroup(elements) {
  let hasIf = false
  let hasElse = false

  for (const element of elements) {
    if (utils.hasDirective(element, 'if')) {
      if (hasIf || hasElse) {
        return false
      }
      hasIf = true
    } else if (utils.hasDirective(element, 'else-if')) {
      if (!hasIf || hasElse) {
        return false
      }
    } else if (utils.hasDirective(element, 'else')) {
      if (!hasIf || hasElse) {
        return false
      }
      hasElse = true
    } else {
      return false
    }
  }

  return hasIf && (elements.length === 1 || hasElse)
}

/** @param {VElement[]} elements */
function isMultiRoot(elements) {
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
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/no-duplicate-attr-inheritance.html'
    },
    fixable: null,
    schema: [],
    messages: {
      noDuplicateAttrInheritance: 'Set "inheritAttrs" to false.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {string | number | boolean | RegExp | BigInt | null} */
    let inheritsAttrs = true
    /** @type {VReference[]} */
    const attrsRefs = []

    /** @param {ObjectExpression} node */
    function processOptions(node) {
      const inheritAttrsProp = utils.findProperty(node, 'inheritAttrs')

      if (inheritAttrsProp && inheritAttrsProp.value.type === 'Literal') {
        inheritsAttrs = inheritAttrsProp.value.value
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

          const rootElements = element.children.filter(utils.isVElement)
          // ignore multi root
          if (isMultiRoot(rootElements)) return

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
