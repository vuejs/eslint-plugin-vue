<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}, "requirements": { "@typescript-eslint/parser": ">=5.44.1-alpha.15"}}-->
<script lang="ts">
abstract class Foo {
  abstract accessor
  foo:
    number
  // parser v5 does not parse value.
  //    =
  //    1
  ;
}
</script>
