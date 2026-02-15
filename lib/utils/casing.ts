/**
 * Capitalize a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Checks whether given string has symbols.
 */
function hasSymbols(str: string): boolean {
  return /[!"#%&'()*+,./:;<=>?@[\\\]^`{|}]/u.exec(str) != null // without " ", "$", "-" and "_"
}

/**
 * Checks whether given string has uppercase.
 */
function hasUpper(str: string): boolean {
  return /[A-Z]/u.exec(str) != null
}

/**
 * Convert text to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replaceAll('_', '-')
    .replaceAll(/\B([A-Z])/gu, '-$1')
    .toLowerCase()
}

/**
 * Checks whether given string is kebab-case.
 */
export function isKebabCase(str: string): boolean {
  return (
    !hasUpper(str) &&
    !hasSymbols(str) &&
    !str.startsWith('-') && // starts with hyphen is not kebab-case
    !/_|--|\s/u.test(str)
  )
}

/**
 * Convert text to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replaceAll(/\B([A-Z])/gu, '_$1')
    .replaceAll('-', '_')
    .toLowerCase()
}

/**
 * Checks whether given string is snake_case.
 */
export function isSnakeCase(str: string): boolean {
  return !hasUpper(str) && !hasSymbols(str) && !/-|__|\s/u.test(str)
}

/**
 * Convert text to camelCase
 */
export function camelCase(str: string): string {
  if (isPascalCase(str)) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
  return str.replaceAll(/[-_](\w)/gu, (_, c) => (c ? c.toUpperCase() : ''))
}

/**
 * Checks whether given string is camelCase.
 */
export function isCamelCase(str: string): boolean {
  return !hasSymbols(str) && !/^[A-Z]/u.test(str) && !/-|_|\s/u.test(str)
}

/**
 * Convert text to PascalCase
 */
export function pascalCase(str: string): string {
  return capitalize(camelCase(str))
}

/**
 * Checks whether given string is PascalCase.
 */
export function isPascalCase(str: string): boolean {
  return !hasSymbols(str) && !/^[a-z]/u.test(str) && !/-|_|\s/u.test(str)
}

type Case = 'camelCase' | 'kebab-case' | 'PascalCase' | 'snake_case'
type CaseConverter = (str: string) => string
type CaseChecker = (str: string) => boolean

const convertersMap: Record<Case, CaseConverter> = {
  'kebab-case': kebabCase,
  snake_case: snakeCase,
  camelCase,
  PascalCase: pascalCase
}

const checkersMap: Record<Case, CaseChecker> = {
  'kebab-case': isKebabCase,
  snake_case: isSnakeCase,
  camelCase: isCamelCase,
  PascalCase: isPascalCase
}

/**
 * Return case checker
 */
export function getChecker(name: Case): CaseChecker {
  return checkersMap[name] || isPascalCase
}

/**
 * Return case converter
 */
export function getConverter(name: Case): CaseConverter {
  return convertersMap[name] || pascalCase
}

/**
 * Return case exact converter.
 * If the converted result is not in correct case, the original value is returned.
 */
export function getExactConverter(name: Case): CaseConverter {
  const converter = getConverter(name)
  const checker = getChecker(name)
  return (str) => {
    const result = converter(str)
    return checker(result) ? result : str /* cannot convert */
  }
}

export const allowedCaseOptions: Case[] = [
  'camelCase',
  'kebab-case',
  'PascalCase'
]
