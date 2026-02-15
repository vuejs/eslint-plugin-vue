const RE_REGEXP_CHAR = /[\\^$.*+?()[\]{}|]/gu
const RE_HAS_REGEXP_CHAR = new RegExp(RE_REGEXP_CHAR.source)

const RE_REGEXP_STR = /^\/(.+)\/(.*)$/u

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 */
export function escape(string: string): string {
  return string && RE_HAS_REGEXP_CHAR.test(string)
    ? string.replaceAll(RE_REGEXP_CHAR, String.raw`\$&`)
    : string
}

interface ToRegExpFlag {
  /** Flags to add to the `RegExp` (e.g. `'i'` for case-insensitive) */
  add?: string
  /** Flags to remove from the `RegExp` (e.g. `'g'` to remove global matching) */
  remove?: string
}

/**
 * Convert a string to the `RegExp`.
 * Normal strings (e.g. `"foo"`) is converted to `/^foo$/` of `RegExp`.
 * Strings like `"/^foo/i"` are converted to `/^foo/i` of `RegExp`.
 */
export function toRegExp(string: string, flags: ToRegExpFlag = {}): RegExp {
  const parts = RE_REGEXP_STR.exec(string)
  const { add: forceAddFlags = '', remove: forceRemoveFlags = '' } =
    typeof flags === 'object' ? flags : {} // Avoid issues when this is called directly from array.map
  if (parts) {
    return new RegExp(
      parts[1],
      parts[2].replaceAll(
        new RegExp(`[${forceAddFlags}${forceRemoveFlags}]`, 'g'),
        ''
      ) + forceAddFlags
    )
  }
  return new RegExp(`^${escape(string)}$`, forceAddFlags)
}

/**
 * Checks whether given string is regexp string
 */
export function isRegExp(string: string): boolean {
  return RE_REGEXP_STR.test(string)
}

/**
 * Converts an array of strings to a singular function to match any of them.
 * This function converts each string to a `RegExp` and returns a function that checks all of them.
 */
export function toRegExpGroupMatcher(
  patterns: string[] = []
): (...toCheck: string[]) => boolean {
  if (patterns.length === 0) {
    return () => false
  }

  // In the future, we could optimize this by joining expressions with identical flags.
  const regexps = patterns.map((pattern) => toRegExp(pattern, { remove: 'g' }))

  if (regexps.length === 1) {
    return (...toCheck) => toCheck.some((str) => regexps[0].test(str))
  }

  return (...toCheck) =>
    regexps.some((regexp) => toCheck.some((str) => regexp.test(str)))
}
