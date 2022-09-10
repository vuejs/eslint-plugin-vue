import { computed } from 'vue'
let v = computed(() => 42)
console.log(v.value)
let a = v
console.log(a.value)
