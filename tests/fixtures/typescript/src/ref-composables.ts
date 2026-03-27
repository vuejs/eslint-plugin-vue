import {
  ref,
  computed,
  shallowRef,
  type Ref,
  type ComputedRef,
  type ShallowRef
} from 'vue'

export function useCount(): Ref<number> {
  return ref(0)
}

export function useComputed(): ComputedRef<string> {
  return computed(() => '')
}

export function useShallow(): ShallowRef<{ name: string }> {
  return shallowRef({ name: '' })
}

export function useNullableRef(): Ref<boolean> | undefined {
  return ref(true)
}

export function useMaybeRef(): string | Ref<string> {
  return ref('')
}

export function usePlainValue(): string {
  return ''
}

export function useObjectComposable(): {
  count: Ref<number>
  label: ComputedRef<string>
} {
  return { count: ref(0), label: computed(() => '') }
}

export function useArrayComposable(): [Ref<number>, ComputedRef<string>] {
  return [ref(0), computed(() => '')]
}
