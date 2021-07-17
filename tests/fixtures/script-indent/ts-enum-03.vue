<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
enum FileAccess {
  // constant members
  None,
  Read    = 1 << 1,
  Write   = 1 << 2,
  ReadWrite  = Read | Write,
  // computed member
  G = "123".length
}
</script>
