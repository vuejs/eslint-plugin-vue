'use strict'

const assert = require('assert')
const {
  isBlockComment,
  isJSDocComment
} = require('../../../lib/utils/comments.js')

// //foo
const lineCommentNode = {
  type: 'Line',
  value: 'foo'
}

// /*foo*/
const blockCommentNodeWithoutAsterisks = {
  type: 'Block',
  value: 'foo'
}

// //** foo */
const blockCommentNodeWithOneAsterisk = {
  type: 'Block',
  value: '* foo'
}

// /*** foo */
const blockCommentNodeWithTwoAsterisks = {
  type: 'Block',
  value: '** foo'
}

describe('isJSDocComment()', () => {
  it('returns true for JSDoc comments', () => {
    assert.equal(isJSDocComment(blockCommentNodeWithOneAsterisk), true)
  })

  it('returns false for block comments', () => {
    assert.equal(isJSDocComment(blockCommentNodeWithoutAsterisks), false)
  })

  it('returns false for line comments', () => {
    assert.equal(isJSDocComment(lineCommentNode), false)
  })

  it('returns false for block comments with two asterisks', () => {
    assert.equal(isJSDocComment(blockCommentNodeWithTwoAsterisks), false)
  })
})

describe('isBlockComment()', () => {
  it('returns false for JSDoc comments', () => {
    assert.equal(isBlockComment(blockCommentNodeWithOneAsterisk), false)
  })

  it('returns true for block comments', () => {
    assert.equal(isBlockComment(blockCommentNodeWithoutAsterisks), true)
  })

  it('returns false for line comments', () => {
    assert.equal(isBlockComment(lineCommentNode), false)
  })

  it('returns true for block comments with two asterisks', () => {
    assert.equal(isBlockComment(blockCommentNodeWithTwoAsterisks), true)
  })
})
