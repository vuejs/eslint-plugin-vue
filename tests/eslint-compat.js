// @ts-check
const eslint = require('eslint')

module.exports = {
  ESLint: eslint.ESLint || getESLintClassForV6(),
  RuleTester: eslint.RuleTester
}

/** @returns {typeof eslint.ESLint} */
function getESLintClassForV6() {
  class ESLintForV6 {
    static get version() {
      return eslint.CLIEngine.version
    }

    /** @param {eslint.ESLint.Options} options */
    constructor(options) {
      const {
        overrideConfig: { plugins, globals, ...overrideConfig },
        fix,
        reportUnusedDisableDirectives,
        plugins: pluginsMap,
        ...otherOptions
      } = options
      this.engine = new eslint.CLIEngine({
        fix: Boolean(fix),
        globals: globals
          ? Object.keys(globals).filter((n) => globals[n])
          : undefined,
        ...otherOptions,
        ...overrideConfig,
        plugins: plugins || [],
        reportUnusedDisableDirectives: reportUnusedDisableDirectives
          ? reportUnusedDisableDirectives !== 'off'
          : undefined
      })

      for (const [name, plugin] of Object.entries(pluginsMap || {})) {
        this.engine.addPlugin(name, plugin)
      }
    }

    /**
     * @param {Parameters<eslint.ESLint['lintText']>} params
     * @returns {ReturnType<eslint.ESLint['lintText']>}
     */
    async lintText(...params) {
      const result = this.engine.executeOnText(params[0], params[1].filePath)
      return result.results
    }
  }

  /** @type {typeof eslint.ESLint} */
  const eslintClass = /** @type {any} */ (ESLintForV6)
  return eslintClass
}
