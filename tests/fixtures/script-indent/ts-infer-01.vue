<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
type Foo<T> = T extends Bar<
  infer
    U
> ? U : T;
</script>
