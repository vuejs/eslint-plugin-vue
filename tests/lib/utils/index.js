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

  it('should not collide with object spread operator inside CP', () => {
    node = parse(`const test = {
      name: 'test',
      computed: {
        foo: {
          ...mapGetters({ get: 'getFoo' }),
          ...mapActions({ set: 'setFoo' })
        }
      }
    }`)

    const computedProperties = utils.getComputedProperties(node)

    assert.equal(
      computedProperties.length,
      1,
      'it detects all computed properties'
    )

    assert.notOk(computedProperties[0].value)
  })
})

describe('getStaticPropertyName', () => {
  let node

  const parse = function (code) {
    return babelEslint.parse(code).body[0].declarations[0].init
  }

  it('should parse property expression with identifier', () => {
    node = parse(`const test = { computed: { } }`)

    const parsed = utils.getStaticPropertyName(node.properties[0])
    assert.ok(parsed === 'computed')
  })
  it('should parse property expression with literal', () => {
    node = parse(`const test = { ['computed'] () {} }`)

    const parsed = utils.getStaticPropertyName(node.properties[0])
    assert.ok(parsed === 'computed')
  })
  it('should parse property expression with template literal', () => {
    node = parse(`const test = { [\`computed\`] () {} }`)

    const parsed = utils.getStaticPropertyName(node.properties[0])
    assert.ok(parsed === 'computed')
  })
  it('should parse identifier', () => {
    node = parse(`const test = { computed: { } }`)

    const parsed = utils.getStaticPropertyName(node.properties[0].key)
    assert.ok(parsed === 'computed')
  })
  it('should parse literal', () => {
    node = parse(`const test = { ['computed'] () {} }`)

    const parsed = utils.getStaticPropertyName(node.properties[0].key)
    assert.ok(parsed === 'computed')
  })
  it('should parse template literal', () => {
    node = parse(`const test = { [\`computed\`] () {} }`)

    const parsed = utils.getStaticPropertyName(node.properties[0].key)
    assert.ok(parsed === 'computed')
  })
})

describe('parseMemberOrCallExpression', () => {
  let node

  const parse = function (code) {
    return babelEslint.parse(code).body[0].declarations[0].init
  }

  it('should parse CallExpression', () => {
    node = parse(`const test = this.lorem['ipsum'].map(d => d.id).filter((a, b) => a > b).reduce((acc, d) => acc + d, 0)`)
    const parsed = utils.parseMemberOrCallExpression(node)
    assert.equal(parsed, 'this.lorem[].map().filter().reduce()')
  })

  it('should parse MemberExpression', () => {
    node = parse(`const test = this.lorem['ipsum'][0].map(d => d.id).dolor.reduce((acc, d) => acc + d, 0).sit`)
    const parsed = utils.parseMemberOrCallExpression(node)
    assert.equal(parsed, 'this.lorem[][].map().dolor.reduce().sit')
  })
})

describe('getRegisteredComponents', () => {
  let node

  const parse = function (code) {
    return babelEslint.parse(code).body[0].declarations[0].init
  }

  it('should return empty array when there are no components registered', () => {
    node = parse(`const test = {
      name: 'test',
    }`)

    assert.equal(
      utils.getRegisteredComponents(node).length,
      0
    )
  })

  it('should return an array with all registered components', () => {
    node = parse(`const test = {
      name: 'test',
      components: {
        ...test,
        PrimaryButton,
        secondaryButton,
        'the-modal': TheModal,
        the_dropdown: TheDropdown,
        the_input,
        ['SomeComponent']: SomeComponent
      }
    }`)

    assert.deepEqual(
      utils.getRegisteredComponents(node).map(c => c.name),
      ['PrimaryButton', 'secondaryButton', 'the-modal', 'the_dropdown', 'the_input', 'SomeComponent'],
    )
  })

  it('should return an array of only components whose names can be identified', () => {
    node = parse(`const test = {
      name: 'test',
      components: {
        ...test,
        Foo,
        [bar]: Bar,
        [baz.baz]: Baz,
        [\`\${qux}\`]: Qux,
        [\`Quux\`]: Quux
      }
    }`)

    assert.deepEqual(
      utils.getRegisteredComponents(node).map(c => c.name),
      ['Foo', 'Quux'],
    )
  })
})

describe('getComponentProps', () => {
  let props

  const parse = function (code) {
    const data = babelEslint.parse(code).body[0].declarations[0].init
    return utils.getComponentProps(data)
  }

  it('should return empty array when there is no component props', () => {
    props = parse(`const test = {
      name: 'test',
      data() {
        return {}
      }
    }`)

    assert.equal(props.length, 0)
  })

  it('should return empty array when component props is empty array', () => {
    props = parse(`const test = {
      name: 'test',
      props: []
    }`)

    assert.equal(props.length, 0)
  })

  it('should return empty array when component props is empty object', () => {
    props = parse(`const test = {
      name: 'test',
      props: {}
    }`)

    assert.equal(props.length, 0)
  })

  it('should return computed props', () => {
    props = parse(`const test = {
      name: 'test',
      ...test,
      data() {
        return {}
      },
      props: {
        ...foo,
        a: String,
        b: {},
        c: [String],
        d
      }
    }`)

    assert.equal(props.length, 4, 'it detects all props')

    assert.ok(props[0].key.type === 'Identifier')
    assert.ok(props[0].node.type === 'Property')
    assert.ok(props[0].value.type === 'Identifier')

    assert.ok(props[1].key.type === 'Identifier')
    assert.ok(props[1].node.type === 'Property')
    assert.ok(props[1].value.type === 'ObjectExpression')

    assert.ok(props[2].key.type === 'Identifier')
    assert.ok(props[2].node.type === 'Property')
    assert.ok(props[2].value.type === 'ArrayExpression')

    assert.deepEqual(props[3].key, props[3].value)
    assert.ok(props[3].node.type === 'Property')
    assert.ok(props[3].value.type === 'Identifier')
  })

  it('should return computed from array props', () => {
    props = parse(`const test = {
      name: 'test',
      data() {
        return {}
      },
      props: ['a', b, \`c\`, null]
    }`)

    assert.equal(props.length, 4, 'it detects all props')

    assert.ok(props[0].node.type === 'Literal')
    assert.deepEqual(props[0].key, props[0].node)
    assert.notOk(props[0].value)

    assert.ok(props[1].node.type === 'Identifier')
    assert.notOk(props[1].key)
    assert.notOk(props[1].value)

    assert.ok(props[2].node.type === 'TemplateLiteral')
    assert.notOk(props[2].key)
    assert.notOk(props[2].value)

    assert.ok(props[3].node.type === 'Literal')
    assert.notOk(props[3].key)
    assert.notOk(props[3].value)
  })
})
