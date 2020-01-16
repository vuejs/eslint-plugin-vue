<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
interface Foo
  <
    T
  >
  extends
    Bar
      <
        T
      >,
    Baz
      <
        T
      >
{
  prop:string
}
</script>
