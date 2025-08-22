// @ts-expect-error -- Browser
if (typeof window !== 'undefined') {
  if (typeof require === 'undefined') {
    // @ts-expect-error -- Browser
    ;(window as any).require = () => {
      const e = new Error('require is not defined')
      ;(e as any).code = 'MODULE_NOT_FOUND'
      throw e
    }
  }
}
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import ESLintCodeBlock from './components/eslint-code-block.vue'
import RulesTable from './components/rules-table.vue'

const theme: Theme = {
  ...DefaultTheme,
  Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('eslint-code-block', ESLintCodeBlock)
    ctx.app.component('rules-table', RulesTable)
  }
}
export default theme
