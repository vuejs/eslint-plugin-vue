/**
 * @author Thomasan1999
 * See LICENSE file in root directory for full license.
 */
import { findVariable } from '@eslint-community/eslint-utils'
import type { Scope } from 'eslint'
import utils from '../utils/index.ts'

type ScriptRef = [string, CallExpression]

function getScriptRefsFromSetupFunction(
  body: (Statement | ModuleDeclaration)[]
): ScriptRef[] {
  return body.flatMap((child) => {
    if (child.type === 'VariableDeclaration') {
      const declarator = child.declarations[0]

      if (
        declarator.init?.type === 'CallExpression' &&
        declarator.init.callee?.type === 'Identifier' &&
        declarator.id.type === 'Identifier' &&
        ['ref', 'shallowRef'].includes(declarator.init.callee.name)
      )
        return [[declarator.id.name, declarator.init]]
    }

    return []
  })
}

const USE_TEMPLATE_REF_IMPORT = "import { useTemplateRef } from 'vue';"

/**
 * `ref()` without an argument starts as `undefined`, but `useTemplateRef()` as `null`,
 * so only `ref(null)` can be replaced without changing the value.
 */
function hasNullInitialValue(node: CallExpression): boolean {
  const args = node.arguments
  return (
    args.length === 1 && args[0].type === 'Literal' && args[0].raw === 'null'
  )
}

const TS_EXPRESSION_WRAPPERS = new Set([
  'TSAsExpression',
  'TSNonNullExpression',
  'TSSatisfiesExpression',
  'TSTypeAssertion'
])

/**
 * Gets the outermost of `node as T`, `node!`, `node satisfies T` and `<T>node` around the node,
 * or the node itself.
 */
function skipTSExpressionWrappers(node: ASTNode): ASTNode {
  let current = node
  while (
    current.parent &&
    TS_EXPRESSION_WRAPPERS.has(current.parent.type) &&
    (current.parent as TSAsExpression).expression === current
  ) {
    current = current.parent
  }
  return current
}

/**
 * Gets the expression inside `node as T`, `node!`, `node satisfies T` and `<T>node`.
 */
function unwrapTSExpression(node: ASTNode): ASTNode {
  let current = node
  while (TS_EXPRESSION_WRAPPERS.has(current.type)) {
    current = (current as TSAsExpression).expression
  }
  return current
}

/**
 * Gets the outermost destructuring pattern that has the node as a target,
 * e.g. `[{ a: node = b }]` for `node`, or the node itself.
 */
function getOutermostPatternTarget(node: ASTNode): ASTNode {
  const parent = node.parent
  switch (parent?.type) {
    case 'ArrayPattern':
    case 'RestElement': {
      return getOutermostPatternTarget(parent)
    }
    case 'AssignmentPattern': {
      return parent.left === node ? getOutermostPatternTarget(parent) : node
    }
    case 'Property': {
      return parent.value === node && parent.parent.type === 'ObjectPattern'
        ? getOutermostPatternTarget(parent.parent)
        : node
    }
    default: {
      return node
    }
  }
}

/**
 * Whether the node is assigned or updated, also through type expressions and destructuring,
 * e.g. `node = a`, `node++`, `delete node`, `(node as T) = a`, `[node] = a`, `({ a: node } = b)` or `for (node of a)`.
 */
function isWriteTarget(node: ASTNode): boolean {
  const target = getOutermostPatternTarget(skipTSExpressionWrappers(node))
  const parent = target.parent
  switch (parent?.type) {
    case 'AssignmentExpression':
    case 'ForInStatement':
    case 'ForOfStatement': {
      return parent.left === target
    }
    case 'UpdateExpression': {
      return true
    }
    case 'UnaryExpression': {
      return parent.operator === 'delete'
    }
    default: {
      return false
    }
  }
}

/**
 * Whether the node is only checked for truthiness, e.g. `if (node && node.value)`.
 */
function isCondition(node: ASTNode): boolean {
  const parent = node.parent
  switch (parent?.type) {
    case 'LogicalExpression': {
      return isCondition(parent)
    }
    case 'UnaryExpression': {
      return parent.operator === '!'
    }
    case 'IfStatement':
    case 'WhileStatement':
    case 'DoWhileStatement':
    case 'ForStatement':
    case 'ConditionalExpression': {
      return parent.test === node
    }
    default: {
      return false
    }
  }
}

/** Functions that keep their arguments where they can be written */
const STORING_FUNCTIONS = new Set([
  'customRef',
  'defineExpose',
  'provide',
  'reactive',
  'ref',
  'shallowReactive',
  'shallowRef',
  'toRef',
  'toRefs'
])
/** Methods that store their arguments in a collection */
const STORING_METHODS = new Set(['push', 'unshift', 'splice', 'set', 'add'])

/**
 * Gets the name the identifier is imported as, e.g. `provide` for `import { provide as p }`,
 * its own name for globals, or `null` for local variables.
 */
function getImportedName(
  context: RuleContext,
  identifier: Identifier
): string | null {
  const variable = findVariable(utils.getScope(context, identifier), identifier)
  if (!variable || variable.defs.length === 0) {
    return identifier.name
  }
  const def = variable.defs[0]
  if (def.type !== 'ImportBinding' || def.node.type !== 'ImportSpecifier') {
    return null
  }
  // e.g. `import { 'provide' as p } from 'vue'`
  const imported = def.node.imported as Identifier | Literal
  return imported.type === 'Identifier' ? imported.name : String(imported.value)
}

/**
 * Whether the identifier is a namespace import of Vue,
 * e.g. `import * as Vue from 'vue'`, `'@vue/runtime-core'` or `'#imports'`.
 */
function isVueNamespace(context: RuleContext, identifier: Identifier): boolean {
  const variable = findVariable(utils.getScope(context, identifier), identifier)
  const def = variable?.defs[0]
  if (
    def?.type !== 'ImportBinding' ||
    def.node.type !== 'ImportNamespaceSpecifier'
  ) {
    return false
  }
  const source = String(def.parent.source.value)
  return source === 'vue' || source.startsWith('@vue/') || source === '#imports'
}

/**
 * Gets the imported name of an identifier callee, or the property name of a member callee,
 * e.g. `getCurrentInstance` for `Vue.getCurrentInstance()`.
 */
function getCalleeName(
  context: RuleContext,
  callee: CallExpression['callee']
): string | null {
  if (callee.type === 'MemberExpression') {
    return utils.getStaticPropertyName(callee)
  }
  if (callee.type === 'Identifier') {
    return getImportedName(context, callee)
  }
  return null
}

/**
 * Whether the call may write its arguments or keep them where they can be written,
 * e.g. `reactive({ node })`, `Vue.provide(key, node)`, `Object.assign(node, a)`,
 * `list.push(node)` or `new Set([node])`.
 */
function isStoringCall(
  context: RuleContext,
  node: CallExpression | NewExpression
): boolean {
  if (node.type === 'NewExpression') {
    return true
  }
  const callee = node.callee
  if (callee.type === 'Identifier') {
    const name = getImportedName(context, callee)
    return name !== null && STORING_FUNCTIONS.has(name)
  }
  if (callee.type !== 'MemberExpression') {
    return false
  }
  const name = utils.getStaticPropertyName(callee)
  if (name === null) {
    return false
  }
  const object = callee.object
  return (
    STORING_METHODS.has(name) ||
    (object.type === 'Identifier' &&
      (['Object', 'Reflect'].includes(object.name) ||
        (STORING_FUNCTIONS.has(name) && isVueNamespace(context, object))))
  )
}

/**
 * Whether the node is inside a `defineExpose()` call, where the parent could write it.
 */
function isInDefineExpose(node: ASTNode): boolean {
  let current = node.parent
  while (current) {
    if (
      current.type === 'CallExpression' &&
      current.callee.type === 'Identifier' &&
      current.callee.name === 'defineExpose'
    ) {
      return true
    }
    current = current.parent
  }
  return false
}

/**
 * Whether the node is passed to a function, also inside arrays, objects and other expressions,
 * e.g. `watch(node, ...)`, `watch([node], ...)`, `use({ target: node })` or `use(() => node)`.
 * Functions that write or keep their arguments, e.g. `reactive()`, don't count.
 * `h('div', { ref: node })` doesn't count either, Vue doesn't set template refs to it.
 */
function isPassedToFunction(context: RuleContext, node: ASTNode): boolean {
  const parent = node.parent
  if (!parent) {
    return false
  }
  if (TS_EXPRESSION_WRAPPERS.has(parent.type)) {
    return isPassedToFunction(context, parent)
  }
  switch (parent.type) {
    case 'ArrayExpression':
    case 'ObjectExpression':
    case 'SpreadElement':
    case 'ConditionalExpression':
    case 'LogicalExpression':
    case 'SequenceExpression': {
      return isPassedToFunction(context, parent)
    }
    case 'Property': {
      return (
        parent.value === node &&
        utils.getStaticPropertyName(parent) !== 'ref' &&
        isPassedToFunction(context, parent)
      )
    }
    case 'ArrowFunctionExpression': {
      return parent.body === node && isPassedToFunction(context, parent)
    }
    case 'CallExpression':
    case 'NewExpression': {
      return parent.callee !== node && !isStoringCall(context, parent)
    }
    default: {
      return false
    }
  }
}

/**
 * Whether every reference only reads the ref: reads or destructures its properties,
 * checks it for truthiness or passes it to a function.
 * Anything else could write it, e.g. through an alias,
 * but `useTemplateRef()` returns a readonly ref.
 */
function isOnlyReadInScript(context: RuleContext, variable: Variable): boolean {
  return variable.references.every((reference) => {
    const identifier = reference.identifier
    if (
      reference.init ||
      // `vue-eslint-parser` marks `<script setup>` variables used in `<template>` as read at their declaration
      (identifier.parent.type === 'VariableDeclarator' &&
        identifier.parent.id === identifier) ||
      // e.g. `type T = typeof node`
      identifier.parent.type === 'TSTypeQuery'
    ) {
      return true
    }
    if (reference.isWrite()) {
      return false
    }
    const expression = skipTSExpressionWrappers(identifier)
    const parent = expression.parent
    if (parent?.type === 'MemberExpression' && parent.object === expression) {
      return !isWriteTarget(parent)
    }
    // e.g. `const { value } = node`
    if (
      (parent?.type === 'VariableDeclarator' &&
        parent.init === expression &&
        parent.id.type === 'ObjectPattern') ||
      (parent?.type === 'AssignmentExpression' &&
        parent.right === expression &&
        parent.left.type === 'ObjectPattern')
    ) {
      return true
    }
    return (
      isCondition(expression) ||
      (isPassedToFunction(context, expression) && !isInDefineExpose(expression))
    )
  })
}

/**
 * Whether the variable is a value import of one of the given names from `vue`.
 */
function isImportedFromVue(variable: Variable, names: string[]): boolean {
  return (
    variable.defs.length > 0 &&
    variable.defs.every(
      (def) =>
        def.type === 'ImportBinding' &&
        def.parent.source.value === 'vue' &&
        def.parent.importKind !== 'type' &&
        def.node.type === 'ImportSpecifier' &&
        def.node.importKind !== 'type' &&
        names.includes(def.node.imported.name)
    )
  )
}

/**
 * Whether the name refers to the Vue function:
 * imported from `vue`, or a global such as an auto-import.
 */
function isVueFunction(
  scope: Scope.Scope,
  name: string,
  importedNames: string[]
): boolean {
  const variable = findVariable(scope, name)
  return (
    variable === null ||
    variable.defs.length === 0 ||
    isImportedFromVue(variable, importedNames)
  )
}

function isInVFor(element: VElement): boolean {
  let current: VElement | VDocumentFragment = element
  while (current.type === 'VElement') {
    if (utils.hasDirective(current, 'for')) {
      return true
    }
    current = current.parent
  }
  return false
}

function getIndent(sourceCode: SourceCode, node: ASTNode): string {
  const line = sourceCode.lines[node.loc.start.line - 1]
  return line.slice(0, line.length - line.trimStart().length)
}

/**
 * Gets the top-level statements of the `<script>` block that contains the node.
 */
function getScriptStatements(
  context: RuleContext,
  node: ASTNode
): (Statement | ModuleDeclaration)[] {
  const sourceCode = context.sourceCode
  const documentFragment = sourceCode.parserServices.getDocumentFragment?.()
  const script = documentFragment?.children
    .filter(utils.isVElement)
    .find(
      (element) =>
        element.name === 'script' &&
        element.range[0] <= node.range[0] &&
        node.range[1] <= element.range[1]
    )
  return script
    ? sourceCode.ast.body.filter(
        (statement) =>
          script.range[0] <= statement.range[0] &&
          statement.range[1] <= script.range[1]
      )
    : sourceCode.ast.body
}

function fixImport(
  context: RuleContext,
  fixer: RuleFixer,
  node: CallExpression
): Fix {
  const sourceCode = context.sourceCode
  const imports = sourceCode.ast.body.filter(
    (statement): statement is ImportDeclaration =>
      statement.type === 'ImportDeclaration'
  )

  const vueImport = imports.find(
    (declaration) =>
      declaration.source.value === 'vue' &&
      declaration.importKind !== 'type' &&
      declaration.specifiers.some(
        (specifier) => specifier.type === 'ImportSpecifier'
      )
  )
  if (vueImport) {
    return fixer.insertTextAfter(
      vueImport.specifiers.at(-1)!,
      ', useTemplateRef'
    )
  }

  const lastImport = imports.at(-1)
  if (lastImport) {
    return fixer.insertTextAfter(
      lastImport,
      `
${getIndent(sourceCode, lastImport)}${USE_TEMPLATE_REF_IMPORT}`
    )
  }

  const firstStatement = getScriptStatements(context, node)[0]
  return fixer.insertTextBefore(
    firstStatement,
    `${USE_TEMPLATE_REF_IMPORT}
${getIndent(sourceCode, firstStatement)}`
  )
}

export default {
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
  create(context: RuleContext) {
    const templateRefs = new Set<string>()
    const templateWrites = new Set<string>()
    /** Template refs inside `v-for` */
    const templateRefsInVFor = new Set<string>()
    /** Names written through `this` in `<template>`, `null` when unknown */
    const templateInstanceWrites = new Set<string | null>()

    const scriptRefs: ScriptRef[] = []
    /** `ref()` calls in the Options API `setup()`, which are not fixed */
    const optionsApiRefs = new Set<CallExpression>()

    /**
     * Whether the component instance is used in the script,
     * e.g. `this` in a `<script>` without `setup` or `getCurrentInstance()`,
     * which could write the ref
     */
    let isInstanceUsed = false

    /** Keys passed to existing `useTemplateRef()` calls */
    const useTemplateRefKeys = new Set<string>()
    let hasUnknownUseTemplateRefKey = false

    function isUseTemplateRefCall(node: CallExpression): boolean {
      const callee = node.callee
      if (callee.type === 'MemberExpression') {
        return (
          !callee.computed &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'useTemplateRef'
        )
      }
      if (callee.type !== 'Identifier') {
        return false
      }
      if (callee.name === 'useTemplateRef') {
        return true
      }
      // e.g. `import { useTemplateRef as useRefByKey } from 'vue'`
      const variable = findVariable(utils.getScope(context, callee), callee)
      return (
        variable !== null && isImportedFromVue(variable, ['useTemplateRef'])
      )
    }

    function isInScriptSetup(node: ASTNode): boolean {
      const scriptSetup = utils.getScriptSetupElement(context)
      return scriptSetup !== null && utils.isInRange(scriptSetup, node)
    }

    /**
     * Whether the call is `getCurrentInstance()`, also aliased, through a namespace
     * or imported from another module, e.g. `#imports`.
     */
    function isGetCurrentInstanceCall(node: CallExpression): boolean {
      return getCalleeName(context, node.callee) === 'getCurrentInstance'
    }

    function canFix(node: CallExpression, name: string): boolean {
      const { id } = node.parent as VariableDeclarator
      if (
        isInstanceUsed ||
        // the fix would add a second `useTemplateRef()` for the same key
        hasUnknownUseTemplateRefKey ||
        useTemplateRefKeys.has(name) ||
        // only `<script setup>` is fixed, the Options API can write the ref in many ways
        optionsApiRefs.has(node) ||
        !isInScriptSetup(node) ||
        // the ref holds an array, which `useTemplateRef()` makes readonly
        templateRefsInVFor.has(name) ||
        !hasNullInitialValue(node) ||
        // the annotation was written for `ref()` and may not match
        (id.type === 'Identifier' && id.typeAnnotation) ||
        templateWrites.has(name) ||
        templateInstanceWrites.has(null) ||
        templateInstanceWrites.has(name) ||
        // the fix would drop them
        context.sourceCode.getCommentsInside(node).length > 0
      ) {
        return false
      }
      const scope = utils.getScope(context, node)
      if (
        !isVueFunction(scope, (node.callee as Identifier).name, [
          'ref',
          'shallowRef'
        ]) ||
        // e.g. a local `useTemplateRef` or one imported from another module
        !isVueFunction(scope, 'useTemplateRef', ['useTemplateRef'])
      ) {
        return false
      }
      const variable = findVariable(scope, name)
      return variable !== null && isOnlyReadInScript(context, variable)
    }

    function fix(fixer: RuleFixer, node: CallExpression, name: string): Fix[] {
      const sourceCode = context.sourceCode
      const typeArguments = node.typeArguments
        ? sourceCode.getText(node.typeArguments)
        : ''
      const fixes = [
        fixer.replaceText(node, `useTemplateRef${typeArguments}('${name}')`)
      ]
      if (!findVariable(utils.getScope(context, node), 'useTemplateRef')) {
        fixes.push(fixImport(context, fixer, node))
      }
      return fixes
    }

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(context, {
        'VAttribute[directive=false]'(node) {
          if (node.key.name !== 'ref' || !node.value?.value) {
            return
          }
          templateRefs.add(node.value.value)
          if (isInVFor(node.parent.parent)) {
            templateRefsInVFor.add(node.value.value)
          }
        },
        "VAttribute[directive=true][key.name.name='model']"(node) {
          const expression =
            node.value?.expression && unwrapTSExpression(node.value.expression)
          if (
            expression?.type === 'Identifier' &&
            // not a `v-for` or slot variable
            node.value!.references.every(
              (reference) => reference.id !== expression || !reference.variable
            )
          ) {
            templateWrites.add(expression.name)
          }
        },
        VExpressionContainer(node) {
          for (const reference of node.references) {
            if (reference.mode !== 'r' && !reference.variable) {
              templateWrites.add(reference.id.name)
            }
          }
        },
        MemberExpression(node: MemberExpression) {
          if (node.object.type !== 'ThisExpression') {
            return
          }
          const parent = skipTSExpressionWrappers(node).parent!
          if (
            isWriteTarget(node) ||
            (parent.type === 'VExpressionContainer' &&
              parent.parent.type === 'VAttribute' &&
              parent.parent.directive &&
              parent.parent.key.name.name === 'model')
          ) {
            templateInstanceWrites.add(utils.getStaticPropertyName(node))
          }
        }
      }),
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
          if (node.type === 'ArrowFunctionExpression' && node.expression) {
            return
          }
          const newScriptRefs = getScriptRefsFromSetupFunction(node.body.body)
          for (const [, call] of newScriptRefs) {
            optionsApiRefs.add(call)
          }
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
        CallExpression(node: CallExpression) {
          if (isGetCurrentInstanceCall(node)) {
            isInstanceUsed = true
          }
          if (!isUseTemplateRefCall(node)) {
            return
          }
          const key = node.arguments[0]
          const value =
            key?.type === 'Literal' || key?.type === 'TemplateLiteral'
              ? utils.getStringLiteralValue(key, true)
              : null
          if (value === null) {
            hasUnknownUseTemplateRefKey = true
          } else {
            useTemplateRefKeys.add(value)
          }
        },
        ThisExpression(node: ThisExpression) {
          const scriptSetup = utils.getScriptSetupElement(context)
          if (!scriptSetup || !utils.isInRange(scriptSetup, node)) {
            isInstanceUsed = true
          }
        },
        'Program:exit'() {
          const scriptRefsMap = new Map(scriptRefs)

          for (const templateRef of templateRefs) {
            const scriptRef = scriptRefsMap.get(templateRef)

            if (!scriptRef) {
              continue
            }

            context.report({
              node: scriptRef,
              messageId: 'preferUseTemplateRef',
              data: {
                name: (scriptRef.callee as Identifier).name
              },
              fix: canFix(scriptRef, templateRef)
                ? (fixer) => fix(fixer, scriptRef, templateRef)
                : null
            })
          }
        }
      }
    )
  }
}
