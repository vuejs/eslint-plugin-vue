const last = require('lodash/last')

module.exports = { getPresetIds, formatItems }

const presetCategories = {
  base: null,
  essential: 'base',
  'vue3-essential': 'base',
  'strongly-recommended': 'essential',
  'vue3-strongly-recommended': 'vue3-essential',
  recommended: 'strongly-recommended',
  'vue3-recommended': 'vue3-strongly-recommended'
  // 'use-with-caution': 'recommended',
  // 'vue3-use-with-caution': 'vue3-recommended'
}

function formatItems(items) {
  if (items.length <= 2) {
    return items.join(' and ')
  }
  return `all of ${items.slice(0, -1).join(', ')} and ${last(items)}`
}
function getPresetIds(categoryIds) {
  const subsetCategoryIds = []
  for (const categoryId of categoryIds) {
    for (const subsetCategoryId in presetCategories) {
      if (presetCategories[subsetCategoryId] === categoryId) {
        subsetCategoryIds.push(subsetCategoryId)
      }
    }
  }
  if (subsetCategoryIds.length === 0) {
    return categoryIds
  }
  return [...new Set([...categoryIds, ...getPresetIds(subsetCategoryIds)])]
}
