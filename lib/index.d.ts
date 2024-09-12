type ConfigName =
  | "base"
  | "essential"
  | "no-layout-rules"
  | "recommended"
  | "strongly-recommended"
  | "vue3-essential"
  | "vue3-recommended"
  | "vue3-strongly-recommended"
  | "flat/base"
  | "flat/vue2-essential"
  | "flat/vue2-recommended"
  | "flat/vue2-strongly-recommended"
  | "flat/essential"
  | "flat/recommended"
  | "flat/strongly-recommended"

declare const vue: {
  meta: any
  configs: {
    [name in keyof ConfigName]: any
  }
  rules: Record<string, any>
  processors: {
    ".vue": any
    vue: any
  }
  environments: {
    /**
     * @deprecated
     */
    "setup-compiler-macros": {
      globals: {
        defineProps: "readonly"
        defineEmits: "readonly"
        defineExpose: "readonly"
        withDefaults: "readonly"
      }
    }
  }
}

export = vue
