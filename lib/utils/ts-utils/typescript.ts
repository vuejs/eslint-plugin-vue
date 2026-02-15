import { createRequire } from 'node:module'
import type { Type, ObjectType, TypeReference } from 'typescript'

const require = createRequire(import.meta.url)
let cacheTypeScript: typeof import('typescript') | undefined

export function getTypeScript(): typeof import('typescript') | undefined {
  if (cacheTypeScript) {
    return cacheTypeScript
  }
  try {
    return (cacheTypeScript = require('typescript'))
  } catch (error) {
    if ((error as any).code === 'MODULE_NOT_FOUND') {
      return undefined
    }

    throw error
  }
}
/**
 * For debug
 */
export function extractTypeFlags(tsType: Type): string[] {
  const ts = getTypeScript()!
  const result: string[] = []
  const keys = Object.keys(ts.TypeFlags) as (keyof typeof ts.TypeFlags)[]
  for (const k of keys) {
    if ((tsType.flags & ts.TypeFlags[k]) !== 0) {
      result.push(k)
    }
  }
  return result
}
/**
 * For debug
 */
export function extractObjectFlags(tsType: Type): string[] {
  if (!isObject(tsType)) {
    return []
  }
  const ts = getTypeScript()!
  const result: string[] = []
  const keys = Object.keys(ts.ObjectFlags) as (keyof typeof ts.ObjectFlags)[]
  for (const k of keys) {
    if ((tsType.objectFlags & ts.ObjectFlags[k]) !== 0) {
      result.push(k)
    }
  }
  return result
}

export function isObject(tsType: Type): tsType is ObjectType {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Object) !== 0
}

export function isArrayLikeObject(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (
    isObject(tsType) &&
    (tsType.objectFlags &
      (ts.ObjectFlags.ArrayLiteral |
        ts.ObjectFlags.EvolvingArray |
        ts.ObjectFlags.Tuple)) !==
      0
  )
}

export function isAny(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Any) !== 0
}

export function isUnknown(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Unknown) !== 0
}

export function isNever(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Never) !== 0
}

export function isNull(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Null) !== 0
}

export function isStringLike(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.StringLike) !== 0
}

export function isNumberLike(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.NumberLike) !== 0
}

export function isBooleanLike(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.BooleanLike) !== 0
}

export function isBigIntLike(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.BigIntLike) !== 0
}

export function isReferenceObject(tsType: Type): tsType is TypeReference {
  const ts = getTypeScript()!
  return (
    isObject(tsType) && (tsType.objectFlags & ts.ObjectFlags.Reference) !== 0
  )
}

export function isFunction(tsType: Type): boolean {
  const ts = getTypeScript()!
  if (
    tsType.symbol &&
    (tsType.symbol.flags &
      (ts.SymbolFlags.Function | ts.SymbolFlags.Method)) !==
      0
  ) {
    return true
  }

  const signatures = tsType.getCallSignatures()
  return signatures.length > 0
}
