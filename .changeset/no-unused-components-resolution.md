---
"eslint-plugin-vue": patch
---

Fixed `vue/no-unused-components` to match registered names the same way Vue resolves components, so e.g. a `myComponent` registration used only as `<MyComponent>` (which Vue cannot resolve) is now reported
