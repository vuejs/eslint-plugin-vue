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

function formatPresets(presets) {
  if (presets.length === 1) {
    return `${presets[0]} preset`
  }
  if (presets.length === 2) {
    return `${presets.join(' and ')} presets`
  }
  return `all of ${presets.slice(0, -1).join(', ')} and ${last(presets)} presets`
}

function getPresetIds(categoryIds) {
  const subsetCategoryIds = []
  for (const categoryId of categoryIds) {
    for (const [subsetCategoryId, supersetCategoryId] of Object.entries(presetCategories)) {
      if (supersetCategoryId === categoryId) {
        subsetCategoryIds.push(subsetCategoryId)
      }
    }
  }
  if (subsetCategoryIds.length === 0) {
    return categoryIds
  }
  return [...new Set([...categoryIds, ...getPresetIds(subsetCategoryIds)])]
}
