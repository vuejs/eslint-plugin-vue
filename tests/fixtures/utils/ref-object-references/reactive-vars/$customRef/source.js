let v = $customRef((track, trigger) => {
  return {
    get() { return count },
    set(newValue) { count = newValue }
  }
})
console.log(v)
let a = v
console.log(a)
console.log($$(v))
