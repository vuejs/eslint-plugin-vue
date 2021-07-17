<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
type Foo = new
  (
    arg1,
    arg2
  )
  =>
  T

type Foo2 = new
  <
    T
  >
  (
    arg1,
    arg2
  )
  =>
  T
</script>
