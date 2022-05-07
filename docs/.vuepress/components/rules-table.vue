<template>
  <div>
    <div v-if="kindMarks.length > 1" class="filter-tool">
      Highlight:
      <label v-for="kindMark in kindMarks" :key="kindMark">
        <input type="checkbox" :value="kindMark" v-model="checkedKindMarks" />
        <span class="emoji">{{ kindMark }}</span>
      </label>
    </div>
    <div class="table-root" ref="tableRoot">
      <slot />
    </div>
  </div>
</template>

<script>
const emojis = ['3️⃣', '2️⃣', '⚠️']

export default {
  data() {
    return {
      kindMarks: [],
      checkedKindMarks: []
    }
  },
  mounted() {
    this.setup()
  },
  watch: {
    checkedKindMarks: {
      handler: 'filterTable',
      deep: true
    }
  },
  methods: {
    setup() {
      const kindMarks = new Set()
      const table = this.getTable()
      for (const row of table.rows) {
        row.cells[3].classList.add('emoji')
        const trimmed = row.cells[3].textContent.trim()
        if (!trimmed) {
          continue
        }
        const chars =
          trimmed.match(new RegExp(`${emojis.join('|')}|.`, 'ug')) || []
        for (const mark of chars) {
          kindMarks.add(mark)
        }
      }
      this.kindMarks = [...kindMarks]
    },
    getTable() {
      return this.$refs.tableRoot.querySelector('table')
    },
    filterTable() {
      const table = this.getTable()
      if (this.checkedKindMarks.length === 0) {
        table.classList.remove('highlighting')
        return
      }
      table.classList.add('highlighting')
      for (const row of table.rows) {
        if (row.cells[0].tagName === 'TH') {
          row.classList.add('highlight')
          continue
        }
        const rowMarks = row.cells[3].textContent
        const highlight = this.checkedKindMarks.every((mark) =>
          rowMarks.includes(mark)
        )
        row.classList.toggle('highlight', highlight)
      }
    }
  }
}
</script>

<style scoped>
.table-root ::v-deep .highlighting tr {
  opacity: 0.3;
}
.table-root ::v-deep .highlighting .highlight {
  opacity: 1;
}
.filter-tool label {
  display: inline-flex;
  margin-right: 0.5ex;
}
</style>
