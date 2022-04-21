/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const xnv = require('xml-name-validator')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require valid attribute names',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-invalid-attribute-name.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Attribute name {{name}} is not valid.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @param {string | VIdentifier} key
     * @return {string}
     */
    const getName = (key) => (typeof key === 'string' ? key : key.name)

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VAttribute} node */
      /** @param {VAttribute} node */
      VAttribute(node) {
        const name = getName(node.key.name)

        if (!xnv.name(name)) {
          context.report({
            node,
            messageId: 'unexpected',
            data: {
              name
            }
          })
        }
      }
    })
  }
}
