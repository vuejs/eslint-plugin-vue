/**
 * @author Przemysław Jan Beigert
 * See LICENSE file in root directory for full license.
 */
import type { ComponentProp } from '../utils/index.js'
import utils from '../utils/index.js'

const checkPropIdentifierType = (
  context: RuleContext,
  identifierNode: Identifier
) => {
  if (identifierNode.name !== 'Object' && identifierNode.name !== 'Array') {
    return
  }

  const arrayTypeSuggestion = identifierNode.name === 'Array' ? '[]' : ''
  context.report({
    node: identifierNode,
    messageId: 'expectedTypeAnnotation',
    suggest: [
      {
        messageId: 'addTypeAnnotation',
        data: { type: `any${arrayTypeSuggestion}` },
        fix(fixer) {
          return fixer.insertTextAfter(
            identifierNode,
            ` as PropType<any${arrayTypeSuggestion}>`
          )
        }
      },
      {
        messageId: 'addTypeAnnotation',
        data: { type: `unknown${arrayTypeSuggestion}` },
        fix(fixer) {
          return fixer.insertTextAfter(
            identifierNode,
            ` as PropType<unknown${arrayTypeSuggestion}>`
          )
        }
      }
    ]
  })
}

const checkPropArrayType = (
  context: RuleContext,
  arrayNode: ArrayExpression
) => {
  for (const elementNode of arrayNode.elements) {
    if (elementNode?.type === 'Identifier') {
      checkPropIdentifierType(context, elementNode)
    }
  }
}

const checkPropObjectType = (
  context: RuleContext,
  objectNode: ObjectExpression
) => {
  const typeProperty = objectNode.properties.find(
    (prop) =>
      prop.type === 'Property' &&
      prop.key.type === 'Identifier' &&
      prop.key.name === 'type'
  )
  if (!typeProperty || typeProperty.type !== 'Property') {
    return
  }

  if (typeProperty.value.type === 'Identifier') {
    // `foo: { type: String }`
    checkPropIdentifierType(context, typeProperty.value)
  } else if (typeProperty.value.type === 'ArrayExpression') {
    // `foo: { type: [String, Boolean] }`
    checkPropArrayType(context, typeProperty.value)
  }
}

const checkProp = (prop: ComponentProp, context: RuleContext) => {
  if (prop.type !== 'object') {
    return
  }

  switch (prop.node.value.type) {
    case 'Identifier': {
      // e.g. `foo: String`
      checkPropIdentifierType(context, prop.node.value)
      break
    }
    case 'ArrayExpression': {
      // e.g. `foo: [String, Boolean]`
      checkPropArrayType(context, prop.node.value)
      break
    }
    case 'ObjectExpression': {
      // e.g. `foo: { type: … }`
      checkPropObjectType(context, prop.node.value)
      return
    }
  }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce adding type declarations to object props',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-typed-object-prop.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      expectedTypeAnnotation: 'Expected type annotation on object prop.',
      addTypeAnnotation: 'Add `{{ type }}` type annotation.'
    }
  },
  create(context: RuleContext) {
    const filename = context.filename
    if (!utils.isVueFile(filename) && !utils.isTypeScriptFile(filename)) {
      return {}
    }

    if (utils.isVueFile(filename)) {
      const sourceCode = context.sourceCode
      const documentFragment =
        sourceCode.parserServices.getDocumentFragment &&
        sourceCode.parserServices.getDocumentFragment()
      if (!documentFragment) {
        return {}
      }
      const scripts = documentFragment.children.filter(
        (element): element is VElement =>
          utils.isVElement(element) && element.name === 'script'
      )
      if (
        scripts.every((script) => !utils.hasAttribute(script, 'lang', 'ts'))
      ) {
        return {}
      }
    }

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          for (const prop of props) {
            checkProp(prop, context)
          }
        }
      }),
      utils.executeOnVue(context, (obj) => {
        const props = utils.getComponentPropsFromOptions(obj)

        for (const prop of props) {
          checkProp(prop, context)
        }
      })
    )
  }
}
