<!--{}-->
<script>
class Counter {
  get
  #x
    (
    )
  {
  }
  set
  #x
    (
      value
    ) {
  }
  static
  get
  #y
    (
    ) {
  }
  static
  set
  #y
    (
      value
    ) {
  }
  inc() {
    this
      .#inc
      (
      )
    this.
      #inc
      (
      )
  }
  #inc
    (
    ) {
    this
      .#x++;
    this.
      #x++;
    Counter
      .#staticInc
      (
      )
    Counter.
      #staticInc(
      )
  }
  static
  #staticInc
    (
    ) {
    Counter
      .#y++;
    Counter.
      #y++;
  }
}
</script>
