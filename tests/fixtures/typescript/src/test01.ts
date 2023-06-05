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
