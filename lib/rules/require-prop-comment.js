/**
 * @author *****CZB*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// ...

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require that props have a comment',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-prop-comment.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          type: { enum: ['line', 'block', 'unlimited'] }
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
    /** @type {{type: "line" | "block" | "unlimited" | "JSDoc"}|undefined} */
    const schema = context.options[0]

    /** @type {"line" | "block" | "unlimited" | "JSDoc"} */
    const type = schema ? schema.type : 'JSDoc'

    const sourceCode = context.getSourceCode()

    /** @type {{(comments:Comment[]):string}} */
    const verifyBlock = (comments) => {
      if (comments.length === 1 && comments[0].type === 'Block') return ''
      return 'The "{{name}}" property should have one block comment.'
    }
    /** @type {{(comments:Comment[]):string}} */
    const verifyLine = (comments) => {
      if (comments.length > 0 && comments.every((c) => c.type === 'Line')) {
        return ''
      }
      return 'The "{{name}}" property should have a line comment.'
    }
    /** @type {{(comments:Comment[]):string}} */
    const verifyUnlimited = (comments) => {
      if (comments.length > 0) return ''
      return 'The "{{name}}" property should have a comment.'
    }
    /** @type {{(comments:Comment[]):string}} */
    const verifyJSDoc = (comments) => {
      if (
        comments.length === 1 &&
        comments[0].type === 'Block' &&
        /^\*[^*]+/.test(comments[0].value)
      )
        return ''
      return 'The "{{name}}" property should have one JSDoc comment.'
    }

    /**
     * @param {import('../utils').ComponentProp[]} props
     */
    function verifyProps(props) {
      for (const prop of props) {
        if (!prop.propName) continue

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

        if (!message) continue
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
