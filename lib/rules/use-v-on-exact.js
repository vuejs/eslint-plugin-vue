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
 * @param {array} attributes Element attributes
 * @returns {array[object]} [{ name, node, modifiers }]
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

/**
 * Checks whether given modifier is KEY
 *
 * @param {string} modifier
 * @returns {boolean}
 */
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

/**
 * Checks whether given any of provided modifiers
 * has KEY modifier
 *
 * @param {array} modifiers
 * @returns {boolean}
 */
function hasKeyModifier (modifiers) {
  return modifiers.some(isKeyModifier)
}

/**
 * Groups all events in object,
 * with keys represinting each event name
 *
 * @param {array} events
 * @returns {object} { click: [], keypress: [] }
 */
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

/**
 * Creates alphabetically sorted string with key modifiers
 *
 * @param {array[string]} modifiers
 * @returns {string} e.g. "alt,ctrl,del,shift"
 */
function getKeyModifiersString (modifiers) {
  return modifiers.filter(isKeyModifier).sort().join(',')
}

/**
 * Compares two events based on their modifiers
 * to detect possible event leakeage
 *
 * @param {object} baseEvent
 * @param {object} event
 * @returns {boolean}
 */
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

/**
 * Searches for events that might conflict with each other
 *
 * @param {array} events
 * @returns {array} conflicted events, without duplicates
 */
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
