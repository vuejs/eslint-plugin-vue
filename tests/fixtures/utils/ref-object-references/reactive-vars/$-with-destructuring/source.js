let { a, b: c, d: [,f], g: [...h], ...i } = $(foo)
let [ x, y = 42 ] = $(bar)

console.log(
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  x,
  y
)
