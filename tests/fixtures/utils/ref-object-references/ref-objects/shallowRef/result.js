import { shallowRef } from 'vue'
let v = shallowRef({ count: 0 })
console.log(/*>*/v/*<{"type":"expression","method":"shallowRef"}*/.value)
let a = v
console.log(/*>*/a/*<{"type":"expression","method":"shallowRef"}*/.value)
