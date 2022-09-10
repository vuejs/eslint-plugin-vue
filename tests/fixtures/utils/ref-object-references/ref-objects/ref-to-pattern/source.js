import { ref } from 'vue'
let v = ref(0)
const { value: a } = v
const { value = 42 } = v
console.log(a)
console.log(value)

const [x] = v
console.log(x)
