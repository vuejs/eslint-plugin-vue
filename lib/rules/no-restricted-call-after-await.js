/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const fs = require('fs')
const path = require('path')
const { ReferenceTracker } = require('eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('eslint-utils').TYPES.TraceMap} TraceMap
 * @typedef {import('eslint-utils').TYPES.TraceKind} TraceKind
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow asynchronously called restricted methods',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-restricted-call-after-await.html'
    },
    fixable: null,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          module: { type: 'string' },
          path: {
            anyOf: [
              { type: 'string' },
              {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            ]
          },
          message: { type: 'string', minLength: 1 }
        },
        required: ['module'],
        additionalProperties: false
      },
      uniqueItems: true,
      minItems: 0
    },
    messages: {
      // eslint-disable-next-line eslint-plugin/report-message-format
      restricted: '{{message}}'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Map<ESNode, string>} */
    const restrictedCallNodes = new Map()
    /** @type {Map<FunctionExpression | ArrowFunctionExpression | FunctionDeclaration, { setupProperty: Property, afterAwait: boolean }>} */
    const setupFunctions = new Map()

    /**x
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration} functionNode
     */
    /** @type {ScopeStack | null} */
    let scopeStack = null

    /** @type {Record<string, string[]> | null} */
    let allLocalImports = null
    /**
     * @param {string} id
     */
    function safeRequireResolve(id) {
      try {
        if (fs.statSync(id).isDirectory()) {
          return require.resolve(id)
        }
      } catch (_e) {
        // ignore
      }
      return id
    }
    /**
     * @param {Program} ast
     */
    function getAllLocalImports(ast) {
      if (!allLocalImports) {
        allLocalImports = {}
        const dir = path.dirname(context.getFilename())
        for (const body of ast.body) {
          if (body.type !== 'ImportDeclaration') {
            continue
          }
          const source = String(body.source.value)
          if (!source.startsWith('.')) {
            continue
          }
          const modulePath = safeRequireResolve(path.join(dir, source))
          const list =
            allLocalImports[modulePath] || (allLocalImports[modulePath] = [])
          list.push(source)
        }
      }

      return allLocalImports
    }

    function getCwd() {
      if (context.getCwd) {
        return context.getCwd()
      }
      return path.resolve('')
    }

    /**
     * @param {string} moduleName
     * @param {Program} ast
     * @returns {string[]}
     */
    function normalizeModules(moduleName, ast) {
      /** @type {string} */
      let modulePath
      if (moduleName.startsWith('.')) {
        modulePath = safeRequireResolve(path.join(getCwd(), moduleName))
      } else if (path.isAbsolute(moduleName)) {
        modulePath = safeRequireResolve(moduleName)
      } else {
        return [moduleName]
      }
      return getAllLocalImports(ast)[modulePath] || []
    }

    return utils.compositingVisitors(
      {
        /** @param {Program} node */
        Program(node) {
          const tracker = new ReferenceTracker(context.getScope())

          for (const option of context.options) {
            const modules = normalizeModules(option.module, node)

            for (const module of modules) {
              /** @type {TraceMap} */
              const traceMap = {
                [module]: {
                  [ReferenceTracker.ESM]: true
                }
              }

              /** @type {TraceKind & TraceMap} */
              const mod = traceMap[module]
              let local = mod
              const paths = Array.isArray(option.path)
                ? option.path
                : [option.path || 'default']
              for (const path of paths) {
                local = local[path] || (local[path] = {})
              }
              local[ReferenceTracker.CALL] = true
              const message =
                option.message ||
                `The \`${[`import("${module}")`, ...paths].join(
                  '.'
                )}\` after \`await\` expression are forbidden.`

              for (const { node } of tracker.iterateEsmReferences(traceMap)) {
                restrictedCallNodes.set(node, message)
              }
            }
          }
        }
      },
      utils.defineVueVisitor(context, {
        /** @param {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration} node */
        ':function'(node) {
          scopeStack = {
            upper: scopeStack,
            functionNode: node
          }
        },
        onSetupFunctionEnter(node) {
          setupFunctions.set(node, {
            setupProperty: node.parent,
            afterAwait: false
          })
        },
        AwaitExpression() {
          if (!scopeStack) {
            return
          }
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData) {
            return
          }
          setupFunctionData.afterAwait = true
        },
        /** @param {CallExpression} node */
        CallExpression(node) {
          if (!scopeStack) {
            return
          }
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData || !setupFunctionData.afterAwait) {
            return
          }

          const message = restrictedCallNodes.get(node)
          if (message) {
            context.report({
              node,
              messageId: 'restricted',
              data: { message }
            })
          }
        },
        /** @param {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration} node */
        ':function:exit'(node) {
          scopeStack = scopeStack && scopeStack.upper

          setupFunctions.delete(node)
        }
      })
    )
  }
}
