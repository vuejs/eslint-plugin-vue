<!--{}-->
<template>
  <div>
    <p>
      <Address
        value=""
        onchange="await setTokenAddress(event.target.value)"/>
    </p>
  </div>
</template>
<!-- https://github.com/vuejs/eslint-plugin-vue/issues/1403 -->
