<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
interface Foo
  <
    T
  >
// implements // parsing error
// Bar
// <
// T
// >
{ }
</script>
