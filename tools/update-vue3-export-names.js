'use strict'

/*
 This script updates `lib/utils/vue3-export-names.json` file from vue type.
 */

const fs = require('fs')
const path = require('path')
const tsParser = require('@typescript-eslint/parser')
const { httpGet } = require('./lib/http')

main()

async function main() {
  const names = new Set()

  for await (const name of extractExportNames('vue@^3')) {
    names.add(name)
  }
  // Update file.
  const filePath = path.resolve(
    __dirname,
    '../lib/utils/vue3-export-names.json'
  )

  fs.writeFileSync(filePath, `${JSON.stringify([...names], null, 2)}\n`)
}

async function* extractExportNames(m) {
  const rootNode = tsParser.parse(await resolveTypeContents(m), {
    loc: true,
    range: true
  })
  for (const node of rootNode.body) {
    switch (node.type) {
      case 'ExportAllDeclaration': {
        if (node.exported) {
          yield node.exported.name
        } else {
          for await (const name of extractExportNames(node.source.value)) {
            yield name
          }
        }
        break
      }
      case 'ExportNamedDeclaration': {
        if (node.declaration) {
          switch (node.declaration.type) {
            case 'ClassDeclaration':
            case 'ClassExpression':
            case 'FunctionDeclaration':
            case 'TSDeclareFunction':
            case 'TSEnumDeclaration':
            case 'TSInterfaceDeclaration':
            case 'TSTypeAliasDeclaration': {
              yield node.declaration.id.name
              break
            }
            case 'VariableDeclaration': {
              for (const decl of node.declaration.declarations) {
                yield* extractNamesFromPattern(decl.id)
              }
              break
            }
            case 'TSModuleDeclaration': {
              //?
              break
            }
          }
        }
        for (const spec of node.specifiers) {
          yield spec.exported.name
        }
        break
      }
      case 'ExportDefaultDeclaration': {
        yield 'default'
        break
      }
    }
  }
}

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.ArrayPattern} ArrayPattern
 * @typedef {import('@typescript-eslint/types').TSESTree.ObjectPattern} ObjectPattern
 * @typedef {import('@typescript-eslint/types').TSESTree.Identifier} Identifier
 * @typedef {import('@typescript-eslint/types').TSESTree.AssignmentPattern} AssignmentPattern
 * @typedef {import('@typescript-eslint/types').TSESTree.MemberExpression} MemberExpression
 * @typedef {import('@typescript-eslint/types').TSESTree.RestElement} RestElement
 */

/**
 * @param {Identifier|ArrayPattern|ObjectPattern|AssignmentPattern|MemberExpression|RestElement} node
 */
function* extractNamesFromPattern(node) {
  switch (node.type) {
    case 'Identifier': {
      yield node.name
      break
    }
    case 'ArrayPattern': {
      for (const element of node.elements) {
        yield* extractNamesFromPattern(element)
      }
      break
    }
    case 'ObjectPattern': {
      for (const prop of node.properties) {
        if (prop.type === 'Property') {
          yield prop.key.name
        } else if (prop.type === 'RestElement') {
          yield* extractNamesFromPattern(prop)
        }
      }
      break
    }
    case 'AssignmentPattern': {
      yield* extractNamesFromPattern(node.left)
      break
    }
    case 'RestElement': {
      yield* extractNamesFromPattern(node.argument)
      break
    }
    case 'MemberExpression': {
      // ?
      break
    }
  }
}
async function resolveTypeContents(m) {
  const packageJsonText = await httpGet(`https://unpkg.com/${m}/package.json`)
  const packageJson = JSON.parse(packageJsonText)

  let typesPath =
    (packageJson.exports &&
      packageJson.exports['.'] &&
      packageJson.exports['.'].types) ||
    packageJson.types
  if (typesPath.startsWith('./')) {
    typesPath = typesPath.slice(2)
  }
  return await httpGet(`https://unpkg.com/${m}/${typesPath}`)
}
