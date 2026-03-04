/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import semver from 'semver'
import utils from '../utils/index.js'
import slotScopeAttribute from './syntaxes/slot-scope-attribute.js'
import dynamicDirectiveArguments from './syntaxes/dynamic-directive-arguments.js'
import vSlot from './syntaxes/v-slot.js'
import scriptSetup from './syntaxes/script-setup.js'
import styleCssVarsInjection from './syntaxes/style-css-vars-injection.ts'
import vModelArgument from './syntaxes/v-model-argument.js'
import vModelCustomModifiers from './syntaxes/v-model-custom-modifiers.js'
import vIs from './syntaxes/v-is.js'
import isAttributeWithVuePrefix from './syntaxes/is-attribute-with-vue-prefix.js'
import vMemo from './syntaxes/v-memo.js'
import vBindPropModifierShorthand from './syntaxes/v-bind-prop-modifier-shorthand.js'
import vBindAttrModifier from './syntaxes/v-bind-attr-modifier.js'
import defineOptions from './syntaxes/define-options.js'
import defineSlots from './syntaxes/define-slots.js'
import defineModel from './syntaxes/define-model.js'
import vBindSameNameShorthand from './syntaxes/v-bind-same-name-shorthand.js'

interface SyntaxRule {
  supported: string
  createTemplateBodyVisitor?: (context: RuleContext) => TemplateListener
  createScriptVisitor?: (context: RuleContext) => RuleListener
}

const FEATURES = {
  // Vue.js 2.5.0+
  'slot-scope-attribute': slotScopeAttribute,
  // Vue.js 2.6.0+
  'dynamic-directive-arguments': dynamicDirectiveArguments,
  'v-slot': vSlot,
  // Vue.js 2.7.0+
  'script-setup': scriptSetup,
  'style-css-vars-injection': styleCssVarsInjection,
  // Vue.js 3.0.0+
  'v-model-argument': vModelArgument,
  'v-model-custom-modifiers': vModelCustomModifiers,
  'v-is': vIs,
  // Vue.js 3.1.0+
  'is-attribute-with-vue-prefix': isAttributeWithVuePrefix,
  // Vue.js 3.2.0+
  'v-memo': vMemo,
  'v-bind-prop-modifier-shorthand': vBindPropModifierShorthand,
  'v-bind-attr-modifier': vBindAttrModifier,
  // Vue.js 3.3.0+
  'define-options': defineOptions,
  'define-slots': defineSlots,
  // Vue.js 3.4.0+
  'define-model': defineModel,
  'v-bind-same-name-shorthand': vBindSameNameShorthand
} satisfies Record<string, SyntaxRule>

const SYNTAX_NAMES = Object.keys(FEATURES) as (keyof typeof FEATURES)[]

const cache = new Map()
/**
 * Get the `semver.Range` object of a given range text.
 * It's null if the `x` is not a valid range text.
 */
function getSemverRange(x: string): semver.Range {
  const s = String(x)
  let ret = cache.get(s) || null

  if (!ret) {
    try {
      ret = new semver.Range(s)
    } catch {
      // Ignore parsing error.
    }
    cache.set(s, ret)
  }

  return ret
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow unsupported Vue.js syntax on the specified version',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-unsupported-features.html'
    },
    // eslint-disable-next-line eslint-plugin/require-meta-fixable -- fixer is not recognized
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          version: {
            type: 'string'
          },
          ignores: {
            type: 'array',
            items: {
              enum: SYNTAX_NAMES
            },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      // Vue.js 2.5.0+
      forbiddenSlotScopeAttribute:
        '`slot-scope` are not supported except Vue.js ">=2.5.0 <3.0.0".',
      // Vue.js 2.6.0+
      forbiddenDynamicDirectiveArguments:
        'Dynamic arguments are not supported until Vue.js "2.6.0".',
      forbiddenVSlot: '`v-slot` are not supported until Vue.js "2.6.0".',
      // Vue.js 2.7.0+
      forbiddenScriptSetup:
        '`<script setup>` is not supported until Vue.js "2.7.0".',
      forbiddenStyleCssVarsInjection:
        'SFC CSS variable injection is not supported until Vue.js ">=3.0.3 || >=2.7.0 <3.0.0".',
      // Vue.js 3.0.0+
      forbiddenVModelArgument:
        'Argument on `v-model` is not supported until Vue.js "3.0.0".',
      forbiddenVModelCustomModifiers:
        'Custom modifiers on `v-model` are not supported until Vue.js "3.0.0".',
      forbiddenVIs: '`v-is` are not supported until Vue.js "3.0.0".',
      // Vue.js 3.1.0+
      forbiddenIsAttributeWithVuePrefix:
        '`is="vue:"` are not supported until Vue.js "3.1.0".',
      // Vue.js 3.2.0+
      forbiddenVMemo: '`v-memo` are not supported until Vue.js "3.2.0".',
      forbiddenVBindPropModifierShorthand:
        '`.prop` shorthand are not supported until Vue.js "3.2.0".',
      forbiddenVBindAttrModifier:
        '`.attr` modifiers on `v-bind` are not supported until Vue.js "3.2.0".',
      // Vue.js 3.3.0+
      forbiddenDefineOptions:
        '`defineOptions()` macros are not supported until Vue.js "3.3.0".',
      forbiddenDefineSlots:
        '`defineSlots()` macros are not supported until Vue.js "3.3.0".',
      // Vue.js 3.4.0+
      forbiddenDefineModel:
        '`defineModel()` macros are not supported until Vue.js "3.4.0".',
      forbiddenVBindSameNameShorthand:
        '`v-bind` same-name shorthand is not supported until Vue.js "3.4.0".'
    }
  },
  create(context: RuleContext) {
    const { version, ignores } = Object.assign(
      {
        version: null,
        ignores: []
      },
      context.options[0] || {}
    )
    if (!version) {
      // version is not set.
      return {}
    }
    const versionRange = getSemverRange(version)

    /**
     * Check whether a given case object is full-supported on the configured node version.
     */
    function isNotSupportingVersion(aCase: SyntaxRule): boolean {
      return !semver.subset(versionRange, getSemverRange(aCase.supported))
    }

    let templateBodyVisitor: TemplateListener = {}
    let scriptVisitor: RuleListener = {}

    for (const syntaxName of SYNTAX_NAMES) {
      const syntax: SyntaxRule = FEATURES[syntaxName]
      if (ignores.includes(syntaxName) || !isNotSupportingVersion(syntax)) {
        continue
      }
      if (syntax.createTemplateBodyVisitor) {
        const visitor = syntax.createTemplateBodyVisitor(context)
        templateBodyVisitor = utils.compositingVisitors(
          templateBodyVisitor,
          visitor
        )
      }
      if (syntax.createScriptVisitor) {
        const visitor = syntax.createScriptVisitor(context)
        scriptVisitor = utils.compositingVisitors(scriptVisitor, visitor)
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      templateBodyVisitor,
      scriptVisitor
    )
  }
}
