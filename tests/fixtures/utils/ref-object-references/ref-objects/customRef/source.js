import { customRef } from 'vue'
let v = customRef((track, trigger) => {
  return {
    get() { return count },
    set(newValue) { count = newValue }
  }
})
console.log(v.value)
let a = v
console.log(a.value)
