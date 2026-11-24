---
"eslint-plugin-vue": minor
---

Fixed `vue/no-mutating-props` false negatives for `const` aliases destructured or assigned from the props object or its members, e.g. `const { user } = props; user.name = 'x'`
