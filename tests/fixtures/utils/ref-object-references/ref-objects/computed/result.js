import { computed } from 'vue'
let v = computed(() => 42)
console.log(/*>*/v/*<{"type":"expression","method":"computed"}*/.value)
let a = v
console.log(/*>*/a/*<{"type":"expression","method":"computed"}*/.value)
