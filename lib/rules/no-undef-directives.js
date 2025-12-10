/**
 * @author rzzf
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')

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
    .filter(
      /**
       * @param {Property | SpreadElement} node
       * @returns {node is Property}
       */
      (node) => node.type === 'Property'
    )
    .map((node) => {
      const name = utils.getStaticPropertyName(node)
      return name ? { node, name } : null
    })
    .filter(
      /**
       * @param {{node: Property, name: string} | null} res
       * @returns {res is {node: Property, name: string}}
       */
      (res) => res !== null
    )
}

class DefinedInSetupDirectives {
  constructor() {
    /**
     * Directive names
     * @type {Set<string>}
     */
    this.names = new Set()
  }

  /**
   * @param {string[]} names
   */
  addName(...names) {
    for (const name of names) {
      this.names.add(name)
    }
  }

  /**
   * @param {string} rawName
   */
  isDefinedDirective(rawName) {
    const camelName = camelize(rawName)
    const variableName = `v${casing.capitalize(camelName)}`
    if (this.names.has(variableName)) {
      return true
    }
    return false
  }
}

class DefinedInOptionDirectives {
  constructor() {
    /**
     * Directive names
     * @type {Set<string>}
     */
    this.names = new Set()
  }

  /**
   * @param {string[]} names
   */
  addName(...names) {
    for (const name of names) {
      this.names.add(name)
    }
  }

  /**
   * @param {string} rawName
   */
  isDefinedDirective(rawName) {
    const camelName = camelize(rawName)
    if (this.names.has(rawName) || this.names.has(camelName)) {
      return true
    }

    // allow case-insensitive ONLY when the directive name itself contains capitalized letters
    for (const name of this.names) {
      if (
        name.toLowerCase() === camelName.toLowerCase() &&
        name !== name.toLowerCase()
      ) {
        return true
      }
    }

    return false
  }
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
          ignorePatterns: {
            type: 'array',
            items: {
              type: 'string'
            },
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
    /** @type {string[]} */
    const ignorePatterns = options.ignorePatterns || []

    /**
     * Check whether the given directive name is a verify target or not.
     *
     * @param {string} rawName The directive name.
     * @returns {boolean}
     */
    function isVerifyTargetDirective(rawName) {
      if (utils.isBuiltInDirectiveName(rawName)) {
        return false
      }

      const ignored = ignorePatterns.some((pattern) =>
        new RegExp(pattern).test(rawName)
      )
      return !ignored
    }

    /** @type { (rawName:string, reportNode: ASTNode) => void } */
    let verifyName
    /** @type {RuleListener} */
    let scriptVisitor = {}
    /** @type {TemplateListener} */
    const templateBodyVisitor = {
      /** @param {VDirective} node */
      'VAttribute[directive=true]'(node) {
        const name = node.key.name.name
        if (utils.isBuiltInDirectiveName(name)) {
          return
        }
        verifyName(node.key.name.rawName || name, node.key)
      }
    }

    if (utils.isScriptSetup(context)) {
      // For <script setup>
      const definedInSetupDirectives = new DefinedInSetupDirectives()
      const definedInOptionDirectives = new DefinedInOptionDirectives()

      const globalScope = context.sourceCode.scopeManager.globalScope
      if (globalScope) {
        for (const variable of globalScope.variables) {
          definedInSetupDirectives.addName(variable.name)
        }
        const moduleScope = globalScope.childScopes.find(
          (scope) => scope.type === 'module'
        )
        for (const variable of (moduleScope && moduleScope.variables) || []) {
          definedInSetupDirectives.addName(variable.name)
        }
      }

      scriptVisitor = utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          for (const directive of getRegisteredDirectives(node)) {
            definedInOptionDirectives.addName(directive.name)
          }
        }
      })

      verifyName = (rawName, reportNode) => {
        if (!isVerifyTargetDirective(rawName)) {
          return
        }
        if (definedInSetupDirectives.isDefinedDirective(rawName)) {
          return
        }
        if (definedInOptionDirectives.isDefinedDirective(rawName)) {
          return
        }

        context.report({
          node: reportNode,
          messageId: 'undef',
          data: {
            name: rawName
          }
        })
      }
    } else {
      // For Options API
      const definedInOptionDirectives = new DefinedInOptionDirectives()

      scriptVisitor = utils.executeOnVue(context, (obj) => {
        for (const directive of getRegisteredDirectives(obj)) {
          definedInOptionDirectives.addName(directive.name)
        }
      })

      verifyName = (rawName, reportNode) => {
        if (!isVerifyTargetDirective(rawName)) {
          return
        }
        if (definedInOptionDirectives.isDefinedDirective(rawName)) {
          return
        }

        context.report({
          node: reportNode,
          messageId: 'undef',
          data: {
            name: rawName
          }
        })
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      templateBodyVisitor,
      scriptVisitor
    )
  }
}
