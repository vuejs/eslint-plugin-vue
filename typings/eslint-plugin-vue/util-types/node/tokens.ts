import { HasLocation } from './locations'
export interface Token extends HasLocation {
  type: string
  value: string
}
export interface Comment extends Token {
  type: 'Line' | 'Block'
  value: string
}
export interface HTMLComment extends Token {
  type: 'HTMLComment'
  value: string
}
export interface HTMLBogusComment extends Token {
  type: 'HTMLBogusComment'
  value: string
}
