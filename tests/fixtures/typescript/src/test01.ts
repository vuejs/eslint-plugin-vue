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
