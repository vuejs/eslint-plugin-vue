import { ref } from 'vue'
let v = ref(0)
console.log(/*>*/v/*<{"type":"expression","method":"ref"}*/.value)
let a = v
console.log(/*>*/a/*<{"type":"expression","method":"ref"}*/.value)
