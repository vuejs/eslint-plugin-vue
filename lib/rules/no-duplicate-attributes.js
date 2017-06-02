/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Get the name of the given attribute node.
 * @param {ASTNode} attribute The attribute node to get.
 * @returns {string} The name of the attribute.
 */
function getName(attribute) {
    if (!attribute.directive) {
        return attribute.key.name
    }
    if (attribute.key.name === "bind") {
        return attribute.key.argument || null
    }
    return null
}

/**
 * Creates AST event handlers for no-duplicate-attributes.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    const names = new Set()

    utils.registerTemplateBodyVisitor(context, {
        "VStartTag"() {
            names.clear()
        },
        "VAttribute"(node) {
            const name = getName(node)
            if (name == null) {
                return
            }

            if (names.has(name)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "Duplicate attribute '{{name}}'.",
                    data: {name},
                })
            }
            names.add(name)
        },
    })

    return {}
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    create,
    meta: {
        docs: {
            description: "disallow duplicate arguments.",
            category: "Best Practices",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
