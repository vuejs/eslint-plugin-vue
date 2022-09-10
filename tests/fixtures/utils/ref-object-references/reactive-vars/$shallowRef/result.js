let v = $shallowRef({ count: 0 })
console.log(/*>*/v/*<{"escape":false,"method":"$shallowRef"}*/)
let a = /*>*/v/*<{"escape":false,"method":"$shallowRef"}*/
console.log(a)
console.log($$(/*>*/v/*<{"escape":true,"method":"$shallowRef"}*/))
