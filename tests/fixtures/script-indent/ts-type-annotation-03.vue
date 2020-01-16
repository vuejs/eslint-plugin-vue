<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
class Foo {
  prop
    :
    number;
  opt
    ?
    :
    number;
  opt2
    ?
    :
    number
    =
    42;
  abstract absopt
    ?
    :
    number;
  abstract absopt2
    ?
    :
    number
    =
    42;
}
</script>
