'use strict'

const casing = require('../../../lib/utils/casing')
const chai = require('chai')

const assert = chai.assert

describe('getConverter()', () => {
  it('should conver string to camelCase', () => {
    const converter = casing.getConverter('camelCase')

    assert.ok(converter('fooBar') === 'fooBar')
    assert.ok(converter('foo-bar') === 'fooBar')
    assert.ok(converter('FooBar') === 'fooBar')
    assert.ok(converter('Foo1Bar') === 'foo1Bar')
  })

  it('should conver string to PascalCase', () => {
    const converter = casing.getConverter('PascalCase')

    assert.ok(converter('fooBar') === 'FooBar')
    assert.ok(converter('foo-bar') === 'FooBar')
    assert.ok(converter('FooBar') === 'FooBar')
    assert.ok(converter('Foo1Bar') === 'Foo1Bar')
  })

  it('should conver string to kebab-case', () => {
    const converter = casing.getConverter('kebab-case')

    assert.ok(converter('fooBar') === 'foo-bar')
    assert.ok(converter('foo-bar') === 'foo-bar')
    assert.ok(converter('FooBar') === 'foo-bar')
    assert.ok(converter('Foo1Bar') === 'foo1bar')
  })

  it('should conver string to snake_case', () => {
    const converter = casing.getConverter('snake_case')

    assert.ok(converter('fooBar') === 'foo_bar')
    assert.ok(converter('foo-bar') === 'foo_bar')
    assert.ok(converter('FooBar') === 'foo_bar')
    assert.ok(converter('Foo1Bar') === 'foo1bar')
  })
})
