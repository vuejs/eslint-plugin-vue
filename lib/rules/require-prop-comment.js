/**
 * @author CZB
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require props to have a comment',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-prop-comment.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          type: { enum: ['JSDoc', 'line', 'block', 'unlimited'] }
        },
        additionalProperties: false
      }
    ],
    messages: {
      // ...
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {{type: "JSDoc" | "line" | "block" | "unlimited"}|undefined} */
    const schema = context.options[0]
    const type = schema ? schema.type : 'JSDoc'

    const sourceCode = context.getSourceCode()

    /** @param {Comment | undefined} comment */
    const verifyBlock = (comment) =>
      comment && comment.type === 'Block' && comment.value.charAt(0) !== '*'
        ? undefined
        : 'The "{{name}}" property should have a block comment.'

    /** @param {Comment | undefined} comment */
    const verifyLine = (comment) =>
      comment && comment.type === 'Line'
        ? undefined
        : 'The "{{name}}" property should have a line comment.'

    /** @param {Comment | undefined} comment */
    const verifyUnlimited = (comment) =>
      comment ? undefined : 'The "{{name}}" property should have a comment.'

    /** @param {Comment | undefined} comment */
    const verifyJSDoc = (comment) =>
      comment && comment.type === 'Block' && comment.value.charAt(0) === '*'
        ? undefined
        : 'The "{{name}}" property should have a JSDoc comment.'

    /**
     * @param {import('../utils').ComponentProp[]} props
     */
    function verifyProps(props) {
      for (const prop of props) {
        if (!prop.propName) {
          continue
        }

        const precedingComments = sourceCode.getCommentsBefore(prop.node)
        const lastPrecedingComment =
          precedingComments.length > 0
            ? precedingComments[precedingComments.length - 1]
            : undefined

        /** @type {string|undefined} */
        let message

        switch (type) {
          case 'block':
            message = verifyBlock(lastPrecedingComment)
            break
          case 'line':
            message = verifyLine(lastPrecedingComment)
            break
          case 'unlimited':
            message = verifyUnlimited(lastPrecedingComment)
            break
          default:
            message = verifyJSDoc(lastPrecedingComment)
            break
        }

        if (!message) {
          continue
        }

        context.report({
          node: prop.node,
          message,
          data: {
            name: prop.propName
          }
        })
      }
    }

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          verifyProps(props)
        }
      }),
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          verifyProps(utils.getComponentPropsFromOptions(node))
        }
      })
    )
  }
}
