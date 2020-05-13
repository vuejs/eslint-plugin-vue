'use strict'

const fs = require('fs')
const tsParser = require('@typescript-eslint/parser')
const { httpGet } = require('./lib/http')

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.TSInterfaceDeclaration} TSInterfaceDeclaration
 */

main()

async function main() {
  const libDomDTsText = await httpGet(
    'https://unpkg.com/typescript/lib/lib.dom.d.ts'
  )
  const rootNode = tsParser.parse(libDomDTsText, {
    loc: true,
    range: true
  })
  updateDeprecatedHTMLElements()
  updateHTMLElements()
  updateSVGElements()

  // ------------------------------------------------------------------------------
  // Update deprecated-html-elements.json
  // ------------------------------------------------------------------------------
  function updateDeprecatedHTMLElements() {
    const DEPRECATED_HTML_ELEMENTS_PATH = require.resolve(
      '../lib/utils/deprecated-html-elements.json'
    )
    const elements = new Set()
    /** @type {TSInterfaceDeclaration} */
    const interfaceDeclaration = rootNode.body.find(
      (body) =>
        body.type === 'TSInterfaceDeclaration' &&
        body.id.name === 'HTMLElementDeprecatedTagNameMap'
    )

    for (const name of extractPropNames(interfaceDeclaration)) {
      elements.add(name)
    }

    fs.writeFileSync(
      DEPRECATED_HTML_ELEMENTS_PATH,
      `${JSON.stringify([...elements].sort(), null, 2)}\n`,
      'utf8'
    )
  }

  // ------------------------------------------------------------------------------
  // Update html-elements.json
  // ------------------------------------------------------------------------------
  function updateHTMLElements() {
    const HTML_ELEMENTS_PATH = require.resolve(
      '../lib/utils/html-elements.json'
    )
    const elements = new Set()
    const deprecatedHtmlElements = new Set(
      require('../lib/utils/deprecated-html-elements.json')
    )
    /** @type {TSInterfaceDeclaration} */
    const interfaceDeclaration = rootNode.body.find(
      (body) =>
        body.type === 'TSInterfaceDeclaration' &&
        body.id.name === 'HTMLElementTagNameMap'
    )

    for (const name of extractPropNames(interfaceDeclaration)) {
      if (deprecatedHtmlElements.has(name)) {
        continue
      }
      elements.add(name)
    }

    fs.writeFileSync(
      HTML_ELEMENTS_PATH,
      `${JSON.stringify([...elements].sort(), null, 2)}\n`,
      'utf8'
    )
  }

  // ------------------------------------------------------------------------------
  // Update svg-elements.json
  // ------------------------------------------------------------------------------
  function updateSVGElements() {
    const SVG_ELEMENTS_PATH = require.resolve('../lib/utils/svg-elements.json')
    const elements = new Set()
    /** @type {TSInterfaceDeclaration} */
    const interfaceDeclaration = rootNode.body.find(
      (body) =>
        body.type === 'TSInterfaceDeclaration' &&
        body.id.name === 'SVGElementTagNameMap'
    )

    for (const name of extractPropNames(interfaceDeclaration)) {
      elements.add(name)
    }

    fs.writeFileSync(
      SVG_ELEMENTS_PATH,
      `${JSON.stringify([...elements].sort(), null, 2)}\n`,
      'utf8'
    )
  }
}

/**
 * @param {TSInterfaceDeclaration} node
 */
function* extractPropNames(node) {
  for (const m of node.body.body) {
    if (
      (m.type === 'TSPropertySignature' || m.type === 'TSMethodSignature') &&
      (m.key.type === 'Identifier' || m.key.type === 'Literal')
    ) {
      yield m.key.type === 'Identifier' ? m.key.name : `${m.key.value}`
    }
  }
}
