/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export interface RuleMeta {
  type: string
  docs: {
    description: string
    url: string
    category?: string | null
    categories?: string[] | null
    extensionSource?: { url: string; name: string }
    defaultOptions?: Record<string, unknown[]>
  }
  fixable?: string | null
  hasSuggestions?: boolean
  deprecated?: boolean
  replacedBy?: string[]
}

export interface RuleInfo {
  ruleId: string
  name: string
  ext: string
  meta: RuleMeta
}

const ROOT = path.resolve(import.meta.dirname, '../../lib/rules')

const ruleFiles = fs.readdirSync(ROOT).filter((file) => {
  const ext = path.extname(file)
  return ext === '.js' || ext === '.ts'
})

const rules: RuleInfo[] = await Promise.all(
  ruleFiles.map(async (file) => {
    const ext = path.extname(file)
    const name = path.basename(file, ext)

    const { default: rule } = await import(
      pathToFileURL(path.join(ROOT, file)).href
    )
    const meta: RuleMeta = { ...rule.meta }
    if (meta.docs && !meta.docs.categories && meta.docs.category) {
      // for vue3 migration
      meta.docs = { ...meta.docs, categories: [meta.docs.category] }
    }
    return {
      ruleId: `vue/${name}`,
      name,
      ext,
      meta
    }
  })
)

export default rules
