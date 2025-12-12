'use strict'

const fs = require('fs')
const jsdom = require('jsdom')
const { httpGet } = require('./lib/http')

main()

async function main() {
  const [bcdJson, obsoleteHtml] = await Promise.all([
    httpGet('https://unpkg.com/@mdn/browser-compat-data/data.json'),
    httpGet('https://html.spec.whatwg.org/multipage/obsolete.html')
  ])
  const bcd = JSON.parse(bcdJson)

  updateDeprecatedHTMLElements()
  updateHTMLElements()
  updateSVGElements()

  // ------------------------------------------------------------------------------
  // Update deprecated-html-elements.json
  // ------------------------------------------------------------------------------
  function updateDeprecatedHTMLElements() {
    const DEPRECATED_HTML_ELEMENTS_PATH =
      require.resolve('../lib/utils/deprecated-html-elements.json')
    const elements = new Set()

    const domDl = jsdom.JSDOM.fragment(obsoleteHtml).querySelector(
      '[id="non-conforming-features"] ~ dl'
    )
    for (const code of domDl.querySelectorAll('dt code')) {
      const name = code.textContent.trim()
      if (name) elements.add(name)
    }

    if (elements.size === 0) {
      throw new Error('No deprecated HTML elements found')
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
    const HTML_ELEMENTS_PATH =
      require.resolve('../lib/utils/html-elements.json')
    const elements = new Set()
    const deprecatedHtmlElements = new Set(
      require('../lib/utils/deprecated-html-elements.json')
    )

    for (const [name, element] of Object.entries(bcd.html.elements)) {
      if (deprecatedHtmlElements.has(name)) {
        continue
      }
      if (element.__compat.status.deprecated) {
        continue
      }
      elements.add(name)
    }

    if (elements.size === 0) {
      throw new Error('No HTML elements found')
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

    for (const [name, element] of Object.entries(bcd.svg.elements)) {
      if (element.__compat.status.deprecated) {
        continue
      }
      elements.add(name)
    }

    if (elements.size === 0) {
      throw new Error('No SVG elements found')
    }

    fs.writeFileSync(
      SVG_ELEMENTS_PATH,
      `${JSON.stringify([...elements].sort(), null, 2)}\n`,
      'utf8'
    )
  }
}
