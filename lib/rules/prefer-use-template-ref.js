/**
 * @author Thomasan1999
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef ScriptRef
 * @type {{node: Expression, ref: string}}
 */

/**
 * @param declarator {VariableDeclarator}
 * @returns {ScriptRef}
 * */
function convertDeclaratorToScriptRef(declarator) {
  return {
    // @ts-ignore
    node: declarator.init,
    // @ts-ignore
    ref: declarator.id.name
  }
}

/**
 * @param body {(Statement | ModuleDeclaration)[]}
 * @returns {ScriptRef[]}
 * */
function getScriptRefsFromSetupFunction(body) {
  /** @type {VariableDeclaration[]} */
  const variableDeclarations = body.filter(
    (child) => child.type === 'VariableDeclaration'
  )
  const variableDeclarators = variableDeclarations.map(
    (declaration) => declaration.declarations[0]
  )
  const refDeclarators = variableDeclarators.filter((declarator) =>
    // @ts-ignore
    ['ref', 'shallowRef'].includes(declarator.init?.callee?.name)
  )

  return refDeclarators.map(convertDeclaratorToScriptRef)
}

/** @param node {Statement | ModuleDeclaration} */
function createIndent(node) {
  const indentSize = node.loc.start.column

  return ' '.repeat(indentSize)
}

/**
 *  @param context {RuleContext}
 *  @param fixer {RuleFixer}
 * */
function addUseTemplateRefImport(context, fixer) {
  const sourceCode = context.getSourceCode()

  if (!sourceCode) {
    return
  }

  const body = sourceCode.ast.body
  const imports = body.filter((node) => node.type === 'ImportDeclaration')

  const vueDestructuredImport = imports.find(
    (importStatement) =>
      importStatement.source.value === 'vue' &&
      importStatement.specifiers.some(
        (specifier) => specifier.type === 'ImportSpecifier'
      )
  )

  if (vueDestructuredImport) {
    const importSpecifiers = vueDestructuredImport.specifiers
    const lastImportSpecifier = importSpecifiers[importSpecifiers.length - 1]

    // @ts-ignore
    return fixer.insertTextAfter(lastImportSpecifier, `, useTemplateRef`)
  }

  const importStatement = "import { useTemplateRef } from 'vue';"
  const lastImport = imports[imports.length - 1]

  if (lastImport) {
    const indent = createIndent(lastImport)

    return fixer.insertTextAfter(lastImport, `\n${indent}${importStatement}`)
  }

  const firstNode = body[0]
  const indent = createIndent(firstNode)

  return fixer.insertTextBefore(firstNode, `${importStatement}\n${indent}`)
}

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require using `useTemplateRef` instead of `ref`/`shallowRef` for template refs',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-use-template-ref.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferUseTemplateRef: "Replace '{{name}}' with 'useTemplateRef'."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type Set<string> */
    const templateRefs = new Set()

    /**
     * @type ScriptRef[] */
    const scriptRefs = []

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(context, {
        'VAttribute[directive=false]'(node) {
          if (node.key.name === 'ref' && node.value?.value) {
            templateRefs.add(node.value.value)
          }
        }
      }),
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
          if (node.type === 'ArrowFunctionExpression' && node.expression) {
            return
          }
          const newScriptRefs = getScriptRefsFromSetupFunction(node.body.body)
          scriptRefs.push(...newScriptRefs)
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        Program(node) {
          const newScriptRefs = getScriptRefsFromSetupFunction(node.body)

          scriptRefs.push(...newScriptRefs)
        }
      }),
      {
        'Program:exit'() {
          let missingImportChecked = false

          for (const templateRef of templateRefs) {
            const scriptRef = scriptRefs.find(
              (scriptRef) => scriptRef.ref === templateRef
            )

            if (!scriptRef) {
              continue
            }

            context.report({
              node: scriptRef.node,
              messageId: 'preferUseTemplateRef',
              data: {
                // @ts-ignore
                name: scriptRef.node?.callee?.name
              },
              fix(fixer) {
                const replaceFunctionFix = fixer.replaceText(
                  scriptRef.node,
                  `useTemplateRef('${scriptRef.ref}')`
                )

                if (!missingImportChecked) {
                  missingImportChecked = true

                  const missingImportFix = addUseTemplateRefImport(
                    context,
                    fixer
                  )

                  if (missingImportFix) {
                    return [replaceFunctionFix, missingImportFix]
                  }
                }

                return replaceFunctionFix
              }
            })
          }
        }
      }
    )
  }
}
