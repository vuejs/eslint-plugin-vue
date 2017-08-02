/**
 * @fileoverview Enforce consistent indentation in html template
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

const REGEXP_VTEXT = /([^\r\n]*)([\r\n]*)([\s\t]*)$/g // Get last text + caret + whitespaces

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function create (context) {
  const sourceCode = context.getSourceCode()
  const options = context.options[0] || 2
  const indentCount = options === 'tab' ? 1 : options
  const indentType = options === 'tab' ? 'tab' : 'space'
  const tagIndent = options === 'tab' ? '\t' : ' '.repeat(options)
  const attrIndent = tagIndent // TODO: add way to configure this
  let currentIndent = -1 // Start at -1 for <template> root

  // ----------------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------------

  function createErrorMessage (expectedAmount, actualSpaces, actualTabs) {
    const expectedStatement = `${expectedAmount} ${indentType}${expectedAmount === 1 ? '' : 's'}` // e.g. "2 tabs"
    const foundSpacesWord = `space${actualSpaces === 1 ? '' : 's'}` // e.g. "space"
    const foundTabsWord = `tab${actualTabs === 1 ? '' : 's'}` // e.g. "tabs"
    let foundStatement

    if (actualSpaces > 0 && actualTabs > 0) {
      foundStatement = `${actualSpaces} ${foundSpacesWord} and ${actualTabs} ${foundTabsWord}` // e.g. "1 space and 2 tabs"
    } else if (actualSpaces > 0) {
      foundStatement = indentType === 'space' ? actualSpaces : `${actualSpaces} ${foundSpacesWord}`
    } else if (actualTabs > 0) {
      foundStatement = indentType === 'tab' ? actualTabs : `${actualTabs} ${foundTabsWord}`
    } else {
      foundStatement = '0'
    }

    return `Expected indentation of ${expectedStatement} but found ${foundStatement}.`
  }

  function getNodeIndent (node) {
    const prevToken = context.getTokenBefore(node) // TODO: fix
    if (!prevToken) {
      return
    }
    const prevNode = sourceCode.getNodeByRangeIndex(prevToken.range[0])
    if (prevNode && prevNode.type === 'VText') {
      const match = REGEXP_VTEXT.exec(prevNode.value)
      const indentChars = (match[3] || '').split('')
      return {
        node: prevNode,
        text: match[1],
        caret: match[2],
        ws: match[3],
        spaces: indentChars.filter(char => char === ' ').length,
        tabs: indentChars.filter(char => char === '\t').length
      }
    }
    return null
  }

  function getDesireIndent (attribute) {
    return tagIndent.repeat(currentIndent) + (attribute ? attrIndent : '')
  }

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  utils.registerTemplateBodyVisitor(context, {
    VStartTag (node) {
      ++currentIndent

      const info = getNodeIndent(node.parent)
      if (info) {
        // TODO: add caret check
        if (info.ws !== getDesireIndent()) {
          context.report({
            node,
            loc: node.loc,
            message: createErrorMessage(indentCount * currentIndent, info.spaces, info.tabs)
            // fixable: () => info.node .....  replace(info.text + info.caret + info.ws)
          })
        }
      }

      if (!node.endTag) {
        --currentIndent
      }
    },
    VEndTag (node) {
      --currentIndent
    }
  })

  return {}
}

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consistent indentation in html template',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {
        oneOf: [
          {
            enum: ['tab']
          },
          {
            type: 'integer',
            minimum: 0
          }
        ]
      }
    ]
  },

  create
}
