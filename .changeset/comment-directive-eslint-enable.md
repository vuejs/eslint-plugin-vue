---
'eslint-plugin-vue': patch
---

Fixed `vue/comment-directive` so that `<!-- eslint-enable -->` re-enables rules disabled by `<!-- eslint-disable rule -->`, and `<!-- eslint-enable rule -->` re-enables that rule after `<!-- eslint-disable -->`, as ESLint does
