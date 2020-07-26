'use strict'

const babelEslint = require('babel-eslint')
const espree = require('espree')
const utils = require('../../../lib/utils/index')
const assert = require('assert')

describe('getComputedProperties', () => {
  const parse = function (code) {
    return babelEslint.parse(code).body[0].declarations[0].init
  }

  it('should return empty array when there is no computed property', () => {
    const node = parse(`const test = {
      name: 'test',
      data() {
        return {}
      }
    }`)

    assert.equal(utils.getComputedProperties(node).length, 0)
  })

  it('should return computed properties', () => {
    const node = parse(`const test = {
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

    assert.ok(!computedProperties[0].value)
    assert.ok(computedProperties[1].value)
    assert.ok(computedProperties[2].value)
    assert.ok(!computedProperties[3].value)
    assert.ok(!computedProperties[4].value)
    assert.ok(computedProperties[5].value)
  })

  it('should not collide with object spread operator', () => {
    const node = parse(`const test = {
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
    const node = parse(`const test = {
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

    assert.ok(!computedProperties[0].value)
  })
})

describe('getStaticPropertyName', () => {
  const parse = function (code) {
    return babelEslint.parse(code).body[0].declarations[0].init
  }

  it('should parse property expression with identifier', () => {
    const node = parse(`const test = { computed: { } }`)

    const parsed = utils.getStaticPropertyName(node.properties[0])
    assert.ok(parsed === 'computed')
  })
  it('should parse property expression with literal', () => {
    const node = parse(`const test = { ['computed'] () {} }`)

    const parsed = utils.getStaticPropertyName(node.properties[0])
    assert.ok(parsed === 'computed')
  })
  it('should parse property expression with template literal', () => {
    const node = parse(`const test = { [\`computed\`] () {} }`)

    const parsed = utils.getStaticPropertyName(node.properties[0])
    assert.ok(parsed === 'computed')
  })
})

describe('getStringLiteralValue', () => {
  const parse = function (code) {
    return babelEslint.parse(code).body[0].declarations[0].init
  }

  it('should parse literal', () => {
    const node = parse(`const test = { ['computed'] () {} }`)

    const parsed = utils.getStringLiteralValue(node.properties[0].key)
    assert.ok(parsed === 'computed')
  })
  it('should parse template literal', () => {
    const node = parse(`const test = { [\`computed\`] () {} }`)

    const parsed = utils.getStringLiteralValue(node.properties[0].key)
    assert.ok(parsed === 'computed')
  })
})

describe('getMemberChaining', () => {
  const parse = function (code) {
    return espree.parse(code, { ecmaVersion: 2020 }).body[0].declarations[0]
      .init
  }

  const jsonIgnoreKeys = ['expression', 'object']

  it('should parse MemberExpression', () => {
    const node = parse(`const test = this.lorem['ipsum'].foo.bar`)
    const parsed = utils.getMemberChaining(node)
    assert.equal(
      nodeToJson(parsed, jsonIgnoreKeys),
      nodeToJson([
        {
          type: 'ThisExpression'
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Identifier',
            name: 'lorem'
          },
          computed: false,
          optional: false
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Literal',
            value: 'ipsum',
            raw: "'ipsum'"
          },
          computed: true,
          optional: false
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Identifier',
            name: 'foo'
          },
          computed: false,
          optional: false
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Identifier',
            name: 'bar'
          },
          computed: false,
          optional: false
        }
      ])
    )
  })

  it('should parse optional Chaining ', () => {
    const node = parse(`const test = (this?.lorem)['ipsum']?.[0]?.foo?.bar`)
    const parsed = utils.getMemberChaining(node)
    assert.equal(
      nodeToJson(parsed, jsonIgnoreKeys),
      nodeToJson([
        {
          type: 'ThisExpression'
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Identifier',
            name: 'lorem'
          },
          computed: false,
          optional: true
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Literal',
            value: 'ipsum',
            raw: "'ipsum'"
          },
          computed: true,
          optional: false
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Literal',
            value: 0,
            raw: '0'
          },
          computed: true,
          optional: true
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Identifier',
            name: 'foo'
          },
          computed: false,
          optional: true
        },
        {
          type: 'MemberExpression',
          property: {
            type: 'Identifier',
            name: 'bar'
          },
          computed: false,
          optional: true
        }
      ])
    )
  })
})

describe('getRegisteredComponents', () => {
  const parse = function (code) {
    return babelEslint.parse(code).body[0].declarations[0].init
  }

  it('should return empty array when there are no components registered', () => {
    const node = parse(`const test = {
      name: 'test',
    }`)

    assert.equal(utils.getRegisteredComponents(node).length, 0)
  })

  it('should return an array with all registered components', () => {
    const node = parse(`const test = {
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
      utils.getRegisteredComponents(node).map((c) => c.name),
      [
        'PrimaryButton',
        'secondaryButton',
        'the-modal',
        'the_dropdown',
        'the_input',
        'SomeComponent'
      ]
    )
  })

  it('should return an array of only components whose names can be identified', () => {
    const node = parse(`const test = {
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
      utils.getRegisteredComponents(node).map((c) => c.name),
      ['Foo', 'Quux']
    )
  })
})

describe('getComponentProps', () => {
  const parse = function (code) {
    const data = babelEslint.parse(code).body[0].declarations[0].init
    return utils.getComponentProps(data)
  }

  it('should return empty array when there is no component props', () => {
    const props = parse(`const test = {
      name: 'test',
      data() {
        return {}
      }
    }`)

    assert.equal(props.length, 0)
  })

  it('should return empty array when component props is empty array', () => {
    const props = parse(`const test = {
      name: 'test',
      props: []
    }`)

    assert.equal(props.length, 0)
  })

  it('should return empty array when component props is empty object', () => {
    const props = parse(`const test = {
      name: 'test',
      props: {}
    }`)

    assert.equal(props.length, 0)
  })

  it('should return computed props', () => {
    const props = parse(`const test = {
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
    const props = parse(`const test = {
      name: 'test',
      data() {
        return {}
      },
      props: ['a', b, \`c\`, null]
    }`)

    assert.equal(props.length, 4, 'it detects all props')

    assert.ok(props[0].node.type === 'Literal')
    assert.deepEqual(props[0].key, props[0].node)
    assert.ok(!props[0].value)

    assert.ok(props[1].node.type === 'Identifier')
    assert.ok(!props[1].key)
    assert.ok(!props[1].value)

    assert.ok(props[2].node.type === 'TemplateLiteral')
    assert.deepEqual(props[2].key, props[2].node)
    assert.ok(!props[2].value)

    assert.ok(props[3].node.type === 'Literal')
    assert.ok(!props[3].key)
    assert.ok(!props[3].value)
  })
})

describe('editdistance', () => {
  const editDistance = utils.editDistance
  it('should return editDistance beteen two string', () => {
    assert.equal(editDistance('book', 'back'), 2)
    assert.equal(editDistance('methods', 'metho'), 2)
    assert.equal(editDistance('methods', 'metds'), 2)
    assert.equal(editDistance('computed', 'comput'), 2)
    assert.equal(editDistance('book', 'back'), 2)
    assert.equal(editDistance('methods', 'method'), 1)
    assert.equal(editDistance('methods', 'methds'), 1)
    assert.equal(editDistance('computed', 'computd'), 1)
  })
})
function nodeToJson(nodes, ignores = []) {
  return JSON.stringify(nodes, replacer, 2)
  function replacer(key, value) {
    if (key === 'parent' || key === 'start' || key === 'end') {
      return undefined
    }
    if (ignores.includes(key)) {
      return undefined
    }
    return value
  }
}
