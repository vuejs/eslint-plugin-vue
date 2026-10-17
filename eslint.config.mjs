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
    ignores: ['.changeset/**/*.md', 'tests/fixtures', 'tests/integrations']
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

      'unicorn/better-dom-traversing': 'off', // false positives on Vue AST nodes, whose `children` is a plain array, not a DOM `NodeList`
      'unicorn/filename-case': 'off',
      'unicorn/name-replacements': 'off',
      'unicorn/no-array-callback-reference': 'off', // doesn't work well with TypeScript's custom type guards
      'unicorn/no-array-reverse': 'off', // enable when the minimum supported Node.js version is v20
      'unicorn/no-array-sort': 'off', // enable when the minimum supported Node.js version is v20
      'unicorn/no-asterisk-prefix-in-documentation-comments': 'off', // prefer standard style
      'unicorn/no-computed-property-existence-check': 'off', // the dynamic `obj[key]` checks here are intentional truthiness/`in` checks, not `Object.hasOwn` existence checks
      'unicorn/no-null': 'off',
      'unicorn/no-this-outside-of-class': 'off', // `this` is used intentionally in the exported utils object-literal methods and `@this`-bound helpers
      'unicorn/no-top-level-side-effects': 'off', // too many false positives
      'unicorn/no-useless-recursion': 'off', // tail recursion is often clearer than a manual loop for the AST/tree helpers here
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-group-by': 'off', // `Object.groupBy()` requires Node.js v22
      'unicorn/prefer-iterator-to-array': 'off', // `Iterator#toArray()` requires Node.js v22
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-top-level-await': 'off', // only available in ESM modules
      'unicorn/single-line-block-comment-style': 'off' // too verbose while we still have type annotations in JSDoc comments
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
      'accessor-pairs': 'error',
      camelcase: ['error', { properties: 'never' }],
      'constructor-super': 'error',
      eqeqeq: ['error', 'allow-null'],
      'handle-callback-err': ['error', '^(err|error)$'],
      'jsx-quotes': ['error', 'prefer-single'],
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      'new-parens': 'error',
      'no-array-constructor': 'error',
      'no-caller': 'error',
      'no-class-assign': 'error',
      'no-cond-assign': 'error',
      'no-const-assign': 'error',
      'no-control-regex': 'error',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-parens': ['error', 'functions'],
      'no-fallthrough': 'error',
      'no-floating-decimal': 'error',
      'no-func-assign': 'error',
      'no-implied-eval': 'error',
      'no-inner-declarations': ['error', 'functions'],
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-multi-spaces': ['error', { ignoreEOLComments: true }],
      'no-multi-str': 'error',
      'no-native-reassign': 'error',
      'no-negated-in-lhs': 'error',
      'no-new-object': 'error',
      'no-new-require': 'error',
      'no-new-symbol': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-path-concat': 'error',
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-return-assign': ['error', 'except-parens'],
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-unexpected-multiline': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-escape': 'off',
      'no-with': 'error',
      'one-var': ['error', { initialized: 'never' }],
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'wrap-iife': ['error', 'any'],
      yoda: ['error', 'never'],
      'prefer-const': 'error',

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

      'unicorn/consistent-conditional-object-spread': ['error', 'ternary'],
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
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
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
    files: ['lib/rules/*.{js,ts}'],
    rules: {
      'eslint-plugin/require-meta-docs-url': [
        'error',
        { pattern: 'https://eslint.vuejs.org/rules/{{name}}.html' }
      ],
      'eslint-plugin/require-meta-languages': 'off', // Enabling this would require adding `meta.languages` to every published rule, which is a breaking change, so we keep it disabled for now.
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
  {
    files: ['docs/**'],
    rules: {
      // Browser shims and polyfills in the docs site intentionally assign to the global object.
      'unicorn/no-global-object-property-assignment': 'off'
    }
  },
  {
    files: ['tests/**'],
    rules: {
      // test fixtures intentionally contain `${...}` in plain strings to exercise the rules
      'unicorn/no-incorrect-template-string-interpolation': 'off'
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
        'markdown/no-multiple-h1': 'off',

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
