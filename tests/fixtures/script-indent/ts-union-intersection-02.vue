<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
type T =
  a
  | b
type U =
  | a
  | b
type V =
  a
  & b
type W =
  & a
  & b
type X =
  &
  (
    a
    | b
  )
</script>
