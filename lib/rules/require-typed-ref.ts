/**
 * @author Ivan Demchuk <https://github.com/Demivan>
 * See LICENSE file in root directory for full license.
 */
import { findVariable } from '@eslint-community/eslint-utils'
import { iterateDefineRefs } from '../utils/ref-object-references.ts'
import utils from '../utils/index.js'

type FunctionNode =
  FunctionDeclaration | FunctionExpression | ArrowFunctionExpression

/** `ref() as Ref<T>`, `ref() satisfies Ref<T>` and `<Ref<T>>ref()` */
const TYPE_ASSERTIONS = new Set([
  'TSAsExpression',
  'TSSatisfiesExpression',
  'TSTypeAssertion'
])

function isNullOrUndefined(node: Expression | SpreadElement) {
  return (
    (node.type === 'Literal' && node.value === null) ||
    (node.type === 'Identifier' && node.name === 'undefined')
  )
}

function hasTypeAnnotation(node: Pattern): boolean {
  return node.type === 'AssignmentPattern'
    ? hasTypeAnnotation(node.left)
    : 'typeAnnotation' in node && node.typeAnnotation != null
}

/**
 * Resolves the single definition of the given identifier reference.
 */
function findDefinition(context: RuleContext, node: Identifier) {
  const variable = findVariable(utils.getScope(context, node), node)
  return variable?.defs.length === 1 ? variable.defs[0] : null
}

/**
 * Checks whether the given identifier refers to a variable or a parameter
 * that was declared with an explicit type annotation.
 */
function isTypedVariable(context: RuleContext, node: Identifier): boolean {
  const def = findDefinition(context, node)
  return (
    (def?.type === 'Variable' || def?.type === 'Parameter') &&
    hasTypeAnnotation(def.name as Pattern)
  )
}

/**
 * Resolves the identifier to the function it refers to, if that function is
 * declared in the same file.
 */
function findFunction(
  context: RuleContext,
  node: Identifier
): FunctionNode | null {
  const def = findDefinition(context, node)
  if (def?.type === 'FunctionName') {
    return def.node
  }
  const init = def?.type === 'Variable' ? def.node.init : null
  return init != null &&
    (init.type === 'ArrowFunctionExpression' ||
      init.type === 'FunctionExpression')
    ? init
    : null
}

/**
 * Checks whether the parameter receiving the argument at the given index has
 * an explicit type annotation.
 */
function hasTypedParameter(fn: FunctionNode, index: number): boolean {
  const param = fn.params[index] ?? fn.params.at(-1)
  if (param == null) {
    return false
  }
  if (fn.params[index] == null && param.type !== 'RestElement') {
    return false
  }
  return hasTypeAnnotation(param)
}

/**
 * Checks whether an explicit type annotation already applies to the given
 * expression, which makes the type of the created ref known.
 */
function isInTypedPosition(context: RuleContext, node: Expression): boolean {
  const parent = node.parent
  if (TYPE_ASSERTIONS.has(parent.type)) {
    return true
  }
  switch (parent.type) {
    // `const value: Ref<T> = ref()`
    case 'VariableDeclarator': {
      return parent.init === node && hasTypeAnnotation(parent.id)
    }
    // `function useValue(value: Ref<T> = ref()) {}`
    case 'AssignmentPattern': {
      return parent.right === node && hasTypeAnnotation(parent.left)
    }
    // `value = ref()` where `value` is typed
    case 'AssignmentExpression': {
      return (
        parent.operator === '=' &&
        parent.left.type === 'Identifier' &&
        isTypedVariable(context, parent.left)
      )
    }
    // `useValue(ref())` where the parameter of `useValue` is typed
    case 'CallExpression': {
      const index = parent.arguments.indexOf(node)
      if (index === -1 || parent.callee.type !== 'Identifier') {
        return false
      }
      const fn = findFunction(context, parent.callee)
      return fn != null && hasTypedParameter(fn, index)
    }
    default: {
      return false
    }
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require `ref` and `shallowRef` functions to be strongly typed',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-typed-ref.html'
    },
    fixable: null,
    schema: [],
    messages: {
      noType:
        'Specify type parameter for `{{name}}` function, otherwise created variable will not be typechecked.'
    }
  },
  create(context: RuleContext) {
    const filename = context.filename
    if (!utils.isVueFile(filename) && !utils.isTypeScriptFile(filename)) {
      return {}
    }

    if (utils.isVueFile(filename)) {
      const sourceCode = context.sourceCode
      const documentFragment =
        sourceCode.parserServices.getDocumentFragment &&
        sourceCode.parserServices.getDocumentFragment()
      if (!documentFragment) {
        return {}
      }
      const scripts = documentFragment.children.filter(
        (element): element is VElement =>
          utils.isVElement(element) && element.name === 'script'
      )
      if (
        scripts.every((script) => !utils.hasAttribute(script, 'lang', 'ts'))
      ) {
        return {}
      }
    }

    const defines = iterateDefineRefs(
      context.sourceCode.scopeManager.globalScope!
    )

    function report(name: string, node: CallExpression) {
      context.report({
        node,
        messageId: 'noType',
        data: {
          name
        }
      })
    }

    return {
      Program() {
        for (const ref of defines) {
          if (ref.name !== 'ref' && ref.name !== 'shallowRef') {
            continue
          }

          if (
            ref.node.arguments.length > 0 &&
            !isNullOrUndefined(ref.node.arguments[0])
          ) {
            continue
          }

          const typeArguments =
            'typeArguments' in ref.node
              ? ref.node.typeArguments
              : ref.node.typeParameters
          if (typeArguments != null) {
            continue
          }

          if (!isInTypedPosition(context, ref.node)) {
            report(ref.name, ref.node)
          }
        }
      }
    }
  }
}
