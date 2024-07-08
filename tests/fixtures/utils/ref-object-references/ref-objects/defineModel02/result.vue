<script setup>
const [modelValue, modelModifiers] = defineModel({
  // get() omitted as it is not needed here
  set(value) {
    // if the .trim modifier is used, return trimmed value
    if (modelModifiers.trim) {
      return value.trim()
    }
    // otherwise, return the value as-is
    return value
  }
})

console.log(/*>*/modelValue/*<{"type":"expression","method":"defineModel"}*/.value)
console.log(modelModifiers.value)
</script>
