/**
 * @fileoverview Internal rule to enforce valid default options.
 * @author Flo Edelmann
 */

'use strict'

const Ajv = require('ajv')
const metaSchema = require('ajv/lib/refs/json-schema-draft-04.json')

// from https://github.com/eslint/eslint/blob/main/lib/shared/ajv.js
const ajv = new Ajv({
  meta: false,
  useDefaults: true,
  validateSchema: false,
  missingRefs: 'ignore',
  verbose: true,
  schemaId: 'auto'
})
ajv.addMetaSchema(metaSchema)
ajv._opts.defaultMeta = metaSchema.id

// from https://github.com/eslint/eslint/blob/main/lib/config/flat-config-helpers.js
const noOptionsSchema = Object.freeze({
  type: 'array',
  minItems: 0,
  maxItems: 0
})
function getRuleOptionsSchema(schema) {
  if (schema === false || typeof schema !== 'object' || schema === null) {
    return null
  }

  if (!Array.isArray(schema)) {
    return schema
  }

  if (schema.length === 0) {
    return { ...noOptionsSchema }
  }

  return {
    type: 'array',
    items: schema,
    minItems: 0,
    maxItems: schema.length
  }
}

/**
 * @param {RuleContext} context
 * @param {ASTNode} node
 * @returns {any}
 */
function getNodeValue(context, node) {
  try {
    // eslint-disable-next-line no-eval
    return eval(context.getSourceCode().getText(node))
  } catch (error) {
    return undefined
  }
}

/**
 * Gets the property of the Object node passed in that has the name specified.
 *
 * @param {string} propertyName Name of the property to return.
 * @param {ASTNode} node The ObjectExpression node.
 * @returns {ASTNode} The Property node or null if not found.
 */
function getPropertyFromObject(propertyName, node) {
  if (node && node.type === 'ObjectExpression') {
    for (const property of node.properties) {
      if (property.type === 'Property' && property.key.name === propertyName) {
        return property
      }
    }
  }
  return null
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce correct use of `meta` property in core rules',
      categories: ['Internal']
    },
    schema: [],
    messages: {
      defaultOptionsNotMatchingSchema:
        'Default options do not match the schema.'
    }
  },

  create(context) {
    /** @type {ASTNode} */
    let exportsNode

    return {
      AssignmentExpression(node) {
        if (
          node.left &&
          node.right &&
          node.left.type === 'MemberExpression' &&
          node.left.object.name === 'module' &&
          node.left.property.name === 'exports'
        ) {
          exportsNode = node.right
        }
      },

      'Program:exit'() {
        const metaProperty = getPropertyFromObject('meta', exportsNode)
        if (!metaProperty) {
          return
        }

        const metaSchema = getPropertyFromObject('schema', metaProperty.value)
        const metaDefaultOptions = getPropertyFromObject(
          'defaultOptions',
          metaProperty.value
        )

        if (
          !metaSchema ||
          !metaDefaultOptions ||
          metaDefaultOptions.value.type !== 'ArrayExpression'
        ) {
          return
        }

        const defaultOptions = getNodeValue(context, metaDefaultOptions.value)
        const schema = getNodeValue(context, metaSchema.value)

        if (!defaultOptions || !schema) {
          return
        }

        let validate
        try {
          validate = ajv.compile(getRuleOptionsSchema(schema))
        } catch (error) {
          return
        }

        if (!validate(defaultOptions)) {
          context.report({
            node: metaDefaultOptions.value,
            messageId: 'defaultOptionsNotMatchingSchema'
          })
        }
      }
    }
  }
}
