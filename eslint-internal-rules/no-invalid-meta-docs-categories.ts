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
 * Extracts the `meta` property from the ObjectExpression that all rules export.
 */
function getMetaPropertyFromExportsNode(exportsNode: ASTNode | undefined) {
  return getPropertyFromObject('meta', exportsNode)
}

/**
 * Checks the validity of the meta definition of this rule and reports any errors found.
 */
function checkMetaValidity(
  context: RuleContext,
  exportsNode: ASTNode | undefined
) {
  const metaProperty = getMetaPropertyFromExportsNode(exportsNode)
  if (!metaProperty) {
    return
  }

  const metaDocs = getPropertyFromObject('docs', metaProperty.value)
  if (!metaDocs) {
    return
  }

  const categories = getPropertyFromObject('categories', metaDocs.value)
  if (!categories) {
    context.report({
      node: metaDocs,
      messageId: 'missingCategories',
      fix(fixer) {
        const category = getPropertyFromObject('category', metaDocs.value)
        if (!category) {
          return null
        }
        const fixes = [fixer.replaceText(category.key, 'categories')]
        if (
          category.value &&
          category.value.type === 'Literal' &&
          typeof category.value.value === 'string'
        ) {
          // fixes.push(fixer.insertTextBefore(category.value, '['), fixer.insertTextAfter(category.value, ']'))

          fixes.push(
            fixer.insertTextBefore(
              category.value,
              category.value.value === 'base'
                ? '['
                : `['vue3-${category.value.value}', ` // for vue3 migration
            ),
            fixer.insertTextAfter(category.value, ']')
          )
        }
        return fixes
      }
    })
    return
  }

  if (
    categories.value &&
    categories.value.type !== 'ArrayExpression' &&
    !(categories.value.type === 'Literal' && categories.value.value == null) &&
    !(
      categories.value.type === 'Identifier' &&
      categories.value.name === 'undefined'
    )
  ) {
    context.report({
      node: categories.value,
      messageId: 'categoriesMustBeArray'
    })
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce correct use of `meta` property in core rules',
      categories: ['Internal']
    },
    // eslint-disable-next-line eslint-plugin/require-meta-fixable -- fixer is not recognized
    fixable: 'code',
    schema: [],
    messages: {
      missingCategories: 'Rule is missing a meta.docs.categories property.',
      // eslint-disable-next-line eslint-plugin/report-message-format
      categoriesMustBeArray: 'meta.docs.categories must be an array.'
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
