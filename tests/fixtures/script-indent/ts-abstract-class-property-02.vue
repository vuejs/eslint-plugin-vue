<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
abstract class A {
  a
    =
    1
  ;
  abstract public b
  // parser v5 does not parse value.
  //   =
  //   's'
  ;
  protected abstract c
  // parser v5 does not parse value.
  //   =
  //   i
  ;
}
</script>
