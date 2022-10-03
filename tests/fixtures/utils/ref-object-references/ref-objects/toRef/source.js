import { toRef } from 'vue'
let v = toRef(foo, 'bar')
console.log(v.value)
let a = v
console.log(a.value)
