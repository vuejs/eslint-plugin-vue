'use strict'

/*
 This script updates `lib/utils/vue3-export-names.json` file from vue type.
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const { URL } = require('url')
const tsParser = require('@typescript-eslint/parser')

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

  fs.writeFileSync(filePath, JSON.stringify([...names], null, 2))
}

async function* extractExportNames(m) {
  const rootNode = tsParser.parse(await resolveTypeContents(m), {
    loc: true,
    range: true
  })
  for (const node of rootNode.body) {
    if (node.type === 'ExportAllDeclaration') {
      if (node.exported) {
        yield node.exported.name
      } else {
        for await (const name of extractExportNames(node.source.value)) {
          yield name
        }
      }
    } else if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        if (
          node.declaration.type === 'ClassDeclaration' ||
          node.declaration.type === 'ClassExpression' ||
          node.declaration.type === 'FunctionDeclaration' ||
          node.declaration.type === 'TSDeclareFunction' ||
          node.declaration.type === 'TSEnumDeclaration' ||
          node.declaration.type === 'TSInterfaceDeclaration' ||
          node.declaration.type === 'TSTypeAliasDeclaration'
        ) {
          yield node.declaration.id.name
        } else if (node.declaration.type === 'VariableDeclaration') {
          for (const decl of node.declaration.declarations) {
            yield* extractNamesFromPattern(decl.id)
          }
        } else if (node.declaration.type === 'TSModuleDeclaration') {
          //?
        }
      }
      for (const spec of node.specifiers) {
        yield spec.exported.name
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      yield 'default'
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
  if (node.type === 'Identifier') {
    yield node.name
  } else if (node.type === 'ArrayPattern') {
    for (const element of node.elements) {
      yield* extractNamesFromPattern(element)
    }
  } else if (node.type === 'ObjectPattern') {
    for (const prop of node.properties) {
      if (prop.type === 'Property') {
        yield prop.key.name
      } else if (prop.type === 'RestElement') {
        yield* extractNamesFromPattern(prop)
      }
    }
  } else if (node.type === 'AssignmentPattern') {
    yield* extractNamesFromPattern(node.left)
  } else if (node.type === 'RestElement') {
    yield* extractNamesFromPattern(node.argument)
  } else if (node.type === 'MemberExpression') {
    // ?
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

function httpGet(url) {
  return new Promise((resolve, reject) => {
    let result = ''
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
          // redirect
          let redirectUrl = res.headers.location
          if (!redirectUrl.startsWith('http')) {
            const baseUrl = new URL(url)
            baseUrl.pathname = redirectUrl
            redirectUrl = String(baseUrl)
          }
          resolve(httpGet(redirectUrl))
          return
        }
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          result += String(chunk)
        })
        res.on('end', () => {
          resolve(result)
        })
        res.on('error', reject)
      })
      .on('error', reject)
  })
}
