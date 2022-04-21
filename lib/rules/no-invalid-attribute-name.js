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
      description:
        'require the attributes to match the imported component name',
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
    const getName = (key) => {
      if (typeof key === 'string') {
        return key
      }

      return key.name
    }

    return utils.defineTemplateBodyVisitor(context, {
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
