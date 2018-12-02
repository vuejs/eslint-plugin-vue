'use strict'

const casing = require('../../../lib/utils/casing')
const chai = require('chai')

const assert = chai.assert

describe('getConverter()', () => {
  it('should convert string to camelCase', () => {
    const converter = casing.getConverter('camelCase')

    assert.equal(converter('foo'), 'foo')
    assert.equal(converter('fooBar'), 'fooBar')
    assert.equal(converter('foo-bar'), 'fooBar')
    assert.equal(converter('foo_bar'), 'fooBar')
    assert.equal(converter('FooBar'), 'fooBar')
    assert.equal(converter('Foo1Bar'), 'foo1Bar')
    assert.equal(converter('FooBAR'), 'fooBAR')
    assert.equal(converter('Foo1BAZ'), 'foo1BAZ')
    assert.equal(converter('foo1b_a_z'), 'foo1bAZ')
    assert.equal(converter('darИībaÊÊw'), 'darИībaÊÊw')
    assert.equal(converter('    foo       Bar   '), 'fooBar')
  })

  it('should convert string to PascalCase', () => {
    const converter = casing.getConverter('PascalCase')

    assert.equal(converter('foo'), 'Foo')
    assert.equal(converter('fooBar'), 'FooBar')
    assert.equal(converter('foo-bar'), 'FooBar')
    assert.equal(converter('foo_bar'), 'FooBar')
    assert.equal(converter('FooBar'), 'FooBar')
    assert.equal(converter('Foo1Bar'), 'Foo1Bar')
    assert.equal(converter('FooBAR'), 'FooBAR')
    assert.equal(converter('Foo1BAZ'), 'Foo1BAZ')
    assert.equal(converter('foo1b_a_z'), 'Foo1bAZ')
    assert.equal(converter('darИībaÊÊw'), 'DarИībaÊÊw')
    assert.equal(converter('    foo       Bar   '), 'FooBar')
  })

  it('should convert string to kebab-case', () => {
    const converter = casing.getConverter('kebab-case')

    assert.equal(converter('foo'), 'foo')
    assert.equal(converter('fooBar'), 'foo-bar')
    assert.equal(converter('foo-bar'), 'foo-bar')
    assert.equal(converter('foo_bar'), 'foo-bar')
    assert.equal(converter('FooBar'), 'foo-bar')
    assert.equal(converter('Foo1Bar'), 'foo1-bar')
    assert.equal(converter('FooBAR'), 'foo-b-a-r')
    assert.equal(converter('Foo1BAZ'), 'foo1-b-a-z')
    assert.equal(converter('foo1b_a_z'), 'foo1b-a-z')
    assert.equal(converter('darИībaÊÊw'), 'dar-иība-ê-êw')
    assert.equal(converter('    foo       Bar   '), 'foo-bar')
  })

  it('should convert string to snake_case', () => {
    const converter = casing.getConverter('snake_case')

    assert.equal(converter('a'), 'a')
    assert.equal(converter('fooBar'), 'foo_bar')
    assert.equal(converter('foo-bar'), 'foo_bar')
    assert.equal(converter('FooBar'), 'foo_bar')
    assert.equal(converter('Foo1Bar'), 'foo1_bar')
    assert.equal(converter('FooBAR'), 'foo_b_a_r')
    assert.equal(converter('Foo1BAZ'), 'foo1_b_a_z')
    assert.equal(converter('foo1b_a_z'), 'foo1b_a_z')
    assert.equal(converter('darИībaÊÊw'), 'dar_иība_ê_êw')
    assert.equal(converter('    foo       Bar   '), 'foo_bar')
  })

  it('unicode tests', () => {
    const words = [
      ['ÊtreSîne', 'être_sîne'],
      ['darbībaÊÊw', 'darbība_ê_êw'],
      ['klâwen-ûf', 'klâwen_ûf'],
      ['γλώσσαΤη', 'γλώσσα_τη'],
      ['пустынныхИвдалП', 'пустынных_ивдал_п'],
      ['kpłĄżć', 'kpł_ążć']
    ]
    for (const [word, snake] of words) {
      assert.equal(casing.camelCase(word), casing.camelCase(casing.snakeCase(word)))
      assert.equal(casing.pascalCase(word), casing.pascalCase(casing.kebabCase(word)))
      assert.equal(casing.kebabCase(word), casing.kebabCase(casing.camelCase(word)))
      assert.equal(casing.snakeCase(word), casing.snakeCase(casing.pascalCase(word)))
      assert.equal(casing.snakeCase(word), snake)
    }
  })
})
