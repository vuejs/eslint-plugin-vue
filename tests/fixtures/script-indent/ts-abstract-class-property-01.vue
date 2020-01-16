<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
abstract class A {
  abstract a;
  abstract public b;
  public abstract c;
  abstract protected d;
  protected abstract e;
  abstract private f;
  private abstract g;
}

abstract class B {
  readonly abstract a;
  abstract readonly b;
  abstract readonly public c;
  public abstract readonly d;
  public readonly abstract e;
  public static readonly  a;
  public abstract readonly  a;
}
</script>
