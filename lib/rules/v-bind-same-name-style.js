/**
 * @author waynzh
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')

/**
 * @typedef { VDirectiveKey & { name: VIdentifier & { name: 'bind' }, argument: VExpressionContainer | VIdentifier } } VBindDirectiveKey
 * @typedef { VDirective & { key: VBindDirectiveKey } } VBindDirective
 */

/**
 * @param {VBindDirective} node
 * @returns {string | null}
 */
function getAttributeName(node) {
  // not support VExpressionContainer e.g. :[attribute]
  if (node.key.argument.type === 'VIdentifier') {
    return node.key.argument.rawName
  }

  return null
}

/**
 * @param {VBindDirective} node
 * @returns {string | null}
 */
function getValueName(node) {
  if (node.value?.expression?.type === 'Identifier') {
    return node.value.expression.name
  }

  return null
}

/**
 * @param {VBindDirective} node
 * @returns {boolean}
 */
function isSameName(node) {
  const attrName = getAttributeName(node)
  const valueName = getValueName(node)
  return Boolean(attrName && valueName && attrName === valueName)
}

/**
 * @param {VBindDirectiveKey} key
 * @returns {number}
 */
function getCutStart(key) {
  const modifiers = key.modifiers
  return modifiers.length > 0
    ? modifiers[modifiers.length - 1].range[1]
    : key.argument.range[1]
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce `v-bind` same name directive style',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/v-bind-same-name-style.html'
    },
    fixable: 'code',
    schema: [{ enum: ['always', 'never'] }],
    messages: {
      expectedShorthand: 'Expected shorthand same name.',
      unexpectedShorthand: 'Unexpected shorthand same name.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const preferShorthand = context.options[0] === 'always'

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VBindDirective} node */
      "VAttribute[directive=true][key.name.name='bind'][key.argument!=null]"(
        node
      ) {
        if (!isSameName(node)) return

        const isShortHand = utils.isVBindSameNameShorthand(node)
        if (isShortHand === preferShorthand) {
          return
        }

        let messageId = 'unexpectedShorthand'
        if (preferShorthand) {
          messageId = 'expectedShorthand'
        }

        context.report({
          node,
          loc: node.loc,
          messageId,
          *fix(fixer) {
            if (preferShorthand && node.value) {
              /** @type {Range} */
              const valueRange = [getCutStart(node.key), node.range[1]]

              yield fixer.removeRange(valueRange)
            } else if (node.key.argument.type === 'VIdentifier') {
              yield fixer.insertTextAfter(
                node,
                `="${casing.camelCase(node.key.argument.rawName)}"`
              )
            }
          }
        })
      }
    })
  }
}
