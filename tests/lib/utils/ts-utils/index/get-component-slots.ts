import path from 'node:path'
import { FIXTURES_ROOT, verifyWithTsParser } from './utils'

const SNAPSHOT_ROOT = path.resolve(FIXTURES_ROOT, './get-component-slots')

function extractComponentSlots(code: string) {
  const result: { type: string; name: string | null }[] = []
  verifyWithTsParser(code, {
    onDefineSlotsEnter(_node, slots) {
      result.push(
        ...slots.map((slot) => ({
          type: slot.type,
          name: slot.slotName
        }))
      )
    }
  })
  return result
}

describe('getComponentSlotsFromTypeDefineTypes', () => {
  it.each([
    {
      name: 'inline-type',
      scriptCode: `
        defineSlots<{
          default(props: { msg: string }): any
        }>()`
    },
    {
      name: 'inline-interface',
      scriptCode: `
        interface Slots {
          default(props: { msg: string }): any
        }
        defineSlots<Slots>()`
    },
    {
      name: 'inline-type-alias',
      scriptCode: `
        type Slots = {
          default(props: { msg: string }): any
        }
        defineSlots<Slots>()`
    }
  ])(
    'should return expected slots with $name',
    async ({ name, scriptCode }) => {
      const code = `
      <script setup lang="ts">
      ${scriptCode}
      </script>
    `
      const slots = extractComponentSlots(code)

      await expect(JSON.stringify(slots, null, 4)).toMatchFileSnapshot(
        path.join(SNAPSHOT_ROOT, `${name}.json`)
      )
    }
  )
})
