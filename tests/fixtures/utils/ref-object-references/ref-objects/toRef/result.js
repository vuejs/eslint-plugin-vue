import { toRef } from 'vue'
let v = toRef(foo, 'bar')
console.log(/*>*/v/*<{"type":"expression","method":"toRef"}*/.value)
let a = v
console.log(/*>*/a/*<{"type":"expression","method":"toRef"}*/.value)
