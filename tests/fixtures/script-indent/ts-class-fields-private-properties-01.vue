<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script>
class Counter {
  #x
    =
    0;
  static
  #y
    =
    0;
  inc() {
    this
      .#x++;
    this.
      #x++;
    Counter
      .#y++;
    Counter.
      #y++;
  }
}
</script>
