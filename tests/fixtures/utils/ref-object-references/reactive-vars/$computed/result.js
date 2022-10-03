let v = $computed(() => 42)
console.log(/*>*/v/*<{"escape":false,"method":"$computed"}*/)
let a = /*>*/v/*<{"escape":false,"method":"$computed"}*/
console.log(a)
console.log($$(/*>*/v/*<{"escape":true,"method":"$computed"}*/))
