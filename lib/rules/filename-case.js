'use strict'
const path = require('path')
const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')
const snakeCase = require('lodash.snakecase')
const upperfirst = require('lodash.upperfirst')

const pascalCase = str => upperfirst(camelCase(str))
const numberRegex = /(\d+)/
const PLACEHOLDER = '\uFFFF\uFFFF\uFFFF'
const PLACEHOLDER_REGEX = new RegExp(PLACEHOLDER, 'i')

function ignoreNumbers (fn) {
  return str => {
    const stack = []
    let execResult = numberRegex.exec(str)

    while (execResult) {
      stack.push(execResult[0])
      str = str.replace(execResult[0], PLACEHOLDER)
      execResult = numberRegex.exec(str)
    }

    let withCase = fn(str)

    while (stack.length > 0) {
      withCase = withCase.replace(PLACEHOLDER_REGEX, stack.shift())
    }

    return withCase
  }
}

const cases = {
  camelCase: {
    fn: camelCase,
    name: 'camel case'
  },
  kebabCase: {
    fn: kebabCase,
    name: 'kebab case'
  },
  snakeCase: {
    fn: snakeCase,
    name: 'snake case'
  },
  pascalCase: {
    fn: pascalCase,
    name: 'pascal case'
  }
}

function fixFilename (chosenCase, filename) {
  return filename
    .split('.')
    .map(ignoreNumbers(chosenCase.fn))
    .join('.')
}

const leadingUnserscoresRegex = /^(_+)(.*)$/
function splitFilename (filename) {
  const res = leadingUnserscoresRegex.exec(filename)
  return {
    leading: (res && res[1]) || '',
    trailing: (res && res[2]) || filename
  }
}

const create = context => {
  let chosenCase = cases['camelCase']

  if (context.options[0] && context.options[0].case) {
    chosenCase = cases[context.options[0].case]
  }

  const filenameWithExt = context.getFilename()

  if (filenameWithExt === '<text>') {
    return {}
  }

  return {
    Program: node => {
      const extension = path.extname(filenameWithExt)
      const filename = path.basename(filenameWithExt, extension)

      if (filename + extension === 'index.js') {
        return
      }

      if (extension === '.vue') {
        chosenCase = cases['pascalCase']
      }

      const splitName = splitFilename(filename)
      const fixedFilename = fixFilename(chosenCase, splitName.trailing)
      const renameFilename = splitName.leading + fixedFilename + extension

      if (fixedFilename !== splitName.trailing) {
        context.report({
          node,
          message: `Filename is not in ${chosenCase.name}. Rename it to \`${renameFilename}\`.`
        })
      }
    }
  }
}

const schema = [{
  type: 'object',
  properties: {
    case: {
      enum: [
        'camelCase',
        'snakeCase',
        'kebabCase',
        'pascalCase'
      ]
    }
  }
}]

module.exports = {
  create,
  meta: {
    docs: {
      description: 'enforce file-name conventions',
      category: 'recommended'
    },
    schema
  }
}
