import type { ObjectType, Type, TypeReference } from 'typescript'

type TypeScript = typeof import('typescript')

let cacheTypeScript: TypeScript | undefined

/**
 * Get TypeScript instance
 */
export function getTypeScript(): TypeScript | undefined {
  if (cacheTypeScript) {
    return cacheTypeScript
  }
  try {
    // eslint-disable-next-line unicorn/no-top-level-assignment-in-function, @typescript-eslint/no-require-imports -- lazily load and cache the optional `typescript` peer dependency
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

/**
 * Check if a given type is an object type or not.
 */
export function isObject(tsType: Type): tsType is ObjectType {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Object) !== 0
}

/**
 * Check if a given type is an array-like type or not.
 */
export function isArrayLikeObject(tsType: Type) {
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
/**
 * Check if a given type is an any type or not.
 */
export function isAny(tsType: Type) {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Any) !== 0
}
/**
 * Check if a given type is an unknown type or not.
 */
export function isUnknown(tsType: Type) {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Unknown) !== 0
}
/**
 * Check if a given type is a never type or not.
 */
export function isNever(tsType: Type) {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Never) !== 0
}
/**
 * Check if a given type is an null type or not.
 */
export function isNull(tsType: Type) {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.Null) !== 0
}

/**
 * Check if a given type is a string-like type or not.
 */
export function isStringLike(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.StringLike) !== 0
}
/**
 * Check if a given type is an number-like type or not.
 */
export function isNumberLike(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.NumberLike) !== 0
}
/**
 * Check if a given type is an boolean-like type or not.
 */
export function isBooleanLike(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.BooleanLike) !== 0
}
/**
 * Check if a given type is an bigint-like type or not.
 */
export function isBigIntLike(tsType: Type): boolean {
  const ts = getTypeScript()!
  return (tsType.flags & ts.TypeFlags.BigIntLike) !== 0
}

/**
 * Check if a given type is a reference type or not.
 */
export function isReferenceObject(tsType: Type): tsType is TypeReference {
  const ts = getTypeScript()!
  return (
    isObject(tsType) && (tsType.objectFlags & ts.ObjectFlags.Reference) !== 0
  )
}
/**
 * Check if a given type is `function` or not.
 */
export function isFunction(tsType: Type) {
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
