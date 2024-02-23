/**
 * @fileoverview eslint config helpers
 * @author 唯然<weiran.zsd@outlook.com>
 */

exports.extendsRules = function (config, rules) {
  const { rules: extendedRules = {}, ...rest } = config
  return {
    ...rest,
    rules: {
      ...extendedRules,
      ...rules
    }
  }
}
