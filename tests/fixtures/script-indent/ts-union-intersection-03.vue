<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
type T = a
  | b
  | c
type U = | a
  | b
  | c
type V = a
  |
  b
  |
  c
const a = a
  |
  b
  |
  c
</script>
