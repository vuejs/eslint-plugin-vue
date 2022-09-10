import { ref } from 'vue'
let v = ref(0)
console.log(v.value)
let a = v
console.log(a.value)
