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

const VALID_MODIFIERS = new Set([
    "stop", "prevent", "capture", "self", "ctrl", "shift", "alt", "meta",
    "native", "once", "left", "right", "middle", "passive", "esc", "tab",
    "enter", "space", "up", "left", "right", "down", "delete",
])

/**
 * Creates AST event handlers for no-invalid-v-on.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        "VAttribute[directive=true][key.name='on']"(node) {
            if (!node.key.argument) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-on' directives require event names.",
                })
            }
            for (const modifier of node.key.modifiers) {
                if (!VALID_MODIFIERS.has(modifier) && !Number.isInteger(parseInt(modifier, 10))) {
                    context.report({
                        node,
                        loc: node.loc,
                        message: "'v-on' directives don't support the modifier '{{modifier}}'.",
                        data: {modifier},
                    })
                }
            }
            if (!utils.hasAttributeValue(node)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-on' directives require that attribute value.",
                })
            }
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
            description: "disallow invalid v-on directives.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}
