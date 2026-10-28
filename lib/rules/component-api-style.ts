/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

type PreferOption =
  'script-setup' | 'composition' | 'composition-vue2' | 'options'

interface AllowsOption {
  scriptSetup?: boolean
  composition?: boolean
  compositionVue2?: boolean
  options?: boolean
}

interface NormalizeOptions {
  allowsSFC: AllowsOption
  allowsOther: Omit<AllowsOption, 'scriptSetup'>
}

const STYLE_OPTIONS: PreferOption[] = [
  'script-setup',
  'composition',
  'composition-vue2',
  'options'
]

function applyPreferOption(opts: NormalizeOptions, prefer: PreferOption) {
  switch (prefer) {
    case 'script-setup': {
      opts.allowsSFC.scriptSetup = true
      break
    }
    case 'composition': {
      opts.allowsSFC.composition = true
      opts.allowsOther.composition = true
      break
    }
    case 'composition-vue2': {
      opts.allowsSFC.compositionVue2 = true
      opts.allowsOther.compositionVue2 = true
      break
    }
    case 'options': {
      opts.allowsSFC.options = true
      opts.allowsOther.options = true
      break
    }
  }
}

/**
 * Normalize options.
 */
function parseOptions(options: any[]): NormalizeOptions {
  const opts: NormalizeOptions = { allowsSFC: {}, allowsOther: {} }

  const preferOptions: PreferOption[] = options[0] || [
    'script-setup',
    'composition'
  ]
  for (const prefer of preferOptions) {
    applyPreferOption(opts, prefer)
  }

  if (
    !opts.allowsOther.composition &&
    !opts.allowsOther.compositionVue2 &&
    !opts.allowsOther.options
  ) {
    opts.allowsOther.composition = true
    opts.allowsOther.compositionVue2 = true
    opts.allowsOther.options = true
  }

  return opts
}

const OPTIONS_API_OPTIONS = new Set([
  'mixins',
  'extends',
  // state
  'data',
  'computed',
  'methods',
  'watch',
  'provide',
  'inject',
  // lifecycle
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'beforeDestroy',
  'beforeUnmount',
  'destroyed',
  'unmounted',
  'render',
  'renderTracked',
  'renderTriggered',
  'errorCaptured',
  // public API
  'expose'
])
const COMPOSITION_API_OPTIONS = new Set(['setup'])

const COMPOSITION_API_VUE2_OPTIONS = new Set([
  'setup',
  'render', // https://github.com/vuejs/composition-api#template-refs
  'renderTracked', // https://github.com/vuejs/composition-api#missing-apis
  'renderTriggered' // https://github.com/vuejs/composition-api#missing-apis
])

const LIFECYCLE_HOOK_OPTIONS = new Set([
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'beforeDestroy',
  'beforeUnmount',
  'destroyed',
  'unmounted',
  'renderTracked',
  'renderTriggered',
  'errorCaptured'
])

function buildAllowedPhrase(allowsOpt: AllowsOption) {
  const phrases = []
  if (allowsOpt.scriptSetup) {
    phrases.push('`<script setup>`')
  }
  if (allowsOpt.composition) {
    phrases.push('Composition API')
  }
  if (allowsOpt.compositionVue2) {
    phrases.push('Composition API (Vue 2)')
  }
  if (allowsOpt.options) {
    phrases.push('Options API')
  }
  return phrases.length > 2
    ? `${phrases.slice(0, -1).join(', ')} or ${phrases.at(-1)}`
    : phrases.join(' or ')
}

function isPreferScriptSetup(allowsOpt: AllowsOption) {
  return (
    allowsOpt.scriptSetup &&
    !allowsOpt.composition &&
    !allowsOpt.compositionVue2 &&
    !allowsOpt.options
  )
}

function buildOptionPhrase(name: string) {
  if (LIFECYCLE_HOOK_OPTIONS.has(name)) return `\`${name}\` lifecycle hook`

  return name === 'setup' || name === 'render'
    ? `\`${name}\` function`
    : `\`${name}\` option`
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce component API style',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/component-api-style.html'
    },
    fixable: null,
    schema: [
      {
        type: 'array',
        items: {
          enum: STYLE_OPTIONS,
          uniqueItems: true
        },
        minItems: 1
      }
    ],
    messages: {
      disallowScriptSetup:
        '`<script setup>` is not allowed in your project. Use {{allowedApis}} instead.',
      disallowComponentOption:
        '{{disallowedApi}} is not allowed in your project. {{optionPhrase}} is part of the {{disallowedApi}}. Use {{allowedApis}} instead.',
      disallowComponentOptionPreferScriptSetup:
        '{{disallowedApi}} is not allowed in your project. Use `<script setup>` instead.'
    }
  },
  create(context: RuleContext) {
    const options = parseOptions(context.options)

    return utils.compositingVisitors(
      {
        Program() {
          if (options.allowsSFC.scriptSetup) {
            return
          }
          const scriptSetup = utils.getScriptSetupElement(context)
          if (scriptSetup) {
            context.report({
              node: scriptSetup.startTag,
              messageId: 'disallowScriptSetup',
              data: {
                allowedApis: buildAllowedPhrase(options.allowsSFC)
              }
            })
          }
        }
      },
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          const allows = utils.isSFCObject(context, node)
            ? options.allowsSFC
            : options.allowsOther
          if (
            (allows.composition || allows.compositionVue2) &&
            allows.options
          ) {
            return
          }
          const apis = [
            {
              allow: allows.composition,
              options: COMPOSITION_API_OPTIONS,
              apiName: 'Composition API'
            },
            {
              allow: allows.options,
              options: OPTIONS_API_OPTIONS,
              apiName: 'Options API'
            },
            {
              allow: allows.compositionVue2,
              options: COMPOSITION_API_VUE2_OPTIONS,
              apiName: 'Composition API (Vue 2)'
            }
          ]
          for (const prop of node.properties) {
            if (prop.type !== 'Property') {
              continue
            }
            const name = utils.getStaticPropertyName(prop)
            if (!name) {
              continue
            }
            const disallowApi =
              apis.every((api) => !(api.allow && api.options.has(name))) &&
              apis.find((api) => !api.allow && api.options.has(name))

            if (disallowApi) {
              context.report({
                node: prop.key,
                messageId: isPreferScriptSetup(allows)
                  ? 'disallowComponentOptionPreferScriptSetup'
                  : 'disallowComponentOption',
                data: {
                  disallowedApi: disallowApi.apiName,
                  optionPhrase: buildOptionPhrase(name),
                  allowedApis: buildAllowedPhrase(allows)
                }
              })
            }
          }
        }
      })
    )
  }
}
