export type Props1 = {
  foo: string
  bar?: number
  baz?: boolean
}
export type Emits1 = {
  (e: 'foo' | 'bar', payload: string): void
  (e: 'baz', payload: number): void
}
export type Props2 = {
  a: string
  b?: number
  c?: boolean
  d?: boolean
  e?: number | string
  f?: () => number
  g?: { foo?: string }
  h?: string[]
  i?: readonly string[]
}
export type Props3 = {
  snake_case: string
  'kebab-case': number
  camelCase: boolean
  PascalCase?: string
  foo: number
}

export type Slots1 = {
  default(props: { msg: string }): any
  foo(props: { msg: string }): any
}

export type Status = 'active' | 'inactive' | 'pending'
export enum Color {
  Red,
  Green,
  Blue
}
export type NullableKind = 'a' | 'b' | null
export type UndefinedKind = 'a' | 'b' | undefined
export type FullyNullable = 'x' | 'y' | null | undefined
export type NumericUnion = 1 | 2 | 3
export enum StringStatus {
  Active = 'active',
  Inactive = 'inactive'
}

type Brand<T, B> = T & { __brand: B }
export type BrandedStatus = Brand<'active', 'status'> | Brand<'inactive', 'status'>
export type BigIntUnion = 1n | 2n | 3n
export type MixedLiterals = 0 | 1 | 'two' | true

export type ClickEvent = { type: 'click'; x: number; y: number }
export type HoverEvent = { type: 'hover'; target: string }
export type KeyEvent = { type: 'key'; code: number }
export type AppEvent = ClickEvent | HoverEvent | KeyEvent
