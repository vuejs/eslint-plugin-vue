import type { Linter } from 'eslint'

declare const vue: {
  meta: any
  configs: {
    base: Linter.LegacyConfig

    'vue2-essential': Linter.LegacyConfig
    'vue2-strongly-recommended': Linter.LegacyConfig
    'vue2-recommended': Linter.LegacyConfig

    'vue3-essential': Linter.LegacyConfig
    'vue3-strongly-recommended': Linter.LegacyConfig
    'vue3-recommended': Linter.LegacyConfig

    'flat/base': Linter.FlatConfig[]

    'flat/vue2-essential': Linter.FlatConfig[]
    'flat/vue2-strongly-recommended': Linter.FlatConfig[]
    'flat/vue2-recommended': Linter.FlatConfig[]

    'flat/essential': Linter.FlatConfig[]
    'flat/strongly-recommended': Linter.FlatConfig[]
    'flat/recommended': Linter.FlatConfig[]

    'no-layout-rules': Linter.LegacyConfig
  }
  rules: Record<string, any>
  processors: {
    '.vue': any
    vue: any
  }
}

export = vue
