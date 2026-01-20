/**
 * Capitalize a string.
 * @param str - Text to be capitalized
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Checks whether given string has symbols.
 * @param str - Text to check
 * @returns True if string has symbols
 */
function hasSymbols(str: string): boolean {
  return /[!"#%&'()*+,./:;<=>?@[\\\]^`{|}]/u.exec(str) != null // without " ", "$", "-" and "_"
}

/**
 * Checks whether given string has uppercase.
 * @param str - Text to check
 * @returns True if string has uppercase
 */
function hasUpper(str: string): boolean {
  return /[A-Z]/u.exec(str) != null
}

/**
 * Convert text to kebab-case
 * @param str - Text to be converted
 * @returns kebab-case string
 */
export function kebabCase(str: string): string {
  return str
    .replaceAll('_', '-')
    .replaceAll(/\B([A-Z])/gu, '-$1')
    .toLowerCase()
}

/**
 * Checks whether given string is kebab-case.
 * @param str - Text to check
 * @returns True if string is kebab-case
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
 * @param str - Text to be converted
 * @returns snake_case string
 */
export function snakeCase(str: string): string {
  return str
    .replaceAll(/\B([A-Z])/gu, '_$1')
    .replaceAll('-', '_')
    .toLowerCase()
}

/**
 * Checks whether given string is snake_case.
 * @param str - Text to check
 * @returns True if string is snake_case
 */
export function isSnakeCase(str: string): boolean {
  return !hasUpper(str) && !hasSymbols(str) && !/-|__|\s/u.test(str)
}

/**
 * Convert text to camelCase
 * @param str - Text to be converted
 * @returns camelCase string
 */
export function camelCase(str: string): string {
  if (isPascalCase(str)) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
  return str.replaceAll(/[-_](\w)/gu, (_, c) => (c ? c.toUpperCase() : ''))
}

/**
 * Checks whether given string is camelCase.
 * @param str - Text to check
 * @returns True if string is camelCase
 */
export function isCamelCase(str: string): boolean {
  return !hasSymbols(str) && !/^[A-Z]/u.test(str) && !/-|_|\s/u.test(str)
}

/**
 * Convert text to PascalCase
 * @param str - Text to be converted
 * @returns PascalCase string
 */
export function pascalCase(str: string): string {
  return capitalize(camelCase(str))
}

/**
 * Checks whether given string is PascalCase.
 * @param str - Text to check
 * @returns True if string is PascalCase
 */
export function isPascalCase(str: string): boolean {
  return !hasSymbols(str) && !/^[a-z]/u.test(str) && !/-|_|\s/u.test(str)
}

const convertersMap = {
  'kebab-case': kebabCase,
  snake_case: snakeCase,
  camelCase,
  PascalCase: pascalCase
}

const checkersMap = {
  'kebab-case': isKebabCase,
  snake_case: isSnakeCase,
  camelCase: isCamelCase,
  PascalCase: isPascalCase
}

type CaseType = 'camelCase' | 'kebab-case' | 'PascalCase' | 'snake_case'

type CheckerReturnType = Record<CaseType, (str: string) => boolean>

/**
 * Return case checker
 * @param name - Type of checker to return ('camelCase', 'kebab-case', 'PascalCase')
 * @returns Case checker function
 */
export function getChecker(name: CaseType): CheckerReturnType[CaseType] {
  return checkersMap[name] || isPascalCase
}

type ConverterReturnType = Record<CaseType, (str: string) => string>

/**
 * Return case converter
 * @param name - Type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
 * @returns Case converter function
 */
export function getConverter(name: CaseType): ConverterReturnType[CaseType] {
  return convertersMap[name] || pascalCase
}

/**
 * Return case exact converter.
 * If the converted result is not in correct case, the original value is returned.
 * @param name - Type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
 * @returns Converter function that returns original value if case doesn't match
 */
export function getExactConverter(
  name: CaseType
): ConverterReturnType[CaseType] {
  const converter = getConverter(name)
  const checker = getChecker(name)
  return (str) => {
    const result = converter(str)
    return checker(result) ? result : str /* cannot convert */
  }
}

export const allowedCaseOptions: CaseType[] = [
  'camelCase',
  'kebab-case',
  'PascalCase'
]
