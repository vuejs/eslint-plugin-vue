export interface Position {
  line: number
  column: number
}
export interface SourceLocation {
  start: Position
  end: Position
}
export type Range = [number, number]
export interface HasLocation {
  range: Range
  loc: SourceLocation
}
