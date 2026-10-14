/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 * See LICENSE file in root directory for full license.
 */
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { kebabCase, pascalCase } from '../utils/casing.ts'

function getExpectedNames(identifier: Identifier): string[] {
  return [pascalCase(identifier.name), kebabCase(identifier.name)]
}

/**
 * Checks whether the registered name (or its PascalCase form) is already
 * declared in the file, e.g. by another import or a type.
 */
function isConflictingName(
  context: RuleContext,
  node: ESNode,
  registeredName: string
): boolean {
  const scope = utils.getScope(context, node)
  return [registeredName, pascalCase(registeredName)].some((name) => {
    const variable = findVariable(scope, name)
    return variable != null && variable.defs.length > 0
  })
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require the registered component name to match the imported component name',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/match-component-import-name.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoreConflictingNames: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected:
        'Component alias {{importedName}} should be one of: {{expectedName}}.'
    }
  },
  create(context: RuleContext): RuleListener {
    const options = context.options[0] || {}
    const shouldIgnoreConflictingNames = options.ignoreConflictingNames === true

    return utils.executeOnVueComponent(context, (obj) => {
      const components = utils.findProperty(obj, 'components')
      if (
        !components ||
        !components.value ||
        components.value.type !== 'ObjectExpression'
      ) {
        return
      }

      for (const property of components.value.properties) {
        if (
          property.type === 'SpreadElement' ||
          property.value.type !== 'Identifier' ||
          property.computed === true
        ) {
          continue
        }

        const importedName = utils.getStaticPropertyName(property) || ''
        const expectedNames = getExpectedNames(property.value)
        if (
          !expectedNames.includes(importedName) &&
          !(
            shouldIgnoreConflictingNames &&
            isConflictingName(context, property, importedName)
          )
        ) {
          context.report({
            node: property,
            messageId: 'unexpected',
            data: {
              importedName,
              expectedName: expectedNames.join(', ')
            }
          })
        }
      }
    })
  }
}
