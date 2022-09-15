module.exports = {
  createRequire: () => (module) => {
    if (module === 'espree') {
      return require('espree')
    }
    if (module === 'eslint-scope') {
      return require('eslint-scope')
    }
    throw new Error(`Not implemented: ${module}`)
  }
}
