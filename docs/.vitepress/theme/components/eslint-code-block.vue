<template>
  <div class="eslint-code-container">
    <eslint-editor
      :linter="linter"
      :config="config"
      v-model:code="code"
      :style="{ height }"
      class="eslint-code-block"
      :filename="filename"
      :language="language"
      dark
      :format="format"
      :fix="fix"
      @keydown.stop
    />
  </div>
</template>

<script>
import EslintEditor from '@ota-meshi/site-kit-eslint-editor-vue'
import { markRaw } from 'vue'

export default {
  name: 'ESLintCodeBlock',
  components: { EslintEditor },

  props: {
    fix: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    filename: {
      type: String,
      default: 'example.vue'
    },
    language: {
      type: String,
      default: 'html'
    },
    /**
     * If enabled, `@typescript-eslint/parser` will be used.
     * This must be enabled when used for `ts` code blocks.
     */
    typescript: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      code: '',
      height: '100px',
      linter: null,
      format: {
        insertSpaces: true,
        tabSize: 2
      },
      tsEslintParser: null,
      baseConfig: {
        files: ['**'],
        plugins: {},
        processor: 'vue/vue',
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          parserOptions: {
            ecmaFeatures: { jsx: true }
          }
        }
      }
    }
  },

  computed: {
    config() {
      let parser = null // Use default parser (`espree`)
      if (this.typescript) {
        // Use `@typescript-eslint/parser`.
        parser = this.tsEslintParser
      } else if (this.langTs) {
        // Use `@typescript-eslint/parser` only when `<script lang="ts">` or `<script lang="typescript">`.
        parser = {
          ts: this.tsEslintParser,
          typescript: this.tsEslintParser
        }
      }
      return {
        ...this.baseConfig,
        rules: this.rules,
        languageOptions: {
          ...this.baseConfig?.languageOptions,
          parserOptions: {
            ...this.baseConfig?.languageOptions?.parserOptions,
            parser
          }
        }
      }
    },

    /**
     * Checks whether code may be using lang="ts" or lang="typescript".
     * @returns {boolean} If `true`, may be using lang="ts" or lang="typescript".
     */
    langTs() {
      return /lang\s*=\s*(?:"ts"|ts|'ts'|"typescript"|typescript|'typescript')/u.test(
        this.code
      )
    }
  },

  watch: {
    typescript(value) {
      if (value) {
        this.loadTypescriptESLint()
      }
    },
    langTs(value) {
      if (value) {
        this.loadTypescriptESLint()
      }
    }
  },

  methods: {
    async loadTypescriptESLint() {
      const tsEslintParser = await import('@typescript-eslint/parser')
      this.tsEslintParser = tsEslintParser.default || tsEslintParser
    }
  },

  async mounted() {
    this.code = `${computeCodeFromSlot(
      findCode(this.$slots.default?.())
    ).trim()}\n`
    const lines = this.code.split('\n').length
    this.height = `${Math.max(120, 20 * (1 + lines))}px`
    // Load linter.
    const [plugin, { Linter }, vueEslintParser, globals] = await Promise.all([
      import('../../../../lib/index'),
      import('eslint'),
      import('vue-eslint-parser'),
      import('globals')
    ])
    if (this.langTs || this.typescript) {
      await this.loadTypescriptESLint()
    }

    this.linter = markRaw(new Linter())
    this.baseConfig.plugins.vue = markRaw(plugin.default || plugin)
    this.baseConfig.languageOptions.parser = markRaw(
      vueEslintParser.default || vueEslintParser
    )
    this.baseConfig.languageOptions.globals = markRaw({
      ...globals.browser
    })
  }
}

/**
 * Find VNode of <code> tag
 */
function findCode(n) {
  const nodes = Array.isArray(n) ? n : [n]
  for (const node of nodes) {
    if (!node) {
      continue
    }
    if (node.type === 'code') {
      return node
    }
    const c = findCode(node.children)
    if (c) {
      return c
    }
  }
  return null
}

/**
 * Extract text
 */
function computeCodeFromSlot(n) {
  if (!n) {
    return ''
  }
  const nodes = Array.isArray(n) ? n : [n]
  // debugger
  return nodes
    .map((node) =>
      typeof node === 'string' ? node : computeCodeFromSlot(node.children)
    )
    .join('')
}
</script>

<style>
.eslint-code-container {
  border-radius: 6px;
  padding: 1.25rem 0;
  margin: 1em 0;
  background-color: #1e1e1e;
}

.eslint-code-block {
  width: 100%;
}

.eslint-editor-actions {
  bottom: -0.9rem;
}
</style>
