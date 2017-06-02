/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

module.exports = {
    "html-end-tags": require("./rules/html-end-tags"),
    "html-no-self-closing": require("./rules/html-no-self-closing"),
    "html-quotes": require("./rules/html-quotes"),
    "no-confusing-v-for-v-if": require("./rules/no-confusing-v-for-v-if"),
    "no-duplicate-attributes": require("./rules/no-duplicate-attributes"),
    "no-invalid-template-root": require("./rules/no-invalid-template-root"),
    "no-invalid-v-bind": require("./rules/no-invalid-v-bind"),
    "no-invalid-v-cloak": require("./rules/no-invalid-v-cloak"),
    "no-invalid-v-else-if": require("./rules/no-invalid-v-else-if"),
    "no-invalid-v-else": require("./rules/no-invalid-v-else"),
    "no-invalid-v-for": require("./rules/no-invalid-v-for"),
    "no-invalid-v-html": require("./rules/no-invalid-v-html"),
    "no-invalid-v-if": require("./rules/no-invalid-v-if"),
    "no-invalid-v-model": require("./rules/no-invalid-v-model"),
    "no-invalid-v-on": require("./rules/no-invalid-v-on"),
    "no-invalid-v-once": require("./rules/no-invalid-v-once"),
    "no-invalid-v-pre": require("./rules/no-invalid-v-pre"),
    "no-invalid-v-show": require("./rules/no-invalid-v-show"),
    "no-invalid-v-text": require("./rules/no-invalid-v-text"),
    "no-parsing-error": require("./rules/no-parsing-error"),
    "no-textarea-mustache": require("./rules/no-textarea-mustache"),
    "require-component-is": require("./rules/require-component-is"),
    "require-v-for-key": require("./rules/require-v-for-key"),
    "v-bind-style": require("./rules/v-bind-style"),
    "v-on-style": require("./rules/v-on-style"),
}
