// @ts-check
const eslint = require('eslint')
const semver = require('semver')

let ESLint = eslint.ESLint
/** @type {typeof eslint.ESLint | null} */
let FlatESLint = eslint.ESLint
let Linter = eslint.Linter
let RuleTester = eslint.RuleTester
if (semver.lt(eslint.Linter.version, '9.0.0-0')) {
  ESLint = getESLintClassForV8()
  Linter = getLinterClassForV8()
  RuleTester = getRuleTesterClassForV8()
  try {
    // @ts-ignore
    FlatESLint = require('eslint/use-at-your-own-risk').FlatESLint
  } catch {
    FlatESLint = null
  }
}

module.exports = {
  ESLint,
  FlatESLint,
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

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function adjustOptions(options) {
    const newOptions = {
      ...options
    }
    if (newOptions.overrideConfigFile === true) {
      newOptions.useEslintrc = false
      delete newOptions.overrideConfigFile
    }
    if (newOptions.overrideConfig) {
      newOptions.overrideConfig = { ...newOptions.overrideConfig }
      let plugins
      if (newOptions.overrideConfig.plugins) {
        plugins = newOptions.overrideConfig.plugins
        delete newOptions.overrideConfig.plugins
      }
      newOptions.overrideConfig = processCompatibleConfig(
        newOptions.overrideConfig
      )
      if (plugins) {
        newOptions.overrideConfig.plugins = Object.keys(plugins)
        newOptions.plugins = plugins
      }

      // adjust
      delete newOptions.overrideConfig.files
      delete newOptions.overrideConfig.processor
    }
    return newOptions
  }
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
