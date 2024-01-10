<script setup>
// declares "modelValue" prop, consumed by parent via v-model
const model1 = defineModel()
// OR: declares "modelValue" prop with options
const model2 = defineModel({ type: String })

// emits "update:modelValue" when mutated
/*>*/model1/*<{"type":"expression","method":"defineModel"}*/.value = 'hello'

// declares "count" prop, consumed by parent via v-model:count
const count1 = defineModel('count')
// OR: declares "count" prop with options
const count2 = defineModel('count', { type: Number, default: 0 })

function inc() {
  // emits "update:count" when mutated
  /*>*/count1/*<{"type":"expression","method":"defineModel"}*/.value++
}

console.log(/*>*/model1/*<{"type":"expression","method":"defineModel"}*/.value)
console.log(/*>*/model2/*<{"type":"expression","method":"defineModel"}*/.value)
console.log(/*>*/count1/*<{"type":"expression","method":"defineModel"}*/.value)
console.log(/*>*/count2/*<{"type":"expression","method":"defineModel"}*/.value)
</script>
