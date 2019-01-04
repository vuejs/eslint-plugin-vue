/**
 * @fileoverview enforce usage of `exact` modifier on `v-on`.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const keyAliases = require('../utils/key-aliases.json')

const KEY_MODIFIERS = new Set([
  'ctrl', 'shift', 'alt', 'meta', 'left', 'right', 'middle', 'esc', 'tab',
  'enter', 'space', 'up', 'left', 'right', 'down', 'delete'
])

// https://www.w3.org/TR/uievents-key/
const KEY_ALIASES = new Set(keyAliases)

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Finds and returns all keys for event directives
 *
 * @param {Array} attributes Element attributes
 * @returns {Array}
 */
function getEventDirectives (attributes) {
  return attributes
    .filter(attribute =>
      attribute.directive &&
      attribute.key.name === 'on'
    )
    .map(attribute => ({
      name: attribute.key.argument,
      node: attribute.key,
      modifiers: attribute.key.modifiers
    }))
}

function isKeyModifier (modifier) {
  return (
    KEY_MODIFIERS.has(modifier) ||
    // keyCode
    Number.isInteger(parseInt(modifier, 10)) ||
    // keyAlias (an Unicode character)
    Array.from(modifier).length === 1 ||
    // keyAlias (special keys)
    KEY_ALIASES.has(modifier)
  )
}

function hasKeyModifier (modifiers) {
  return modifiers.some(isKeyModifier)
}

function groupEvents (events) {
  return events.reduce((acc, event) => {
    if (acc[event.name]) {
      acc[event.name].push(event)
    } else {
      acc[event.name] = [event]
    }

    return acc
  }, {})
}

function getKeyModifiersString (modifiers) {
  return modifiers.filter(isKeyModifier).sort().join(',')
}

function hasConflictedModifiers (baseEvent, event) {
  if (
    event.node === baseEvent.node ||
    event.modifiers.includes('exact')
  ) return false

  const eventModifiers = getKeyModifiersString(event.modifiers)
  const baseEventModifiers = getKeyModifiersString(baseEvent.modifiers)

  return (
    baseEvent.modifiers.length >= 1 &&
    baseEventModifiers !== eventModifiers &&
    baseEventModifiers.indexOf(eventModifiers) > -1
  )
}

function findConflictedEvents (events) {
  return events.reduce((acc, event) => {
    return [
      ...acc,
      ...events
        .filter(evt => !acc.find(e => evt === e)) // No duplicates
        .filter(hasConflictedModifiers.bind(null, event))
    ]
  }, [])
}

// ------------------------------------------------------------------------------
// Rule details
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `exact` modifier on `v-on`',
      category: 'essential',
      url: 'https://eslint.vuejs.org/rules/use-v-on-exact.html'
    },
    fixable: null,
    schema: []
  },

  /**
   * Creates AST event handlers for use-v-on-exact.
   *
   * @param {RuleContext} context - The rule context.
   * @returns {Object} AST event handlers.
   */
  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      VStartTag (node) {
        if (node.attributes.length === 0) return

        const isCustomComponent = utils.isCustomComponent(node.parent)
        let events = getEventDirectives(node.attributes)

        if (isCustomComponent) {
          // For components consider only events with `native` modifier
          events = events.filter(event => event.modifiers.includes('native'))
        }

        const grouppedEvents = groupEvents(events)

        Object.keys(grouppedEvents).forEach(eventName => {
          const eventsInGroup = grouppedEvents[eventName]
          const hasEventWithKeyModifier = eventsInGroup.some(event =>
            hasKeyModifier(event.modifiers)
          )

          if (!hasEventWithKeyModifier) return

          const conflictedEvents = findConflictedEvents(eventsInGroup)

          conflictedEvents.forEach(e => {
            context.report({
              node: e.node,
              loc: e.node.loc,
              message: "Consider to use '.exact' modifier."
            })
          })
        })
      }
    })
  }
}
