// priority: 100

// Recipes for molten fluids
ServerEvents.recipes((e) => {
  const kDefaultNuggetValue = 10
  const kDefaultIngotValue = 90
  const kDefaultBlockRatio = 9

  const createMeltingRecipe = (item, fluid, superheated) => {
    const recipe = e.recipes.create.mixing([fluid], item)
    if (superheated) {
      recipe.superheated()
    } else {
      recipe.heated()
    }
  }

  const createCastingRecipe = (o) => {
    const isGem = o.gem !== undefined

    const clayCastOutput = `${o.fluid}_clay_cast`
    const steelCastOutput = `${o.fluid}_steel_cast`

    const inputClayCast = isGem
      ? 'kubejs:clay_gem_cast'
      : 'kubejs:clay_ingot_cast'
    const inputSteelCast = isGem
      ? 'kubejs:steel_gem_cast'
      : 'kubejs:steel_ingot_cast'

    e.recipes.create.filling(clayCastOutput, [
      Fluid.of(o.fluid, kDefaultIngotValue),
      inputClayCast,
    ])
    e.recipes.create.filling(steelCastOutput, [
      Fluid.of(o.fluid, kDefaultIngotValue),
      inputSteelCast,
    ])

    e.recipes.create.splashing(
      [isGem ? o.gem : o.ingot, Item.of(inputClayCast).withChance(0.1)],
      clayCastOutput
    )
    e.recipes.create.splashing(
      [isGem ? o.gem : o.ingot, inputSteelCast],
      steelCastOutput
    )
  }

  global.meltable_item_data.forEach((data) => {
    if (data.fluid === undefined) {
      throw new Error('No output fluid specified!')
    }

    if (data.gem === undefined) {
      const nuggetFluid = Fluid.of(data.fluid, kDefaultNuggetValue)
      createMeltingRecipe(data.nugget, nuggetFluid, data.superheated)
      const ingotFluid = Fluid.of(data.fluid, kDefaultIngotValue)
      createMeltingRecipe(data.ingot, ingotFluid, data.superheated)
      createCastingRecipe(data)
    } else {
      const gemFluid = Fluid.of(data.fluid, kDefaultIngotValue)
      createMeltingRecipe(data.gem, gemFluid, data.superheated)
      createCastingRecipe(data)
    }

    if (data.block !== undefined) {
      const ratio =
        data.block_ratio === undefined ? kDefaultBlockRatio : data.block_ratio
      createMeltingRecipe(
        data.block,
        Fluid.of(data.fluid, kDefaultIngotValue * ratio),
        data.superheated
      )
    }
  })
})
