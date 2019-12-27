<!--{}-->
<template>
  <div>
    <span
      v-if="
        a &&
          b"
    >
    </span>
    <span
      v-if="
        a
          && b"
    >
    </span>
    <span
      v-if="
        a
          &&
          b"
    >
    </span>
    <!-- Enclosed in parentheses -->
    <span
      v-if="(
        a &&
        b
      )"
    >
    </span>
    <span
      v-if="(
        a
        && b
      )"
    >
    </span>
    <span
      v-if="(
        a
        &&
        b
      )"
    >
    </span>
    <!-- The first line is the same line -->
    <span
      v-if="a &&
        b"
    >
    </span>
    <span
      v-if="a
        && b"
    >
    </span>
    <span
      v-if="a
        &&
        b"
    >
    </span>
  </div>
</template>
