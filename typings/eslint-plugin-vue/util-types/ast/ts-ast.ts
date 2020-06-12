/**
 * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/typescript-estree/src/ts-estree/ts-estree.ts
 */
import { HasParentNode } from '../node'
import * as ES from './es-ast'
export type TSNode = TSAsExpression

export interface TSAsExpression extends HasParentNode {
  type: 'TSAsExpression'
  expression: ES.Expression
}
