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
      >
{
  prop:string
}
</script>
