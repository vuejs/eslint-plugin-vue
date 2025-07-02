'use strict'

const {
  escape,
  toRegExp,
  toRegExpGroupMatcher
} = require('../../../lib/utils/regexp')
const assert = require('assert')

const ESCAPED = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\'
const UNESCAPED = '^$.*+?()[]{}|\\'

describe('escape()', () => {
  it('should escape values', () => {
    assert.strictEqual(escape(UNESCAPED), ESCAPED)
    assert.strictEqual(escape(UNESCAPED + UNESCAPED), ESCAPED + ESCAPED)
  })

  it('should handle strings with nothing to escape', () => {
    assert.strictEqual(escape('abc'), 'abc')
  })

  it('should return an empty string for empty values', () => {
    assert.strictEqual(escape(null), null)
    assert.strictEqual(escape(undefined), undefined)
    assert.strictEqual(escape(''), '')
  })
})

describe('toRegExp()', () => {
  it('should be convert to RegExp', () => {
    assert.deepEqual(toRegExp('foo'), /^foo$/)
    assert.deepEqual(toRegExp(UNESCAPED), new RegExp(`^${ESCAPED}$`))
  })

  it('RegExp like string should be convert to RegExp', () => {
    assert.deepEqual(toRegExp('/^foo/i'), /^foo/i)
    assert.deepEqual(toRegExp('/.*/iu'), /.*/iu)
    assert.deepEqual(toRegExp(`${/^bar/i}`), /^bar/i)
    assert.deepEqual(toRegExp(`${/[\sA-Z]+/u}`), /[\sA-Z]+/u)
  })
})

describe('toRegExpCheckGroup()', () => {
  it('should return a function missing input', () => {
    const groupMatcher = toRegExpGroupMatcher()
    assert.strictEqual(groupMatcher(''), false)
    assert.strictEqual(groupMatcher('foo'), false)
    assert.strictEqual(groupMatcher('bar'), false)
  })

  it('should return a function for empty array', () => {
    const groupMatcher = toRegExpGroupMatcher([])
    assert.strictEqual(groupMatcher(''), false)
    assert.strictEqual(groupMatcher('foo'), false)
    assert.strictEqual(groupMatcher('bar'), false)
  })

  it('should return a function for single simple pattern', () => {
    const groupMatcher = toRegExpGroupMatcher(['foo'])
    assert.strictEqual(groupMatcher(''), false)
    assert.strictEqual(groupMatcher('foo'), true)
    assert.strictEqual(groupMatcher('foo', 'early'), true)
    assert.strictEqual(groupMatcher('late', 'matches', 'foo'), true)
    assert.strictEqual(groupMatcher('foobar'), false)
    assert.strictEqual(groupMatcher('afoo', 'fooa', 'afooa', 'bar'), false)
  })

  it('should return a function for multiple simple patterns', () => {
    const groupMatcher = toRegExpGroupMatcher(['foo', 'bar'])
    assert.strictEqual(groupMatcher('foo'), true)
    assert.strictEqual(groupMatcher('bar', 'early'), true)
    assert.strictEqual(groupMatcher('late', 'matches', 'foo'), true)
    assert.strictEqual(groupMatcher('foobar'), false)
    assert.strictEqual(groupMatcher('afoo', 'fooa', 'afooa'), false)
  })

  it('should return a function for single regexp pattern', () => {
    const groupMatcher = toRegExpGroupMatcher(['/^foo/'])
    assert.strictEqual(groupMatcher(''), false)
    assert.strictEqual(groupMatcher('foo'), true)
    assert.strictEqual(groupMatcher('fooa', 'early'), true)
    assert.strictEqual(groupMatcher('late', 'matches', 'fooa'), true)
    assert.strictEqual(groupMatcher('barfoo'), false)
    assert.strictEqual(groupMatcher('afoo', 'afooa', 'bar'), false)
  })

  it('should return a function for multiple regexp patterns', () => {
    const groupMatcher = toRegExpGroupMatcher(['/^foo/', '/bar$/'])
    assert.strictEqual(groupMatcher('foo'), true)
    assert.strictEqual(groupMatcher('bar', 'early'), true)
    assert.strictEqual(groupMatcher('late', 'matches', 'foo'), true)
    assert.strictEqual(groupMatcher('barfoo'), false)
    assert.strictEqual(groupMatcher('afoo', 'afooa', 'bara'), false)
  })
})
