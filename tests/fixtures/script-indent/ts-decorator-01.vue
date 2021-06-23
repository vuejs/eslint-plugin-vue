<!--{"parserOptions": {"parser":"@typescript-eslint/parser"}}-->
<script lang="ts">
class
  ExampleClass
{
  @first
    (
    )
  @second
    (
    )
  method
    (
    )
  {
  }
}

@sealed
class
  BugReport
{
  type
    =
    "report"
  ;
  title
    :
    string
  ;

  constructor
    (
      t
        :
        string
    )
  {
    this
      .
      title
      =
      t
    ;
  }
}

class
  Greeter
{
  greeting
    :
    string
  ;
  constructor
    (
      message
        :
        string
    )
  {
    this
      .
      greeting
      =
      message
    ;
  }

  @
  enumerable
    (
      false
    )
  greet
    (
    )
  {
    return "Hello, "
      +
      this
        .
        greeting
    ;
  }
}

class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @
  configurable
    (
      false
    )
  get
  x
    (
    )
  {
    return this._x;
  }

  @
  configurable
    (
      false
    )
  get
  y
    (
    )
  {
    return this._y;
  }
}

class Greeter {
  @
  format
    (
      "Hello, %s"
    )
  greeting
    :
    string
  ;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}

class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }

  @
  validate
  print
    (
      @
      required
      verbose
        :
        boolean
    ) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`;
    } else {
      return this.title;
    }
  }
}

class Line {
  private _start: Point;
  private _end: Point;
  @
  validate
  @
  Reflect
    .
    metadata(
      "design:type"
      ,
      Point
    )
  set start(value: Point) {
    this._start = value;
  }
  get start() {
    return this._start;
  }
  @
  validate
  @
  Reflect
    .
    metadata(
      "design:type"
      ,
      Point
    )
  set
  end(value: Point) {
    this._end = value;
  }
  get end() {
    return this._end;
  }
}
</script>
