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

    /** @param {Comment[]} comments */
    const verifyBlock = (comments) =>
      comments.length > 0 && comments[0].type === 'Block'
        ? undefined
        : 'The "{{name}}" property should have a block comment.'

    /** @param {Comment[]} comments */
    const verifyLine = (comments) =>
      comments.length > 0 && comments.every((c) => c.type === 'Line')
        ? undefined
        : 'The "{{name}}" property should have a line comment.'

    /** @param {Comment[]} comments */
    const verifyUnlimited = (comments) =>
      comments.length > 0
        ? undefined
        : 'The "{{name}}" property should have a comment.'

    /** @param {Comment[]} comments */
    const verifyJSDoc = (comments) =>
      comments.length > 0 &&
      comments[0].type === 'Block' &&
      /^\*[^*]+/.test(comments[0].value)
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

        const beforeComments = sourceCode.getCommentsBefore(prop.node)

        /** @type {string|undefined} */
        let message

        switch (type) {
          case 'block':
            message = verifyBlock(beforeComments)
            break
          case 'line':
            message = verifyLine(beforeComments)
            break
          case 'unlimited':
            message = verifyUnlimited(beforeComments)
            break
          default:
            message = verifyJSDoc(beforeComments)
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
