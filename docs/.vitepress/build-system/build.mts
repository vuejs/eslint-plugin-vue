/**
 * Pre-build cjs packages that cannot be bundled well.
 */
import esbuild from 'esbuild'
import path from 'pathe'
import fs from 'fs'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

build(
  path.join(
    dirname,
    '../../../node_modules/@typescript-eslint/parser/dist/index.js'
  ),
  path.join(dirname, './shim/@typescript-eslint/parser.mjs'),
  [
    'util',
    'node:util',
    'path',
    'node:path',
    'fs',
    'node:fs',
    'semver',
    'fast-glob',
    'debug'
  ]
)

build(
  path.join(dirname, '../../../node_modules/vue-eslint-parser/index.js'),
  path.join(dirname, './shim/vue-eslint-parser.mjs'),
  [
    'path',
    'debug',
    'semver',
    'assert',
    'module',
    'events',
    'esquery',
    'fs',
    'eslint'
  ]
)

function build(input: string, out: string, injects: string[] = []) {
  // eslint-disable-next-line no-console -- ignore
  console.log(`build@ ${input}`)
  let code = bundle(input, injects)
  code = transform(code, injects)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, code, 'utf8')
}

function bundle(entryPoint: string, externals: string[]) {
  const result = esbuild.buildSync({
    entryPoints: [entryPoint],
    format: 'esm',
    bundle: true,
    external: externals,
    write: false,
    inject: [path.join(dirname, './src/process-shim.mjs')]
  })

  return `${result.outputFiles[0].text}`
}

function transform(code: string, injects: string[]) {
  const normalizeInjects = [
    ...new Set(injects.map((inject) => inject.replace(/^node:/u, '')))
  ]
  const newCode = code.replace(/"[a-z]+" = "[a-z]+";/u, '')
  return `
${normalizeInjects
  .map(
    (inject) =>
      `import $inject_${inject.replace(/[\-:]/gu, '_')}$ from '${inject}';`
  )
  .join('\n')}
const $_injects_$ = {${injects
    .map(
      (inject) =>
        `"${inject}":$inject_${inject.replace(/^node:/u, '').replace(/[\-:]/gu, '_')}$`
    )
    .join(',\n')}};
function require(module, ...args) {
  return $_injects_$[module] || {}
}
${newCode}
`
}
