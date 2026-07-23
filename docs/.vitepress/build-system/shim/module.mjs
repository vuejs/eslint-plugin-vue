import * as eslintScope from 'eslint-scope'
import typescript from 'typescript'

const modules = new Map([
  ['eslint-scope', eslintScope],
  ['typescript', typescript]
])

export function createRequire() {
  const nodeRequire = (id) => {
    const module = modules.get(id)
    if (module) {
      return module
    }

    const error = new Error(`Cannot find module '${id}'`)
    error.code = 'MODULE_NOT_FOUND'
    throw error
  }

  nodeRequire.resolve = (id) => id
  return nodeRequire
}

export default { createRequire }
