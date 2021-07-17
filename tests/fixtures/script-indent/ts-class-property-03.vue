<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
class A {
  a: number
    =
    1
  ;
  public b
    :
    CustomType<
      T
    >
    =
    's'
  ;
  readonly protected c
    :
    {
      key: string;
      [
        name
        in
        CustomType
      ]: undefined;
      [
        key:
          string
      ]:
        string
      ;
    }
    =
    i
  ;
}
</script>
