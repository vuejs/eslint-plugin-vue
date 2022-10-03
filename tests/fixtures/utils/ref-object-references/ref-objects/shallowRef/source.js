import { shallowRef } from 'vue'
let v = shallowRef({ count: 0 })
console.log(v.value)
let a = v
console.log(a.value)
