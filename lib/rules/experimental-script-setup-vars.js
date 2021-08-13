/**
 * @fileoverview prevent variables defined in `<script setup>` to be marked as undefined
 * @author Yosuke Ota
 */
'use strict'

const Module = require('module')
const path = require('path')
const utils = require('../utils')
const AST = require('vue-eslint-parser').AST

const ecmaVersion = 2020

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'prevent variables defined in `<script setup>` to be marked as undefined', // eslint-disable-line eslint-plugin/require-meta-docs-description
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/experimental-script-setup-vars.html'
    },
    deprecated: true,
    schema: []
  },
  /**
   * @param {RuleContext} context - The rule context.
   * @returns {RuleListener} AST event handlers.
   */
  create(context) {
    const documentFragment =
      context.parserServices.getDocumentFragment &&
      context.parserServices.getDocumentFragment()
    if (!documentFragment) {
      return {}
    }
    const sourceCode = context.getSourceCode()
    const scriptElement = documentFragment.children
      .filter(utils.isVElement)
      .find(
        (element) =>
          element.name === 'script' &&
          element.range[0] <= sourceCode.ast.range[0] &&
          sourceCode.ast.range[1] <= element.range[1]
      )
    if (!scriptElement) {
      return {}
    }
    const setupAttr = utils.getAttribute(scriptElement, 'setup')
    if (!setupAttr || !setupAttr.value) {
      return {}
    }
    const value = setupAttr.value.value

    let eslintScope
    try {
      eslintScope = getESLintModule('eslint-scope', () =>
        // @ts-ignore
        require('eslint-scope')
      )
    } catch (_e) {
      context.report({
        node: setupAttr,
        message: 'Can not be resolved eslint-scope.'
      })
      return {}
    }
    let espree
    try {
      espree = getESLintModule('espree', () =>
        // @ts-ignore
        require('espree')
      )
    } catch (_e) {
      context.report({
        node: setupAttr,
        message: 'Can not be resolved espree.'
      })
      return {}
    }

    const globalScope = sourceCode.scopeManager.scopes[0]

    /** @type {string[]} */
    let vars
    try {
      vars = parseSetup(value, espree, eslintScope)
    } catch (_e) {
      context.report({
        node: setupAttr.value,
        message: 'Parsing error.'
      })
      return {}
    }

    // Define configured global variables.
    for (const id of vars) {
      const tempVariable = globalScope.set.get(id)

      /** @type {Variable} */
      let variable
      if (!tempVariable) {
        variable = new eslintScope.Variable(id, globalScope)

        globalScope.variables.push(variable)
        globalScope.set.set(id, variable)
      } else {
        variable = tempVariable
      }

      variable.eslintImplicitGlobalSetting = 'readonly'
      variable.eslintExplicitGlobal = undefined
      variable.eslintExplicitGlobalComments = undefined
      variable.writeable = false
    }

    /*
     * "through" contains all references which definitions cannot be found.
     * Since we augment the global scope using configuration, we need to update
     * references and remove the ones that were added by configuration.
     */
    globalScope.through = globalScope.through.filter((reference) => {
      const name = reference.identifier.name
      const variable = globalScope.set.get(name)

      if (variable) {
        /*
         * Links the variable and the reference.
         * And this reference is removed from `Scope#through`.
         */
        reference.resolved = variable
        variable.references.push(reference)

        return false
      }

      return true
    })

    return {}
  }
}

/**
 * @param {string} code
 * @param {any} espree
 * @param {any} eslintScope
 * @returns {string[]}
 */
function parseSetup(code, espree, eslintScope) {
  /** @type {Program} */
  const ast = espree.parse(`(${code})=>{}`, { ecmaVersion })
  const result = eslintScope.analyze(ast, {
    ignoreEval: true,
    nodejsScope: false,
    ecmaVersion,
    sourceType: 'script',
    fallback: AST.getFallbackKeys
  })

  const variables = /** @type {Variable[]} */ (
    result.globalScope.childScopes[0].variables
  )

  return variables.map((v) => v.name)
}

const createRequire =
  // Added in v12.2.0
  Module.createRequire ||
  // Added in v10.12.0, but deprecated in v12.2.0.
  Module.createRequireFromPath ||
  // Polyfill - This is not executed on the tests on node@>=10.
  /**
   * @param {string} filename
   */
  function (filename) {
    const mod = new Module(filename)

    mod.filename = filename
    // @ts-ignore
    mod.paths = Module._nodeModulePaths(path.dirname(filename))
    // @ts-ignore
    mod._compile('module.exports = require;', filename)
    return mod.exports
  }

/** @type { { 'espree'?: any, 'eslint-scope'?: any } } */
const modulesCache = {}

/**
 * @param {string} p
 */
function isLinterPath(p) {
  return (
    // ESLint 6 and above
    p.includes(`eslint${path.sep}lib${path.sep}linter${path.sep}linter.js`) ||
    // ESLint 5
    p.includes(`eslint${path.sep}lib${path.sep}linter.js`)
  )
}

/**
 * Load module from the loaded ESLint.
 * If the loaded ESLint was not found, just returns `fallback()`.
 * @param {'espree' | 'eslint-scope'} name
 * @param { () => any } fallback
 */
function getESLintModule(name, fallback) {
  if (!modulesCache[name]) {
    // Lookup the loaded eslint
    const linterPath = Object.keys(require.cache).find(isLinterPath)
    if (linterPath) {
      try {
        modulesCache[name] = createRequire(linterPath)(name)
      } catch (_e) {
        // ignore
      }
    }
    if (!modulesCache[name]) {
      modulesCache[name] = fallback()
    }
  }

  return modulesCache[name]
}
