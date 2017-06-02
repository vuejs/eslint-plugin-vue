/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-invalid-v-on")

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const tester = new RuleTester({
    parser: "vue-eslint-parser",
    parserOptions: {ecmaVersion: 2015},
})

tester.run("no-invalid-v-on", rule, {
    valid: [
        {
            filename: "test.vue",
            code: "",
        },
        {
            filename: "test.vue",
            code: "<template><div v-on:click=\"foo\"></div></template>",
        },
        {
            filename: "test.vue",
            code: "<template><div @click=\"foo\"></div></template>",
        },
        {
            filename: "test.vue",
            code: "<template><div @click.prevent.ctrl.left=\"foo\"></div></template>",
        },
        {
            filename: "test.vue",
            code: "<template><div @keydown.27=\"foo\"></div></template>",
        },
    ],
    invalid: [
        {
            filename: "test.vue",
            code: "<template><div v-on=\"foo\"></div></template>",
            errors: ["'v-on' directives require event names."],
        },
        {
            filename: "test.vue",
            code: "<template><div v-on:click.aaa=\"foo\"></div></template>",
            errors: ["'v-on' directives don't support the modifier 'aaa'."],
        },
        {
            filename: "test.vue",
            code: "<template><div v-on:click></div></template>",
            errors: ["'v-on' directives require that attribute value."],
        },
    ],
})
