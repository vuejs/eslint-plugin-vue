let v = $customRef((track, trigger) => {
  return {
    get() { return count },
    set(newValue) { count = newValue }
  }
})
console.log(/*>*/v/*<{"escape":false,"method":"$customRef"}*/)
let a = /*>*/v/*<{"escape":false,"method":"$customRef"}*/
console.log(a)
console.log($$(/*>*/v/*<{"escape":true,"method":"$customRef"}*/))
