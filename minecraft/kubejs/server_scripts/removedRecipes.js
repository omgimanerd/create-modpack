// priority: 500

// Recipes that are removed for balance or duplication reasons.
ServerEvents.recipes((e) => {
  global.removedRecipes.forEach((r) => {
    e.remove(r)

    // Debug logging
    // e.forEachRecipe(output, (r2) => {
    //   const json = JSON.parse(r2.json)
    //   console.log(json.result)
    //   console.log(json)
    //   console.log('================')
    // })
  })

  /////////////////
  // Ars Nouveau //
  /////////////////
  e.remove({ id: /ars_nouveau:manipulation_essence_to_[a-z]+ite/ })
  e.remove({ id: 'ars_nouveau:manipulation_essence_to_tuff' })
  e.remove({ id: 'ars_nouveau:manipulation_essence_to_deepslate' })

  ////////////
  // Create //
  ////////////
  e.remove({ output: '#forge:nuggets', type: 'create:splashing' })

  ///////////////////////////////////
  // Create: The Factory Must Grow //
  ///////////////////////////////////

  // Can't remove pumpjack hammer holder recipe warning?
  // e.remove(/tfmg:mechanical_crafting\/pumpjack_hammer_holder.*/)

  // Suppresses colored concrete warnings in KubeJS logs.
  e.remove(/^tfmg:colored_concrete\/full_block\/[a-z_]+concrete/)
  e.remove({ id: 'tfmg:fractional_distillation/crude_oil' })

  ///////////////////////////////////
  // PneumaticCraft: Repressurized //
  ///////////////////////////////////
  e.remove({ id: /^pneumaticcraft:[a-z_/]+compressed_iron_block$/ })
  e.remove({ id: /^pneumaticcraft:[a-z_/]+compressed_iron_ingot$/ })
  e.remove({ id: 'pneumaticcraft:thermo_plant/compressed_iron_drill_bit' })
  e.remove({ id: /^pneumaticcraft:[a-z_/]+wheat_flour$/ })

  ////////////////////
  // Thermal Series //
  ////////////////////
  // Only the crystallizer and pyrolyzer recipes are whitelisted.
  e.remove({ id: /^thermal:machines\/(?!crystallizer|pyrolyzer).*/ })
  e.remove({ id: /^thermal:earth_charge\/[a-z_]+/ })

  // TODO remove all thermal recipes that aren't used
})
