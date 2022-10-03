let v = $ref(0)
console.log(/*>*/v/*<{"escape":false,"method":"$ref"}*/)
let a = /*>*/v/*<{"escape":false,"method":"$ref"}*/
console.log(a)
console.log($$(/*>*/v/*<{"escape":true,"method":"$ref"}*/))
