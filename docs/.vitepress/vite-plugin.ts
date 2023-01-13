import type { UserConfig } from 'vitepress'
import path from 'path'
import { fileURLToPath } from 'url'
import esbuild from 'esbuild'
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
  return {
    name: 'vite-plugin-cjs-to-esm',
    apply: () => true,
    async transform(code, id) {
      if (!id.startsWith(libRoot)) {
        return undefined
      }
      const base = transformRequire(code)
      try {
        const transformed = esbuild.transformSync(base, {
          format: 'esm'
        })
        return transformed.code
      } catch (e) {
        console.error('Transform error. base code:\n' + base, e)
      }
      return undefined
    }
  }
}

/**
 * Transform `require()` to `import`
 * Inspired by `@originjs/vite-plugin-commonjs`.
 * https://github.com/originjs/vite-plugins/tree/main/packages/vite-plugin-commonjs
 */
function transformRequire(code: string) {
  if (!code.includes('require')) {
    return code
  }
  const modules = new Map()
  const replaced = code.replace(
    /(\/\/[^\n\r]*|\/\*[\s\S]*?\*\/)|\brequire\s*\(\s*(["'].*?["'])\s*\)/gu,
    (match, comment, moduleString) => {
      if (comment) {
        return match
      }

      let id =
        '__' + moduleString.replace(/[^a-zA-Z0-9_$]+/gu, '_') + randomString()
      while (code.includes(id) || modules.has(id)) {
        id += randomString()
      }
      modules.set(id, moduleString)
      return id
    }
  )

  return (
    [...modules]
      .map(([id, moduleString]) => {
        return `import * as __temp_${id} from ${moduleString};
const ${id} = __temp_${id}.default || __temp_${id};
`
      })
      .join('') +
    ';\n' +
    replaced
  )
}

function randomString() {
  const code = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let result = ''
  for (let index = 0; index < 6; index++) {
    result += code[Math.floor(Math.random() * code.length)]
  }
  return result
}
