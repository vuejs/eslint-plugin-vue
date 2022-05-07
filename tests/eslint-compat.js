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
        overrideConfig: { plugins, globals, rules, ...overrideConfig } = {
          plugins: [],
          globals: {},
          rules: {}
        },
        fix,
        reportUnusedDisableDirectives,
        plugins: pluginsMap,
        ...otherOptions
      } = options || {}
      /** @type {eslint.CLIEngine.Options} */
      const newOptions = {
        fix: Boolean(fix),
        reportUnusedDisableDirectives: reportUnusedDisableDirectives
          ? reportUnusedDisableDirectives !== 'off'
          : undefined,
        ...otherOptions,

        globals: globals
          ? Object.keys(globals).filter((n) => globals[n])
          : undefined,
        plugins: plugins || [],
        rules: rules
          ? Object.fromEntries(
              Object.entries(rules).flatMap(([ruleId, opt]) =>
                opt ? [[ruleId, opt]] : []
              )
            )
          : undefined,
        ...overrideConfig
      }
      this.engine = new eslint.CLIEngine(newOptions)

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
