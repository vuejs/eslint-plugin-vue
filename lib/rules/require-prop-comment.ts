/**
 * @author CZB
 * See LICENSE file in root directory for full license.
 */
import type { ComponentProp } from '../utils/index.js'
import utils from '../utils/index.js'
import { isBlockComment, isJSDocComment } from '../utils/comments.ts'

export default {
  meta: {
    type: 'suggestion',
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
          type: { enum: ['JSDoc', 'line', 'block', 'any'] }
        },
        additionalProperties: false
      }
    ],
    messages: {
      requireAnyComment: 'The "{{name}}" property should have a comment.',
      requireLineComment: 'The "{{name}}" property should have a line comment.',
      requireBlockComment:
        'The "{{name}}" property should have a block comment.',
      requireJSDocComment:
        'The "{{name}}" property should have a JSDoc comment.'
    }
  },
  create(context: RuleContext) {
    const schema: { type?: 'JSDoc' | 'line' | 'block' | 'any' } | undefined =
      context.options[0]
    const type = (schema && schema.type) || 'JSDoc'

    const sourceCode = context.sourceCode

    const verifyBlock = (comment: Comment | undefined) =>
      comment && isBlockComment(comment) ? undefined : 'requireBlockComment'

    const verifyLine = (comment: Comment | undefined) =>
      comment && comment.type === 'Line' ? undefined : 'requireLineComment'

    const verifyAny = (comment: Comment | undefined) =>
      comment ? undefined : 'requireAnyComment'

    const verifyJSDoc = (comment: Comment | undefined) =>
      comment && isJSDocComment(comment) ? undefined : 'requireJSDocComment'

    const verifyComment = (
      comment: Comment | undefined
    ): string | undefined => {
      switch (type) {
        case 'block': {
          return verifyBlock(comment)
        }
        case 'line': {
          return verifyLine(comment)
        }
        case 'any': {
          return verifyAny(comment)
        }
        default: {
          return verifyJSDoc(comment)
        }
      }
    }

    function verifyProps(props: ComponentProp[]) {
      for (const prop of props) {
        if (!prop.propName || prop.type === 'infer-type') {
          continue
        }

        const precedingComments = sourceCode.getCommentsBefore(prop.node)
        const lastPrecedingComment = precedingComments.at(-1)

        const messageId = verifyComment(lastPrecedingComment)

        if (!messageId) {
          continue
        }

        context.report({
          node: prop.node,
          messageId,
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
