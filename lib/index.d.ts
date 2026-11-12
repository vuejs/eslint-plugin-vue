/// <reference path="./eslint-typegen.d.ts" />
import type { Linter } from 'eslint'

declare const vue: {
  meta: any
  configs: {
    base: Linter.LegacyConfig

    'vue2-essential': Linter.LegacyConfig
    'vue2-strongly-recommended': Linter.LegacyConfig
    'vue2-strongly-recommended-error': Linter.LegacyConfig
    'vue2-recommended': Linter.LegacyConfig
    'vue2-recommended-error': Linter.LegacyConfig

    essential: Linter.LegacyConfig
    'strongly-recommended': Linter.LegacyConfig
    'strongly-recommended-error': Linter.LegacyConfig
    recommended: Linter.LegacyConfig
    'recommended-error': Linter.LegacyConfig

    'flat/base': Linter.Config[]

    'flat/vue2-essential': Linter.Config[]
    'flat/vue2-strongly-recommended': Linter.Config[]
    'flat/vue2-strongly-recommended-error': Linter.Config[]
    'flat/vue2-recommended': Linter.Config[]
    'flat/vue2-recommended-error': Linter.Config[]

    'flat/essential': Linter.Config[]
    'flat/strongly-recommended': Linter.Config[]
    'flat/strongly-recommended-error': Linter.Config[]
    'flat/recommended': Linter.Config[]
    'flat/recommended-error': Linter.Config[]

    'no-layout-rules': Linter.LegacyConfig
  }
  rules: Record<string, any>
  processors: {
    '.vue': any
    vue: any
  }
}

export = vue
