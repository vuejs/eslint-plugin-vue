<template>
  <div class="eslint-code-container">
    <eslint-editor
      :linter="linter"
      :config="config"
      v-model="code"
      :style="{ height }"
      class="eslint-code-block"
      :filename="filename"
      :language="language"
      :preprocess="preprocess"
      :postprocess="postprocess"
      dark
      :format="format"
      :fix="fix"
    />
  </div>
</template>

<script>
import EslintEditor from 'vue-eslint-editor'
import { rules, processors } from '../../../'

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
    const code = this.computeCodeFromSlot()
    // The height is determined in the initial processing.
    // This is because later code changes do not change the height.
    const lines = code.split('\n').length
    const height = `${Math.max(120, 19 * lines)}px`
    return {
      code,
      height,
      linter: null,
      preprocess: processors['.vue'].preprocess,
      postprocess: processors['.vue'].postprocess,
      format: {
        insertSpaces: true,
        tabSize: 2
      },
      tsEslintParser: null
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
        globals: {
          console: false,
          // ES2015 globals
          ArrayBuffer: false,
          DataView: false,
          Float32Array: false,
          Float64Array: false,
          Int16Array: false,
          Int32Array: false,
          Int8Array: false,
          Map: false,
          Promise: false,
          Proxy: false,
          Reflect: false,
          Set: false,
          Symbol: false,
          Uint16Array: false,
          Uint32Array: false,
          Uint8Array: false,
          Uint8ClampedArray: false,
          WeakMap: false,
          WeakSet: false,
          // ES2017 globals
          Atomics: false,
          SharedArrayBuffer: false
        },
        rules: this.rules,
        parser: 'vue-eslint-parser',
        parserOptions: {
          parser,
          ecmaVersion: 'latest',
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true
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
    computeCodeFromSlot() {
      return `${computeCodeFromSlot(this.$slots.default).trim()}\n`
    },

    async loadTypescriptESLint() {
      this.tsEslintParser = await import('@typescript-eslint/parser')
    }
  },

  async mounted() {
    // Load linter.
    const [{ Linter }, { parseForESLint }] = await Promise.all([
      import('eslint/lib/linter'),
      import('espree').then(() => import('vue-eslint-parser'))
    ])
    if (this.langTs || this.typescript) {
      await this.loadTypescriptESLint()
    }

    const linter = (this.linter = new Linter())

    for (const ruleId of Object.keys(rules)) {
      linter.defineRule(`vue/${ruleId}`, rules[ruleId])
    }

    linter.defineParser('vue-eslint-parser', { parseForESLint })
  }
}

function computeCodeFromSlot(nodes) {
  if (!Array.isArray(nodes)) {
    return ''
  }
  return nodes
    .map((node) => node.text || computeCodeFromSlot(node.children))
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
