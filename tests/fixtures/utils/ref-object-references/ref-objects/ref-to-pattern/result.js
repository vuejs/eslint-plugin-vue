import { ref } from 'vue'
let v = ref(0)
const /*>*/{ value: a }/*<{"type":"pattern","method":"ref"}*/ = v
const /*>*/{ value = 42 }/*<{"type":"pattern","method":"ref"}*/ = v
console.log(a)
console.log(value)

const [x] = v
console.log(x)
