import { toRefs } from 'vue'
let { x, y } = toRefs(foo)
console.log(x.value)
let a = y
console.log(a.value)
console.log(y.value)

let bar = toRefs(foo)
console.log(bar)
console.log(bar.x.value)
console.log(bar.y.value)

const z = bar.z
console.log(z.value)

let b;
b = bar.b
console.log(b.value)
