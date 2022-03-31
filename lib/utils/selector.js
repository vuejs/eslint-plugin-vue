'use strict'

const parser = require('postcss-selector-parser')
const { default: nthCheck } = require('nth-check')
const { getAttribute, isVElement } = require('.')

/**
 * @typedef {object} VElementSelector
 * @property {(element: VElement)=>boolean} test
 */

module.exports = {
  parseSelector
}

/**
 * Parses CSS selectors and returns an object with a function that tests VElement.
 * @param {string} selector CSS selector
 * @param {RuleContext} context - The rule context.
 * @returns {VElementSelector}
 */
function parseSelector(selector, context) {
  let astSelector
  try {
    astSelector = parser().astSync(selector)
  } catch (e) {
    context.report({
      loc: { line: 0, column: 0 },
      message: `Cannot parse selector: ${selector}.`
    })
    return {
      test: () => false
    }
  }

  try {
    const test = selectorsToVElementMatcher(astSelector.nodes)

    return {
      test(element) {
        return test(element, null)
      }
    }
  } catch (e) {
    if (e instanceof SelectorError) {
      context.report({
        loc: { line: 0, column: 0 },
        message: e.message
      })
      return {
        test: () => false
      }
    }
    throw e
  }
}

class SelectorError extends Error {}

/**
 * @typedef {(element: VElement, subject: VElement | null )=>boolean} VElementMatcher
 * @typedef {Exclude<parser.Selector['nodes'][number], {type:'comment'|'root'}>} ChildNode
 */

/**
 * Convert nodes to VElementMatcher
 * @param {parser.Selector[]} selectorNodes
 * @returns {VElementMatcher}
 */
function selectorsToVElementMatcher(selectorNodes) {
  const selectors = selectorNodes.map((n) =>
    selectorToVElementMatcher(cleanSelectorChildren(n))
  )
  return (element, subject) => selectors.some((sel) => sel(element, subject))
}

/**
 * Clean and get the selector child nodes.
 * @param {parser.Selector} selector
 * @returns {ChildNode[]}
 */
function cleanSelectorChildren(selector) {
  /** @type {ChildNode[]} */
  const nodes = []
  /** @type {ChildNode|null} */
  let last = null
  for (const node of selector.nodes) {
    if (node.type === 'root') {
      throw new Error('Unexpected state type=root')
    }
    if (node.type === 'comment') {
      continue
    }
    if (
      (last == null || last.type === 'combinator') &&
      isDescendantCombinator(node)
    ) {
      // Ignore descendant combinator
      continue
    }
    if (isDescendantCombinator(last) && node.type === 'combinator') {
      // Replace combinator
      nodes.pop()
    }
    nodes.push(node)
    last = node
  }
  if (isDescendantCombinator(last)) {
    nodes.pop()
  }
  return nodes

  /**
   * @param {parser.Node|null} node
   * @returns {node is parser.Combinator}
   */
  function isDescendantCombinator(node) {
    return Boolean(node && node.type === 'combinator' && !node.value.trim())
  }
}
/**
 * Convert Selector child nodes to VElementMatcher
 * @param {ChildNode[]} selectorChildren
 * @returns {VElementMatcher}
 */
function selectorToVElementMatcher(selectorChildren) {
  const nodes = [...selectorChildren]
  let node = nodes.shift()
  /**
   * @type {VElementMatcher | null}
   */
  let result = null
  while (node) {
    if (node.type === 'combinator') {
      const combinator = node.value
      node = nodes.shift()
      if (!node) {
        throw new SelectorError(`Expected selector after '${combinator}'.`)
      }
      if (node.type === 'combinator') {
        throw new SelectorError(`Unexpected combinator '${node.value}'.`)
      }
      const right = nodeToVElementMatcher(node)
      result = combination(
        result ||
          // for :has()
          ((element, subject) => element === subject),
        combinator,
        right
      )
    } else {
      const sel = nodeToVElementMatcher(node)
      result = result ? compound(result, sel) : sel
    }
    node = nodes.shift()
  }
  if (!result) {
    throw new SelectorError(`Unexpected empty selector.`)
  }
  return result
}

/**
 * @param {VElementMatcher} left
 * @param {string} combinator
 * @param {VElementMatcher} right
 * @returns {VElementMatcher}
 */
function combination(left, combinator, right) {
  if (!combinator.trim()) {
    // descendant
    return (element, subject) => {
      if (right(element, null)) {
        let parent = element.parent
        while (parent.type === 'VElement') {
          if (left(parent, subject)) {
            return true
          }
          parent = parent.parent
        }
      }
      return false
    }
  }

  if (combinator === '>') {
    // child
    return (element, subject) => {
      if (right(element, null)) {
        const parent = element.parent
        if (parent.type === 'VElement') {
          return left(parent, subject)
        }
      }
      return false
    }
  }

  if (combinator === '+') {
    // adjacent
    return (element, subject) => {
      if (right(element, null)) {
        const before = getBeforeElement(element)
        if (before) {
          return left(before, subject)
        }
      }
      return false
    }
  }

  if (combinator === '~') {
    // sibling
    return (element, subject) => {
      if (right(element, null)) {
        for (const before of getBeforeElements(element)) {
          if (left(before, subject)) {
            return true
          }
        }
      }
      return false
    }
  }
  throw new SelectorError(`Unknown combinator: ${combinator}.`)
}

/**
 * Convert node to VElementMatcher
 * @param {Exclude<parser.Node, {type:'combinator'|'comment'|'root'|'selector'}>} selector
 * @returns {VElementMatcher}
 */
function nodeToVElementMatcher(selector) {
  if (selector.type === 'attribute') {
    return attributeNodeToVElementMatcher(selector)
  }
  if (selector.type === 'class') {
    const className = selector.value
    return (element) => {
      const attrValue = getAttributeValue(element, 'class')
      if (attrValue == null) {
        return false
      }
      return attrValue.split(/\s+/gu).includes(className)
    }
  }
  if (selector.type === 'id') {
    const id = selector.value
    return (element) => {
      const attrValue = getAttributeValue(element, 'id')
      if (attrValue == null) {
        return false
      }
      return attrValue === id
    }
  }
  if (selector.type === 'tag') {
    const name = selector.value
    return (element) => element.rawName === name
  }
  if (selector.type === 'universal') {
    return () => true
  }

  if (selector.type === 'pseudo') {
    const pseudo = selector.value
    if (pseudo === ':not') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:not
      const selectors = selectorsToVElementMatcher(selector.nodes)
      return (element, subject) => {
        return !selectors(element, subject)
      }
    }
    if (pseudo === ':is' || pseudo === ':where') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:is
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:where
      return selectorsToVElementMatcher(selector.nodes)
    }
    if (pseudo === ':has') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:has
      return pseudoHasSelectorsToVElementMatcher(selector.nodes)
    }
    if (pseudo === ':empty') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
      return (element) =>
        element.children.every(
          (child) => child.type === 'VText' && !child.value.trim()
        )
    }
    if (pseudo === ':nth-child') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child
      const nth = parseNth(selector)
      return buildPseudoNthVElementMatcher(nth)
    }
    if (pseudo === ':nth-last-child') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-last-child
      const nth = parseNth(selector)
      return buildPseudoNthVElementMatcher((index, length) =>
        nth(length - index - 1)
      )
    }
    if (pseudo === ':first-child') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:first-child
      return buildPseudoNthVElementMatcher((index) => index === 0)
    }
    if (pseudo === ':last-child') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:last-child
      return buildPseudoNthVElementMatcher(
        (index, length) => index === length - 1
      )
    }
    if (pseudo === ':only-child') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:only-child
      return buildPseudoNthVElementMatcher(
        (index, length) => index === 0 && length === 1
      )
    }

    if (pseudo === ':nth-of-type') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-of-type
      const nth = parseNth(selector)
      return buildPseudoNthOfTypeVElementMatcher(nth)
    }
    if (pseudo === ':nth-last-of-type') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-last-of-type
      const nth = parseNth(selector)
      return buildPseudoNthOfTypeVElementMatcher((index, length) =>
        nth(length - index - 1)
      )
    }
    if (pseudo === ':first-of-type') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:first-of-type
      return buildPseudoNthOfTypeVElementMatcher((index) => index === 0)
    }
    if (pseudo === ':last-of-type') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:last-of-type
      return buildPseudoNthOfTypeVElementMatcher(
        (index, length) => index === length - 1
      )
    }
    if (pseudo === ':only-of-type') {
      // https://developer.mozilla.org/en-US/docs/Web/CSS/:only-of-type
      return buildPseudoNthOfTypeVElementMatcher(
        (index, length) => index === 0 && length === 1
      )
    }
    throw new SelectorError(`Unsupported pseudo selector: ${pseudo}.`)
  }
  if (selector.type === 'nesting') {
    throw new SelectorError('Unsupported nesting selector.')
  }
  if (selector.type === 'string') {
    throw new SelectorError(`Unknown selector: ${selector.value}.`)
  }

  throw new SelectorError(
    `Unknown selector: ${/** @type {any}*/ (selector).value}.`
  )
}

/**
 * Convert Attribute node to VElementMatcher
 * @param {parser.Attribute} selector
 * @returns {VElementMatcher}
 */
function attributeNodeToVElementMatcher(selector) {
  const key = selector.attribute
  if (!selector.operator) {
    return (element) => getAttributeValue(element, key) != null
  }
  const value = selector.value || ''
  if (selector.operator === '=') {
    return buildVElementMatcher(value, (attr, val) => attr === val)
  }

  if (selector.operator === '~=') {
    // words
    return buildVElementMatcher(value, (attr, val) =>
      attr.split(/\s+/gu).includes(val)
    )
  }
  if (selector.operator === '|=') {
    // immediately followed by hyphen
    return buildVElementMatcher(
      value,
      (attr, val) => attr === val || attr.startsWith(`${val}-`)
    )
  }
  if (selector.operator === '^=') {
    // prefixed
    return buildVElementMatcher(value, (attr, val) => attr.startsWith(val))
  }
  if (selector.operator === '$=') {
    // suffixed
    return buildVElementMatcher(value, (attr, val) => attr.endsWith(val))
  }
  if (selector.operator === '*=') {
    // contains
    return buildVElementMatcher(value, (attr, val) => attr.includes(val))
  }

  throw new SelectorError(`Unsupported operator: ${selector.operator}.`)

  /**
   * @param {string} selectorValue
   * @param {(attrValue:string, selectorValue: string)=>boolean} test
   * @returns {VElementMatcher}
   */
  function buildVElementMatcher(selectorValue, test) {
    const val = selector.insensitive
      ? selectorValue.toLowerCase()
      : selectorValue
    return (element) => {
      const attrValue = getAttributeValue(element, key)
      if (attrValue == null) {
        return false
      }
      return test(
        selector.insensitive ? attrValue.toLowerCase() : attrValue,
        val
      )
    }
  }
}

/**
 * Convert :has() selector nodes to VElementMatcher
 * @param {parser.Selector[]} selectorNodes
 * @returns {VElementMatcher}
 */
function pseudoHasSelectorsToVElementMatcher(selectorNodes) {
  const selectors = selectorNodes.map((n) =>
    pseudoHasSelectorToVElementMatcher(n)
  )
  return (element, subject) => selectors.some((sel) => sel(element, subject))
}
/**
 * Convert :has() selector node to VElementMatcher
 * @param {parser.Selector} selector
 * @returns {VElementMatcher}
 */
function pseudoHasSelectorToVElementMatcher(selector) {
  const nodes = cleanSelectorChildren(selector)
  const selectors = selectorToVElementMatcher(nodes)
  const firstNode = nodes[0]
  if (
    firstNode.type === 'combinator' &&
    (firstNode.value === '+' || firstNode.value === '~')
  ) {
    // adjacent or sibling
    return buildVElementMatcher(selectors, (element) =>
      getAfterElements(element)
    )
  }
  // descendant or child
  return buildVElementMatcher(selectors, (element) =>
    element.children.filter(isVElement)
  )

  /**
   * @param {VElementMatcher} selectors
   * @param {(element: VElement) => VElement[]} getStartElements
   * @returns {VElementMatcher}
   */
  function buildVElementMatcher(selectors, getStartElements) {
    return (element) => {
      const elements = [...getStartElements(element)]
      /** @type {VElement|undefined} */
      let curr
      while ((curr = elements.shift())) {
        const el = curr
        if (selectors(el, element)) {
          return true
        }
        elements.push(...el.children.filter(isVElement))
      }
      return false
    }
  }
}

/**
 * Parse <nth>
 * @param {parser.Pseudo} pseudoNode
 * @returns {(index: number)=>boolean}
 */
function parseNth(pseudoNode) {
  const argumentsText = pseudoNode
    .toString()
    .slice(pseudoNode.value.length)
    .toLowerCase()
  const openParenIndex = argumentsText.indexOf('(')
  const closeParenIndex = argumentsText.lastIndexOf(')')
  if (openParenIndex < 0 || closeParenIndex < 0) {
    throw new SelectorError(
      `Cannot parse An+B micro syntax (:nth-xxx() argument): ${argumentsText}.`
    )
  }

  const argument = argumentsText
    .slice(openParenIndex + 1, closeParenIndex)
    .trim()
  try {
    return nthCheck(argument)
  } catch (e) {
    throw new SelectorError(
      `Cannot parse An+B micro syntax (:nth-xxx() argument): '${argument}'.`
    )
  }
}

/**
 * Build VElementMatcher for :nth-xxx()
 * @param {(index: number, length: number)=>boolean} testIndex
 * @returns {VElementMatcher}
 */
function buildPseudoNthVElementMatcher(testIndex) {
  return (element) => {
    const elements = element.parent.children.filter(isVElement)
    return testIndex(elements.indexOf(element), elements.length)
  }
}

/**
 * Build VElementMatcher for :nth-xxx-of-type()
 * @param {(index: number, length: number)=>boolean} testIndex
 * @returns {VElementMatcher}
 */
function buildPseudoNthOfTypeVElementMatcher(testIndex) {
  return (element) => {
    const elements = element.parent.children
      .filter(isVElement)
      .filter((e) => e.rawName === element.rawName)
    return testIndex(elements.indexOf(element), elements.length)
  }
}

/**
 * @param {VElement} element
 */
function getBeforeElement(element) {
  return getBeforeElements(element).pop() || null
}
/**
 * @param {VElement} element
 */
function getBeforeElements(element) {
  const parent = element.parent
  const index = parent.children.indexOf(element)
  return parent.children.slice(0, index).filter(isVElement)
}

/**
 * @param {VElement} element
 */
function getAfterElements(element) {
  const parent = element.parent
  const index = parent.children.indexOf(element)
  return parent.children.slice(index + 1).filter(isVElement)
}

/**
 * @param {VElementMatcher} a
 * @param {VElementMatcher} b
 * @returns {VElementMatcher}
 */
function compound(a, b) {
  return (element, subject) => a(element, subject) && b(element, subject)
}

/**
 * Get attribute value from given element.
 * @param {VElement} element The element node.
 * @param {string} attribute The attribute name.
 */
function getAttributeValue(element, attribute) {
  const attr = getAttribute(element, attribute)
  if (attr) {
    return (attr.value && attr.value.value) || ''
  }
  return null
}
