/**
 * @author Yosuke Ota
 * @copyright 2021 Yosuke Ota. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import type { StyleVariablesContext } from './style-variables/index.ts'
import utils from './index.js'
import { ReferenceTracker } from '@eslint-community/eslint-utils'

interface IHasPropertyOption {
  unknownCallAsAny?: boolean
}

interface NestPropertyNodeForExpression {
  type: 'expression'
  node: MemberExpression
}

interface NestPropertyNodeForPattern {
  type: 'pattern'
  node: MemberExpression | Identifier | ObjectPattern | ArrayPattern
}

type NestPropertyNode =
  | NestPropertyNodeForExpression
  | NestPropertyNodeForPattern

export interface IPropertyReferences {
  hasProperty: (name: string, option?: IHasPropertyOption) => boolean
  allProperties: () => Map<string, { nodes: ASTNode[] }>
  getNest: (name: string) => IPropertyReferences
  getNestNodes: (name: string) => Iterable<NestPropertyNode>
}

const ANY: IPropertyReferences = {
  hasProperty: () => true,
  allProperties: () => new Map(),
  getNest: () => ANY,
  getNestNodes: () => []
}

const NEVER: IPropertyReferences = {
  hasProperty: () => false,
  allProperties: () => new Map(),
  getNest: () => NEVER,
  getNestNodes: () => []
}

function findFunction(
  context: RuleContext,
  id: Identifier
): FunctionExpression | ArrowFunctionExpression | FunctionDeclaration | null {
  const calleeVariable = utils.findVariableByIdentifier(context, id)
  if (!calleeVariable) {
    return null
  }
  if (calleeVariable.defs.length === 1) {
    const def = calleeVariable.defs[0]
    if (def.node.type === 'FunctionDeclaration') {
      return def.node
    }
    if (
      def.type === 'Variable' &&
      def.parent.kind === 'const' &&
      def.node.init
    ) {
      if (
        def.node.init.type === 'FunctionExpression' ||
        def.node.init.type === 'ArrowFunctionExpression'
      ) {
        return def.node.init
      }
      if (def.node.init.type === 'Identifier') {
        return findFunction(context, def.node.init)
      }
    }
  }
  return null
}

interface IPropertyReferenceExtractorOptions {
  unknownMemberAsUnreferenced?: boolean
  returnAsUnreferenced?: boolean
}

export function definePropertyReferenceExtractor(
  context: RuleContext,
  {
    unknownMemberAsUnreferenced = false,
    returnAsUnreferenced = false
  }: IPropertyReferenceExtractorOptions = {}
) {
  const cacheForExpression = new Map<Expression, IPropertyReferences>()
  const cacheForPattern = new Map<Pattern, IPropertyReferences>()
  const cacheForFunction = new Map<
    FunctionExpression | ArrowFunctionExpression | FunctionDeclaration,
    Map<number, IPropertyReferences>
  >()
  let toRefSet: { toRefNodes: Set<ESNode>; toRefsNodes: Set<ESNode> } | null =
    null

  let isFunctionalTemplate = false
  const templateBody = context.sourceCode.ast.templateBody
  if (templateBody) {
    isFunctionalTemplate = utils.hasAttribute(templateBody, 'functional')
  }

  function getToRefSet() {
    if (toRefSet) {
      return toRefSet
    }
    const tracker = new ReferenceTracker(
      context.sourceCode.scopeManager.scopes[0]
    )
    const toRefNodes = new Set<ESNode>()
    for (const { node } of utils.iterateReferencesTraceMap(tracker, {
      [ReferenceTracker.ESM]: true,
      toRef: {
        [ReferenceTracker.CALL]: true
      }
    })) {
      toRefNodes.add(node)
    }
    const toRefsNodes = new Set<ESNode>()
    for (const { node } of utils.iterateReferencesTraceMap(tracker, {
      [ReferenceTracker.ESM]: true,
      toRefs: {
        [ReferenceTracker.CALL]: true
      }
    })) {
      toRefsNodes.add(node)
    }

    return (toRefSet = { toRefNodes, toRefsNodes })
  }

  /**
   * Collects the property references for member expr.
   */
  class PropertyReferencesForMember implements IPropertyReferences {
    node: MemberExpression
    name: string
    withInTemplate: boolean

    constructor(node: MemberExpression, name: string, withInTemplate: boolean) {
      this.node = node
      this.name = name
      this.withInTemplate = withInTemplate
    }

    hasProperty(name: string): boolean {
      return name === this.name
    }

    allProperties() {
      return new Map<string, { nodes: ASTNode[] }>([
        [this.name, { nodes: [this.node.property] }]
      ])
    }

    getNest(name: string): IPropertyReferences {
      return name === this.name
        ? extractFromExpression(this.node, this.withInTemplate)
        : NEVER
    }

    *getNestNodes(name: string): Iterable<NestPropertyNodeForExpression> {
      if (name === this.name) {
        yield {
          type: 'expression',
          node: this.node
        }
      }
    }
  }

  /**
   * Collects the property references for object.
   */
  class PropertyReferencesForObject implements IPropertyReferences {
    properties: Record<string, AssignmentProperty[]>

    constructor() {
      this.properties = Object.create(null)
    }

    hasProperty(name: string): boolean {
      return Boolean(this.properties[name])
    }

    allProperties() {
      const result = new Map<string, { nodes: ASTNode[] }>()
      for (const [name, nodes] of Object.entries(this.properties)) {
        result.set(name, { nodes: nodes.map((node) => node.key) })
      }
      return result
    }

    getNest(name: string): IPropertyReferences {
      const properties = this.properties[name]
      return properties
        ? mergePropertyReferences(
            properties.map((property) => getNestFromPattern(property.value))
          )
        : NEVER
    }

    *getNestNodes(name: string): Iterable<NestPropertyNodeForPattern> {
      const properties = this.properties[name]
      if (!properties) {
        return
      }
      const values = properties.map((property) => property.value)
      let node
      while ((node = values.shift())) {
        if (
          node.type === 'Identifier' ||
          node.type === 'MemberExpression' ||
          node.type === 'ObjectPattern' ||
          node.type === 'ArrayPattern'
        ) {
          yield {
            type: 'pattern',
            node
          }
        } else if (node.type === 'AssignmentPattern') {
          values.unshift(node.left)
        }
      }
      return properties ? properties.map((p) => p.value) : []
    }
  }

  function getNestFromPattern(pattern: Pattern): IPropertyReferences {
    if (pattern.type === 'ObjectPattern') {
      return extractFromObjectPattern(pattern)
    }
    if (pattern.type === 'Identifier') {
      return extractFromIdentifier(pattern)
    } else if (pattern.type === 'AssignmentPattern') {
      return getNestFromPattern(pattern.left)
    }
    return ANY
  }

  /**
   * Extract the property references from Expression.
   */
  function extractFromExpression(
    node:
      | Identifier
      | MemberExpression
      | ChainExpression
      | ThisExpression
      | CallExpression,
    withInTemplate: boolean
  ): IPropertyReferences {
    const ref = cacheForExpression.get(node)
    if (ref) {
      return ref
    }
    cacheForExpression.set(node, ANY)
    const result = extractWithoutCache()
    cacheForExpression.set(node, result)
    return result

    function extractWithoutCache() {
      const parent = node.parent
      switch (parent.type) {
        case 'AssignmentExpression': {
          // `({foo} = arg)`
          return !withInTemplate &&
            parent.right === node &&
            parent.operator === '='
            ? extractFromPattern(parent.left)
            : NEVER
        }
        case 'VariableDeclarator': {
          // `const {foo} = arg`
          // `const foo = arg`
          return !withInTemplate && parent.init === node
            ? extractFromPattern(parent.id)
            : NEVER
        }
        case 'MemberExpression': {
          if (parent.object === node) {
            // `arg.foo`
            const name = utils.getStaticPropertyName(parent)

            if (
              name === '$props' &&
              parent.parent.type === 'MemberExpression'
            ) {
              // `$props.arg`
              const propName = utils.getStaticPropertyName(parent.parent)

              if (!propName) return unknownMemberAsUnreferenced ? NEVER : ANY

              return new PropertyReferencesForMember(
                parent.parent,
                propName,
                withInTemplate
              )
            } else if (name) {
              return new PropertyReferencesForMember(
                parent,
                name,
                withInTemplate
              )
            } else {
              return unknownMemberAsUnreferenced ? NEVER : ANY
            }
          }
          return NEVER
        }
        case 'CallExpression': {
          const argIndex = parent.arguments.indexOf(node)
          // `foo(arg)`
          return !withInTemplate && argIndex !== -1
            ? extractFromCall(parent, argIndex)
            : NEVER
        }
        case 'ChainExpression': {
          return extractFromExpression(parent, withInTemplate)
        }
        case 'ArrowFunctionExpression':
        case 'VExpressionContainer':
        case 'Property':
        case 'ArrayExpression': {
          return maybeExternalUsed(parent) ? ANY : NEVER
        }
        case 'ReturnStatement': {
          if (returnAsUnreferenced) {
            return NEVER
          } else {
            return maybeExternalUsed(parent) ? ANY : NEVER
          }
        }
      }
      return NEVER
    }

    function maybeExternalUsed(parentTarget: ASTNode): boolean {
      if (
        parentTarget.type === 'ReturnStatement' ||
        parentTarget.type === 'VExpressionContainer'
      ) {
        return true
      }
      if (parentTarget.type === 'ArrayExpression') {
        return maybeExternalUsed(parentTarget.parent)
      }
      if (parentTarget.type === 'Property') {
        return maybeExternalUsed(parentTarget.parent.parent)
      }
      if (parentTarget.type === 'ArrowFunctionExpression') {
        return parentTarget.body === node
      }
      return false
    }
  }

  /**
   * Extract the property references from one parameter of the function.
   */
  function extractFromPattern(node: Pattern): IPropertyReferences {
    const ref = cacheForPattern.get(node)
    if (ref) {
      return ref
    }
    cacheForPattern.set(node, ANY)
    const result = extractWithoutCache()
    cacheForPattern.set(node, result)
    return result

    function extractWithoutCache() {
      while (node.type === 'AssignmentPattern') {
        node = node.left
      }
      if (node.type === 'RestElement' || node.type === 'ArrayPattern') {
        // cannot check
        return NEVER
      }
      if (node.type === 'ObjectPattern') {
        return extractFromObjectPattern(node)
      }
      if (node.type === 'Identifier') {
        return extractFromIdentifier(node)
      }
      return NEVER
    }
  }

  /**
   * Extract the property references from ObjectPattern.
   */
  function extractFromObjectPattern(node: ObjectPattern): IPropertyReferences {
    const refs = new PropertyReferencesForObject()
    for (const prop of node.properties) {
      if (prop.type === 'Property') {
        const name = utils.getStaticPropertyName(prop)
        if (name) {
          const list = refs.properties[name] || (refs.properties[name] = [])
          list.push(prop)
        } else {
          // If cannot trace name, everything is used!
          return ANY
        }
      } else {
        // If use RestElement, everything is used!
        return ANY
      }
    }
    return refs
  }

  /**
   * Extract the property references from id.
   */
  function extractFromIdentifier(node: Identifier): IPropertyReferences {
    const variable = utils.findVariableByIdentifier(context, node)
    if (!variable) {
      return NEVER
    }
    return mergePropertyReferences(
      variable.references.map((reference) => {
        const id = reference.identifier
        return extractFromExpression(id, false)
      })
    )
  }

  /**
   * Extract the property references from call.
   */
  function extractFromCall(
    node: CallExpression,
    argIndex: number
  ): IPropertyReferences {
    if (node.callee.type !== 'Identifier') {
      return {
        hasProperty(_name, options) {
          return Boolean(options && options.unknownCallAsAny)
        },
        allProperties: () => new Map(),
        getNest: () => ANY,
        getNestNodes: () => []
      } satisfies IPropertyReferences
    }

    const fnNode = findFunction(context, node.callee)
    if (!fnNode) {
      if (argIndex === 0) {
        if (getToRefSet().toRefNodes.has(node)) {
          return extractFromToRef(node)
        } else if (getToRefSet().toRefsNodes.has(node)) {
          return extractFromToRefs(node)
        }
      }
      return {
        hasProperty(_name, options) {
          return Boolean(options && options.unknownCallAsAny)
        },
        allProperties: () => new Map(),
        getNest: () => ANY,
        getNestNodes: () => []
      } satisfies IPropertyReferences
    }

    return extractFromFunctionParam(fnNode, argIndex)
  }

  /**
   * Extract the property references from function param.
   */
  function extractFromFunctionParam(
    node: FunctionExpression | ArrowFunctionExpression | FunctionDeclaration,
    argIndex: number
  ): IPropertyReferences {
    let cacheForIndexes = cacheForFunction.get(node)
    if (!cacheForIndexes) {
      cacheForIndexes = new Map()
      cacheForFunction.set(node, cacheForIndexes)
    }
    const ref = cacheForIndexes.get(argIndex)
    if (ref) {
      return ref
    }
    cacheForIndexes.set(argIndex, NEVER)
    const arg = node.params[argIndex]
    if (!arg) {
      return NEVER
    }
    const result = extractFromPattern(arg)
    cacheForIndexes.set(argIndex, result)
    return result
  }

  /**
   * Extract the property references from path.
   */
  function extractFromPath(
    pathString: string,
    node: Identifier | Literal | TemplateLiteral
  ): IPropertyReferences {
    return extractFromSegments(pathString.split('.'))

    function extractFromSegments(segments: string[]): IPropertyReferences {
      if (segments.length === 0) {
        return ANY
      }
      const segmentName = segments[0]
      return {
        hasProperty: (name) => name === segmentName,
        allProperties: () => new Map([[segmentName, { nodes: [node] }]]),
        getNest: (name) =>
          name === segmentName ? extractFromSegments(segments.slice(1)) : NEVER,
        getNestNodes: () => []
      } satisfies IPropertyReferences
    }
  }

  /**
   * Extract the property references from name literal.
   */
  function extractFromNameLiteral(node: Expression): IPropertyReferences {
    const referenceName =
      node.type === 'Literal' || node.type === 'TemplateLiteral'
        ? utils.getStringLiteralValue(node)
        : null
    return referenceName
      ? ({
          hasProperty: (name) => name === referenceName,
          allProperties: () => new Map([[referenceName, { nodes: [node] }]]),
          getNest: (name) => (name === referenceName ? ANY : NEVER),
          getNestNodes: () => []
        } satisfies IPropertyReferences)
      : NEVER
  }

  /**
   * Extract the property references from name.
   */
  function extractFromName(
    referenceName: string,
    nameNode: Expression | SpreadElement,
    getNest?: () => IPropertyReferences
  ): IPropertyReferences {
    return {
      hasProperty: (name) => name === referenceName,
      allProperties: () => new Map([[referenceName, { nodes: [nameNode] }]]),
      getNest: (name) =>
        name === referenceName ? (getNest ? getNest() : ANY) : NEVER,
      getNestNodes: () => []
    } satisfies IPropertyReferences
  }

  /**
   * Extract the property references from toRef call.
   */
  function extractFromToRef(node: CallExpression): IPropertyReferences {
    const nameNode = node.arguments[1]
    const refName =
      nameNode &&
      (nameNode.type === 'Literal' || nameNode.type === 'TemplateLiteral')
        ? utils.getStringLiteralValue(nameNode)
        : null
    if (!refName) {
      // unknown name
      return ANY
    }
    return extractFromName(refName, nameNode, () =>
      extractFromExpression(node, false).getNest('value')
    )
  }

  /**
   * Extract the property references from toRefs call.
   */
  function extractFromToRefs(node: CallExpression): IPropertyReferences {
    const base = extractFromExpression(node, false)
    return {
      hasProperty: (name, option) => base.hasProperty(name, option),
      allProperties: () => base.allProperties(),
      getNest: (name) => base.getNest(name).getNest('value'),
      getNestNodes: (name) => base.getNest(name).getNestNodes('value')
    } satisfies IPropertyReferences
  }

  /**
   * Extract the property references from VExpressionContainer.
   */
  function extractFromVExpressionContainer(
    node: VExpressionContainer,
    options?: { ignoreGlobals?: boolean }
  ): IPropertyReferences {
    const ignoreGlobals = options && options.ignoreGlobals

    let ignoreRef: (name: string) => boolean = () => false
    if (ignoreGlobals) {
      const globalScope =
        context.sourceCode.scopeManager.globalScope ||
        context.sourceCode.scopeManager.scopes[0]

      ignoreRef = (name) => globalScope.set.has(name)
    }

    const references: IPropertyReferences[] = []
    for (const id of node.references
      .filter((ref) => ref.variable == null)
      .map((ref) => ref.id)) {
      if (ignoreRef(id.name)) {
        continue
      }
      if (isFunctionalTemplate) {
        if (id.name === 'props') {
          references.push(extractFromExpression(id, true))
        }
      } else {
        const referenceId =
          id.name === '$props' &&
          id.parent.type === 'MemberExpression' &&
          id.parent.property.type === 'Identifier'
            ? id.parent.property
            : id

        references.push(
          extractFromName(referenceId.name, referenceId, () =>
            extractFromExpression(referenceId, true)
          )
        )
      }
    }
    return mergePropertyReferences(references)
  }

  /**
   * Extract the property references from StyleVariablesContext.
   */
  function extractFromStyleVariablesContext(
    ctx: StyleVariablesContext
  ): IPropertyReferences {
    const references: IPropertyReferences[] = []
    for (const { id } of ctx.references) {
      references.push(
        extractFromName(id.name, id, () => extractFromExpression(id, true))
      )
    }
    return mergePropertyReferences(references)
  }

  return {
    extractFromExpression,
    extractFromPattern,
    extractFromFunctionParam,
    extractFromPath,
    extractFromName,
    extractFromNameLiteral,
    extractFromVExpressionContainer,
    extractFromStyleVariablesContext
  }
}

export function mergePropertyReferences(
  references: IPropertyReferences[]
): IPropertyReferences {
  if (references.length === 0) {
    return NEVER
  }
  if (references.length === 1) {
    return references[0]
  }
  return new PropertyReferencesForMerge(references)
}

/**
 * Collects the property references for merge.
 */
class PropertyReferencesForMerge implements IPropertyReferences {
  references: IPropertyReferences[]

  constructor(references: IPropertyReferences[]) {
    this.references = references
  }

  hasProperty(name: string, option?: IHasPropertyOption) {
    return this.references.some((ref) => ref.hasProperty(name, option))
  }

  allProperties() {
    const result = new Map<string, { nodes: ASTNode[] }>()
    for (const reference of this.references) {
      for (const [name, { nodes }] of reference.allProperties()) {
        const r = result.get(name)
        if (r) {
          r.nodes = [...new Set([...r.nodes, ...nodes])]
        } else {
          result.set(name, { nodes: [...nodes] })
        }
      }
    }
    return result
  }

  getNest(name: string): IPropertyReferences {
    const nest: IPropertyReferences[] = []
    for (const ref of this.references) {
      if (ref.hasProperty(name)) {
        nest.push(ref.getNest(name))
      }
    }
    return mergePropertyReferences(nest)
  }

  *getNestNodes(name: string): Iterable<NestPropertyNode> {
    for (const ref of this.references) {
      if (ref.hasProperty(name)) {
        yield* ref.getNestNodes(name)
      }
    }
  }
}
