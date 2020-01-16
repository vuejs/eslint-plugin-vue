/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const {
  isClosingParenToken,
  isOpeningParenToken,
  isOpeningBraceToken,
  isNotClosingParenToken,
  isClosingBracketToken,
  isOpeningBracketToken
} = require('eslint-utils')

/**
 * @typedef {import('@typescript-eslint/types').TSESTree} TSESTree
 * @typedef {import('../../typings/eslint-plugin-vue/util-types/indent-helper').TSNodeListener} TSNodeListener
 */

module.exports = {
  defineVisitor
}

/**
 * Process the given node list.
 * The first node is offsetted from the given left token.
 * Rest nodes are adjusted to the first node.
 * @callback ProcessNodeList
 * @param {(ASTNode|null)[]} nodeList The node to process.
 * @param {ASTNode|Token|null} left The left parenthesis token.
 * @param {ASTNode|Token|null} right The right parenthesis token.
 * @param {number} offset The offset to set.
 * @param {boolean} [alignVertically=true] The flag to align vertically. If `false`, this doesn't align vertically even if the first node is not at beginning of line.
 * @returns {void}
 */
/**
 * Set offset to the given tokens.
 * @callback SetOffset
 * @param {Token|Token[]|null|(Token|null)[]} token The token to set.
 * @param {number} offset The offset of the tokens.
 * @param {Token} baseToken The token of the base offset.
 * @returns {void}
 */
/**
 *
 * Copy offset to the given tokens from srcToken.
 * @callback CopyOffset
 * @param {Token} token The token to set.
 * @param {Token} srcToken The token of the source offset.
 * @returns {void}
 */
/**
 * Collect prefix tokens of the given property.
 * The prefix includes `async`, `get`, `set`, `static`, and `*`.
 * @callback GetPrefixTokens
 * @param {ASTNode} node The property node to collect prefix tokens.
 * @param {ASTNode | Token} keyNode The key node.
 * @returns {Token[]}
 */
/**
 * Process semicolons of the given statement node.
 * @callback ProcessSemicolons
 * @param {ASTNode} node The statement node to process.
 * @returns {void}
 */
/**
 * Get the first and last tokens of the given node.
 * If the node is parenthesized, this gets the outermost parentheses.
 * @callback GetFirstAndLastTokens
 * @param {ASTNode} node The node to get.
 * @param {number} [borderOffset] The least offset of the first token. Defailt is 0. This value is used to prevent false positive in the following case: `(a) => {}` The parentheses are enclosing the whole parameter part rather than the first parameter, but this offset parameter is needed to distinguish.
 * @returns {{firstToken:Token,lastToken:Token}} The gotten tokens.
 */
/**
 * @typedef {object} DefineVisitorParam
 * @property {ProcessNodeList} processNodeList
 * @property {ParserServices.TokenStore | SourceCode} tokenStore
 * @property {SetOffset} setOffset
 * @property {CopyOffset} copyOffset
 * @property {GetPrefixTokens} getPrefixTokens
 * @property {ProcessSemicolons} processSemicolons
 * @property {GetFirstAndLastTokens} getFirstAndLastTokens
 */

/**
 * @param {DefineVisitorParam} param
 * @returns {TSNodeListener}
 */
function defineVisitor({
  processNodeList,
  tokenStore,
  setOffset,
  copyOffset,
  getPrefixTokens,
  processSemicolons,
  getFirstAndLastTokens
}) {
  return {
    // Support TypeScript
    ['ClassDeclaration[implements], ClassDeclaration[typeParameters], ClassDeclaration[superTypeParameters],' +
      'ClassExpression[implements], ClassExpression[typeParameters], ClassExpression[superTypeParameters]'](
      node
    ) {
      if (node.typeParameters != null) {
        setOffset(
          tokenStore.getFirstToken(node.typeParameters),
          1,
          tokenStore.getFirstToken(node.id || node)
        )
      }
      if (node.superTypeParameters != null && node.superClass != null) {
        setOffset(
          tokenStore.getFirstToken(node.superTypeParameters),
          1,
          tokenStore.getFirstToken(node.superClass)
        )
      }
      if (node.implements != null && node.implements.length) {
        const classToken = tokenStore.getFirstToken(node)
        const implementsToken = tokenStore.getTokenBefore(node.implements[0])
        setOffset(implementsToken, 1, classToken)
        processNodeList(node.implements, implementsToken, null, 1)
      }
    },
    // Process semicolons.
    ['TSTypeAliasDeclaration, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSImportEqualsDeclaration,' +
      'TSAbstractMethodDefinition, TSAbstractClassProperty, TSEnumMember, ClassProperty,' +
      'TSPropertySignature, TSIndexSignature, TSMethodSignature'](node) {
      processSemicolons(node)
    },
    /**
     * Process type annotation
     *
     * e.g.
     * ```
     * const foo: Type
     * //       ^^^^^^
     * type foo = () => string
     * //            ^^^^^^^^^
     * ```
     */
    TSTypeAnnotation(node) {
      const [colonOrArrowToken, secondToken] = tokenStore.getFirstTokens(node, {
        count: 2,
        includeComments: false
      })
      const baseToken = tokenStore.getFirstToken(node.parent)
      setOffset([colonOrArrowToken, secondToken], 1, baseToken)

      if (node.parent.range[1] < node.range[0]) {
        setOffset(tokenStore.getTokensBetween(node.parent, node), 1, baseToken)
      }

      // a ?: T
      const before = tokenStore.getTokenBefore(colonOrArrowToken)
      if (before && before.value === '?') {
        setOffset(before, 1, baseToken)
      }
    },
    /**
     * Process as expression
     *
     * e.g.
     * ```
     * var foo = bar as boolean
     * //        ^^^^^^^^^^^^^^
     * ```
     */
    TSAsExpression(node) {
      const expressionTokens = getFirstAndLastTokens(node.expression)
      const asToken = tokenStore.getTokenAfter(expressionTokens.lastToken)
      setOffset(
        [asToken, getFirstAndLastTokens(node.typeAnnotation).firstToken],
        1,
        expressionTokens.firstToken
      )
    },
    /**
     * Process type reference
     *
     * e.g.
     * ```
     * const foo: Type<P>
     * //         ^^^^^^^
     * ```
     */
    TSTypeReference(node) {
      if (node.typeParameters) {
        const typeNameTokens = getFirstAndLastTokens(node.typeName)
        setOffset(
          tokenStore.getFirstToken(node.typeParameters),
          1,
          typeNameTokens.firstToken
        )
      }
    },
    /**
     * Process type parameter instantiation and type parameter declaration
     *
     * e.g.
     * ```
     * const foo: Type<P>
     * //             ^^^
     * ```
     *
     * e.g.
     * ```
     * type Foo<T>
     * //      ^^^
     * ```
     * @param {TSESTree.TSTypeParameterInstantiation | TSESTree.TSTypeParameterDeclaration} node
     */
    'TSTypeParameterInstantiation, TSTypeParameterDeclaration'(node) {
      // <T>
      processNodeList(
        node.params,
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    /**
     * Process type alias declaration
     *
     * e.g.
     * ```
     * type Foo
     * ```
     */
    TSTypeAliasDeclaration(node) {
      // type T = {}
      const typeToken = tokenStore.getFirstToken(node)
      const idToken = tokenStore.getFirstToken(node.id)
      setOffset(idToken, 1, typeToken)
      let eqToken
      if (node.typeParameters) {
        setOffset(tokenStore.getFirstToken(node.typeParameters), 1, idToken)
        eqToken = tokenStore.getTokenAfter(node.typeParameters)
      } else {
        eqToken = tokenStore.getTokenAfter(node.id)
      }
      const initToken = tokenStore.getTokenAfter(eqToken)
      setOffset([eqToken, initToken], 1, idToken)
    },
    /**
     * Process constructor type or function type
     *
     * e.g.
     * ```
     * type Foo = new () => T
     * //         ^^^^^^^^^^^
     * type Foo = () => void
     * //         ^^^^^^^^^^
     * ```
     */
    'TSConstructorType, TSFunctionType'(node) {
      // ()=>void
      const firstToken = tokenStore.getFirstToken(node)
      // new or < or (
      let currToken = firstToken
      if (node.type === 'TSConstructorType') {
        // currToken is new token
        // < or (
        currToken = tokenStore.getTokenAfter(currToken)
        setOffset(currToken, 1, firstToken)
      }
      if (node.typeParameters) {
        // currToken is < token
        // (
        currToken = tokenStore.getTokenAfter(node.typeParameters)
        setOffset(currToken, 1, firstToken)
      }
      const leftParenToken = currToken
      const rightParenToken = tokenStore.getTokenAfter(
        node.params[node.params.length - 1] || leftParenToken,
        isClosingParenToken
      )
      processNodeList(node.params, leftParenToken, rightParenToken, 1)
      const arrowToken = tokenStore.getTokenAfter(rightParenToken)
      setOffset(arrowToken, 1, leftParenToken)
    },
    /**
     * Process type literal
     *
     * e.g.
     * ```
     * const foo: { bar: string }
     * //         ^^^^^^^^^^^^^^^
     * ```
     */
    TSTypeLiteral(node) {
      processNodeList(
        node.members,
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    /**
     * Process property signature
     *
     * e.g.
     * ```
     * const foo: { bar: string }
     * //           ^^^^^^^^^^^
     * ```
     */
    TSPropertySignature(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const keyTokens = getFirstAndLastTokens(node.key)
      let keyLast
      if (node.computed) {
        const closeBracket = tokenStore.getTokenAfter(keyTokens.lastToken)
        processNodeList([node.key], firstToken, closeBracket, 1)
        keyLast = closeBracket
      } else {
        keyLast = keyTokens.lastToken
      }
      if (node.typeAnnotation) {
        const typeAnnotationToken = tokenStore.getFirstToken(
          node.typeAnnotation
        )
        setOffset(
          [
            ...tokenStore.getTokensBetween(keyLast, typeAnnotationToken),
            typeAnnotationToken
          ],
          1,
          firstToken
        )
      } else if (node.optional) {
        const qToken = tokenStore.getLastToken(node)
        setOffset(qToken, 1, firstToken)
      }
    },
    /**
     * Process index signature
     *
     * e.g.
     * ```
     * const foo: { [bar: string]: string }
     * //           ^^^^^^^^^^^^^^^^^^^^^
     * ```
     */
    TSIndexSignature(node) {
      const leftBracketToken = tokenStore.getFirstToken(node)
      const rightBracketToken = tokenStore.getTokenAfter(
        node.parameters[node.parameters.length - 1] || leftBracketToken,
        isClosingBracketToken
      )
      processNodeList(node.parameters, leftBracketToken, rightBracketToken, 1)
      const keyLast = rightBracketToken
      if (node.typeAnnotation) {
        const typeAnnotationToken = tokenStore.getFirstToken(
          node.typeAnnotation
        )
        setOffset(
          [
            ...tokenStore.getTokensBetween(keyLast, typeAnnotationToken),
            typeAnnotationToken
          ],
          1,
          leftBracketToken
        )
      }
    },
    /**
     * Process array type
     *
     * e.g.
     * ```
     * const foo: Type[]
     * //         ^^^^^^
     * ```
     */
    TSArrayType(node) {
      const firstToken = tokenStore.getFirstToken(node)
      setOffset(
        tokenStore.getLastTokens(node, { count: 2, includeComments: false }),
        0,
        firstToken
      )
    },
    TSTupleType(node) {
      // [T, U]
      processNodeList(
        node.elementTypes,
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    TSQualifiedName(node) {
      // A.B
      const objectToken = tokenStore.getFirstToken(node)
      const dotToken = tokenStore.getTokenBefore(node.right)
      const propertyToken = tokenStore.getTokenAfter(dotToken)
      setOffset([dotToken, propertyToken], 1, objectToken)
    },
    TSIndexedAccessType(node) {
      // A[B]
      const objectToken = tokenStore.getFirstToken(node)
      const leftBracketToken = tokenStore.getTokenBefore(
        node.indexType,
        isOpeningBracketToken
      )
      const rightBracketToken = tokenStore.getTokenAfter(
        node.indexType,
        isClosingBracketToken
      )
      setOffset(leftBracketToken, 1, objectToken)
      processNodeList([node.indexType], leftBracketToken, rightBracketToken, 1)
    },
    'TSUnionType, TSIntersectionType'(node) {
      // A | B
      // A & B
      const firstToken = tokenStore.getFirstToken(node)
      const types = [...node.types]
      if (getFirstAndLastTokens(types[0]).firstToken === firstToken) {
        types.shift()
      }
      processNodeList(
        types,
        firstToken,
        null,
        isBeginningOfLine(tokenStore, firstToken) ? 0 : 1
      )
    },
    TSParenthesizedType(node) {
      // (T)
      processNodeList(
        [node.typeAnnotation],
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    TSMappedType(node) {
      // {[key in foo]: bar}
      const leftBraceToken = tokenStore.getFirstToken(node)
      const leftBracketToken = tokenStore.getTokenBefore(node.typeParameter)
      const rightBracketToken = tokenStore.getTokenAfter(
        node.nameType || node.typeParameter
      )
      setOffset(
        [
          ...tokenStore.getTokensBetween(leftBraceToken, leftBracketToken),
          leftBracketToken
        ],
        1,
        leftBraceToken
      )
      processNodeList(
        [node.typeParameter, node.nameType],
        leftBracketToken,
        rightBracketToken,
        1
      )
      const rightBraceToken = tokenStore.getLastToken(node)
      if (node.typeAnnotation) {
        const typeAnnotationToken = tokenStore.getFirstToken(
          node.typeAnnotation
        )
        setOffset(
          [
            ...tokenStore.getTokensBetween(
              rightBracketToken,
              typeAnnotationToken
            ),
            typeAnnotationToken
          ],
          1,
          leftBraceToken
        )
      } else {
        setOffset(
          [...tokenStore.getTokensBetween(rightBracketToken, rightBraceToken)],
          1,
          leftBraceToken
        )
      }
      setOffset(rightBraceToken, 0, leftBraceToken)
    },
    /**
     * Process type parameter
     *
     * e.g.
     * ```
     * type Foo<T, U extends T, V = U>
     * //       ^  ^^^^^^^^^^^  ^^^^^
     * type Foo = {[key in foo]: bar}
     * //           ^^^^^^^^^^
     * ```
     */
    TSTypeParameter(node) {
      const [firstToken, ...afterTokens] = tokenStore.getTokens(node)
      for (const child of [node.constraint, node.default]) {
        if (!child) {
          continue
        }
        const [, ...removeTokens] = tokenStore.getTokens(child)
        for (const token of removeTokens) {
          const i = afterTokens.indexOf(token)
          if (i >= 0) {
            afterTokens.splice(i, 1)
          }
        }
      }
      const secondToken = afterTokens.shift()
      if (!secondToken) {
        return
      }
      setOffset(secondToken, 1, firstToken)
      if (secondToken.value === 'extends') {
        let prevToken = null
        let token = afterTokens.shift()
        while (token) {
          if (token.value === '=') {
            break
          }
          setOffset(token, 1, secondToken)
          prevToken = token
          token = afterTokens.shift()
        }
        while (token) {
          setOffset(token, 1, prevToken || secondToken)
          token = afterTokens.shift()
        }
      } else {
        setOffset(afterTokens, 1, firstToken)
      }
    },
    /**
     * Process conditional type
     *
     * e.g.
     * ```
     * type Foo = A extends B ? Bar : Baz
     * //         ^^^^^^^^^^^^^^^^^^^^^^^
     * ```
     */
    TSConditionalType(node) {
      // T extends Foo ? T : U
      const checkTypeToken = tokenStore.getFirstToken(node)
      const extendsToken = tokenStore.getTokenAfter(node.checkType)
      const extendsTypeToken = tokenStore.getFirstToken(node.extendsType)
      setOffset(extendsToken, 1, checkTypeToken)
      setOffset(extendsTypeToken, 1, extendsToken)
      const questionToken = tokenStore.getTokenAfter(
        node.extendsType,
        isNotClosingParenToken
      )
      const consequentToken = tokenStore.getTokenAfter(questionToken)
      const colonToken = tokenStore.getTokenAfter(
        node.trueType,
        isNotClosingParenToken
      )
      const alternateToken = tokenStore.getTokenAfter(colonToken)
      let baseNode = node
      let parent = baseNode.parent
      while (
        parent &&
        parent.type === 'TSConditionalType' &&
        parent.falseType === baseNode
      ) {
        baseNode = parent
        parent = baseNode.parent
      }
      const baseToken = tokenStore.getFirstToken(baseNode)
      setOffset([questionToken, colonToken], 1, baseToken)
      setOffset(consequentToken, 1, questionToken)
      setOffset(alternateToken, 1, colonToken)
    },
    /**
     * Process interface declaration
     *
     * e.g.
     * ```
     * interface Foo { }
     * ```
     */
    TSInterfaceDeclaration(node) {
      const interfaceToken = tokenStore.getFirstToken(node)
      setOffset(tokenStore.getFirstToken(node.id), 1, interfaceToken)
      if (node.typeParameters != null) {
        setOffset(
          tokenStore.getFirstToken(node.typeParameters),
          1,
          tokenStore.getFirstToken(node.id)
        )
      }
      if (node.extends != null && node.extends.length) {
        const extendsToken = tokenStore.getTokenBefore(node.extends[0])
        setOffset(extendsToken, 1, interfaceToken)
        processNodeList(node.extends, extendsToken, null, 1)
      }
      if (node.implements != null && node.implements.length) {
        const implementsToken = tokenStore.getTokenBefore(node.implements[0])
        setOffset(implementsToken, 1, interfaceToken)
        processNodeList(node.implements, implementsToken, null, 1)
      }
      const bodyToken = tokenStore.getFirstToken(node.body)
      setOffset(bodyToken, 0, interfaceToken)
    },
    /**
     * Process interface body
     *
     * e.g.
     * ```
     * interface Foo { }
     * //            ^^^
     * ```
     *
     * @param {TSESTree.TSInterfaceBody | TSESTree.TSModuleBlock} node
     */
    'TSInterfaceBody, TSModuleBlock'(node) {
      processNodeList(
        node.body,
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    /**
     * Process interface heritage and class implements
     *
     * e.g.
     * ```
     * interface Foo<T> extends Bar<T> { }
     * //                       ^^^^^^
     * class Foo<T> implements Bar<T> { }
     * //                      ^^^^^^
     * ```
     * @param {TSESTree.TSInterfaceHeritage|TSESTree.TSClassImplements} node
     */
    'TSInterfaceHeritage, TSClassImplements'(node) {
      if (node.typeParameters) {
        setOffset(
          tokenStore.getFirstToken(node.typeParameters),
          1,
          tokenStore.getFirstToken(node)
        )
      }
    },
    /**
     * Process enum
     *
     * e.g.
     * ```
     * enum Foo { }
     * ```
     */
    TSEnumDeclaration(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const idTokens = getFirstAndLastTokens(node.id)
      const prefixTokens = tokenStore.getTokensBetween(
        firstToken,
        idTokens.firstToken
      )
      setOffset(prefixTokens, 0, firstToken)
      setOffset(idTokens.firstToken, 1, firstToken)
      const leftBraceToken = tokenStore.getTokenAfter(idTokens.lastToken)
      const rightBraceToken = tokenStore.getLastToken(node)
      setOffset(leftBraceToken, 0, firstToken)
      processNodeList(node.members, leftBraceToken, rightBraceToken, 1)
    },
    TSModuleDeclaration(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const idTokens = getFirstAndLastTokens(node.id)
      const prefixTokens = tokenStore.getTokensBetween(
        firstToken,
        idTokens.firstToken
      )
      setOffset(prefixTokens, 0, firstToken)
      setOffset(idTokens.firstToken, 1, firstToken)
      if (node.body) {
        const bodyFirstToken = tokenStore.getFirstToken(node.body)
        setOffset(
          bodyFirstToken,
          isOpeningBraceToken(bodyFirstToken) ? 0 : 1,
          firstToken
        )
      }
    },
    TSMethodSignature(node) {
      // fn(arg: A): R | null;
      const firstToken = tokenStore.getFirstToken(node)
      const keyTokens = getFirstAndLastTokens(node.key)
      let keyLast
      if (node.computed) {
        const closeBracket = tokenStore.getTokenAfter(keyTokens.lastToken)
        processNodeList([node.key], firstToken, closeBracket, 1)
        keyLast = closeBracket
      } else {
        keyLast = keyTokens.lastToken
      }
      const leftParenToken = tokenStore.getTokenAfter(
        keyLast,
        isOpeningParenToken
      )
      setOffset(
        [
          ...tokenStore.getTokensBetween(keyLast, leftParenToken),
          leftParenToken
        ],
        1,
        firstToken
      )
      const rightParenToken = tokenStore.getTokenAfter(
        node.params[node.params.length - 1] || leftParenToken,
        isClosingParenToken
      )
      processNodeList(node.params, leftParenToken, rightParenToken, 1)
      if (node.returnType) {
        const typeAnnotationToken = tokenStore.getFirstToken(node.returnType)
        setOffset(
          [
            ...tokenStore.getTokensBetween(keyLast, typeAnnotationToken),
            typeAnnotationToken
          ],
          1,
          firstToken
        )
      }
    },
    /**
     * Process call signature declaration and construct signature declaration
     *
     * e.g.
     * ```
     * interface Foo {
     *   (): string;
     * //^^^^^^^^^^^
     *   <T> (e: E): R
     * //^^^^^^^^^^^^^
     * }
     * ```
     *
     * e.g.
     * ```
     * interface Foo {
     *   new ();
     * //^^^^^^^
     * }
     * interface A { new <T> (e: E): R }
     * //            ^^^^^^^^^^^^^^^^^
     * ```
     * @param {TSESTree.TSCallSignatureDeclaration | TSESTree.TSConstructSignatureDeclaration} node
     */
    'TSCallSignatureDeclaration, TSConstructSignatureDeclaration'(node) {
      const firstToken = tokenStore.getFirstToken(node)
      // new or < or (
      let currToken = firstToken
      if (node.type === 'TSConstructSignatureDeclaration') {
        // currToken is new token
        // < or (
        currToken = tokenStore.getTokenAfter(currToken)
        setOffset(currToken, 1, firstToken)
      }
      if (node.typeParameters) {
        // currToken is < token
        // (
        currToken = tokenStore.getTokenAfter(node.typeParameters)
        setOffset(currToken, 1, firstToken)
      }
      const leftParenToken = currToken
      const rightParenToken = tokenStore.getTokenAfter(
        node.params[node.params.length - 1] || leftParenToken,
        isClosingParenToken
      )
      processNodeList(node.params, leftParenToken, rightParenToken, 1)
      if (node.returnType) {
        const typeAnnotationToken = tokenStore.getFirstToken(node.returnType)
        setOffset(
          [
            ...tokenStore.getTokensBetween(
              rightParenToken,
              typeAnnotationToken
            ),
            typeAnnotationToken
          ],
          1,
          firstToken
        )
      }
    },
    /**
     * Process declare function and empty body function
     *
     * e.g.
     * ```
     * declare function foo();
     * ```
     *
     * e.g.
     * ```
     * class Foo {
     *   abstract fn();
     * //           ^^^
     * }
     * ```
     * @param {TSESTree.TSDeclareFunction | TSESTree.TSEmptyBodyFunctionExpression} node
     */
    'TSDeclareFunction, TSEmptyBodyFunctionExpression'(node) {
      const firstToken = tokenStore.getFirstToken(node)
      let leftParenToken, bodyBaseToken
      if (firstToken.type === 'Punctuator') {
        // method
        leftParenToken = firstToken
        bodyBaseToken = tokenStore.getFirstToken(node.parent)
      } else {
        let nextToken = tokenStore.getTokenAfter(firstToken)
        let nextTokenOffset = 0
        while (
          nextToken &&
          !isOpeningParenToken(nextToken) &&
          nextToken.value !== '<'
        ) {
          if (
            nextToken.value === '*' ||
            (node.id && nextToken.range[0] === node.id.range[0])
          ) {
            nextTokenOffset = 1
          }
          setOffset(nextToken, nextTokenOffset, firstToken)
          nextToken = tokenStore.getTokenAfter(nextToken)
        }

        leftParenToken = nextToken
        bodyBaseToken = firstToken
      }
      if (!isOpeningParenToken(leftParenToken) && node.typeParameters) {
        leftParenToken = tokenStore.getTokenAfter(node.typeParameters)
      }
      const rightParenToken = tokenStore.getTokenAfter(
        node.params[node.params.length - 1] || leftParenToken,
        isClosingParenToken
      )
      setOffset(leftParenToken, 1, bodyBaseToken)
      processNodeList(node.params, leftParenToken, rightParenToken, 1)
    },
    /**
     * Process type operator, type query and infer type
     *
     * e.g.
     * ```
     * type Foo = keyof Bar
     * //         ^^^^^^^^^
     * ```
     *
     * e.g.
     * ```
     * type T = typeof a
     * //       ^^^^^^^^
     * ```
     *
     * e.g.
     * ```
     * type Foo<T> = T extends Bar<infer U> ? U : T;
     * //                          ^^^^^^^
     * ```
     *
     * @param {TSESTree.TSTypeOperator | TSESTree.TSTypeQuery | TSESTree.TSInferType} node
     */
    'TSTypeOperator, TSTypeQuery, TSInferType'(node) {
      // keyof T
      // type T = typeof av
      // infer U
      const firstToken = tokenStore.getFirstToken(node)
      const nextToken = tokenStore.getTokenAfter(firstToken)
      setOffset(nextToken, 1, firstToken)
    },
    /**
     * Process type predicate
     *
     * e.g.
     * ```
     * function foo(value): value is string;
     * //                   ^^^^^^^^^^^^^^^
     * ```
     */
    TSTypePredicate(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const opToken = tokenStore.getTokenAfter(
        node.parameterName,
        isNotClosingParenToken
      )
      const rightToken =
        node.typeAnnotation &&
        getFirstAndLastTokens(node.typeAnnotation).firstToken
      setOffset(
        [opToken, rightToken],
        1,
        getFirstAndLastTokens(firstToken).firstToken
      )
    },
    /**
     * Process abstract method definition, abstract class property, enum member and class property
     *
     * e.g.
     * ```
     * class Foo {
     *   abstract fn()
     * //^^^^^^^^^^^^^
     *   abstract x
     * //^^^^^^^^^^
     *   x
     * //^
     * }
     * ```
     *
     * e.g.
     * ```
     * enum Foo { Bar = x }
     * //         ^^^^^^^
     * ```
     *
     * @param {TSESTree.TSAbstractMethodDefinition | TSESTree.TSAbstractClassProperty | TSESTree.TSEnumMember | TSESTree.ClassProperty} node
     *
     */
    'TSAbstractMethodDefinition, TSAbstractClassProperty, TSEnumMember, ClassProperty'(
      node
    ) {
      const { keyNode, valueNode } =
        node.type === 'TSEnumMember'
          ? { keyNode: node.id, valueNode: node.initializer }
          : { keyNode: node.key, valueNode: node.value }
      const firstToken = tokenStore.getFirstToken(node)
      const keyTokens = getFirstAndLastTokens(keyNode)
      const prefixTokens = tokenStore.getTokensBetween(
        firstToken,
        keyTokens.firstToken
      )
      if (node.computed) {
        prefixTokens.pop() // pop [
      }
      setOffset(prefixTokens, 0, firstToken)
      let lastKeyToken
      if (node.computed) {
        const leftBracketToken = tokenStore.getTokenBefore(keyTokens.firstToken)
        const rightBracketToken = (lastKeyToken = tokenStore.getTokenAfter(
          keyTokens.lastToken
        ))
        setOffset(leftBracketToken, 0, firstToken)
        processNodeList([keyNode], leftBracketToken, rightBracketToken, 1)
      } else {
        setOffset(keyTokens.firstToken, 0, firstToken)
        lastKeyToken = keyTokens.lastToken
      }

      if (valueNode != null) {
        const initToken = tokenStore.getFirstToken(valueNode)
        setOffset(
          [...tokenStore.getTokensBetween(lastKeyToken, initToken), initToken],
          1,
          lastKeyToken
        )
      }
    },

    /**
     * Process optional type, non-null expression and JSDocNonNullableType
     *
     * e.g.
     * ```
     * type Foo = [number?]
     * //          ^^^^^^^
     * const a = v!
     * //        ^
     * type T = U!
     * //       ^^
     * ```
     *
     * @param {TSESTree.TSOptionalType, TSESTree.TSNonNullExpression} node
     */
    'TSOptionalType, TSNonNullExpression, TSJSDocNonNullableType'(node) {
      setOffset(
        tokenStore.getLastToken(node),
        1,
        tokenStore.getFirstToken(node)
      )
    },
    TSTypeAssertion(node) {
      // <const>
      const firstToken = tokenStore.getFirstToken(node)
      const expressionToken = getFirstAndLastTokens(node.expression).firstToken
      processNodeList(
        [node.typeAnnotation],
        firstToken,
        tokenStore.getTokenBefore(expressionToken),
        1
      )
      setOffset(expressionToken, 1, firstToken)
    },
    /**
     * Process import type
     *
     * e.g.
     * ```
     * const foo: import('foo').Bar<T>
     * //         ^^^^^^^^^^^^^^^^^^^^
     * ```
     */
    TSImportType(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const leftParenToken = tokenStore.getTokenAfter(
        firstToken,
        isOpeningParenToken
      )
      setOffset(leftParenToken, 1, firstToken)
      const rightParenToken = tokenStore.getTokenAfter(
        node.parameter,
        isClosingParenToken
      )
      processNodeList([node.parameter], leftParenToken, rightParenToken, 1)
      if (node.qualifier) {
        const dotToken = tokenStore.getTokenBefore(node.qualifier)
        const propertyToken = tokenStore.getTokenAfter(dotToken)
        setOffset([dotToken, propertyToken], 1, firstToken)
      }
      if (node.typeParameters) {
        setOffset(tokenStore.getFirstToken(node.typeParameters), 1, firstToken)
      }
    },
    TSParameterProperty(node) {
      // constructor(private a)
      const firstToken = tokenStore.getFirstToken(node)
      const parameterToken = tokenStore.getFirstToken(node.parameter)
      setOffset(
        [
          ...tokenStore.getTokensBetween(firstToken, parameterToken),
          parameterToken
        ],
        1,
        firstToken
      )
    },
    /**
     * Process import equal
     *
     * e.g.
     * ```
     * import foo = require('foo')
     * ```
     */
    TSImportEqualsDeclaration(node) {
      const importToken = tokenStore.getFirstToken(node)
      const idTokens = getFirstAndLastTokens(node.id)
      setOffset(idTokens.firstToken, 1, importToken)
      const opToken = tokenStore.getTokenAfter(idTokens.lastToken)
      setOffset(
        [opToken, tokenStore.getFirstToken(node.moduleReference)],
        1,
        idTokens.lastToken
      )
    },
    /**
     * Process external module reference
     *
     * e.g.
     * ```
     * import foo = require('foo')
     * //           ^^^^^^^^^^^^^^
     * ```
     */
    TSExternalModuleReference(node) {
      const requireToken = tokenStore.getFirstToken(node)
      const leftParenToken = tokenStore.getTokenAfter(
        requireToken,
        isOpeningParenToken
      )
      const rightParenToken = tokenStore.getLastToken(node)
      setOffset(leftParenToken, 1, requireToken)
      processNodeList([node.expression], leftParenToken, rightParenToken, 1)
    },
    /**
     * Process export assignment
     *
     * e.g.
     * ```
     * export = foo
     * ```
     */
    TSExportAssignment(node) {
      const exportNode = tokenStore.getFirstToken(node)
      const exprTokens = getFirstAndLastTokens(node.expression)
      const opToken = tokenStore.getTokenBefore(exprTokens.firstToken)
      setOffset([opToken, exprTokens.firstToken], 1, exportNode)
    },
    TSNamedTupleMember(node) {
      // [a: string, ...b: string[]]
      //  ^^^^^^^^^
      const labelToken = tokenStore.getFirstToken(node)
      const elementTokens = getFirstAndLastTokens(node.elementType)
      setOffset(
        [
          ...tokenStore.getTokensBetween(labelToken, elementTokens.firstToken),
          elementTokens.firstToken
        ],
        1,
        labelToken
      )
    },
    TSRestType(node) {
      // [a: string, ...b: string[]]
      //             ^^^^^^^^^^^^^^
      const firstToken = tokenStore.getFirstToken(node)
      const nextToken = tokenStore.getTokenAfter(firstToken)
      setOffset(nextToken, 1, firstToken)
    },
    TSNamespaceExportDeclaration(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const idToken = tokenStore.getFirstToken(node.id)
      setOffset(
        [...tokenStore.getTokensBetween(firstToken, idToken), idToken],
        1,
        firstToken
      )
    },
    TSTemplateLiteralType(node) {
      const firstToken = tokenStore.getFirstToken(node)
      const quasiTokens = node.quasis
        .slice(1)
        .map((n) => tokenStore.getFirstToken(n))
      const expressionToken = node.quasis
        .slice(0, -1)
        .map((n) => tokenStore.getTokenAfter(n))
      setOffset(quasiTokens, 0, firstToken)
      setOffset(expressionToken, 1, firstToken)
    },
    // ----------------------------------------------------------------------
    // NON-STANDARD NODES
    // ----------------------------------------------------------------------
    Decorator(node) {
      // @Decorator
      const [atToken, secondToken] = tokenStore.getFirstTokens(node, {
        count: 2,
        includeComments: false
      })
      setOffset(secondToken, 0, atToken)
      const parent = node.parent
      const { decorators } = parent
      if (!decorators || decorators.length === 0) {
        return
      }
      if (decorators[0] === node) {
        if (parent.range[0] === node.range[0]) {
          const startParentToken = tokenStore.getTokenAfter(
            decorators[decorators.length - 1]
          )
          setOffset(startParentToken, 0, atToken)
        } else {
          const startParentToken = tokenStore.getFirstToken(parent)
          copyOffset(atToken, startParentToken)
        }
      } else {
        setOffset(atToken, 0, tokenStore.getFirstToken(decorators[0]))
      }
    },
    // ----------------------------------------------------------------------
    // SINGLE TOKEN NODES
    // ----------------------------------------------------------------------
    // VALUES KEYWORD
    TSAnyKeyword() {},
    TSBigIntKeyword() {},
    TSBooleanKeyword() {},
    TSNeverKeyword() {},
    TSNullKeyword() {},
    TSNumberKeyword() {},
    TSObjectKeyword() {},
    TSStringKeyword() {},
    TSSymbolKeyword() {},
    TSUndefinedKeyword() {},
    TSUnknownKeyword() {},
    TSVoidKeyword() {},
    // MODIFIERS KEYWORD
    TSAbstractKeyword() {},
    TSAsyncKeyword() {},
    TSPrivateKeyword() {},
    TSProtectedKeyword() {},
    TSPublicKeyword() {},
    TSReadonlyKeyword() {},
    TSStaticKeyword() {},
    // OTHERS KEYWORD
    TSDeclareKeyword() {},
    TSExportKeyword() {},
    TSIntrinsicKeyword() {},
    // OTHERS
    TSThisType() {},
    // ----------------------------------------------------------------------
    // WRAPPER NODES
    // ----------------------------------------------------------------------
    TSLiteralType() {},
    // ----------------------------------------------------------------------
    // JSX
    // ----------------------------------------------------------------------
    JSXElement(node) {
      processNodeList(
        node.children,
        node.openingElement,
        node.closingElement,
        1
      )
    },
    JSXFragment(node) {
      processNodeList(
        node.children,
        node.openingFragment,
        node.closingFragment,
        1
      )
    },
    JSXOpeningElement(node) {
      const openToken = tokenStore.getFirstToken(node)
      const closeToken = tokenStore.getLastToken(node)
      const nameToken = tokenStore.getFirstToken(node.name)
      setOffset(nameToken, 1, openToken)
      if (node.typeParameters) {
        setOffset(tokenStore.getFirstToken(node.typeParameters), 1, nameToken)
      }
      for (const attr of node.attributes) {
        setOffset(tokenStore.getFirstToken(attr), 1, openToken)
      }
      if (node.selfClosing) {
        const slash = tokenStore.getTokenBefore(closeToken)
        if (slash.value === '/') {
          setOffset(slash, 0, openToken)
        }
      }
      setOffset(closeToken, 0, openToken)
    },
    JSXClosingElement(node) {
      const openToken = tokenStore.getFirstToken(node)
      const slash = tokenStore.getTokenAfter(openToken)
      if (slash.value === '/') {
        setOffset(slash, 0, openToken)
      }
      const closeToken = tokenStore.getLastToken(node)
      const nameToken = tokenStore.getFirstToken(node.name)
      setOffset(nameToken, 1, openToken)
      setOffset(closeToken, 0, openToken)
    },
    /** @param {TSESTree.JSXOpeningFragment | TSESTree.JSXClosingFragment} node */
    'JSXOpeningFragment, JSXClosingFragment'(node) {
      const [firstToken, ...tokens] = tokenStore.getTokens(node)
      setOffset(tokens, 0, firstToken)
    },
    JSXAttribute(node) {
      if (!node.value) {
        return
      }
      const keyToken = tokenStore.getFirstToken(node)
      const eqToken = tokenStore.getTokenAfter(node.name)
      setOffset(eqToken, 1, keyToken)
      setOffset(tokenStore.getFirstToken(node.value), 1, keyToken)
    },
    JSXExpressionContainer(node) {
      processNodeList(
        [node.expression],
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    JSXSpreadAttribute(node) {
      processNodeList(
        [node.argument],
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    JSXSpreadChild(node) {
      processNodeList(
        [node.expression],
        tokenStore.getFirstToken(node),
        tokenStore.getLastToken(node),
        1
      )
    },
    JSXMemberExpression(node) {
      const objectToken = tokenStore.getFirstToken(node)
      const dotToken = tokenStore.getTokenBefore(node.property)
      const propertyToken = tokenStore.getTokenAfter(dotToken)
      setOffset([dotToken, propertyToken], 1, objectToken)
    },
    // ----------------------------------------------------------------------
    // JSX SINGLE TOKEN NODES
    // ----------------------------------------------------------------------
    JSXEmptyExpression() {},
    JSXIdentifier() {},
    JSXNamespacedName() {},
    JSXText() {}
  }
}

/**
 * Check whether the given node or token is the beginning of a line.
 */
function isBeginningOfLine(tokenStore, node) {
  const prevToken = tokenStore.getTokenBefore(node, { includeComments: false })
  return !prevToken || prevToken.loc.end.line < node.loc.start.line
}
