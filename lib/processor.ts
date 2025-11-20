/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
import type { Linter } from 'eslint'
import * as meta from './meta'

type LintMessage = Linter.LintMessage

interface GroupState {
  disableAllKeys: Set<string>
  disableRuleKeys: Map<string, string[]>
}

export default {
  preprocess(code: string): string[] {
    return [code]
  },

  postprocess(messages: LintMessage[][]): LintMessage[] {
    const state = {
      block: {
        disableAllKeys: new Set<string>(),
        disableRuleKeys: new Map<string, string[]>()
      } satisfies GroupState,
      line: {
        disableAllKeys: new Set<string>(),
        disableRuleKeys: new Map<string, string[]>()
      } satisfies GroupState
    }
    const usedDisableDirectiveKeys: string[] = []
    const unusedDisableDirectiveReports = new Map<string, LintMessage>()

    // Filter messages which are in disabled area.
    const filteredMessages = messages[0].filter((message) => {
      if (message.ruleId === 'vue/comment-directive') {
        const directiveType = message.messageId
        const data = message.message.split(' ')
        switch (directiveType) {
          case 'disableBlock': {
            state.block.disableAllKeys.add(data[1])
            break
          }
          case 'disableLine': {
            state.line.disableAllKeys.add(data[1])
            break
          }
          case 'enableBlock': {
            state.block.disableAllKeys.clear()
            break
          }
          case 'enableLine': {
            state.line.disableAllKeys.clear()
            break
          }
          case 'disableBlockRule': {
            addDisableRule(state.block.disableRuleKeys, data[1], data[2])
            break
          }
          case 'disableLineRule': {
            addDisableRule(state.line.disableRuleKeys, data[1], data[2])
            break
          }
          case 'enableBlockRule': {
            state.block.disableRuleKeys.delete(data[1])
            break
          }
          case 'enableLineRule': {
            state.line.disableRuleKeys.delete(data[1])
            break
          }
          case 'clear': {
            state.block.disableAllKeys.clear()
            state.block.disableRuleKeys.clear()
            state.line.disableAllKeys.clear()
            state.line.disableRuleKeys.clear()
            break
          }
          default: {
            // unused eslint-disable comments report
            unusedDisableDirectiveReports.set(messageToKey(message), message)
            break
          }
        }
        return false
      } else {
        const disableDirectiveKeys = []
        if (state.block.disableAllKeys.size > 0) {
          disableDirectiveKeys.push(...state.block.disableAllKeys)
        }
        if (state.line.disableAllKeys.size > 0) {
          disableDirectiveKeys.push(...state.line.disableAllKeys)
        }
        if (message.ruleId) {
          const block = state.block.disableRuleKeys.get(message.ruleId)
          if (block) {
            disableDirectiveKeys.push(...block)
          }
          const line = state.line.disableRuleKeys.get(message.ruleId)
          if (line) {
            disableDirectiveKeys.push(...line)
          }
        }

        if (disableDirectiveKeys.length > 0) {
          // Store used eslint-disable comment key
          usedDisableDirectiveKeys.push(...disableDirectiveKeys)
          return false
        } else {
          return true
        }
      }
    })

    if (unusedDisableDirectiveReports.size > 0) {
      for (const key of usedDisableDirectiveKeys) {
        // Remove used eslint-disable comments
        unusedDisableDirectiveReports.delete(key)
      }
      // Reports unused eslint-disable comments
      filteredMessages.push(...unusedDisableDirectiveReports.values())
      filteredMessages.sort(compareLocations)
    }

    return filteredMessages
  },

  supportsAutofix: true,

  meta
}

function addDisableRule(
  disableRuleKeys: GroupState['disableRuleKeys'],
  rule: string,
  key: string
): void {
  let keys = disableRuleKeys.get(rule)
  if (keys) {
    keys.push(key)
  } else {
    keys = [key]
    disableRuleKeys.set(rule, keys)
  }
}

function messageToKey(message: LintMessage): string {
  return `line:${message.line},column${
    // -1 because +1 by ESLint's `report-translator`.
    message.column - 1
  }`
}

/**
 * Compares the locations of two objects in a source file
 * @param itemA The first object
 * @param itemB The second object
 * @returns A value less than 1 if itemA appears before itemB in the source file, greater than 1 if
 * itemA appears after itemB in the source file, or 0 if itemA and itemB have the same location.
 */
function compareLocations(itemA: Position, itemB: Position): number {
  return itemA.line - itemB.line || itemA.column - itemB.column
}
