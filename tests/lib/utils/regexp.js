'use strict'

const { escape, toRegExp } = require('../../../lib/utils/regexp')
const chai = require('chai')

const assert = chai.assert

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
