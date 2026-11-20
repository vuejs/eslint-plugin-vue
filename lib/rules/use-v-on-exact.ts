/**
 * @fileoverview enforce usage of `exact` modifier on `v-on`.
 * @author Armano
 */
import utils from '../utils/index.ts'

interface EventDirective {
  name: string
  node: VDirectiveKey
  modifiers: string[]
  hasHandler: boolean
}

const SYSTEM_MODIFIERS = new Set(['ctrl', 'shift', 'alt', 'meta'])
const GLOBAL_MODIFIERS = new Set([
  'stop',
  'prevent',
  'capture',
  'self',
  'once',
  'passive',
  'native'
])
const KEYBOARD_EVENTS = new Set(['keydown', 'keypress', 'keyup'])

/**
 * Finds and returns all keys for event directives
 */
function getEventDirectives(
  startTag: VStartTag,
  sourceCode: SourceCode
): EventDirective[] {
  return utils.getDirectives(startTag, 'on').map((attribute) => ({
    name: attribute.key.argument
      ? sourceCode.getText(attribute.key.argument)
      : '',
    node: attribute.key,
    modifiers: attribute.key.modifiers.map((modifier) => modifier.name),
    hasHandler: Boolean(attribute.value)
  }))
}

/**
 * Checks whether given modifier is key modifier
 */
function isKeyModifier(modifier: string): boolean {
  return !GLOBAL_MODIFIERS.has(modifier) && !SYSTEM_MODIFIERS.has(modifier)
}

/**
 * Checks whether given modifier is system one
 */
function isSystemModifier(modifier: string): boolean {
  return SYSTEM_MODIFIERS.has(modifier)
}

/**
 * Checks whether given any of provided modifiers
 * has system modifier
 */
function hasSystemModifier(modifiers: string[]): boolean {
  return modifiers.some(isSystemModifier)
}

/**
 * Checks whether the event catches every key event to stop propagation,
 * only applies global modifiers, and has no handler.
 */
function isGlobalOnlyKeyboardStopEvent(event: EventDirective): boolean {
  return (
    KEYBOARD_EVENTS.has(event.name) &&
    event.modifiers.includes('stop') &&
    !event.hasHandler &&
    event.modifiers.every((modifier) => GLOBAL_MODIFIERS.has(modifier))
  )
}

/**
 * Groups all events in an object with keys representing each event name,
 * e.g. `{ click: [], keypress: [] }`.
 */
function groupEvents(events: EventDirective[]): {
  [key: string]: EventDirective[]
} {
  const grouped: { [key: string]: EventDirective[] } = {}
  for (const event of events) {
    if (!grouped[event.name]) {
      grouped[event.name] = []
    }
    grouped[event.name].push(event)
  }
  return grouped
}

/**
 * Creates an alphabetically sorted string of system modifiers, e.g. `"alt,ctrl,del,shift"`.
 */
function getSystemModifiersString(modifiers: string[]): string {
  return modifiers
    .filter(isSystemModifier)
    .sort((a, b) => a.localeCompare(b))
    .join(',')
}

/**
 * Creates an alphabetically sorted string of key modifiers, e.g. `"enter,tab"`.
 */
function getKeyModifiersString(modifiers: string[]): string {
  return modifiers
    .filter(isKeyModifier)
    .sort((a, b) => a.localeCompare(b))
    .join(',')
}

/**
 * Compares two events based on their modifiers
 * to detect possible event leakeage
 */
function hasConflictedModifiers(
  baseEvent: EventDirective,
  event: EventDirective
): boolean {
  if (
    event.node === baseEvent.node ||
    event.modifiers.includes('exact') ||
    (baseEvent.modifiers.includes('exact') &&
      isGlobalOnlyKeyboardStopEvent(event))
  )
    return false

  const eventKeyModifiers = getKeyModifiersString(event.modifiers)
  const baseEventKeyModifiers = getKeyModifiersString(baseEvent.modifiers)

  if (
    eventKeyModifiers &&
    baseEventKeyModifiers &&
    eventKeyModifiers !== baseEventKeyModifiers
  )
    return false

  const eventSystemModifiers = getSystemModifiersString(event.modifiers)
  const baseEventSystemModifiers = getSystemModifiersString(baseEvent.modifiers)

  return (
    baseEvent.modifiers.length > 0 &&
    baseEventSystemModifiers !== eventSystemModifiers &&
    baseEventSystemModifiers.includes(eventSystemModifiers)
  )
}

/**
 * Searches for events that might conflict with each other and returns them without duplicates.
 */
function findConflictedEvents(events: EventDirective[]): EventDirective[] {
  const conflictedEvents: EventDirective[] = []
  for (const event of events) {
    conflictedEvents.push(
      ...events
        .filter((evt) => !conflictedEvents.includes(evt)) // No duplicates
        .filter(hasConflictedModifiers.bind(null, event))
    )
  }
  return conflictedEvents
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of `exact` modifier on `v-on`',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/use-v-on-exact.html'
    },
    fixable: null,
    schema: [],
    messages: {
      considerExact: "Consider to use '.exact' modifier."
    }
  },

  /**
   * Creates AST event handlers for use-v-on-exact.
   */
  create(context: RuleContext): RuleListener {
    const sourceCode = context.sourceCode

    return utils.defineTemplateBodyVisitor(context, {
      VStartTag(node: VStartTag) {
        if (node.attributes.length === 0) return

        const isCustomComponent = utils.isCustomComponent(node.parent)
        let events = getEventDirectives(node, sourceCode)

        if (isCustomComponent) {
          // For components consider only events with `native` modifier
          events = events.filter((event) => event.modifiers.includes('native'))
        }

        const grouppedEvents = groupEvents(events)

        for (const eventsInGroup of Object.values(grouppedEvents)) {
          const hasEventWithKeyModifier = eventsInGroup.some((event) =>
            hasSystemModifier(event.modifiers)
          )

          if (!hasEventWithKeyModifier) continue

          const conflictedEvents = findConflictedEvents(eventsInGroup)

          for (const e of conflictedEvents) {
            context.report({
              node: e.node,
              loc: e.node.loc,
              messageId: 'considerExact'
            })
          }
        }
      }
    })
  }
}
