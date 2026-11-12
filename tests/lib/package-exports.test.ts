/**
 * Entry points of the built package, resolved through `package.json#exports`.
 * https://github.com/vuejs/eslint-plugin-vue/issues/3010
 */
import { strict as assert } from 'node:assert'
import { createRequire } from 'node:module'
import path from 'node:path'
import ts from 'typescript'

const ROOT = path.resolve(__dirname, '../..')
// Resolving the package's own name from inside it goes through its `exports`.
const require = createRequire(path.join(ROOT, 'package.json'))

describe('package.json exports', () => {
  it.each([
    ['eslint-plugin-vue', 'dist/index.js'],
    ['eslint-plugin-vue/package.json', 'package.json'],
    ['eslint-plugin-vue/dist/index.js', 'dist/index.js'],
    ['eslint-plugin-vue/dist/utils/index.js', 'dist/utils/index.js'],
    ['eslint-plugin-vue/dist/utils/index', 'dist/utils/index.js'],
    ['eslint-plugin-vue/dist/utils', 'dist/utils/index.js'],
    ['eslint-plugin-vue/dist/utils/casing', 'dist/utils/casing.js'],
    ['eslint-plugin-vue/dist/processor', 'dist/processor.js'],
    ['eslint-plugin-vue/dist/configs/flat/base', 'dist/configs/flat/base.js'],
    ['eslint-plugin-vue/dist/eslint-typegen.d.ts', 'dist/eslint-typegen.d.ts']
  ])('should resolve %s', (specifier, expected) => {
    assert.strictEqual(require.resolve(specifier), path.join(ROOT, expected))
  })

  it('should not expose `eslint-plugin-vue/types` at runtime', () => {
    assert.throws(() => require.resolve('eslint-plugin-vue/types'), {
      code: 'ERR_PACKAGE_PATH_NOT_EXPORTED'
    })
  })

  describe.each([
    ['node16', ts.ModuleResolutionKind.Node16, ts.ModuleKind.Node16],
    ['nodenext', ts.ModuleResolutionKind.NodeNext, ts.ModuleKind.NodeNext],
    ['bundler', ts.ModuleResolutionKind.Bundler, ts.ModuleKind.ESNext]
  ])(
    'with TypeScript moduleResolution %s',
    (_name, moduleResolution, module) => {
      it.each([
        ['eslint-plugin-vue', 'dist/index.d.ts'],
        ['eslint-plugin-vue/types', 'dist/eslint-typegen.d.ts'],
        ['eslint-plugin-vue/dist/eslint-typegen', 'dist/eslint-typegen.d.ts'],
        ['eslint-plugin-vue/dist/eslint-typegen.js', 'dist/eslint-typegen.d.ts']
      ])('should resolve the types of %s', (specifier, expected) => {
        const { resolvedModule } = ts.resolveModuleName(
          specifier,
          path.join(ROOT, 'tests/lib/package-exports.test.ts'),
          { module, moduleResolution },
          ts.sys
        )
        assert.strictEqual(
          resolvedModule && path.resolve(resolvedModule.resolvedFileName),
          path.join(ROOT, expected)
        )
      })
    }
  )
})
