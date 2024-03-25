// @ts-check
const eslint = require('eslint')
const semver = require('semver')

let ESLint = eslint.ESLint
let Linter = eslint.Linter
let RuleTester = eslint.RuleTester
if (semver.lt(eslint.Linter.version, '9.0.0-0')) {
  ESLint = eslint.ESLint ? getESLintClassForV8() : getESLintClassForV6()
  Linter = getLinterClassForV8()
  RuleTester = getRuleTesterClassForV8()
}

module.exports = {
  ESLint,
  RuleTester,
  Linter
}

/** @returns {typeof eslint.ESLint} */
function getESLintClassForV8(BaseESLintClass = eslint.ESLint) {
  return class ESLintForV8 extends BaseESLintClass {
    static get version() {
      return BaseESLintClass.version
    }
    constructor(options) {
      super(adjustOptions(options))
    }
  }

  function adjustOptions(options) {
    const {
      overrideConfig: originalOverrideConfig,
      overrideConfigFile,
      ...newOptions
    } = options || {}

    if (overrideConfigFile) {
      if (overrideConfigFile === true) {
        newOptions.useEslintrc = false
      } else {
        newOptions.overrideConfigFile = overrideConfigFile
      }
    }

    if (originalOverrideConfig) {
      const [overrideConfig, plugins] = convertFlatConfigToV8OverridesConfig(
        originalOverrideConfig
      )
      newOptions.overrideConfig = overrideConfig
      newOptions.plugins = plugins
    }
    return newOptions
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function convertFlatConfigToV8OverridesConfig(config) {
    const pluginDefs = {}
    const newConfigs = []
    for (const configItem of Array.isArray(config) ? config : [config]) {
      const { plugins, ...otherConfig } = configItem

      if (typeof otherConfig.processor !== 'string') {
        // Remove unsupported object processor option
        // (I don't know how to successfully convert the processors at now.)
        delete otherConfig.processor
      }

      const newConfig = {
        files: ['*'],
        ...processCompatibleConfig(otherConfig)
      }

      if (plugins) {
        newConfig.plugins = Object.keys(plugins)
      }
      Object.assign(pluginDefs, plugins)
      newConfigs.push(newConfig)
    }

    return [{ overrides: newConfigs }, pluginDefs]
  }
}
/** @returns {typeof eslint.ESLint} */
function getESLintClassForV6() {
  class ESLintForV6 {
    static get version() {
      // @ts-expect-error
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

      // @ts-expect-error
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
      const result = this.engine.executeOnText(params[0], params[1]?.filePath)
      return result.results
    }
  }

  /** @type {typeof eslint.ESLint} */
  const eslintClass = /** @type {any} */ (ESLintForV6)
  return getESLintClassForV8(eslintClass)
}

/** @returns {typeof eslint.Linter} */
function getLinterClassForV8() {
  return class LinterForV8 extends eslint.Linter {
    static get version() {
      return eslint.Linter.version
    }
    verify(code, config, option) {
      return super.verify(code, processCompatibleConfig(config, this), option)
    }
  }
}

function getRuleTesterClassForV8() {
  return class RuleTesterForV8 extends eslint.RuleTester {
    constructor(options) {
      const defineRules = []
      super(
        processCompatibleConfig(options, {
          defineRule(...args) {
            defineRules.push(args)
          }
        })
      )
      for (const args of defineRules) {
        // @ts-expect-error
        this.linter.defineRule(...args)
      }
    }
    run(name, rule, tests) {
      super.run(name, rule, {
        valid: (tests.valid || []).map((test) =>
          typeof test === 'string' ? test : adjustOptions(test)
        ),
        invalid: (tests.invalid || []).map((test) => adjustOptions(test))
      })
    }
  }
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function adjustOptions(test) {
    return processCompatibleConfig(test)
  }
}
function processCompatibleConfig(config, linter) {
  const newConfig = { ...config }
  if (newConfig.languageOptions) {
    const languageOptions = newConfig.languageOptions
    delete newConfig.languageOptions
    newConfig.parserOptions = {
      ...newConfig.parserOptions,
      ...languageOptions,
      ...languageOptions.parserOptions
    }
    if (languageOptions.globals) {
      newConfig.globals = {
        ...newConfig.globals,
        ...languageOptions.globals
      }
    }
    if (languageOptions.parser) {
      newConfig.parser = getParserName(languageOptions.parser)
      if (!languageOptions.parserOptions?.parser) {
        delete newConfig.parserOptions.parser
      }
      linter?.defineParser?.(newConfig.parser, require(newConfig.parser))
    }
  }
  if (newConfig.plugins) {
    const plugins = newConfig.plugins
    delete newConfig.plugins
    for (const [pluginName, plugin] of Object.entries(plugins)) {
      for (const [ruleName, rule] of Object.entries(plugin.rules || {})) {
        linter.defineRule(`${pluginName}/${ruleName}`, rule)
      }
    }
  }
  newConfig.env = { ...newConfig.env, es6: true }
  return newConfig
}

function getParserName(parser) {
  const name = parser.meta?.name || parser.name
  if (name === 'typescript-eslint/parser') {
    return require.resolve('@typescript-eslint/parser')
  } else if (
    name == null &&
    // @ts-expect-error
    parser === require('@typescript-eslint/parser')
  )
    return require.resolve('@typescript-eslint/parser')
  return require.resolve(name)
}
