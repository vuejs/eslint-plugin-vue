/**
 * @fileoverview enforce `v-for` directive's delimiter style
 * @author Flo Edelmann
 * @copyright 2020 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const {
  getTypeScript,
  isAny,
  isUnknown,
  isNever,
  isNull,
  isObject,
  isArrayLikeObject,
  isStringLike,
  isNumberLike,
  isBigIntLike,
  isReferenceObject
} = require('../utils/ts-utils/typescript')

/**
 * @typedef {'array'|'object'|'number'|'string'|'iterable'} IterableType
 */

/**
 * Statically determine the iterable type of a v-for expression without
 * needing TypeScript type information.
 *
 * @param {VForExpression} node
 * @returns {IterableType|null}
 */
function getStaticIterableType(node) {
  const right = node.right
  if (right.type === 'Literal') {
    if (typeof right.value === 'number') return 'number'
    if (typeof right.value === 'string') return 'string'
  }
  // In Vue's v-for, exactly 3 left-side variables means (value, key, index),
  // which is only possible when iterating over an object.
  if (node.left.length === 3) return 'object'
  return null
}

/**
 * @param {import('typescript').Type} type
 * @param {import('typescript').TypeChecker} checker
 * @returns {boolean}
 */
function isArrayType(type, checker) {
  if (!isObject(type)) return false
  // Array literals [1, 2, 3], tuples, evolving arrays
  if (isArrayLikeObject(type)) return true
  // Array<T> or ReadonlyArray<T> as class/interface
  if (type.isClassOrInterface()) {
    const name = checker.getFullyQualifiedName(type.symbol)
    if (name === 'Array' || name === 'ReadonlyArray') return true
  }
  // T[] represented as a TypeReference pointing to Array/ReadonlyArray
  if (isReferenceObject(type)) {
    const target = /** @type {any} */ (type).target
    if (target && target !== type && target.symbol) {
      const name = checker.getFullyQualifiedName(target.symbol)
      if (name === 'Array' || name === 'ReadonlyArray') return true
    }
  }
  return false
}

/**
 * Checks whether a TypeScript type has a `[Symbol.iterator]` method, which
 * identifies it as an iterable (e.g. Set, Map, generators).
 *
 * @param {import('typescript').Type} type
 * @param {import('typescript').TypeChecker} checker
 * @returns {boolean}
 */
function hasSymbolIterator(type, checker) {
  try {
    const properties = checker.getAugmentedPropertiesOfType(type)
    // TypeScript represents well-known symbol properties internally as
    // '__@<symbolName>@<uniqueId>', so Symbol.iterator becomes '__@iterator@…'
    return properties.some((prop) => prop.getName().startsWith('__@iterator'))
  } catch {
    return false
  }
}

/**
 * Classify a TypeScript type into an iterable category. For union types, all
 * non-null/undefined members must agree on the same category, otherwise null
 * is returned.
 *
 * @param {import('typescript').Type} type
 * @param {import('typescript').TypeChecker} checker
 * @returns {IterableType|null} null means "indeterminate / skip"
 */
function classifyTSType(type, checker) {
  if (type.isUnion()) {
    const categories = new Set(
      type.types
        .map((t) => classifyTSType(t, checker))
        .filter((c) => c !== null)
    )
    return categories.size === 1
      ? /** @type {IterableType} */ ([...categories][0])
      : null
  }

  // Null/undefined are transparent – ignore them. any/unknown/never can't be determined.
  if (isNull(type) || isAny(type) || isUnknown(type) || isNever(type))
    return null

  if (isNumberLike(type) || isBigIntLike(type)) return 'number'
  if (isStringLike(type)) return 'string'

  if (isObject(type)) {
    if (isArrayType(type, checker)) return 'array'
    if (hasSymbolIterator(type, checker)) return 'iterable'
    return 'object'
  }

  return null
}

/**
 * Given an Identifier node in a template expression, walk all ESLint scopes to
 * find the variable's declaration and return its corresponding TypeScript AST
 * node. Template expression nodes themselves are not in `esTreeNodeToTSNodeMap`,
 * but the declaration sites in the script section are.
 *
 * @param {Identifier} identifierNode
 * @param {SourceCode} sourceCode
 * @param {{ get(key: object): import('typescript').Node | undefined }} tsNodeMap
 * @returns {import('typescript').Node|undefined}
 */
function findTSNodeForIdentifier(identifierNode, sourceCode, tsNodeMap) {
  const scopeManager = sourceCode.scopeManager
  if (!scopeManager) return undefined

  const name = identifierNode.name

  for (const scope of scopeManager.scopes) {
    // Skip the global scope – it contains thousands of TypeScript lib globals
    if (scope === scopeManager.globalScope) continue

    const variable = scope.variables.find((v) => v.name === name)
    if (variable) {
      for (const def of variable.defs) {
        // VariableDeclarator and its id Identifier are both mapped
        for (const candidate of [def.node, def.node.id].filter(Boolean)) {
          const tsNode = tsNodeMap.get(candidate)
          if (tsNode) return tsNode
        }
      }
    }
  }
  return undefined
}

/**
 * Determine the iterable type of a v-for expression using TypeScript type
 * information. Returns null when TypeScript services are unavailable or the
 * type cannot be determined unambiguously.
 *
 * @param {VForExpression} node
 * @param {RuleContext} context
 * @returns {IterableType|null}
 */
function getTSIterableType(node, context) {
  const sourceCode = context.sourceCode
  const parserServices = sourceCode.parserServices
  if (!parserServices) return null

  const tsNodeMap = parserServices.esTreeNodeToTSNodeMap
  if (
    !tsNodeMap ||
    !parserServices.hasFullTypeInformation ||
    !parserServices.program
  )
    return null

  const checker = parserServices.program.getTypeChecker()

  if (!getTypeScript()) return null

  // Template expression nodes are NOT in the TypeScript node map because they
  // are processed by vue-eslint-parser separately from the script. When the RHS
  // is an Identifier, resolve it to its declaration in the script section by
  // searching all ESLint scopes, then look that declaration node up in the map.
  let tsNode = tsNodeMap.get(node.right)
  if (!tsNode && node.right.type === 'Identifier') {
    tsNode = findTSNodeForIdentifier(node.right, sourceCode, tsNodeMap)
  }
  if (!tsNode) return null

  let type
  try {
    type = checker.getTypeAtLocation(tsNode)
  } catch {
    return null
  }
  if (!type) return null

  return classifyTSType(type, checker)
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: "enforce `v-for` directive's delimiter style",
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/v-for-delimiter-style.html'
    },
    fixable: 'code',
    schema: [
      {
        oneOf: [
          { enum: ['in', 'of'] },
          {
            type: 'object',
            properties: {
              array: { enum: ['in', 'of'] },
              object: { enum: ['in', 'of'] },
              number: { enum: ['in', 'of'] },
              string: { enum: ['in', 'of'] },
              iterable: { enum: ['in', 'of'] },
              unknown: { enum: ['in', 'of'] }
            },
            additionalProperties: false
          }
        ]
      }
    ],
    messages: {
      expected:
        "Expected '{{preferredDelimiter}}' instead of '{{usedDelimiter}}' in 'v-for'."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const option = context.options[0]
    const perTypeDelimiters =
      option !== null && typeof option === 'object'
        ? /** @type {Partial<Record<IterableType|'unknown', 'in'|'of'>>} */ (
            option
          )
        : null
    const preferredDelimiter =
      perTypeDelimiters === null
        ? /** @type {string|undefined} */ (option) || 'in'
        : null

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VForExpression} node */
      VForExpression(node) {
        const sourceCode = context.sourceCode
        const tokenStore =
          sourceCode.parserServices.getTemplateBodyTokenStore &&
          sourceCode.parserServices.getTemplateBodyTokenStore()

        const lastLeftNode = node.left.at(-1)
        const delimiterToken = /** @type {Token} */ (
          tokenStore.getTokenAfter(
            lastLeftNode ?? tokenStore.getFirstToken(node),
            (token) => token.type !== 'Punctuator'
          )
        )

        /** @type {string} */
        let expected

        if (perTypeDelimiters === null) {
          expected = /** @type {string} */ (preferredDelimiter)
        } else {
          const iterableType =
            getStaticIterableType(node) ?? getTSIterableType(node, context)
          const key = iterableType ?? 'unknown'
          const configuredDelimiter = perTypeDelimiters[key]
          if (configuredDelimiter === undefined) {
            // This type is not configured in the option object – skip
            return
          }
          expected = configuredDelimiter
        }

        if (delimiterToken.value === expected) {
          return
        }

        context.report({
          node,
          loc: node.loc,
          messageId: 'expected',
          data: {
            preferredDelimiter: expected,
            usedDelimiter: delimiterToken.value
          },
          *fix(fixer) {
            yield fixer.replaceText(delimiterToken, expected)
          }
        })
      }
    })
  }
}
