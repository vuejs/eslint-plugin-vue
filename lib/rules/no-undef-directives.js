/**
 * @author rzzf
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const regexp = require('../utils/regexp')

/**
 * @param {string} str
 * @returns {string}
 */
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

/**
 * @param {ObjectExpression} componentObject
 * @returns { { node: Property, name: string }[] } Array of ASTNodes
 */
function getRegisteredDirectives(componentObject) {
  const directivesNode = componentObject.properties.find(
    (p) =>
      p.type === 'Property' &&
      utils.getStaticPropertyName(p) === 'directives' &&
      p.value.type === 'ObjectExpression'
  )

  if (
    !directivesNode ||
    directivesNode.type !== 'Property' ||
    directivesNode.value.type !== 'ObjectExpression'
  ) {
    return []
  }

  return directivesNode.value.properties
    .filter((node) => node.type === 'Property')
    .map((node) => {
      const name = utils.getStaticPropertyName(node)
      return name ? { node, name } : null
    })
    .filter((res) => !!res)
}

/**
 * @param {string} rawName
 * @param {Set<string>} definedNames
 */
function isDefinedInSetup(rawName, definedNames) {
  const camelName = camelize(rawName)
  const variableName = `v${casing.capitalize(camelName)}`
  return definedNames.has(variableName)
}

/**
 * @param {string} rawName
 * @param {Set<string>} definedNames
 */
function isDefinedInOptions(rawName, definedNames) {
  const camelName = camelize(rawName)
  if (definedNames.has(rawName) || definedNames.has(camelName)) {
    return true
  }

  // allow case-insensitive only when the directive name itself contains capitalized letters
  for (const name of definedNames) {
    if (
      name.toLowerCase() === camelName.toLowerCase() &&
      name !== name.toLowerCase()
    ) {
      return true
    }
  }

  return false
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow use of undefined custom directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-undef-directives.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        },
        additionalProperties: true
      }
    ],
    messages: {
      undef: "The 'v-{{name}}' directive has been used, but not defined."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const { ignore = [] } = options
    const isAnyIgnored = regexp.toRegExpGroupMatcher(ignore)

    /**
     * Check whether the given directive name is a verify target or not.
     *
     * @param {string} rawName The directive name.
     * @returns {boolean}
     */
    function isVerifyTargetDirective(rawName) {
      const kebabName = casing.kebabCase(rawName)
      if (
        utils.isBuiltInDirectiveName(rawName) ||
        isAnyIgnored(rawName, kebabName)
      ) {
        return false
      }
      return true
    }

    /**
     * @param {(rawName: string) => boolean} isDefined
     * @returns {TemplateListener}
     */
    function createTemplateBodyVisitor(isDefined) {
      return {
        /** @param {VDirective} node */
        'VAttribute[directive=true]'(node) {
          const name = node.key.name.name
          if (utils.isBuiltInDirectiveName(name)) {
            return
          }
          const rawName = node.key.name.rawName || name
          if (isVerifyTargetDirective(rawName) && !isDefined(rawName)) {
            context.report({
              node: node.key,
              messageId: 'undef',
              data: {
                name: rawName
              }
            })
          }
        }
      }
    }

    if (utils.isScriptSetup(context)) {
      // For <script setup>
      /** @type {Set<string>} */
      const definedInSetupDirectives = new Set()
      /** @type {Set<string>} */
      const definedInOptionDirectives = new Set()

      const globalScope = context.sourceCode.scopeManager.globalScope
      if (globalScope) {
        for (const variable of globalScope.variables) {
          definedInSetupDirectives.add(variable.name)
        }
        const moduleScope = globalScope.childScopes.find(
          (scope) => scope.type === 'module'
        )
        for (const variable of (moduleScope && moduleScope.variables) || []) {
          definedInSetupDirectives.add(variable.name)
        }
      }

      const scriptVisitor = utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          for (const directive of getRegisteredDirectives(node)) {
            definedInOptionDirectives.add(directive.name)
          }
        }
      })

      const templateBodyVisitor = createTemplateBodyVisitor(
        (rawName) =>
          isDefinedInSetup(rawName, definedInSetupDirectives) ||
          isDefinedInOptions(rawName, definedInOptionDirectives)
      )

      return utils.defineTemplateBodyVisitor(
        context,
        templateBodyVisitor,
        scriptVisitor
      )
    } else {
      // For Options API
      /** @type {Set<string>} */
      const definedInOptionDirectives = new Set()

      const scriptVisitor = utils.executeOnVue(context, (obj) => {
        for (const directive of getRegisteredDirectives(obj)) {
          definedInOptionDirectives.add(directive.name)
        }
      })

      const templateBodyVisitor = createTemplateBodyVisitor((rawName) =>
        isDefinedInOptions(rawName, definedInOptionDirectives)
      )

      return utils.defineTemplateBodyVisitor(
        context,
        templateBodyVisitor,
        scriptVisitor
      )
    }
  }
}
