<!--{}-->
<template>
  <div
    v-bind:a="
      async () =>
        await
          1
    "
  ></div>
</template>