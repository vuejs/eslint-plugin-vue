<!--{}-->
<template>
  <div class="foo">
    Hello.
  </div>
  <div
    id="a"
    class="b"
    :other-attr="{
      aaa: 1,
      bbb: 2
    }"
    @other-attr2="
      foo()
      bar()
    "
  >
    {{
      displayMessage
    }}
  </div>
</template>