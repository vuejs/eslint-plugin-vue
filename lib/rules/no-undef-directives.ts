/**
 * @author rzzf
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import casing from '../utils/casing.js'
import { toRegExpGroupMatcher } from '../utils/regexp.ts'

function getRegisteredDirectives(
  componentObject: ObjectExpression
): { node: Property; name: string }[] {
  const directivesNode = componentObject.properties.find(
    (p) =>
      p.type === 'Property' &&
      utils.getStaticPropertyName(p) === 'directives' &&
      p.value.type === 'ObjectExpression'
  )

  if (
    !directivesNode ||
    directivesNode.type !== 'Property' ||
    directivesNode.value.type !== 'ObjectExpression'
  ) {
    return []
  }

  return directivesNode.value.properties.flatMap((node) => {
    const name =
      node.type === 'Property' ? utils.getStaticPropertyName(node) : null
    return name ? [{ node: node as Property, name }] : []
  })
}

function isDefinedInSetup(rawName: string, definedNames: Set<string>) {
  const camelName = casing.camelCase(rawName)
  const variableName = `v${casing.capitalize(camelName)}`
  return definedNames.has(variableName)
}

function isDefinedInOptions(rawName: string, definedNames: Set<string>) {
  const camelName = casing.camelCase(rawName)

  if (definedNames.has(rawName)) {
    return true
  }

  // allow case-insensitive only when the directive name itself contains capitalized letters
  for (const name of definedNames) {
    const lowercaseName = name.toLowerCase()
    if (name !== lowercaseName && lowercaseName === camelName.toLowerCase()) {
      return true
    }
  }

  return false
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of undefined custom directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-undef-directives.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      undef: "The 'v-{{name}}' directive has been used, but not defined."
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const { ignore = [] } = options
    const isAnyIgnored = toRegExpGroupMatcher(ignore)

    /**
     * Check whether the given directive name is a verify target or not.
     */
    function isVerifyTargetDirective(rawName: string): boolean {
      const kebabName = casing.kebabCase(rawName)
      if (
        utils.isBuiltInDirectiveName(rawName) ||
        isAnyIgnored(rawName, kebabName)
      ) {
        return false
      }
      return true
    }

    function createTemplateBodyVisitor(
      isDefined: (rawName: string) => boolean
    ): TemplateListener {
      return {
        'VAttribute[directive=true]'(node: VDirective) {
          const name = node.key.name.name
          if (utils.isBuiltInDirectiveName(name)) {
            return
          }
          const rawName = node.key.name.rawName || name
          if (isVerifyTargetDirective(rawName) && !isDefined(rawName)) {
            context.report({
              node: node.key,
              messageId: 'undef',
              data: {
                name: rawName
              }
            })
          }
        }
      }
    }

    const definedInOptionDirectives = new Set<string>()

    if (utils.isScriptSetup(context)) {
      // For <script setup>
      const definedInSetupDirectives = new Set<string>()

      const globalScope = context.sourceCode.scopeManager.globalScope
      if (globalScope) {
        for (const variable of globalScope.variables) {
          definedInSetupDirectives.add(variable.name)
        }
        const moduleScope = globalScope.childScopes.find(
          (scope) => scope.type === 'module'
        )
        for (const variable of moduleScope?.variables ?? []) {
          definedInSetupDirectives.add(variable.name)
        }
      }

      const scriptVisitor = utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          for (const directive of getRegisteredDirectives(node)) {
            definedInOptionDirectives.add(directive.name)
          }
        }
      })

      const templateBodyVisitor = createTemplateBodyVisitor(
        (rawName) =>
          isDefinedInSetup(rawName, definedInSetupDirectives) ||
          isDefinedInOptions(rawName, definedInOptionDirectives)
      )

      return utils.defineTemplateBodyVisitor(
        context,
        templateBodyVisitor,
        scriptVisitor
      )
    }

    // For Options API
    const scriptVisitor = utils.executeOnVue(context, (obj) => {
      for (const directive of getRegisteredDirectives(obj)) {
        definedInOptionDirectives.add(directive.name)
      }
    })

    const templateBodyVisitor = createTemplateBodyVisitor((rawName) =>
      isDefinedInOptions(rawName, definedInOptionDirectives)
    )

    return utils.defineTemplateBodyVisitor(
      context,
      templateBodyVisitor,
      scriptVisitor
    )
  }
}
