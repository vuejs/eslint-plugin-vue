'use strict'

const babelEslint = require('babel-eslint')
const utils = require('../../../lib/utils/index')
const chai = require('chai')

const assert = chai.assert

describe('parseMemberExpression', () => {
  let node

  const parse = function (code) {
    return babelEslint.parse(code).body[0].expression
  }

  it('should parse member expression', () => {
    node = parse('this.some.nested.property')
    assert.deepEqual(
      utils.parseMemberExpression(node),
      ['this', 'some', 'nested', 'property']
    )

    node = parse('another.property')
    assert.deepEqual(
      utils.parseMemberExpression(node),
      ['another', 'property']
    )

    node = parse('this.something')
    assert.deepEqual(
      utils.parseMemberExpression(node),
      ['this', 'something']
    )
  })
})

describe('getComputedProperties', () => {
  let node

  const parse = function (code) {
    return babelEslint.parse(code).body[0].declarations[0].init
  }

  it('should return empty array when there is no computed property', () => {
    node = parse(`const test = {
      name: 'test',
      data() {
        return {}
      }
    }`)

    assert.equal(
      utils.getComputedProperties(node).length,
      0
    )
  })

  it('should return computed properties', () => {
    node = parse(`const test = {
      name: 'test',
      data() {
        return {}
      },
      computed: {
        a: 'bad',
        b: function () {
          return 'b'
        },
        c() {
          return 'c'
        },
        d: {},
        e: {
          set(val) {
            this.something = val
          }
        },
        f: {
          get() {
            return 'f'
          }
        }
      }
    }`)

    const computedProperties = utils.getComputedProperties(node)

    assert.equal(
      computedProperties.length,
      6,
      'it detects all computed properties'
    )

    assert.notOk(computedProperties[0].value)
    assert.ok(computedProperties[1].value)
    assert.ok(computedProperties[2].value)
    assert.notOk(computedProperties[3].value)
    assert.notOk(computedProperties[4].value)
    assert.ok(computedProperties[5].value)
  })

  it('should not collide with object spread operator', () => {
    node = parse(`const test = {
      name: 'test',
      computed: {
        ...mapGetters(['test']),
        a() {
          return 'a'
        }
      }
    }`)

    const computedProperties = utils.getComputedProperties(node)

    assert.equal(
      computedProperties.length,
      1,
      'it detects all computed properties'
    )

    assert.ok(computedProperties[0].value)
  })
})
