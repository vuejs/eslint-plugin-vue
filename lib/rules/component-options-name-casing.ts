/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'
import {
  allowedCaseOptions,
  getChecker,
  getConverter
} from '../utils/casing.ts'

function getOptionsComponentName(node: Expression): string | null {
  if (node.type === 'Identifier') {
    return node.name
  }
  return utils.isStringLiteral(node) ? utils.getStringLiteralValue(node) : null
}

function replaceProperty(
  fixer: RuleFixer,
  sourceCode: SourceCode,
  property: Property,
  text: string,
  name: string
) {
  if (property.shorthand) {
    return fixer.replaceText(property, `${text}: ${name}`)
  }

  const fixes = [fixer.replaceText(property.key, text)]
  if (property.computed && utils.isStringLiteral(property.key)) {
    fixes.push(
      fixer.remove(sourceCode.getTokenBefore(property.key)!),
      fixer.remove(sourceCode.getTokenAfter(property.key)!)
    )
  }
  return fixes
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce the casing of component name in `components` options',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/component-options-name-casing.html'
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [{ enum: allowedCaseOptions }],
    messages: {
      caseNotMatched: 'Component name "{{component}}" is not {{caseType}}.',
      possibleRenaming: 'Rename component name to be in {{caseType}}.'
    }
  },
  create(context: RuleContext) {
    const caseType = context.options[0] || 'PascalCase'
    const sourceCode = context.sourceCode

    const canAutoFix = caseType === 'PascalCase'
    const checkCase = getChecker(caseType)
    const convert = getConverter(caseType)

    return utils.executeOnVue(context, (obj) => {
      const node = utils.findProperty(obj, 'components')
      if (!node || node.value.type !== 'ObjectExpression') {
        return
      }

      for (const property of node.value.properties) {
        if (property.type !== 'Property') {
          continue
        }

        const name = getOptionsComponentName(property.key)
        if (!name || checkCase(name)) {
          continue
        }

        context.report({
          node: property.key,
          messageId: 'caseNotMatched',
          data: {
            component: name,
            caseType
          },
          fix: canAutoFix
            ? (fixer) => {
                const converted = convert(name)
                return replaceProperty(
                  fixer,
                  sourceCode,
                  property,
                  converted,
                  name
                )
              }
            : undefined,
          suggest: canAutoFix
            ? undefined
            : [
                {
                  messageId: 'possibleRenaming',
                  data: { caseType },
                  fix: (fixer) => {
                    const converted = convert(name)
                    return replaceProperty(
                      fixer,
                      sourceCode,
                      property,
                      caseType === 'kebab-case' ? `'${converted}'` : converted,
                      name
                    )
                  }
                }
              ]
        })
      }
    })
  }
}
