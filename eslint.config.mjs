import { defineConfig } from 'eslint/config'
import globals from 'globals'
import eslintConfigFlatGitIgnore from 'eslint-config-flat-gitignore'
import eslintPluginEslintPlugin from 'eslint-plugin-eslint-plugin'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import eslintPluginNodeDependencies from 'eslint-plugin-node-dependencies'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintMarkdown from '@eslint/markdown'
import eslintPluginMarkdownPreferences from 'eslint-plugin-markdown-preferences'
import eslintPluginTs from '@typescript-eslint/eslint-plugin'
import tsEslintParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'
import noInvalidMeta from './eslint-internal-rules/no-invalid-meta.js'
import noInvalidMetaDocsCategories from './eslint-internal-rules/no-invalid-meta-docs-categories.js'
import requireEslintCommunity from './eslint-internal-rules/require-eslint-community.js'
import rules from './tools/lib/rules.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import typegen from 'eslint-typegen'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MD_BASE_LINKS = {
  'vue-eslint-parser': 'https://github.com/vuejs/vue-eslint-parser',
  '@typescript-eslint/parser': 'https://typescript-eslint.io/packages/parser',
  'eslint-typegen': 'https://github.com/antfu/eslint-typegen',
  '@stylistic/eslint-plugin': 'https://eslint.style/'
}
const MD_LINKS = {
  ...Object.fromEntries(
    rules.map((rule) => [
      rule.ruleId,
      `https://eslint.vuejs.org/rules/${rule.name}.html`
    ])
  ),
  ...MD_BASE_LINKS
}
// Links to rule docs from files in docs will link to the md file.
const MD_LINKS_FOR_DOCS = {
  ...Object.fromEntries(
    rules.map((rule) => [
      rule.ruleId,
      path.resolve(dirname, './docs/rules', `./${rule.name}.md`)
    ])
  ),
  ...MD_BASE_LINKS
}

export default typegen([
  eslintConfigFlatGitIgnore(),
  {
    ignores: [
      '.changeset/**/*.md',
      'tests/fixtures',
      'tests/integrations/eslint-plugin-import'
    ]
  },
  eslintPluginPrettierRecommended,
  ...eslintPluginNodeDependencies.configs['flat/recommended'],
  {
    plugins: {
      internal: {
        rules: {
          'no-invalid-meta': noInvalidMeta,
          'no-invalid-meta-docs-categories': noInvalidMetaDocsCategories,
          'require-eslint-community': requireEslintCommunity
        }
      }
    }
  },
  ...defineConfig({
    files: ['**/*.{js,mjs,ts,mts}'],
    extends: [
      eslintPluginEslintPlugin.configs.all,
      eslintPluginUnicorn.configs.recommended
    ],
    // turn off some rules from shared configs in all files
    rules: {
      'eslint-plugin/require-meta-default-options': 'off', // TODO: enable when all rules have defaultOptions
      'eslint-plugin/require-meta-docs-recommended': 'off', // use `categories` instead
      'eslint-plugin/require-meta-schema-description': 'off',
      'eslint-plugin/require-test-case-name': 'off',

      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-callback-reference': 'off', // doesn't work well with TypeScript's custom type guards
      'unicorn/no-array-reverse': 'off', // enable when the minimum supported Node.js version is v20
      'unicorn/no-array-sort': 'off', // enable when the minimum supported Node.js version is v20
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-string-replace-all': 'off', // turn off to prevent make breaking changes (ref: #2146)
      'unicorn/prefer-top-level-await': 'off', //    turn off to prevent make breaking changes (ref: #2146)
      'unicorn/prevent-abbreviations': 'off'
    }
  }),

  {
    name: 'typescript/setup',
    files: ['**/*.{ts,mts}'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs
    }
  },

  {
    files: ['**/*.{js,mjs,ts,mts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.es6,
        ...globals.node,
        ...globals.vitest
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'accessor-pairs': 2,
      camelcase: [2, { properties: 'never' }],
      'constructor-super': 2,
      eqeqeq: [2, 'allow-null'],
      'handle-callback-err': [2, '^(err|error)$'],
      'jsx-quotes': [2, 'prefer-single'],
      'new-cap': [2, { newIsCap: true, capIsNew: false }],
      'new-parens': 2,
      'no-array-constructor': 2,
      'no-caller': 2,
      'no-class-assign': 2,
      'no-cond-assign': 2,
      'no-const-assign': 2,
      'no-control-regex': 2,
      'no-delete-var': 2,
      'no-dupe-args': 2,
      'no-dupe-class-members': 2,
      'no-dupe-keys': 2,
      'no-duplicate-case': 2,
      'no-empty-character-class': 2,
      'no-empty-pattern': 2,
      'no-eval': 2,
      'no-ex-assign': 2,
      'no-extend-native': 2,
      'no-extra-bind': 2,
      'no-extra-boolean-cast': 2,
      'no-extra-parens': [2, 'functions'],
      'no-fallthrough': 2,
      'no-floating-decimal': 2,
      'no-func-assign': 2,
      'no-implied-eval': 2,
      'no-inner-declarations': [2, 'functions'],
      'no-invalid-regexp': 2,
      'no-irregular-whitespace': 2,
      'no-iterator': 2,
      'no-label-var': 2,
      'no-labels': [2, { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 2,
      'no-multi-spaces': [2, { ignoreEOLComments: true }],
      'no-multi-str': 2,
      'no-native-reassign': 2,
      'no-negated-in-lhs': 2,
      'no-new-object': 2,
      'no-new-require': 2,
      'no-new-symbol': 2,
      'no-new-wrappers': 2,
      'no-obj-calls': 2,
      'no-octal': 2,
      'no-octal-escape': 2,
      'no-path-concat': 2,
      'no-proto': 2,
      'no-redeclare': 2,
      'no-regex-spaces': 2,
      'no-return-assign': [2, 'except-parens'],
      'no-self-assign': 2,
      'no-self-compare': 2,
      'no-sequences': 2,
      'no-shadow-restricted-names': 2,
      'no-sparse-arrays': 2,
      'no-this-before-super': 2,
      'no-throw-literal': 2,
      'no-undef': 2,
      'no-undef-init': 2,
      'no-unexpected-multiline': 2,
      'no-unmodified-loop-condition': 2,
      'no-unneeded-ternary': [2, { defaultAssignment: false }],
      'no-unreachable': 2,
      'no-unsafe-finally': 2,
      'no-unused-vars': [2, { vars: 'all', args: 'none' }],
      'no-useless-call': 2,
      'no-useless-computed-key': 2,
      'no-useless-constructor': 2,
      'no-useless-escape': 0,
      'no-with': 2,
      'one-var': [2, { initialized: 'never' }],
      'use-isnan': 2,
      'valid-typeof': 2,
      'wrap-iife': [2, 'any'],
      yoda: [2, 'never'],
      'prefer-const': 2,

      'prettier/prettier': 'error',
      'eslint-plugin/require-meta-docs-description': [
        'error',
        { pattern: '^(enforce|require|disallow).*[^.]$' }
      ],
      'eslint-plugin/require-meta-fixable': [
        'error',
        { catchNoFixerButFixableProperty: true }
      ],
      'eslint-plugin/report-message-format': ['error', "^[A-Z`'{].*\\.$"],

      'no-debugger': 'error',
      'no-console': 'error',
      'no-alert': 'error',
      'no-void': 'error',

      'no-warning-comments': 'warn',
      'no-var': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'prefer-rest-params': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-spread': 'error',

      'dot-notation': 'error',
      'arrow-body-style': 'error',

      'no-restricted-properties': [
        'error',
        {
          object: 'context',
          property: 'parserServices',
          message: 'Use sourceCode.parserServices'
        },
        {
          object: 'context',
          property: 'getScope',
          message: 'Use utils.getScope'
        }
      ],

      'unicorn/consistent-function-scoping': [
        'error',
        { checkArrowFunctions: false }
      ],

      'internal/require-eslint-community': ['error']
    }
  },

  {
    files: ['**/*.{mjs,ts,mts}'],
    languageOptions: {
      sourceType: 'module'
    }
  },

  {
    files: ['**/*.{ts,mts}'],
    rules: {
      ...eslintPluginTs.configs.strict.rules,
      ...eslintPluginTs.configs['flat/eslint-recommended'].rules,
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          minimumDescriptionLength: 3
        }
      ]
    }
  },

  {
    files: ['./**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueEslintParser
    }
  },
  {
    files: ['lib/rules/*.js'],
    rules: {
      'eslint-plugin/require-meta-docs-url': [
        'error',
        { pattern: 'https://eslint.vuejs.org/rules/{{name}}.html' }
      ],
      'internal/no-invalid-meta': 'error',
      'internal/no-invalid-meta-docs-categories': 'error'
    }
  },
  {
    files: ['eslint-internal-rules/*.js'],
    rules: {
      'eslint-plugin/require-meta-docs-url': 'off',
      'internal/no-invalid-meta': 'error',
      'internal/no-invalid-meta-docs-categories': 'error'
    }
  },
  ...defineConfig({
    files: ['**/*.json'],
    extends: [...eslintPluginJsonc.configs['flat/recommended-with-jsonc']],
    rules: {
      'prettier/prettier': 'off'
    }
  }),
  ...defineConfig([
    {
      files: ['**/*.md'],
      extends: [
        eslintMarkdown.configs.recommended,
        eslintPluginMarkdownPreferences.configs.recommended
      ],
      rules: {
        'prettier/prettier': 'off',
        'markdown/no-missing-link-fragments': 'off',

        'markdown-preferences/prefer-linked-words': [
          'error',
          {
            words: MD_LINKS,
            ignores: [
              {
                node: { type: 'heading' }
              },
              {
                node: { type: 'footnoteDefinition' }
              }
            ]
          }
        ]
      }
    },
    {
      files: ['docs/**/*.md'],
      rules: {
        'markdown-preferences/prefer-linked-words': [
          'error',
          {
            words: MD_LINKS_FOR_DOCS,
            ignores: [
              {
                node: { type: 'heading' }
              },
              {
                node: { type: 'footnoteDefinition' }
              }
            ]
          }
        ]
      }
    },
    {
      files: ['.github/ISSUE_TEMPLATE/*.md'],
      rules: {
        'prettier/prettier': 'off',
        'markdown/no-missing-label-refs': 'off'
      }
    }
  ])
])
