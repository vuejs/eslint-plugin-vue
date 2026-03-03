/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import type { ComponentProp } from '../utils/index.js'
import utils from '../utils/index.js'
import { toRegExp } from '../utils/regexp.ts'

interface ParsedOption {
  test: (name: string) => boolean
  message?: string
  suggest?: string
}

function parseOption(
  option: string | { name: string; message?: string; suggest?: string }
): ParsedOption {
  if (typeof option === 'string') {
    const matcher = toRegExp(option, { remove: 'g' })
    return {
      test(name) {
        return matcher.test(name)
      }
    }
  }
  const parsed = parseOption(option.name)
  parsed.message = option.message
  parsed.suggest = option.suggest
  return parsed
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow specific props',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-restricted-props.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { type: ['string'] },
          {
            type: 'object',
            properties: {
              name: { type: 'string' },
              message: { type: 'string', minLength: 1 },
              suggest: { type: 'string' }
            },
            required: ['name'],
            additionalProperties: false
          }
        ]
      },
      uniqueItems: true,
      minItems: 0
    },

    messages: {
      // eslint-disable-next-line eslint-plugin/report-message-format
      restrictedProp: '{{message}}',
      instead: 'Instead, change to `{{suggest}}`.'
    }
  },
  create(context: RuleContext) {
    const options: ParsedOption[] = context.options.map(parseOption)

    function processProps(
      props: ComponentProp[],
      fixPropInOtherPlaces?: (
        fixer: RuleFixer,
        propName: string,
        replaceKeyText: string
      ) => Iterable<Fix>
    ) {
      for (const prop of props) {
        if (!prop.propName) {
          continue
        }

        for (const option of options) {
          if (option.test(prop.propName)) {
            const message =
              option.message ||
              `Using \`${prop.propName}\` props is not allowed.`
            context.report({
              node: prop.type === 'infer-type' ? prop.node : prop.key,
              messageId: 'restrictedProp',
              data: { message },
              suggest:
                prop.type === 'infer-type'
                  ? null
                  : createSuggest(
                      prop.key,
                      option,
                      fixPropInOtherPlaces
                        ? (fixer, replaceKeyText) =>
                            fixPropInOtherPlaces(
                              fixer,
                              prop.propName,
                              replaceKeyText
                            )
                        : undefined
                    )
            })
            break
          }
        }
      }
    }
    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          processProps(props, fixPropInOtherPlaces)

          function fixPropInOtherPlaces(
            fixer: RuleFixer,
            propName: string,
            replaceKeyText: string
          ) {
            const propertyNodes: (Property | AssignmentProperty)[] = []
            const withDefault = utils.getWithDefaultsProps(node)[propName]
            if (withDefault) {
              propertyNodes.push(withDefault)
            }
            const propDestructure = utils.getPropsDestructure(node)[propName]
            if (propDestructure) {
              propertyNodes.push(propDestructure)
            }
            return propertyNodes.map((propertyNode) =>
              propertyNode.shorthand
                ? fixer.insertTextBefore(
                    propertyNode.value,
                    `${replaceKeyText}:`
                  )
                : fixer.replaceText(propertyNode.key, replaceKeyText)
            )
          }
        }
      }),
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          processProps(utils.getComponentPropsFromOptions(node))
        }
      })
    )
  }
}

function createSuggest(
  node: Expression,
  option: ParsedOption,
  fixPropInOtherPlaces?: (
    fixer: RuleFixer,
    replaceKeyText: string
  ) => Iterable<Fix>
): Rule.SuggestionReportDescriptor[] {
  if (!option.suggest) {
    return []
  }

  let replaceText: string
  if (node.type === 'Literal' || node.type === 'TemplateLiteral') {
    replaceText = JSON.stringify(option.suggest)
  } else if (node.type === 'Identifier') {
    replaceText = /^[a-z]\w*$/iu.test(option.suggest)
      ? option.suggest
      : JSON.stringify(option.suggest)
  } else {
    return []
  }

  return [
    {
      fix(fixer) {
        const fixes = [fixer.replaceText(node, replaceText)]
        if (fixPropInOtherPlaces) {
          fixes.push(...fixPropInOtherPlaces(fixer, replaceText))
        }
        return fixes.sort((a, b) => a.range[0] - b.range[0])
      },
      messageId: 'instead',
      data: { suggest: option.suggest }
    }
  ]
}
