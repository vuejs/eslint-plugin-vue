<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
type T = [
  a
    | b
    | c
]
type U = [
  | a
    | b
    | c
]
type T2 = [ a
              | b
              | c,
            a
              | b
              | c
]
type U2 = [ | a
              | b
              | c,
            | a
              | b
              | c
]
</script>
