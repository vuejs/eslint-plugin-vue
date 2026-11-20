/**
 * @fileoverview Internal rule to prevent missing or invalid meta property in core rules.
 * @author Vitor Balocco
 */

/**
 * Gets the property of the Object node passed in that has the name specified.
 */
function getPropertyFromObject(
  propertyName: string,
  node: ASTNode | undefined
): Property | null {
  if (node && node.type === 'ObjectExpression') {
    for (const property of node.properties) {
      if (
        property.type === 'Property' &&
        property.key.type === 'Identifier' &&
        property.key.name === propertyName
      ) {
        return property
      }
    }
  }
  return null
}

/**
 * Checks the validity of the meta definition of this rule and reports any errors found.
 */
function checkMetaValidity(
  context: RuleContext,
  exportsNode: ASTNode | undefined
) {
  const metaProperty = getPropertyFromObject('meta', exportsNode)
  if (!metaProperty) {
    context.report({
      node: exportsNode!,
      messageId: 'missingMeta'
    })
    return
  }

  const metaDocs = getPropertyFromObject('docs', metaProperty.value)
  if (!metaDocs) {
    context.report({
      node: metaProperty,
      messageId: 'missingMetaDocs'
    })
    return
  }

  const metaDocsCategories = getPropertyFromObject('categories', metaDocs.value)
  if (!metaDocsCategories) {
    context.report({
      node: metaDocs,
      messageId: 'missingMetaDocsCategories'
    })
    return
  }

  const metaDocsRecommended = getPropertyFromObject(
    'recommended',
    metaDocs.value
  )
  if (!metaDocsRecommended) {
    return
  }

  context.report({
    node: metaDocsRecommended,
    messageId: 'invalidMetaDocsRecommended'
  })
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce correct use of `meta` property in core rules',
      categories: ['Internal']
    },
    schema: [],
    messages: {
      missingMeta: 'Rule is missing a meta property.',
      missingMetaDocs: 'Rule is missing a meta.docs property.',
      missingMetaDocsCategories:
        'Rule is missing a meta.docs.categories property.',
      invalidMetaDocsRecommended:
        'Rule should not have a meta.docs.recommended property.'
    },
    languages: ['js/js']
  },

  create(context: RuleContext) {
    let exportsNode: ASTNode | undefined

    return {
      AssignmentExpression(node: AssignmentExpression) {
        if (
          node.left &&
          node.right &&
          node.left.type === 'MemberExpression' &&
          node.left.object.type === 'Identifier' &&
          node.left.object.name === 'module' &&
          node.left.property.type === 'Identifier' &&
          node.left.property.name === 'exports'
        ) {
          exportsNode = node.right
        }
      },

      ExportDefaultDeclaration(node: ExportDefaultDeclaration) {
        exportsNode = node.declaration
      },

      'Program:exit'() {
        checkMetaValidity(context, exportsNode)
      }
    }
  }
}
