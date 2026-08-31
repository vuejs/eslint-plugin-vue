/**
 * @author Yosuke Ota
 * @copyright 2022 Yosuke Ota. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

import type { Scope } from 'eslint'
import utils from './index.js'
import { findVariable, ReferenceTracker } from '@eslint-community/eslint-utils'
import { definePropertyReferenceExtractor } from './property-references.ts'

export interface RefObjectReferenceForExpression {
  type: 'expression'
  node: MemberExpression | CallExpression
  method: string
  define: CallExpression
  /** Holds the initialization path for assignment of ref objects. */
  defineChain: (CallExpression | Identifier | MemberExpression)[]
}

export interface RefObjectReferenceForPattern {
  type: 'pattern'
  node: ObjectPattern
  method: string
  define: CallExpression
  /** Holds the initialization path for assignment of ref objects. */
  defineChain: (CallExpression | Identifier | MemberExpression)[]
}

export interface RefObjectReferenceForIdentifier {
  type: 'expression' | 'pattern'
  node: Identifier
  variableDeclarator: VariableDeclarator | null
  variableDeclaration: VariableDeclaration | null
  method: string
  define: CallExpression
  /** Holds the initialization path for assignment of ref objects. */
  defineChain: (CallExpression | Identifier | MemberExpression)[]
}

export type RefObjectReference =
  | RefObjectReferenceForIdentifier
  | RefObjectReferenceForExpression
  | RefObjectReferenceForPattern

export interface RefObjectReferences {
  get: <T extends Identifier | Expression | Pattern | Super>(
    node: T
  ) => T extends Identifier
    ? RefObjectReferenceForIdentifier | null
    : T extends Expression
      ? RefObjectReferenceForExpression | null
      : T extends Pattern
        ? RefObjectReferenceForPattern | null
        : null
}

const cacheForRefObjectReferences = new WeakMap<Program, RefObjectReferences>()

/**
 * Iterate the call expressions that define the ref object.
 */
export function* iterateDefineRefs(
  globalScope: Scope.Scope
): Iterable<{ node: CallExpression; name: string }> {
  const tracker = new ReferenceTracker(globalScope)
  const reactiveReferences = utils.iterateReferencesTraceMap(tracker, {
    ref: {
      [ReferenceTracker.CALL]: true
    },
    computed: {
      [ReferenceTracker.CALL]: true
    },
    toRef: {
      [ReferenceTracker.CALL]: true
    },
    customRef: {
      [ReferenceTracker.CALL]: true
    },
    shallowRef: {
      [ReferenceTracker.CALL]: true
    },
    toRefs: {
      [ReferenceTracker.CALL]: true
    }
  })
  for (const { node, path } of reactiveReferences) {
    const expr = node as CallExpression
    yield {
      node: expr,
      name: path.at(-1)!
    }
  }
}

/**
 * Iterate the call expressions that defineModel() macro.
 */
function* iterateDefineModels(
  globalScope: Scope.Scope
): Iterable<{ node: CallExpression }> {
  for (const { identifier } of iterateMacroReferences()) {
    if (
      identifier.parent.type === 'CallExpression' &&
      identifier.parent.callee === identifier
    ) {
      yield {
        node: identifier.parent
      }
    }
  }

  /**
   * Iterate macro reference.
   */
  function* iterateMacroReferences(): Iterable<Reference> {
    const variable = globalScope.set.get('defineModel')
    if (
      variable &&
      variable.defs.length === 0 /* It was automatically defined. */
    ) {
      yield* variable.references
    }
    for (const ref of globalScope.through) {
      if (ref.identifier.name === 'defineModel') {
        yield ref
      }
    }
  }
}

/**
 * Iterate references of the given identifier.
 */
function* iterateIdentifierReferences(
  id: Identifier,
  globalScope: Scope.Scope
): Iterable<Scope.Reference> {
  const variable = findVariable(globalScope, id)
  if (!variable) {
    return
  }

  for (const reference of variable.references) {
    yield reference
  }
}

function getGlobalScope(context: RuleContext): Scope.Scope {
  const sourceCode = context.sourceCode
  return (
    sourceCode.scopeManager.globalScope || sourceCode.scopeManager.scopes[0]
  )
}

interface RefObjectReferenceContext {
  method: string
  define: CallExpression
  /** Holds the initialization path for assignment of ref objects. */
  defineChain: (CallExpression | Identifier | MemberExpression)[]
}

class RefObjectReferenceExtractor implements RefObjectReferences {
  #processedIds = new Set<Identifier>()
  context: RuleContext
  references = new Map<
    Identifier | MemberExpression | CallExpression | ObjectPattern,
    RefObjectReference
  >()

  constructor(context: RuleContext) {
    this.context = context
  }

  get<T extends Identifier | Expression | Pattern | Super>(
    node: T
  ): T extends Identifier
    ? RefObjectReferenceForIdentifier | null
    : T extends Expression
      ? RefObjectReferenceForExpression | null
      : T extends Pattern
        ? RefObjectReferenceForPattern | null
        : null {
    return (this.references.get(node as never) || null) as never
  }

  processDefineRef(node: CallExpression, method: string): void {
    const parent = node.parent
    let pattern: Pattern | null = null
    if (parent.type === 'VariableDeclarator') {
      pattern = parent.id
    } else if (
      parent.type === 'AssignmentExpression' &&
      parent.operator === '='
    ) {
      pattern = parent.left
    } else {
      if (method !== 'toRefs') {
        this.references.set(node, {
          type: 'expression',
          node,
          method,
          define: node,
          defineChain: [node]
        })
      }
      return
    }

    const ctx = {
      method,
      define: node,
      defineChain: [node]
    }

    if (method === 'toRefs') {
      const propertyReferenceExtractor = definePropertyReferenceExtractor(
        this.context
      )
      const propertyReferences =
        propertyReferenceExtractor.extractFromPattern(pattern)
      for (const name of propertyReferences.allProperties().keys()) {
        for (const nest of propertyReferences.getNestNodes(name)) {
          if (nest.type === 'expression') {
            this.processMemberExpression(nest.node, ctx)
          } else if (nest.type === 'pattern') {
            this.processPattern(nest.node, ctx)
          }
        }
      }
    } else {
      this.processPattern(pattern, ctx)
    }
  }

  processDefineModel(node: CallExpression): void {
    const parent = node.parent

    let pattern: Pattern | null = null
    if (parent.type === 'VariableDeclarator') {
      pattern = parent.id
    } else if (
      parent.type === 'AssignmentExpression' &&
      parent.operator === '='
    ) {
      pattern = parent.left
    } else {
      return
    }

    const ctx = {
      method: 'defineModel',
      define: node,
      defineChain: [node]
    }

    if (pattern.type === 'ArrayPattern' && pattern.elements[0]) {
      pattern = pattern.elements[0]
    }
    this.processPattern(pattern, ctx)
  }

  processExpression(
    node: MemberExpression | Identifier,
    ctx: RefObjectReferenceContext
  ): boolean {
    const parent = node.parent
    if (parent.type === 'AssignmentExpression') {
      if (parent.operator === '=' && parent.right === node) {
        // `(foo = obj.mem)`
        this.processPattern(parent.left, {
          ...ctx,
          defineChain: [node, ...ctx.defineChain]
        })
        return true
      }
    } else if (parent.type === 'VariableDeclarator' && parent.init === node) {
      // `const foo = obj.mem`
      this.processPattern(parent.id, {
        ...ctx,
        defineChain: [node, ...ctx.defineChain]
      })
      return true
    }
    return false
  }

  processMemberExpression(
    node: MemberExpression,
    ctx: RefObjectReferenceContext
  ) {
    if (this.processExpression(node, ctx)) {
      return
    }
    this.references.set(node, {
      type: 'expression',
      node,
      ...ctx
    })
  }

  processPattern(node: Pattern, ctx: RefObjectReferenceContext) {
    switch (node.type) {
      case 'Identifier': {
        this.processIdentifierPattern(node, ctx)
        break
      }
      case 'ArrayPattern':
      case 'RestElement':
      case 'MemberExpression': {
        return
      }
      case 'ObjectPattern': {
        this.references.set(node, {
          type: 'pattern',
          node,
          ...ctx
        })
        return
      }
      case 'AssignmentPattern': {
        this.processPattern(node.left, ctx)
        return
      }
      // No default
    }
  }

  processIdentifierPattern(node: Identifier, ctx: RefObjectReferenceContext) {
    if (this.#processedIds.has(node)) {
      return
    }
    this.#processedIds.add(node)

    const identifierReferences = iterateIdentifierReferences(
      node,
      getGlobalScope(this.context)
    )
    for (const reference of identifierReferences) {
      const def =
        reference.resolved &&
        reference.resolved.defs.length === 1 &&
        reference.resolved.defs[0].type === 'Variable'
          ? reference.resolved.defs[0]
          : null
      if (def && def.name === reference.identifier) {
        continue
      }
      if (
        reference.isRead() &&
        this.processExpression(reference.identifier, ctx)
      ) {
        continue
      }
      this.references.set(reference.identifier, {
        type: reference.isWrite() ? 'pattern' : 'expression',
        node: reference.identifier,
        variableDeclarator: def ? def.node : null,
        variableDeclaration: def ? def.parent : null,
        ...ctx
      })
    }
  }
}

/**
 * Extracts references of all ref objects.
 * @param context The rule context.
 */
export function extractRefObjectReferences(
  context: RuleContext
): RefObjectReferences {
  const sourceCode = context.sourceCode
  const cachedReferences = cacheForRefObjectReferences.get(sourceCode.ast)
  if (cachedReferences) {
    return cachedReferences
  }
  const references = new RefObjectReferenceExtractor(context)

  const globalScope = getGlobalScope(context)
  for (const { node, name } of iterateDefineRefs(globalScope)) {
    references.processDefineRef(node, name)
  }
  for (const { node } of iterateDefineModels(globalScope)) {
    references.processDefineModel(node)
  }

  cacheForRefObjectReferences.set(sourceCode.ast, references)

  return references
}
