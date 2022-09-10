import { customRef } from 'vue'
let v = customRef((track, trigger) => {
  return {
    get() { return count },
    set(newValue) { count = newValue }
  }
})
console.log(/*>*/v/*<{"type":"expression","method":"customRef"}*/.value)
let a = v
console.log(/*>*/a/*<{"type":"expression","method":"customRef"}*/.value)
