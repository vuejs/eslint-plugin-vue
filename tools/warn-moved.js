const chalk = require('chalk')
const log = console.log

log(
  chalk.bold('***Warning***')
)

log(
  chalk.dim('eslint-plugin-vue') +
  ' -> ' +
  chalk.green.underline('@vue/eslint-plugin')
)

log(
  chalk.bold('eslint-plugin-vue') +
  ' has been republished as scoped package'
)

log(
  'Please consider switching to ' +
  chalk.bold('@vue/eslint-plugin') + '\n\n'
)
