import { HasLocation } from './locations'
export interface Token extends HasLocation {
  type: string
  value: string
}

export interface PunctuatorToken extends Token {
  type: 'Punctuator'
}

export interface KeywordToken extends Token {
  type: 'Keyword'
}

export interface Comment extends Token {
  type: 'Line' | 'Block'
  value: string
}

export interface LineComment extends Comment {
  type: 'Line'
}

export interface BlockComment extends Comment {
  type: 'Block'
}

export interface HTMLComment extends Token {
  type: 'HTMLComment'
  value: string
}
export interface HTMLBogusComment extends Token {
  type: 'HTMLBogusComment'
  value: string
}
