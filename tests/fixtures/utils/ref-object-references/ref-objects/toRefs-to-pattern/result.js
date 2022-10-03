import { toRefs } from 'vue'
let bar = toRefs(foo)
const { x, y = 42 } = bar
console.log(/*>*/x/*<{"type":"expression","method":"toRefs"}*/.value)
console.log(/*>*/y/*<{"type":"expression","method":"toRefs"}*/.value)
