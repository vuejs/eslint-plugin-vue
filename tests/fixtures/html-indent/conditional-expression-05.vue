<!--{}-->
<template>
  <div
    v-bind:e="
      a ? 1 :
      b ? 2 :
      /*else*/ 3
    "
  ></div>
</template>
