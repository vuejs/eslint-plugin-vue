module.exports = { getPresetIds, formatItems }

const presetCategories = {
  base: null,
  'vue2-essential': 'base',
  'vue3-essential': 'base',
  'vue2-strongly-recommended': 'vue2-essential',
  'vue3-strongly-recommended': 'vue3-essential',
  'vue2-recommended': 'vue2-strongly-recommended',
  'vue3-recommended': 'vue3-strongly-recommended'
  // 'use-with-caution': 'recommended',
  // 'vue3-use-with-caution': 'vue3-recommended'
}

function formatItems(items, suffix) {
  if (items.length === 1) {
    return `${items[0]}${suffix ? ` ${suffix[0]}` : ''}`
  }
  if (items.length === 2) {
    return `${items.join(' and ')}${suffix ? ` ${suffix[1]}` : ''}`
  }
  return `all of ${items.slice(0, -1).join(', ')} and ${[...items].pop()}${
    suffix ? ` ${suffix[1]}` : ''
  }`
}

function getPresetIds(categoryIds) {
  const subsetCategoryIds = []
  for (const categoryId of categoryIds) {
    for (const [subsetCategoryId, supersetCategoryId] of Object.entries(
      presetCategories
    )) {
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
