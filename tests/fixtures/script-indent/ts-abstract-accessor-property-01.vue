<!--{"languageOptions": {"parserOptions": {"parser":"@typescript-eslint/parser"}}}-->
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
