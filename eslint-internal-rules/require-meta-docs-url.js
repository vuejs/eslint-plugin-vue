/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @author Teddy Katz <https://github.com/not-an-aardvark>
 *
 * Three functions `isNormalFunctionExpression`, `getKeyName`, and `getRuleInfo`
 * are copied from https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/blob/master/lib/utils.js
 *
 * I have a plan to send this rule to that plugin: https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/issues/55
 */

'use strict'

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const path = require('path')

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
* Determines whether a node is a 'normal' (i.e. non-async, non-generator) function expression.
* @param {ASTNode} node The node in question
* @returns {boolean} `true` if the node is a normal function expression
*/
function isNormalFunctionExpression (node) {
  return (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') && !node.generator && !node.async
}

/**
 * Gets the key name of a Property, if it can be determined statically.
 * @param {ASTNode} node The `Property` node
 * @returns {string|null} The key name, or `null` if the name cannot be determined statically.
 */
function getKeyName (property) {
  if (!property.computed && property.key.type === 'Identifier') {
    return property.key.name
  }
  if (property.key.type === 'Literal') {
    return '' + property.key.value
  }
  if (property.key.type === 'TemplateLiteral' && property.key.quasis.length === 1) {
    return property.key.quasis[0].value.cooked
  }
  return null
}

/**
* Performs static analysis on an AST to try to determine the final value of `module.exports`.
* @param {ASTNode} ast The `Program` AST node
* @returns {Object} An object with keys `meta`, `create`, and `isNewStyle`. `meta` and `create` correspond to the AST nodes
for the final values of `module.exports.meta` and `module.exports.create`. `isNewStyle` will be `true` if `module.exports`
is an object, and `false` if module.exports is just the `create` function. If no valid ESLint rule info can be extracted
from the file, the return value will be `null`.
*/
function getRuleInfo (ast) {
  const INTERESTING_KEYS = new Set(['create', 'meta'])
  let exportsVarOverridden = false
  let exportsIsFunction = false

  const exportNodes = ast.body
    .filter(statement => statement.type === 'ExpressionStatement')
    .map(statement => statement.expression)
    .filter(expression => expression.type === 'AssignmentExpression')
    .filter(expression => expression.left.type === 'MemberExpression')
    .reduce((currentExports, node) => {
      if (
        node.left.object.type === 'Identifier' && node.left.object.name === 'module' &&
        node.left.property.type === 'Identifier' && node.left.property.name === 'exports'
      ) {
        exportsVarOverridden = true

        if (isNormalFunctionExpression(node.right)) {
          // Check `module.exports = function () {}`

          exportsIsFunction = true
          return { create: node.right, meta: null }
        } else if (node.right.type === 'ObjectExpression') {
          // Check `module.exports = { create: function () {}, meta: {} }`

          exportsIsFunction = false
          return node.right.properties.reduce((parsedProps, prop) => {
            const keyValue = getKeyName(prop)
            if (INTERESTING_KEYS.has(keyValue)) {
              parsedProps[keyValue] = prop.value
            }
            return parsedProps
          }, {})
        }
        return {}
      } else if (
        !exportsIsFunction &&
        node.left.object.type === 'MemberExpression' &&
        node.left.object.object.type === 'Identifier' && node.left.object.object.name === 'module' &&
        node.left.object.property.type === 'Identifier' && node.left.object.property.name === 'exports' &&
        node.left.property.type === 'Identifier' && INTERESTING_KEYS.has(node.left.property.name)
      ) {
        // Check `module.exports.create = () => {}`

        currentExports[node.left.property.name] = node.right
      } else if (
        !exportsVarOverridden &&
        node.left.object.type === 'Identifier' && node.left.object.name === 'exports' &&
        node.left.property.type === 'Identifier' && INTERESTING_KEYS.has(node.left.property.name)
      ) {
        // Check `exports.create = () => {}`

        currentExports[node.left.property.name] = node.right
      }
      return currentExports
    }, {})

  return Object.prototype.hasOwnProperty.call(exportNodes, 'create')
    ? Object.assign({ isNewStyle: !exportsIsFunction, meta: null }, exportNodes)
    : null
}

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'require rules to implement a meta.docs.url property',
      category: 'Rules',
      recommended: false
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        pattern: { type: 'string' }
      },
      additionalProperties: false
    }]
  },

  /**
   * Creates AST event handlers for require-meta-docs-url.
   * @param {RuleContext} context - The rule context.
   * @returns {Object} AST event handlers.
   */
  create (context) {
    const options = context.options[0] || {}
    const sourceCode = context.getSourceCode()
    const filename = context.getFilename()
    const ruleName = filename === '<input>' ? undefined : path.basename(filename, '.js')
    const expectedUrl = !options.pattern || !ruleName
      ? undefined
      : options.pattern.replace(/{{\s*name\s*}}/g, ruleName)

    /**
     * Check whether a given node is the expected URL.
     * @param {Node} node The node of property value to check.
     * @returns {boolean} `true` if the node is the expected URL.
     */
    function isExpectedUrl (node) {
      return Boolean(
        node &&
        node.type === 'Literal' &&
        typeof node.value === 'string' &&
        (
          expectedUrl === undefined ||
          node.value === expectedUrl
        )
      )
    }

    /**
     * Insert a given property into a given object literal.
     * @param {SourceCodeFixer} fixer The fixer.
     * @param {Node} node The ObjectExpression node to insert a property.
     * @param {string} propertyText The property code to insert.
     * @returns {void}
     */
    function insertProperty (fixer, node, propertyText) {
      if (node.properties.length === 0) {
        return fixer.replaceText(node, `{\n${propertyText}\n}`)
      }
      return fixer.insertTextAfter(
        sourceCode.getLastToken(node.properties[node.properties.length - 1]),
        `,\n${propertyText}`
      )
    }

    return {
      Program (node) {
        const info = getRuleInfo(node)
        if (!info) {
          return
        }
        const metaNode = info.meta
        const docsPropNode =
          metaNode &&
          metaNode.properties &&
          metaNode.properties.find(p => p.type === 'Property' && getKeyName(p) === 'docs')
        const urlPropNode =
          docsPropNode &&
          docsPropNode.value.properties &&
          docsPropNode.value.properties.find(p => p.type === 'Property' && getKeyName(p) === 'url')

        if (isExpectedUrl(urlPropNode && urlPropNode.value)) {
          return
        }

        context.report({
          loc:
            (urlPropNode && urlPropNode.value.loc) ||
            (docsPropNode && docsPropNode.value.loc) ||
            (metaNode && metaNode.loc) ||
            node.loc.start,

          message:
            !urlPropNode ? 'Rules should export a `meta.docs.url` property.'
              : !expectedUrl ? '`meta.docs.url` property must be a string.'
                /* otherwise */ : '`meta.docs.url` property must be `{{expectedUrl}}`.',

          data: {
            expectedUrl
          },

          fix (fixer) {
            if (expectedUrl) {
              const urlString = JSON.stringify(expectedUrl)
              if (urlPropNode) {
                return fixer.replaceText(urlPropNode.value, urlString)
              }
              if (docsPropNode && docsPropNode.value.type === 'ObjectExpression') {
                return insertProperty(fixer, docsPropNode.value, `url: ${urlString}`)
              }
              if (!docsPropNode && metaNode && metaNode.type === 'ObjectExpression') {
                return insertProperty(fixer, metaNode, `docs: {\nurl: ${urlString}\n}`)
              }
            }
            return null
          }
        })
      }
    }
  }
}
