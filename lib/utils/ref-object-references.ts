/**
 * @author Yosuke Ota
 * @copyright 2022 Yosuke Ota. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

import type { Scope } from 'eslint'
import { iterateReferencesTraceMap, isDef } from './index.ts'
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

interface ReactiveVariableReference {
  node: Identifier
  /** Within escape hint (`$$()`) */
  escape: boolean
  variableDeclaration: VariableDeclaration
  method: string
  define: CallExpression
}

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

interface ReactiveVariableReferences {
  get: (node: Identifier) => ReactiveVariableReference | null
}

const REF_MACROS = [
  '$ref',
  '$computed',
  '$shallowRef',
  '$customRef',
  '$toRef',
  '$'
]

const cacheForRefObjectReferences = new WeakMap<Program, RefObjectReferences>()
const cacheForReactiveVariableReferences = new WeakMap<
  Program,
  ReactiveVariableReferences
>()

/**
 * Iterate the call expressions that define the ref object.
 */
export function* iterateDefineRefs(
  globalScope: Scope.Scope
): Iterable<{ node: CallExpression; name: string }> {
  const tracker = new ReferenceTracker(globalScope)
  for (const { node, path } of iterateReferencesTraceMap(tracker, {
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
  })) {
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
 * Iterate the call expressions that define the reactive variables.
 */
function* iterateDefineReactiveVariables(
  globalScope: Scope.Scope
): Iterable<{ node: CallExpression; name: string }> {
  for (const { identifier } of iterateRefMacroReferences()) {
    if (
      identifier.parent.type === 'CallExpression' &&
      identifier.parent.callee === identifier
    ) {
      yield {
        node: identifier.parent,
        name: identifier.name
      }
    }
  }

  /**
   * Iterate ref macro reference.
   */
  function* iterateRefMacroReferences(): Iterable<Reference> {
    yield* REF_MACROS.map((m) => globalScope.set.get(m))
      .filter(isDef)
      .flatMap((v) => v.references)
    for (const ref of globalScope.through) {
      if (REF_MACROS.includes(ref.identifier.name)) {
        yield ref
      }
    }
  }
}

/**
 *  Iterate the call expressions that the escape hint values.
 */
function* iterateEscapeHintValueRefs(
  globalScope: Scope.Scope
): Iterable<CallExpression> {
  for (const { identifier } of iterateEscapeHintReferences()) {
    if (
      identifier.parent.type === 'CallExpression' &&
      identifier.parent.callee === identifier
    ) {
      yield identifier.parent
    }
  }

  /**
   * Iterate escape hint reference.
   */
  function* iterateEscapeHintReferences(): Iterable<Reference> {
    const escapeHint = globalScope.set.get('$$')
    if (escapeHint) {
      yield* escapeHint.references
    }
    for (const ref of globalScope.through) {
      if (ref.identifier.name === '$$') {
        yield ref
      }
    }
  }
}

/**
 * Extract identifier from given pattern node.
 */
function* extractIdentifier(node: Pattern): Iterable<Identifier> {
  switch (node.type) {
    case 'Identifier': {
      yield node
      break
    }
    case 'ObjectPattern': {
      for (const property of node.properties) {
        if (property.type === 'Property') {
          yield* extractIdentifier(property.value)
        } else if (property.type === 'RestElement') {
          yield* extractIdentifier(property)
        }
      }
      break
    }
    case 'ArrayPattern': {
      for (const element of node.elements) {
        if (element) {
          yield* extractIdentifier(element)
        }
      }
      break
    }
    case 'AssignmentPattern': {
      yield* extractIdentifier(node.left)
      break
    }
    case 'RestElement': {
      yield* extractIdentifier(node.argument)
      break
    }
    case 'MemberExpression': {
      // can't extract
      break
    }
    // No default
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
  context: RuleContext
  references = new Map<
    Identifier | MemberExpression | CallExpression | ObjectPattern,
    RefObjectReference
  >()
  _processedIds = new Set<Identifier>()

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
    if (this._processedIds.has(node)) {
      return
    }
    this._processedIds.add(node)

    for (const reference of iterateIdentifierReferences(
      node,
      getGlobalScope(this.context)
    )) {
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

class ReactiveVariableReferenceExtractor implements ReactiveVariableReferences {
  context: RuleContext
  references: Map<Identifier, ReactiveVariableReference>
  _processedIds: Set<Identifier>
  _escapeHintValueRefs: Set<CallExpression>

  constructor(context: RuleContext) {
    this.context = context
    this.references = new Map()
    this._processedIds = new Set()
    this._escapeHintValueRefs = new Set(
      iterateEscapeHintValueRefs(getGlobalScope(context))
    )
  }

  get(node: Identifier): ReactiveVariableReference | null {
    return this.references.get(node) || null
  }

  processDefineReactiveVariable(node: CallExpression, method: string): void {
    const parent = node.parent
    if (parent.type !== 'VariableDeclarator') {
      return
    }

    const pattern: Pattern | null = parent.id

    if (method === '$') {
      for (const id of extractIdentifier(pattern)) {
        this.processIdentifierPattern(id, method, node)
      }
    } else {
      if (pattern.type === 'Identifier') {
        this.processIdentifierPattern(pattern, method, node)
      }
    }
  }

  processIdentifierPattern(
    node: Identifier,
    method: string,
    define: CallExpression
  ) {
    if (this._processedIds.has(node)) {
      return
    }
    this._processedIds.add(node)

    for (const reference of iterateIdentifierReferences(
      node,
      getGlobalScope(this.context)
    )) {
      const def =
        reference.resolved &&
        reference.resolved.defs.length === 1 &&
        reference.resolved.defs[0].type === 'Variable'
          ? reference.resolved.defs[0]
          : null
      if (!def || def.name === reference.identifier) {
        continue
      }
      this.references.set(reference.identifier, {
        node: reference.identifier,
        escape: this.withinEscapeHint(reference.identifier),
        method,
        define,
        variableDeclaration: def.parent
      })
    }
  }

  /**
   * Checks whether the given identifier node within the escape hints (`$$()`) or not.
   */
  withinEscapeHint(node: Identifier): boolean {
    let target:
      | Identifier
      | ObjectExpression
      | ArrayExpression
      | SpreadElement
      | Property
      | AssignmentProperty = node
    let parent: ASTNode | null = target.parent
    while (parent) {
      if (parent.type === 'CallExpression') {
        if (
          parent.arguments.includes(target as any) &&
          this._escapeHintValueRefs.has(parent)
        ) {
          return true
        }
        return false
      }
      if (
        (parent.type === 'Property' && parent.value === target) ||
        (parent.type === 'ObjectExpression' &&
          parent.properties.includes(target as any)) ||
        parent.type === 'ArrayExpression' ||
        parent.type === 'SpreadElement'
      ) {
        target = parent
        parent = target.parent
      } else {
        return false
      }
    }
    return false
  }
}

/**
 * Extracts references of all reactive variables.
 */
export function extractReactiveVariableReferences(
  context: RuleContext
): ReactiveVariableReferences {
  const sourceCode = context.sourceCode
  const cachedReferences = cacheForReactiveVariableReferences.get(
    sourceCode.ast
  )
  if (cachedReferences) {
    return cachedReferences
  }

  const references = new ReactiveVariableReferenceExtractor(context)

  for (const { node, name } of iterateDefineReactiveVariables(
    getGlobalScope(context)
  )) {
    references.processDefineReactiveVariable(node, name)
  }

  cacheForReactiveVariableReferences.set(sourceCode.ast, references)

  return references
}
