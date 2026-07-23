import type { UserConfig } from 'vitepress'
import path from 'pathe'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'
type Plugin = Extract<
  NonNullable<NonNullable<UserConfig['vite']>['plugins']>[number],
  { name: string }
>

const libRoot = path.join(fileURLToPath(import.meta.url), '../../../lib')
export function vitePluginRequireResolve(): Plugin {
  return {
    name: 'vite-plugin-require.resolve',
    transform(code, id) {
      if (id.startsWith(libRoot)) {
        return code.replaceAll('require.resolve', '(function(){return 0})')
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
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Transform error. base code:\n${base}`, error)
      }
      return undefined
    }
  }
}

/**
 * Transform `require()` to `import`
 */
function transformRequire(code: string) {
  if (!code.includes('require')) {
    return code
  }
  const modules = new Map()
  const replaced = code.replaceAll(
    /(\/\/[^\n\r]*|\/\*[\s\S]*?\*\/)|\brequire\s*\(\s*(["'].*?["'])\s*\)/gu,
    (match, comment, moduleString) => {
      if (comment) {
        return match
      }

      let id =
        // eslint-disable-next-line prefer-template
        '__' +
        moduleString.replaceAll(/[^a-zA-Z0-9_$]+/gu, '_') +
        Math.random().toString(32).slice(2)
      while (code.includes(id) || modules.has(id)) {
        id += Math.random().toString(32).slice(2)
      }
      modules.set(id, moduleString)
      return `${id}()`
    }
  )

  return (
    // eslint-disable-next-line prefer-template
    [...modules]
      .map(
        ([id, moduleString]) => `import * as __temp_${id} from ${moduleString};
const ${id} = () => __temp_${id}.default || __temp_${id};
`
      )
      .join('') +
    ';\n' +
    replaced
  )
}
