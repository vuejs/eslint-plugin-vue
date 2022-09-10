import { toRefs } from 'vue'
let bar = toRefs(foo)
const { x, y = 42 } = bar
console.log(x.value)
console.log(y.value)
