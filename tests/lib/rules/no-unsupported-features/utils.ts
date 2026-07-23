/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import rule from '../../../../lib/rules/no-unsupported-features'

export const SYNTAXES = rule.meta.schema[0].properties.ignores.items.enum

/**
 * Define the options builder to exclude anything other than the given syntax.
 */
export function optionsBuilder(
  targetSyntax: (typeof SYNTAXES)[number],
  defaultVersion: string
) {
  const baseIgnores = SYNTAXES.filter((s) => s !== targetSyntax)
  return (option?: {
    ignores?: (typeof SYNTAXES)[number][]
    version?: string
  }) => {
    const ignores = [...baseIgnores]
    let version = defaultVersion
    if (!option) {
      option = {}
    }
    if (option.ignores) {
      ignores.push(...option.ignores)
    }
    if (option.version) {
      version = option.version
    }
    option.ignores = ignores
    option.version = version
    return [option]
  }
}
