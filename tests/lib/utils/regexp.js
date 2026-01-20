'use strict'

const {
  escape,
  toRegExp,
  toRegExpGroupMatcher
} = require('../../../lib/utils/regexp.ts')
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

  it('should handle simple patterns', () => {
    const regex = toRegExp('foo')
    assert.strictEqual(regex.test('foo'), true)
    assert.strictEqual(regex.test('bar'), false)
    assert.strictEqual(regex.test('foobar'), false)
    assert.strictEqual(regex.test('afoo'), false)
    assert.strictEqual(regex.test('afoobar'), false)
    assert.strictEqual(regex.test('Foo'), false)
  })

  it('should handle simple patterns with added flags', () => {
    const regex = toRegExp('foo', { add: 'i' })
    assert.strictEqual(regex.test('foo'), true)
    assert.strictEqual(regex.test('bar'), false)
    assert.strictEqual(regex.test('foobar'), false)
    assert.strictEqual(regex.test('afoo'), false)
    assert.strictEqual(regex.test('afoobar'), false)
    assert.strictEqual(regex.test('Foo'), true)
  })

  it('should handle regexp patterns', () => {
    const regex = toRegExp('/^foo/')
    assert.strictEqual(regex.test('foo'), true)
    assert.strictEqual(regex.test('bar'), false)
    assert.strictEqual(regex.test('foobar'), true)
    assert.strictEqual(regex.test('afoo'), false)
    assert.strictEqual(regex.test('afoobar'), false)
    assert.strictEqual(regex.test('Foo'), false)
  })

  it('should handle regexp patterns with attached flags', () => {
    const regex = toRegExp('/^foo/i')
    assert.strictEqual(regex.test('foo'), true)
    assert.strictEqual(regex.test('bar'), false)
    assert.strictEqual(regex.test('foobar'), true)
    assert.strictEqual(regex.test('afoo'), false)
    assert.strictEqual(regex.test('afoobar'), false)
    assert.strictEqual(regex.test('Foo'), true)
  })

  it('should handle regexp patterns with added flags', () => {
    const regex = toRegExp('/^foo/', { add: 'i' })
    assert.deepEqual(regex, /^foo/i)
    assert.strictEqual(regex.test('foo'), true)
    assert.strictEqual(regex.test('bar'), false)
    assert.strictEqual(regex.test('foobar'), true)
    assert.strictEqual(regex.test('afoo'), false)
    assert.strictEqual(regex.test('afoobar'), false)
    assert.strictEqual(regex.test('Foo'), true)
  })

  it('should handle regexp patterns with removed flags', () => {
    const regex = toRegExp('/^foo/i', { remove: 'i' })
    assert.deepEqual(regex, /^foo/)
    assert.strictEqual(regex.test('foo'), true)
    assert.strictEqual(regex.test('bar'), false)
    assert.strictEqual(regex.test('foobar'), true)
    assert.strictEqual(regex.test('afoo'), false)
    assert.strictEqual(regex.test('afoobar'), false)
    assert.strictEqual(regex.test('Foo'), false)
  })
})

describe('toRegExpGroupMatcher()', () => {
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
    const groupMatcher = toRegExpGroupMatcher(['/^foo/g'])
    assert.strictEqual(groupMatcher(''), false)
    assert.strictEqual(groupMatcher('foo'), true)
    assert.strictEqual(groupMatcher('fooa', 'early'), true)
    assert.strictEqual(groupMatcher('late', 'matches', 'fooa'), true)
    assert.strictEqual(groupMatcher('barfoo'), false)
    assert.strictEqual(groupMatcher('afoo', 'afooa', 'bar'), false)
  })

  it('should return a function for multiple regexp patterns', () => {
    const groupMatcher = toRegExpGroupMatcher(['/^foo/', '/bar$/gi'])
    assert.strictEqual(groupMatcher('foo'), true)
    assert.strictEqual(groupMatcher('Bar', 'early'), true)
    assert.strictEqual(groupMatcher('late', 'matches', 'foo'), true)
    assert.strictEqual(groupMatcher('barfoo'), false)
    assert.strictEqual(groupMatcher('afoo', 'afooa', 'bara'), false)
  })
})
