/// <reference path="./eslint-typegen.d.ts" />
import type { Linter } from 'eslint'

declare const vue: {
  meta: any
  configs: {
    'flat/base': Linter.FlatConfig[]

    'flat/essential': Linter.FlatConfig[]
    'flat/strongly-recommended': Linter.FlatConfig[]
    'flat/strongly-recommended-error': Linter.FlatConfig[]
    'flat/recommended': Linter.FlatConfig[]
    'flat/recommended-error': Linter.FlatConfig[]

    'no-layout-rules': Linter.FlatConfig
  }
  rules: Record<string, any>
  processors: {
    vue: any
  }
}

export = vue
