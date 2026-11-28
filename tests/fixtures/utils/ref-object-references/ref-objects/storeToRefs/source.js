import { storeToRefs } from 'pinia'
let { x, y } = storeToRefs(foo)
console.log(x.value)
let a = y
console.log(a.value)
console.log(y.value)

let bar = storeToRefs(foo)
console.log(bar)
console.log(bar.x.value)
console.log(bar.y.value)

const z = bar.z
console.log(z.value)

let b;
b = bar.b
console.log(b.value)
