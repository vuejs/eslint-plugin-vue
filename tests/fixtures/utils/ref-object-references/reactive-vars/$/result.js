let v = $(foo)
let { x, y } = $(bar)
console.log(/*>*/v/*<{"escape":false,"method":"$"}*/, /*>*/x/*<{"escape":false,"method":"$"}*/, /*>*/y/*<{"escape":false,"method":"$"}*/)
let a = /*>*/v/*<{"escape":false,"method":"$"}*/
console.log(a)
console.log($$({ /*>*/v/*<{"escape":true,"method":"$"}*/, /*>*/x/*<{"escape":true,"method":"$"}*/ }))
