<!--{"languageOptions": {"parserOptions": {"parser":"@typescript-eslint/parser"}}}-->
<script lang="ts">
type Foo
  <
    T,
    U
      extends
        T,
    V
      =
      keyof
        U
  >
  =
  Bar
;
</script>
