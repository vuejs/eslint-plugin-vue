import { storeToRefs } from 'pinia'
let { x, y } = storeToRefs(foo)
console.log(/*>*/x/*<{"type":"expression","method":"storeToRefs"}*/.value)
let a = y
console.log(/*>*/a/*<{"type":"expression","method":"storeToRefs"}*/.value)
console.log(/*>*/y/*<{"type":"expression","method":"storeToRefs"}*/.value)

let bar = storeToRefs(foo)
console.log(bar)
console.log(/*>*/bar.x/*<{"type":"expression","method":"storeToRefs"}*/.value)
console.log(/*>*/bar.y/*<{"type":"expression","method":"storeToRefs"}*/.value)

const z = bar.z
console.log(/*>*/z/*<{"type":"expression","method":"storeToRefs"}*/.value)

let b;
/*>*/b/*<{"type":"pattern","method":"storeToRefs"}*/ = bar.b
console.log(/*>*/b/*<{"type":"expression","method":"storeToRefs"}*/.value)
