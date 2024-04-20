// priority: 1000

const getNameFromId = (s) => {
  const parts = s.split(':')
  if (parts.length !== 2) throw new Error(`Invalid item ${s}`)
  return parts[1]
}

const getOffsetList = (o) => {
  const minX = o.minX ?? 0
  const maxX = o.maxX ?? minX + 1
  const minY = o.minY ?? 0
  const maxY = o.maxY ?? minY + 1
  const minZ = o.minZ ?? 0
  const maxZ = o.maxZ ?? minZ + 1

  const offsetList = []
  for (const x = minX; x <= maxX; x++) {
    for (const y = minY; y <= maxY; y++) {
      for (const z = minZ; z <= maxZ; z++) {
        offsetList.push([x, y, z])
      }
    }
  }
  return offsetList
}

const clamp = (x, a, b) => {
  return Math.max(a, Math.min(x, b))
}

/**
 * Returns a random number in the range [low, high)
 * @param {number} low
 * @param {number=} high
 * @returns {number}
 */
const randRange = (low, high) => {
  if (high === undefined) {
    high = low
    low = 0
  }
  return Math.random() * (high - low) + low
}

/**
 * For shaped recipes, the passed key object must only include keys used in the
 * pattern. For ease of use, a shared key object is used for multiple recipe
 * remappings, so this helper returns a copy of the key object with all the
 * keys that are not present in the pattern removed.
 * @param {string[]} pattern Crafting pattern
 * @param {Object<string,string>} keys Item mapping for the crafting pattern.
 */
const removeUnusedKeys = (pattern, keys) => {
  const chars = new Set()
  for (const c of pattern.join('')) {
    chars.add(c)
  }
  const newKeys = {}
  for (const [key, value] of Object.entries(keys)) {
    if (chars.has(key)) {
      newKeys[key] = value
    }
  }
  return newKeys
}

// Wrapper to define a utility function in the given RecipesEventJS context that
// wraps the shaped/shapeless recipe definitions to redefine a recipe for
// a given item.
const redefineRecipe_ = (e) => {
  // Overrides shaped/shapeless recipes for a given output
  return (output, shape, keys) => {
    const id = output.replace(/^[0-9]+x /, '')
    e.remove({ output: id })
    // 3-argument shaped recipe
    if (keys !== undefined) {
      const keyCopy = removeUnusedKeys(shape, keys)
      return e.shaped(output, shape, keyCopy)
    } else {
      // 2-argument shapeless recipe
      return e.shapeless(output, shape)
    }
  }
}

const redefineMechanismRecipe_ = (e) => {
  // Redefines the recipe for 'output' as
  // A TOP A
  // M MID M
  // A BOT A
  // where A = air, M = given mechanism, and
  // TOP, MID, BOT are the respective arguments
  return (mechanism) => {
    return (output, top, middle, bottom) => {
      const id = output.replace(/^[0-9]+x /, '')
      e.remove({ output: id })
      return e.shaped(
        output,
        [
          ' T ', //
          'ZMZ', //
          ' B ', //
        ],
        {
          T: top,
          M: middle,
          B: bottom,
          Z: mechanism,
        }
      )
    }
  }
}

const redefineEnchantingRecipe_ = (e) => {
  // Recipes using the Ars Nouveau enchanting apparatus.
  return (output, inputs, reagent, source, keepReagentNbt) => {
    source = source ?? 0
    keepReagentNbt = !!keepReagentNbt
    const id = output.replace(/^[0-9]+x /, '')
    e.remove({ output: id })
    e.recipes.ars_nouveau
      .enchanting_apparatus(inputs, reagent, output, source, keepReagentNbt)
      .id(`kubejs:custom_ars_nouveau_enchanting_${getNameFromId(output)}`)
  }
}

/**
 *
 * @param {Object} o
 * @param {string} key
 * @param {Object} value
 * @returns {boolean}
 */
const setIfValid = (o, key, value) => {
  if (value === null) return false
  if (o[key] !== undefined) throw new Error(`Key ${key} is already set on ${o}`)
  o[key] = value
  return true
}
