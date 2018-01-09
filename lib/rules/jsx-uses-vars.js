// the following rule is based on yannickcr/eslint-plugin-react

/**
The MIT License (MIT)

Copyright (c) 2014 Yannick Croissant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

/**
 * @fileoverview Prevent variables used in JSX to be marked as unused
 * @author Yannick Croissant
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'prevent variables used in JSX to be marked as unused', // eslint-disable-line consistent-docs-description
      category: 'base',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/jsx-uses-vars.md'
    },
    schema: []
  },

  create (context) {
    return {
      JSXOpeningElement (node) {
        let name
        if (node.name.name) {
          // <Foo>
          name = node.name.name
        } else if (node.name.object) {
          // <Foo...Bar>
          let parent = node.name.object
          while (parent.object) {
            parent = parent.object
          }
          name = parent.name
        } else {
          return
        }

        context.markVariableAsUsed(name)
      }
    }
  }
}
