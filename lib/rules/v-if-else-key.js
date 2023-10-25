/**
 * @author Felipe Melendez
 * See LICENSE file in root directory for full license.
 */
'use strict'

// =============================================================================
// Requirements
// =============================================================================

const utils = require('../utils')
const casing = require('../utils/casing')
const reservedNamesInVue2 = require('../utils/vue2-builtin-components')

// =============================================================================
// Constants and Variables
// =============================================================================

/**
 * Curated list of standard HTML elements that serve as containers.
 * We're not using an existing library util because we are only concerned about HTML elements that
 * have the capacity to wrap other components.
 *
 * @type {Array<string>}
 */
const htmlContainerElements = [
  // Structural elements
  'div',
  'section',
  'article',
  'nav',
  'aside',
  'header',
  'footer',
  'main',

  // Interactive elements
  'details',
  'menu',

  // Table related elements
  'table',
  'tr',
  'td',
  'th',

  // List related elements
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',

  // Text content or related elements
  'address',
  'figure',
  'figcaption',
  'details',
  'summary',
  'dialog',

  // Form and related elements
  'form',
  'fieldset',
  'label',
  'output',
  'optgroup',
  'select',
  'textarea'
]
const allContainerElements = [...reservedNamesInVue2, ...htmlContainerElements]

/**
 * Set of HTML and Vue tags that can act as containers
 *
 * @type {Set<string>}
 * @constant
 */
const CONTAINER_ELEMENTS = new Set(allContainerElements)

/**
 * Map to store conditionally rendered components and their respective conditional directives.
 *
 * A conditional family is a group of components that are conditionally rendered using v-if, v-else-if, and v-else.
 * This data structure helps track and manage the relation of such components with one another.
 *
 * This map links a parent node to its associated conditional family, representing
 * the relationship between different parts of a Vue conditional rendering chain
 * (v-if, v-else-if, v-else). Each entry in the map associates a parent node
 * (representing the scope of the conditional family) with an object that tracks
 * the nodes for each part of the conditional chain:
 *
 *  - 'if': Represents the node associated with the 'v-if' directive.
 *  - 'elseIf': An array representing nodes associated with any 'v-else-if' directives.
 *  - 'else': Represents the node associated with the 'v-else' directive.
 *
 * This structure helps in understanding the relationship between conditional directives
 * within a given scope and aids in linting scenarios where these relationships matter.
 *
 * @type {Map<VElement, { if: VElement | null, elseIf: VElement[], else: VElement | null }>}
 */
const conditionalFamilies = new Map()

// =============================================================================
// Rule Helpers
// =============================================================================

/**
 * Checks for the presence of a 'key' attribute in the given Vue component node. If the
 * 'key' attribute is missing and the node is part of a conditional family (like v-if, v-else-if, or v-else),
 * a report is generated. The fix proposed adds a unique key based on the component's name
 * and count, following the format '${kebabCase(componentName)}-${componentCount}', e.g., 'some-component-2'.
 *
 * @param {VElement} node - The Vue component node to check for a 'key' attribute.
 * @param {RuleContext} context - The rule's context object, used for reporting.
 * @param {string} componentName - Name of the component.
 * @param {string} uniqueKey - A unique key for the repeated component, used for the fix.
 */
const checkForKey = (node, context, componentName, uniqueKey) => {
  if (node.parent && node.parent.type === 'VElement') {
    const conditionalFamily = conditionalFamilies.get(node.parent)

    if (
      conditionalFamily &&
      (utils.hasDirective(node, 'bind', 'key') ||
        utils.hasAttribute(node, 'key') ||
        !hasConditionalDirective(node) ||
        !isConditionalFamilyComplete(conditionalFamily))
    ) {
      return
    }

    context.report({
      node: node.startTag,
      loc: node.startTag.loc,
      messageId: 'requireKey',
      data: {
        componentName
      },
      fix(fixer) {
        const afterComponentNamePosition =
          node.startTag.range[0] + componentName.length + 1
        return fixer.insertTextBeforeRange(
          [afterComponentNamePosition, afterComponentNamePosition],
          ` key='${uniqueKey}'`
        )
      }
    })
  }
}

/**
 * Checks for the presence of conditional directives such as 'v-if', 'v-else-if', or 'v-else' in the
 * given Vue component node.
 *
 * @param {VElement} node - The node to check for conditional directives.
 * @returns {boolean} Returns true if a conditional directive is found in the node or its parents,
 *   false otherwise.
 */
const hasConditionalDirective = (node) =>
  utils.hasDirective(node, 'if') ||
  utils.hasDirective(node, 'else-if') ||
  utils.hasDirective(node, 'else')

/**
 * Checks whether a conditional family (comprising of 'if', 'else-if', and 'else' conditions) is complete.
 * A conditional family is considered complete if:
 * 1. An 'if' condition is present.
 * 2. All elements of the family (if, else, else-if) share the same rawName.
 * 3. There exists either an 'else' condition or at least one 'else-if' condition.
 *
 * @param {{ if: VElement | null, elseIf: VElement[], else: VElement | null }} family - The conditional family object with 'if', 'else-if', and 'else' properties.
 * @returns {boolean} True if the conditional family is complete based on the above criteria, false otherwise.
 */
const isConditionalFamilyComplete = (family) => {
  if (!family || !family.if) {
    return false
  }
  const familyComponentName = family.if.rawName
  if (family.else && family.else.rawName !== familyComponentName) {
    return false
  }
  if (family.elseIf.some((node) => node.rawName !== familyComponentName)) {
    return false
  }
  return Boolean(family.else || family.elseIf.length > 0)
}

// =============================================================================
// Rule Definition
// =============================================================================

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require key attribute for conditionally rendered repeated components',
      categories: null,
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/v-if-else-key.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      requireKey:
        "Conditionally rendered repeated component '{{componentName}}' expected to have a 'key' attribute."
    }
  },
  /**
   * Creates and returns a rule object which checks usage of repeated components. If a component
   * is used more than once, it checks for the presence of a key.
   *
   * @param {RuleContext} context - The context object.
   * @returns {Object} A dictionary of functions to be called on traversal of the template body by
   *   the eslint parser.
   */
  create(context) {
    /**
     * Array of Maps to keep track of components and their usage counts along with the first
     * node instance. Each Map represents a different scope level, and maps a component name to
     * an object containing the count and a reference to the first node.
     */
    /** @type {Map<string, { count: number; firstNode: any }>[]} */
    const componentUsageStack = [new Map()]

    /** Set of built-in Vue components that are exempt from the rule. */
    /** @type {Set<string>} */
    const exemptTags = new Set(['slot', 'template'])

    /** Set to keep track of nodes we've pushed to the stack. */
    /** @type {Set<any>} */
    const pushedNodes = new Set()

    /**
     * Creates and returns an object representing a conditional family.
     *
     * @returns {{ if: VElement | null, elseIf: VElement[], else: VElement | null }}
     */
    const createConditionalFamily = () => ({
      if: null,
      elseIf: [],
      else: null
    })

    /**
     * Checks if the given node represents a container element.
     * A container element is defined as a Vue AST node of type 'VElement' that:
     * 1. Matches one of the predefined HTML container elements from CONTAINER_ELEMENTS.
     * 2. Does NOT have a conditional directive.
     *
     * @param {VElement} node - The node to check.
     * @returns {boolean} - True if the node is a container element, false otherwise.
     */
    const isContainerElement = (node) =>
      node.type === 'VElement' &&
      CONTAINER_ELEMENTS.has(node.rawName) &&
      !hasConditionalDirective(node)

    return utils.defineTemplateBodyVisitor(context, {
      /**
       * Callback to be executed when a Vue element is traversed. This function checks if the
       * Vue element is a component, increments the usage count of the component in the
       * current scope, and checks for the key directive if the component is repeated.
       *
       * @param {VElement} node - The traversed Vue element.
       */
      VElement(node) {
        if (exemptTags.has(node.rawName)) {
          return
        }

        const condition =
          utils.getDirective(node, 'if') ||
          utils.getDirective(node, 'else-if') ||
          utils.getDirective(node, 'else')

        if (condition) {
          const conditionType = condition.key.name.name

          if (node.parent && node.parent.type === 'VElement') {
            let conditionalFamily = conditionalFamilies.get(node.parent)

            if (
              !conditionalFamily ||
              (conditionalFamily.if &&
                conditionalFamily.if.rawName !== node.rawName)
            ) {
              conditionalFamily = createConditionalFamily()
              conditionalFamilies.set(node.parent, conditionalFamily)
            }

            switch (conditionType) {
              case 'if': {
                conditionalFamily.if = node
                break
              }
              case 'else-if': {
                conditionalFamily.elseIf.push(node)
                break
              }
              case 'else': {
                conditionalFamily.else = node
                break
              }
            }
          }
        }

        if (isContainerElement(node)) {
          componentUsageStack.push(new Map())
          return
        }

        if (!utils.isCustomComponent(node)) {
          return
        }

        const componentName = node.rawName
        const currentScope = componentUsageStack[componentUsageStack.length - 1]
        const usageInfo = currentScope.get(componentName) || {
          count: 0,
          firstNode: null
        }

        if (hasConditionalDirective(node)) {
          // Store the first node if this is the first occurrence
          if (usageInfo.count === 0) {
            usageInfo.firstNode = node
          }

          if (usageInfo.count > 0) {
            const uniqueKey = `${casing.kebabCase(componentName)}-${
              usageInfo.count + 1
            }`
            checkForKey(node, context, componentName, uniqueKey)

            // If this is the second occurrence, also apply a fix to the first occurrence
            if (usageInfo.count === 1) {
              const uniqueKeyForFirstInstance = `${casing.kebabCase(
                componentName
              )}-1`
              checkForKey(
                usageInfo.firstNode,
                context,
                componentName,
                uniqueKeyForFirstInstance
              )
            }
          }
          usageInfo.count += 1
          currentScope.set(componentName, usageInfo)
        }
        componentUsageStack.push(new Map())
        pushedNodes.add(node)
      },

      'VElement:exit'(node) {
        if (exemptTags.has(node.rawName)) {
          return
        }
        if (isContainerElement(node)) {
          componentUsageStack.pop()
          return
        }
        if (!utils.isCustomComponent(node)) {
          return
        }
        if (pushedNodes.has(node)) {
          componentUsageStack.pop()
          pushedNodes.delete(node)
        }
      }
    })
  }
}
