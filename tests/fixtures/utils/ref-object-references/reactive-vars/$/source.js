let v = $(foo)
let { x, y } = $(bar)
console.log(v, x, y)
let a = v
console.log(a)
console.log($$({ v, x }))
