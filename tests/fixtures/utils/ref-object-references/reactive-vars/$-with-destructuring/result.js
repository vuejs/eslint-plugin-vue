let { a, b: c, d: [,f], g: [...h], ...i } = $(foo)
let [ x, y = 42 ] = $(bar)

console.log(
  /*>*/a/*<{"escape":false,"method":"$"}*/,
  b,
  /*>*/c/*<{"escape":false,"method":"$"}*/,
  d,
  e,
  /*>*/f/*<{"escape":false,"method":"$"}*/,
  g,
  /*>*/h/*<{"escape":false,"method":"$"}*/,
  /*>*/i/*<{"escape":false,"method":"$"}*/,
  /*>*/x/*<{"escape":false,"method":"$"}*/,
  /*>*/y/*<{"escape":false,"method":"$"}*/
)
