<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
const BaseLayout = DefaultTheme.Layout
const { frontmatter } = useData()
const pageClass = computed(() => frontmatter.value.pageClass || '')
</script>

<template>
  <div :class="pageClass">
    <BaseLayout />
  </div>
</template>

<style scoped>
/* Rule Page */
.rule-details :deep(.main h1 + blockquote ::first-letter) {
  text-transform: uppercase;
}
</style>
