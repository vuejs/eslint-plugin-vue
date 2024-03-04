/**
 * @fileoverview eslint config helpers
 * @author 唯然<weiran.zsd@outlook.com>
 */

function extendRules(config, rules) {
  const { rules: extendedRules = {}, ...rest } = config
  return {
    ...rest,
    rules: {
      ...extendedRules,
      ...rules
    }
  }
}

module.exports = {
  extendRules
}
