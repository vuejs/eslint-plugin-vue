/**
 * @author *****your name*****
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
      description: 'require prop should have a comment',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-prop-comment.html'
    },
    fixable: null,
    schema: [],
    messages: {
      // ...
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()

    /**
     * @param {import('../utils').ComponentProp[]} props
     */
    function verifyProps(props) {
      for (const prop of props) {
        if (!prop.propName) {
          continue
        }
        const beforeComments = sourceCode.getCommentsBefore(prop.node)

        if (beforeComments.length > 0) continue
        context.report({
          node: prop.node,
          message: 'The "{{name}}" property should have a comment.',
          data: {
            name: prop.propName
          }
        })
      }
    }
    // 合成选择器
    return utils.compositingVisitors(
      // 遍历 <script setup> 中的节点
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          verifyProps(props)
        }
      }),

      // 遍历 vue 实例或组件的配置对象
      // 其中 onSetupFunctionEnter 在具有 setup 函数时触发
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          verifyProps(utils.getComponentPropsFromOptions(node))
        }
      })

      // 检查当前文件是否为 vue 组件，是 utils.executeOnVue 的其中一部分
      // 不适用于 <script setup>
      // utils.executeOnVueComponent(context, (obj) => {
      //   verifyProps(utils.getComponentPropsFromOptions(obj))
      // })

      // 检查组件是否 vue 实例或组件
      // 不适用于 <script setup>
      // utils.executeOnVue(context, (obj) => {
      //   // getComponentPropsFromOptions 从组件配置中获取所有 prop
      //   verifyProps(utils.getComponentPropsFromOptions(obj))
      // })
    )
  }
}
