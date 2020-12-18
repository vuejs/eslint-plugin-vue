<template>
  <BaseLayout v-bind="$attrs" v-on="$listeners">
    <slot name="sidebar-top" slot="sidebar-top" />
    <slot name="sidebar-bottom" slot="sidebar-bottom" />
    <template slot="page-top">
      <div class="theme-default-content beta-doc-description">
        <div class="warning custom-block">
          <p class="custom-block-title">Note</p>
          <p>
            This is a documentation for version <code>{{ docVersion }}</code
            >.<template v-if="hasNotYetBeenReleased">
              Also, this documentation may contain content that has not yet been
              released.</template
            ><br />
            To check version <code>6.2.2</code>
            <a :href="v6DocLink">go here</a>. To check previous releases
            <a href="https://github.com/vuejs/eslint-plugin-vue/releases"
              >go here</a
            >.
          </p>
        </div>
      </div>
      <slot name="page-top" />
    </template>
    <slot name="page-bottom" slot="page-bottom" />
  </BaseLayout>
</template>

<script>
/**
 * Layout definition to navigate to older versions of the document.
 */
import BaseLayout from '@vuepress/theme-default/layouts/Layout.vue'
import semver from 'semver'
const version = semver.parse(require('../../../../package.json').version)
export default {
  name: 'MyLayout',
  components: {
    BaseLayout
  },
  computed: {
    docVersion() {
      if (version.major < 7) {
        return '7.x'
      }
      return version.raw
    },
    hasNotYetBeenReleased() {
      if (version.major < 7) {
        return true
      }
      return false
    },
    v6DocLink() {
      if (this.$page.path.endsWith('.html')) {
        return `https://github.com/vuejs/eslint-plugin-vue/blob/v6.2.2/docs${this.$page.path.replace(
          /\.html$/,
          ''
        )}.md`
      }
      return `https://github.com/vuejs/eslint-plugin-vue/blob/v6.2.2/docs${this.$page.path}README.md`
    }
  }
}
</script>

<style scoped>
.beta-doc-description {
  padding-bottom: 0;
}
* ::v-deep .theme-default-content ~ .theme-default-content {
  padding-top: 0;
}
* ::v-deep .theme-default-content:not(.custom) h1 {
  margin-top: -3.1rem;
}
</style>
