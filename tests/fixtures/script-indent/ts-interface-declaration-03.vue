<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
function fn() {
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
}
</script>
