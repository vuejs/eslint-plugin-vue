<!--{"languageOptions": {"parserOptions": {"parser":"@typescript-eslint/parser"}}}-->
<script lang="ts">
enum Direction {
  // comment
  Up = 1,
  // comment
  Down,
  Left
    = 2,
  // [ // Currently, computed property names are not allowed in enums.
  Right
    // ]
    =
    3,
}
</script>
