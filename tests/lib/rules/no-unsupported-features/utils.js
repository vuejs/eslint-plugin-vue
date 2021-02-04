/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../../lib/rules/no-unsupported-features')

const SYNTAXES = rule.meta.schema[0].properties.ignores.items.enum

module.exports = {
  SYNTAXES,
  /**
   * Define the options builder to exclude anything other than the given syntax.
   * @param {string} targetSyntax syntax for given
   * @param {string} defaultVersion default Vue.js version
   * @returns {function} the options builder
   */
  optionsBuilder(targetSyntax, defaultVersion) {
    const baseIgnores = SYNTAXES.filter((s) => s !== targetSyntax)
    return (option) => {
      const ignores = [...baseIgnores]
      let version = defaultVersion
      if (!option) {
        option = {}
      }
      if (option.ignores) {
        ignores.push(...option.ignores)
      }
      if (option.version) {
        version = option.version
      }
      option.ignores = ignores
      option.version = version
      return [option]
    }
  }
}
