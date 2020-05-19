/**
 * @fileoverview Disallow unused properties, data and computed properties.
 * @author Learning Equality
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const { findVariable } = require('eslint-utils')

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const GROUP_PROPERTY = 'props'
const GROUP_DATA = 'data'
const GROUP_COMPUTED_PROPERTY = 'computed'
const GROUP_METHODS = 'methods'
const GROUP_SETUP = 'setup'
const GROUP_WATCHER = 'watch'

const PROPERTY_LABEL = {
  [GROUP_PROPERTY]: 'property',
  [GROUP_DATA]: 'data',
  [GROUP_COMPUTED_PROPERTY]: 'computed property',
  [GROUP_METHODS]: 'method',
  [GROUP_SETUP]: 'property returned from `setup()`'
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Extract names from references objects.
 */
const getReferencesNames = references => {
  return references
    .filter(ref => ref.variable == null)
    .map(ref => ref.id.name)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused properties',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-unused-properties.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
            items: {
              enum: [
                GROUP_PROPERTY,
                GROUP_DATA,
                GROUP_COMPUTED_PROPERTY,
                GROUP_METHODS,
                GROUP_SETUP
              ]
            },
            additionalItems: false,
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unused: "'{{name}}' of {{group}} found, but never used."
    }
  },

  create (context) {
    const options = context.options[0] || {}
    const groups = new Set(options.groups || [GROUP_PROPERTY])

    /**
     * @typedef {import('vue-eslint-parser').AST.Node} ASTNode
     * @typedef {import('vue-eslint-parser').AST.ESLintObjectPattern} ObjectPattern
     * @typedef { { node: ASTNode } } VueData
     * @typedef { { name: string, groupName: string, node: ASTNode } } PropertyData
     * @typedef { {
     *   usedNames: Set<string>,
     * } } BasePropertiesContainer
     * @typedef { BasePropertiesContainer } TemplatePropertiesContainer
     * @typedef { BasePropertiesContainer & {
     *   ignore: boolean,
     *   properties: Array<PropertyData>,
     *   usedPropsNames: Set<string>,
     *   propsReferenceIds: Set<ASTNode>,
     * } } VueComponentPropertiesContainer
     * @typedef { {node: ASTNode, upper: VueDataStack} } VueDataStack
     */

    /** @type {TemplatePropertiesContainer} */
    const templatePropertiesContainer = {
      usedNames: new Set()
    }
    /** @type {Map<ASTNode, VueComponentPropertiesContainer>} */
    const vueComponentPropertiesContainers = new Map()
    /**
     * @param {ASTNode} node
     * @returns {VueComponentPropertiesContainer}
     */
    function getVueComponentPropertiesContainer (node) {
      const key = node

      let container = vueComponentPropertiesContainers.get(key)
      if (!container) {
        container = {
          properties: [],
          usedNames: new Set(),
          usedPropsNames: new Set(),
          propsReferenceIds: new Set(),
          ignore: false
        }
        vueComponentPropertiesContainers.set(key, container)
      }
      return container
    }

    /**
     * @param {ObjectPattern} node
     * @param {Set<string>} usedNames
     * @param {VueComponentPropertiesContainer} vueComponentPropertiesContainer
     */
    function extractObjectPatternProperties (node, usedNames, vueComponentPropertiesContainer) {
      for (const prop of node.properties) {
        if (prop.type === 'Property') {
          usedNames.add(utils.getStaticPropertyName(prop))
        } else {
          // If use RestElement, everything is used!
          vueComponentPropertiesContainer.ignore = true
          return
        }
      }
    }

    /**
     * @param {ASTNode} node
     * @param {VueComponentPropertiesContainer} vueComponentPropertiesContainer
     * @returns {Set<string> | null}
     */
    function getPropertyNamesSet (node, vueComponentPropertiesContainer) {
      if (utils.isThis(node, context)) {
        return vueComponentPropertiesContainer.usedNames
      }
      if (vueComponentPropertiesContainer.propsReferenceIds.has(node)) {
        return vueComponentPropertiesContainer.usedPropsNames
      }
      return null
    }

    /**
     * Report all unused properties.
     */
    function reportUnusedProperties () {
      for (const container of vueComponentPropertiesContainers.values()) {
        if (container.ignore) {
          continue
        }
        for (const property of container.properties) {
          if (container.usedNames.has(property.name) || templatePropertiesContainer.usedNames.has(property.name)) {
            continue
          }
          if (property.groupName === 'props' && container.usedPropsNames.has(property.name)) {
            continue
          }
          context.report({
            node: property.node,
            messageId: 'unused',
            data: {
              group: PROPERTY_LABEL[property.groupName],
              name: property.name
            }
          })
        }
      }
    }

    const scriptVisitor = Object.assign(
      {},
      utils.defineVueVisitor(context, {
        ObjectExpression (node, vueData) {
          if (node !== vueData.node) {
            return
          }

          const container = getVueComponentPropertiesContainer(vueData.node)
          const watcherNames = new Set()
          for (const watcher of utils.iterateProperties(node, new Set([GROUP_WATCHER]))) {
            watcherNames.add(watcher.name)
          }
          for (const prop of utils.iterateProperties(node, groups)) {
            if (watcherNames.has(prop.name)) {
              continue
            }
            container.properties.push(prop)
          }
        },
        'Property[value.type=/^(Arrow)?FunctionExpression$/]' (node, vueData) {
          if (node.parent !== vueData.node) {
            return
          }
          if (utils.getStaticPropertyName(node) !== 'setup') {
            return
          }
          const container = getVueComponentPropertiesContainer(vueData.node)
          const propsParam = node.value.params[0]
          if (!propsParam) {
            // no arguments
            return
          }
          if (propsParam.type === 'RestElement' || propsParam.type === 'ArrayPattern') {
            // cannot check
            return
          }
          if (propsParam.type === 'ObjectPattern') {
            extractObjectPatternProperties(propsParam, container.usedPropsNames, container)
            return
          }
          const variable = findVariable(context.getScope(), propsParam)
          if (!variable) {
            return
          }
          for (const reference of variable.references) {
            container.propsReferenceIds.add(reference.identifier)
          }
        },
        MemberExpression (node, vueData) {
          const vueComponentPropertiesContainer = getVueComponentPropertiesContainer(vueData.node)
          const usedNames = getPropertyNamesSet(node.object, vueComponentPropertiesContainer)
          if (!usedNames) {
            return
          }
          usedNames.add(utils.getStaticPropertyName(node))
        },
        'VariableDeclarator > ObjectPattern' (node, vueData) {
          const decl = node.parent
          const vueComponentPropertiesContainer = getVueComponentPropertiesContainer(vueData.node)
          const usedNames = getPropertyNamesSet(decl.init, vueComponentPropertiesContainer)
          if (!usedNames) {
            return
          }
          extractObjectPatternProperties(node, usedNames, vueComponentPropertiesContainer)
        },
        'AssignmentExpression > ObjectPattern' (node, vueData) {
          const assign = node.parent
          const vueComponentPropertiesContainer = getVueComponentPropertiesContainer(vueData.node)
          const usedNames = getPropertyNamesSet(assign.right, vueComponentPropertiesContainer)
          if (!usedNames) {
            return
          }
          extractObjectPatternProperties(node, usedNames, vueComponentPropertiesContainer)
        }
      }),
      {
        'Program:exit' (node) {
          if (!node.templateBody) {
            reportUnusedProperties()
          }
        }
      },
    )

    const templateVisitor = {
      'VExpressionContainer' (node) {
        for (const name of getReferencesNames(node.references)) {
          templatePropertiesContainer.usedNames.add(name)
        }
      },
      "VElement[parent.type!='VElement']:exit" () {
        reportUnusedProperties()
      }
    }

    return utils.defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor)
  }
}
