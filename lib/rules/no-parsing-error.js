/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// https://html.spec.whatwg.org/multipage/parsing.html#parse-errors
// TODO: Enable all by default.
const DEFAULT_OPTIONS = Object.freeze(Object.assign(Object.create(null), {
  'abrupt-closing-of-empty-comment': false,
  'absence-of-digits-in-numeric-character-reference': false,
  'cdata-in-html-content': false,
  'character-reference-outside-unicode-range': false,
  'control-character-in-input-stream': false,
  'control-character-reference': false,
  'eof-before-tag-name': false,
  'eof-in-cdata': false,
  'eof-in-comment': false,
  'eof-in-tag': false,
  'incorrectly-closed-comment': false,
  'incorrectly-opened-comment': false,
  'invalid-first-character-of-tag-name': false,
  'missing-attribute-value': false,
  'missing-end-tag-name': false,
  'missing-semicolon-after-character-reference': false,
  'missing-whitespace-between-attributes': false,
  'nested-comment': false,
  'noncharacter-character-reference': false,
  'noncharacter-in-input-stream': false,
  'null-character-reference': false,
  'surrogate-character-reference': false,
  'surrogate-in-input-stream': false,
  'unexpected-character-in-attribute-name': false,
  'unexpected-character-in-unquoted-attribute-value': false,
  'unexpected-equals-sign-before-attribute-name': false,
  'unexpected-null-character': false,
  'unexpected-question-mark-instead-of-tag-name': false,
  'unexpected-solidus-in-tag': false,
  'unknown-named-character-reference': false,
  'end-tag-with-attributes': false,
  'duplicate-attribute': false,
  'end-tag-with-trailing-solidus': false,
  'non-void-html-element-start-tag-with-trailing-solidus': false,
  'x-invalid-end-tag': false,
  'x-invalid-namespace': false
}))

/**
 * Creates AST event handlers for no-parsing-error.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  const options = Object.assign({}, DEFAULT_OPTIONS, context.options[0] || {})

  return {
    Program (program) {
      const node = program.templateBody
      if (node == null || node.errors == null) {
        return
      }

      for (const error of node.errors) {
        if (error.code && !options[error.code]) {
          continue
        }

        context.report({
          node,
          loc: { line: error.lineNumber, column: error.column },
          message: 'Parsing error: {{message}}.',
          data: {
            message: error.message.endsWith('.')
              ? error.message.slice(0, -1)
              : error.message
          }
        })
      }
    }
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'disallow parsing errors in `<template>`',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: false,
    schema: [
      {
        type: 'object',
        properties: Object.keys(DEFAULT_OPTIONS).reduce((ret, code) => {
          ret[code] = { type: 'boolean' }
          return ret
        }, {}),
        additionalProperties: false
      }
    ]
  }
}
