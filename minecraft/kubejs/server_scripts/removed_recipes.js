// priority: 500

// Only matchers that should be fully removed from crafting and JEI should go
// here. JEI.hideItems uses the matcher in key: output
global.hideJEI = false
global.removedRecipes = [
  { output: /^ars_nouveau:[a-z]+_sourcelink/ },
  { output: 'compressedcreativity:compressed_iron_casing' },
  { output: 'create:brass_hand' },
  { output: 'createaddition:electric_motor' },
  { output: 'createaddition:alternator' },
  { output: 'createaddition:capacitor' },
  { output: /^createconnected:copycat_[a-z_]+/ },
  { output: /^pneumaticcraft:compressed_iron.*/ },
  { output: 'pneumaticcraft:pneumatic_dynamo' },
  { output: 'pneumaticcraft:copper_nugget' },
  { output: 'pneumaticcraft:ingot_iron_compressed' },
  { output: 'pneumaticcraft:drill_bit_compressed_iron' },
  { output: 'pneumaticcraft:logistics_core' },
  { output: 'pneumaticcraft:wheat_flour' },
  { output: /^tfmg:[a-z_]+_concrete$/ },
  { output: /^tfmg:cast_iron_distillation.*/ },
  { output: /^tfmg:casting_.*/ },
  { output: /^tfmg:.*engine.*/ },
  { output: 'tfmg:lignite' },
  { output: 'tfmg:fireclay' },
  { output: 'tfmg:exhaust' },
  { output: 'tfmg:sulfur_dust' },
  { output: '#thermal:dynamos' },
  { output: '#thermal:machines' },
  { output: '#forge:coins' },
  { output: /^starbunclemania:star_[a-z_]+/ },
]

// Recipes that are removed for balance or duplication reasons.
ServerEvents.recipes((e) => {
  global.removedRecipes.forEach((r) => {
    e.remove(r)
  })

  ////////////
  // Create //
  ////////////
  e.remove({ output: '#forge:nuggets', type: 'create:splashing' })

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
  e.remove({ id: /^thermal:machines.*/ })
  e.remove({ id: /^thermal:earth_charge\/[a-z_]+/ })

  // Can't remove pumpjack hammer holder recipe warning?
  // e.remove(/tfmg:mechanical_crafting\/pumpjack_hammer_holder.*/)
  e.remove(/^tfmg:colored_concrete\/full_block\/[a-z_]+concrete/)
})
