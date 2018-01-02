/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

'use strict'

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const COMMENT_DIRECTIVE_B = /^\s*(eslint-(?:en|dis)able)\s*(?:(\S|\S[\s\S]*\S)\s*)?$/
const COMMENT_DIRECTIVE_L = /^\s*(eslint-disable(?:-next)?-line)\s*(?:(\S|\S[\s\S]*\S)\s*)?$/

/**
 * Parse a given comment.
 * @param {RegExp} pattern The RegExp pattern to parse.
 * @param {string} comment The comment value to parse.
 * @returns {({type:string,rules:string[]})|null} The parsing result.
 */
function parse (pattern, comment) {
  const match = pattern.exec(comment)
  if (match == null) {
    return null
  }

  const type = match[1]
  const rules = (match[2] || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  return { type, rules }
}

/**
 * Enable rules.
 * @param {RuleContext} context The rule context.
 * @param {{line:number,column:number}} loc The location information to enable.
 * @param {string} group The group to enable.
 * @param {string[]} rules The rule IDs to enable.
 * @returns {void}
 */
function enable (context, loc, group, rules) {
  if (rules.length === 0) {
    context.report({ loc, message: '++ {{group}}', data: { group }})
  } else {
    context.report({ loc, message: '+ {{group}} {{rules}}', data: { group, rules: rules.join(' ') }})
  }
}

/**
 * Disable rules.
 * @param {RuleContext} context The rule context.
 * @param {{line:number,column:number}} loc The location information to disable.
 * @param {string} group The group to disable.
 * @param {string[]} rules The rule IDs to disable.
 * @returns {void}
 */
function disable (context, loc, group, rules) {
  if (rules.length === 0) {
    context.report({ loc, message: '-- {{group}}', data: { group }})
  } else {
    context.report({ loc, message: '- {{group}} {{rules}}', data: { group, rules: rules.join(' ') }})
  }
}

/**
 * Process a given comment token.
 * If the comment is `eslint-disable` or `eslint-enable` then it reports the comment.
 * @param {RuleContext} context The rule context.
 * @param {Token} comment The comment token to process.
 * @returns {void}
 */
function processBlock (context, comment) {
  const parsed = parse(COMMENT_DIRECTIVE_B, comment.value)
  if (parsed != null) {
    if (parsed.type === 'eslint-disable') {
      disable(context, comment.loc.start, 'block', parsed.rules)
    } else {
      enable(context, comment.loc.start, 'block', parsed.rules)
    }
  }
}

/**
 * Process a given comment token.
 * If the comment is `eslint-disable-line` or `eslint-disable-next-line` then it reports the comment.
 * @param {RuleContext} context The rule context.
 * @param {Token} comment The comment token to process.
 * @returns {void}
 */
function processLine (context, comment) {
  const parsed = parse(COMMENT_DIRECTIVE_L, comment.value)
  if (parsed != null && comment.loc.start.line === comment.loc.end.line) {
    const line = comment.loc.start.line + (parsed.type === 'eslint-disable-line' ? 0 : 1)
    const column = -1
    disable(context, { line, column }, 'line', parsed.rules)
    enable(context, { line: line + 1, column }, 'line', parsed.rules)
  }
}

/**
 * The implementation of `vue/comment-directive` rule.
 * @param {Program} node The program node to parse.
 * @returns {Object} The visitor of this rule.
 */
function create (context) {
  return {
    Program (node) {
      const comments = (node.templateBody && node.templateBody.comments) || []
      for (const comment of comments) {
        processBlock(context, comment)
        processLine(context, comment)
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'support comment-directives in `<template>`', // eslint-disable-line consistent-docs-description
      category: 'base'
    },
    schema: []
  },
  create
}
