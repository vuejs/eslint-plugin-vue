/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs")
const path = require("path")

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, "../lib/rules")
const README = path.resolve(__dirname, "../README.md")
const RULES_JS = path.resolve(__dirname, "../lib/rules.js")
const RECOMMENDED_JSON = path.resolve(__dirname, "../lib/recommended.json")
const STAR = "⭐️"
const PEN = "✒️"
const CATEGORIES = ["Possible Errors", "Best Practices", "Stylistic Issues"]
const TABLE_PLACE_HOLDER = /<!--RULES_TABLE_START-->[\s\S]*<!--RULES_TABLE_END-->/

const ruleNames = fs.readdirSync(ROOT)
    .filter(file => path.extname(file) === ".js")
    .map(file => path.basename(file, ".js"))

const rules = new Map(
    ruleNames.map(name => [
        name,
        require(path.join(ROOT, name)),
    ])
)

const RULE_TABLE = CATEGORIES.map(category => `### ${category}

|    | Rule ID | Description |
|:---|:--------|:------------|
${
    Array.from(rules.entries())
        .filter(entry => entry[1].meta.docs.category === category)
        .map(entry => {
            const name = entry[0]
            const meta = entry[1].meta
            const mark = `${meta.docs.recommended ? STAR : ""}${meta.fixable ? PEN : ""}`
            const link = `[${name}](./docs/rules/${name}.md)`
            const description = meta.docs.description || "(no description)"
            return `| ${mark} | ${link} | ${description} |`
        })
        .join("\n")
}
`).join("\n")

const RULES_JS_CONTENT = `/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

module.exports = {
${ruleNames.map(name => `    "${name}": require("./rules/${name}"),`).join("\n")}
}
`

const recommendedConf = {
    parser: "vue-eslint-parser",
    env: {es6: true},
    rules: Array.from(rules.entries())
        .reduce((obj, entry) => {
            const name = entry[0]
            const recommended = entry[1].meta.docs.recommended
            obj[`vue/${name}`] = recommended ? "error" : "off"
            return obj
        }, {}),
}

fs.writeFileSync(
    README,
    fs.readFileSync(README, "utf8").replace(
        TABLE_PLACE_HOLDER,
        `<!--RULES_TABLE_START-->\n${RULE_TABLE}\n<!--RULES_TABLE_END-->`
    )
)
fs.writeFileSync(
    RULES_JS,
    RULES_JS_CONTENT
)
fs.writeFileSync(
    RECOMMENDED_JSON,
    JSON.stringify(recommendedConf, null, 4)
)
