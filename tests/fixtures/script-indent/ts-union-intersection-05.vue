<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
type T = U<
  a
    | b
    | c,
  a
    | b
    | c
>
type T = U<
  a
    & b
    & c,
  a
    & b
    & c
>
</script>
