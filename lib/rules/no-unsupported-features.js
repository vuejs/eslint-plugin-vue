/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const semver = require('semver')
const utils = require('../utils')

/**
 * @typedef {object} SyntaxRule
 * @property {string} supported
 * @property { (context: RuleContext) => TemplateListener } [createTemplateBodyVisitor]
 * @property { (context: RuleContext) => RuleListener } [createScriptVisitor]
 */

const FEATURES = {
  // Vue.js 2.5.0+
  'slot-scope-attribute': require('./syntaxes/slot-scope-attribute'),
  // Vue.js 2.6.0+
  'dynamic-directive-arguments': require('./syntaxes/dynamic-directive-arguments'),
  'v-slot': require('./syntaxes/v-slot'),
  // >=2.6.0-beta.1 <=2.6.0-beta.3
  'v-bind-prop-modifier-shorthand': require('./syntaxes/v-bind-prop-modifier-shorthand'),
  // Vue.js 3.0.0+
  'v-model-argument': require('./syntaxes/v-model-argument'),
  'v-model-custom-modifiers': require('./syntaxes/v-model-custom-modifiers'),
  'v-is': require('./syntaxes/v-is'),
  'script-setup': require('./syntaxes/script-setup'),
  'style-css-vars-injection': require('./syntaxes/style-css-vars-injection'),
  // Vue.js 3.1.0+
  'is-attribute-with-vue-prefix': require('./syntaxes/is-attribute-with-vue-prefix')
}

const SYNTAX_NAMES = /** @type {(keyof FEATURES)[]} */ (Object.keys(FEATURES))

const cache = new Map()
/**
 * Get the `semver.Range` object of a given range text.
 * @param {string} x The text expression for a semver range.
 * @returns {semver.Range} The range object of a given range text.
 * It's null if the `x` is not a valid range text.
 */
function getSemverRange(x) {
  const s = String(x)
  let ret = cache.get(s) || null

  if (!ret) {
    try {
      ret = new semver.Range(s)
    } catch (_error) {
      // Ignore parsing error.
    }
    cache.set(s, ret)
  }

  return ret
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow unsupported Vue.js syntax on the specified version',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-unsupported-features.html'
    },
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
      // >=2.6.0-beta.1 <=2.6.0-beta.3
      forbiddenVBindPropModifierShorthand:
        '`.prop` shorthand are not supported except Vue.js ">=2.6.0-beta.1 <=2.6.0-beta.3".',
      // Vue.js 3.0.0+
      forbiddenVModelArgument:
        'Argument on `v-model` is not supported until Vue.js "3.0.0".',
      forbiddenVModelCustomModifiers:
        'Custom modifiers on `v-model` are not supported until Vue.js "3.0.0".',
      forbiddenVIs: '`v-is` are not supported until Vue.js "3.0.0".',
      forbiddenScriptSetup:
        '`<script setup>` are not supported until Vue.js "3.0.0".',
      forbiddenStyleCssVarsInjection:
        'SFC CSS variable injection is not supported until Vue.js "3.0.3".',
      // Vue.js 3.1.0+
      forbiddenIsAttributeWithVuePrefix:
        '`is="vue:"` are not supported until Vue.js "3.1.0".'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
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
     * @param {SyntaxRule} aCase The case object to check.
     * @returns {boolean} `true` if it's supporting.
     */
    function isNotSupportingVersion(aCase) {
      return !semverSubset(versionRange, getSemverRange(aCase.supported))
    }

    /** @type {TemplateListener} */
    let templateBodyVisitor = {}
    /** @type {RuleListener} */
    let scriptVisitor = {}

    for (const syntaxName of SYNTAX_NAMES) {
      /** @type {SyntaxRule} */
      const syntax = FEATURES[syntaxName]
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

// TODO replace semver.subset() in the major version.
/**
 * semver.subset()
 *
 * We need to use a copy of the semver source code until a major version upgrade.
 *
 * @see https://github.com/npm/node-semver/blob/e79ac3a450e8bb504e78b8159e3efc70895699b8/ranges/subset.js#L43
 * @license ISC at Isaac Z. Schlueter and Contributors
 * https://github.com/npm/node-semver/blob/master/LICENSE
 *
 * @param {semver.Range} sub
 * @param {semver.Range} dom
 */
function semverSubset(sub, dom) {
  if (sub === dom) return true

  sub = new semver.Range(sub)
  dom = new semver.Range(dom)
  let sawNonNull = false

  // eslint-disable-next-line no-labels
  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom)
      sawNonNull = sawNonNull || isSub !== null
      // eslint-disable-next-line no-labels
      if (isSub) continue OUTER
    }
    if (sawNonNull) return false
  }
  return true
}

/**
 * @license ISC at Isaac Z. Schlueter and Contributors
 * https://github.com/npm/node-semver/blob/master/LICENSE
 * @param {readonly semver.Comparator[]} sub
 * @param {readonly semver.Comparator[]} dom
 */
function simpleSubset(sub, dom) {
  if (sub === dom) return true

  /**
   * @param {semver.Comparator} c
   */
  function isAny(c) {
    return Object.keys(c.semver).length === 0
  }

  if (sub.length === 1 && isAny(sub[0])) {
    if (dom.length === 1 && isAny(dom[0])) return true
    else sub = [new semver.Comparator('>=0.0.0')]
  }

  if (dom.length === 1 && isAny(dom[0])) {
    dom = [new semver.Comparator('>=0.0.0')]
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') gt = higherGT(gt, c)
    else if (c.operator === '<' || c.operator === '<=') lt = lowerLT(lt, c)
    else eqSet.add(c.semver)
  }

  if (eqSet.size > 1) return null

  let gtltComp
  if (gt && lt) {
    gtltComp = semver.compare(gt.semver, lt.semver)
    if (gtltComp > 0) return null
    else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<='))
      return null
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !semver.satisfies(eq, String(gt))) return null

    if (lt && !semver.satisfies(eq, String(lt))) return null

    for (const c of dom) {
      if (!semver.satisfies(eq, String(c))) return false
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt && lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt && gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (
    needDomLTPre &&
    needDomLTPre.prerelease.length === 1 &&
    lt &&
    lt.operator === '<' &&
    needDomLTPre.prerelease[0] === 0
  ) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (
          c.semver.prerelease &&
          c.semver.prerelease.length &&
          c.semver.major === needDomGTPre.major &&
          c.semver.minor === needDomGTPre.minor &&
          c.semver.patch === needDomGTPre.patch
        ) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c)
        if (higher === c && higher !== gt) return false
      } else if (
        gt.operator === '>=' &&
        !semver.satisfies(gt.semver, String(c))
      )
        return false
    }
    if (lt) {
      if (needDomLTPre) {
        if (
          c.semver.prerelease &&
          c.semver.prerelease.length &&
          c.semver.major === needDomLTPre.major &&
          c.semver.minor === needDomLTPre.minor &&
          c.semver.patch === needDomLTPre.patch
        ) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c)
        if (lower === c && lower !== lt) return false
      } else if (
        lt.operator === '<=' &&
        !semver.satisfies(lt.semver, String(c))
      )
        return false
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) return false
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) return false

  if (lt && hasDomGT && !gt && gtltComp !== 0) return false

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) return false

  return true
}

/**
 * @license ISC at Isaac Z. Schlueter and Contributors
 * https://github.com/npm/node-semver/blob/master/LICENSE
 * @param {semver.Comparator | void} a
 * @param {semver.Comparator} b
 */
const higherGT = (a, b) => {
  if (!a) return b
  const comp = semver.compare(a.semver, b.semver)
  return comp > 0
    ? a
    : comp < 0
    ? b
    : b.operator === '>' && a.operator === '>='
    ? b
    : a
}

/**
 * @license ISC at Isaac Z. Schlueter and Contributors
 * https://github.com/npm/node-semver/blob/master/LICENSE
 * @param {semver.Comparator | void} a
 * @param {semver.Comparator} b
 */
const lowerLT = (a, b) => {
  if (!a) return b
  const comp = semver.compare(a.semver, b.semver)
  return comp < 0
    ? a
    : comp > 0
    ? b
    : b.operator === '<' && a.operator === '<='
    ? b
    : a
}
