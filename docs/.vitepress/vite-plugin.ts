import type { UserConfig } from 'vitepress'
import path from 'path'
import { fileURLToPath } from 'url'
import { viteCommonjs as baseViteCommonjs } from '@originjs/vite-plugin-commonjs'
type Plugin = Extract<
  NonNullable<NonNullable<UserConfig['vite']>['plugins']>[number],
  { name: string }
>

const libRoot = path.join(
  fileURLToPath(
    // @ts-expect-error -- Cannot change `module` option
    import.meta.url
  ),
  '../../../lib'
)
export function vitePluginRequireResolve(): Plugin {
  return {
    name: 'vite-plugin-require.resolve',
    transform(code, id, _options) {
      if (id.startsWith(libRoot)) {
        return code.replace(/require\.resolve/gu, '(function(){return 0})')
      }
      return undefined
    }
  }
}

export function viteCommonjs(): Plugin {
  const base = baseViteCommonjs({
    include: [libRoot],
    skipPreBuild: true
  }) as Plugin
  return {
    ...base,
    // The `@originjs/vite-plugin-commonjs` is 'serve' only, but use it in 'build' as well.
    apply: () => true,
    async transform(code, id, options) {
      if (typeof base.transform !== 'function') {
        return null
      }
      const result = await base.transform.call(this, code, id, options)
      if (result && typeof result === 'object' && result.code) {
        return {
          ...result,
          // Replace it with null, because blanks can be given to the sourcemap and cause an error.
          map: undefined
        }
      }
      return result
    }
  }
}
