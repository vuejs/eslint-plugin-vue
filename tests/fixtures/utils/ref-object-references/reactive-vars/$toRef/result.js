let v = $toRef(foo, 'bar')
console.log(/*>*/v/*<{"escape":false,"method":"$toRef"}*/)
let a = /*>*/v/*<{"escape":false,"method":"$toRef"}*/
console.log(a)
console.log($$(/*>*/v/*<{"escape":true,"method":"$toRef"}*/))
