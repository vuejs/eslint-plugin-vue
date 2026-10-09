---
"eslint-plugin-vue": major
---

Changed `vue/block-lang` to treat the default language of a block (`html` for `<template>`, `css` for `<style>`, `js`/`javascript` for `<script>`) like any other language. Listing it in `lang` no longer forbids the attribute and no longer implicitly allows omitting it: `{ lang: 'js' }` now requires `lang="js"`, and `{ lang: ['ts', 'js'] }` now reports a `<script>` without `lang`. To keep the previous behavior (e.g. for Vetur), remove the default language from `lang` and set `allowNoLang: true`
