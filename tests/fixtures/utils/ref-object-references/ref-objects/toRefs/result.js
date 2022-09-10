import { toRefs } from 'vue'
let { x, y } = toRefs(foo)
console.log(/*>*/x/*<{"type":"expression","method":"toRefs"}*/.value)
let a = y
console.log(/*>*/a/*<{"type":"expression","method":"toRefs"}*/.value)
console.log(/*>*/y/*<{"type":"expression","method":"toRefs"}*/.value)

let bar = toRefs(foo)
console.log(bar)
console.log(/*>*/bar.x/*<{"type":"expression","method":"toRefs"}*/.value)
console.log(/*>*/bar.y/*<{"type":"expression","method":"toRefs"}*/.value)

const z = bar.z
console.log(/*>*/z/*<{"type":"expression","method":"toRefs"}*/.value)

let b;
/*>*/b/*<{"type":"pattern","method":"toRefs"}*/ = bar.b
console.log(/*>*/b/*<{"type":"expression","method":"toRefs"}*/.value)
