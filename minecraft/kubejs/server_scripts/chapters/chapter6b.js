// priority: 500
// Recipe overhauls for Chapter 6 progression.

// Call the method to register time pouch crafting recipes.
if (global.RegisterTimePouchCraftingEventHandlers) {
  global.RegisterTimePouchCraftingEventHandlers()
  console.log('Successfully registered time pouch crafting recipes.')
}

/**
 * Event handler for expelling the silverfish from infested stone to generate
 * end stone.
 */
BlockEvents.rightClicked('minecraft:infested_stone', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'apotheosis:vial_of_expulsion') return

  // Each usage will spawn a silverfish.
  const silverfish = block.createEntity('minecraft:silverfish')
  silverfish.setPos(block.pos.center.add(0, 1, 0))
  silverfish.spawn()

  spawnParticles(level, 'block', block.pos.center, [0.5, 0.5, 0.5], 35, 0.01)
  // There is a 25% chance of converting the block to end stone.
  if (Math.random() < 0.25) {
    block.set('minecraft:end_stone')

    // Upon a successful conversion, there is a 2% chance the vial of expulsion
    // will be consumed.
    if (Math.random() < 0.02) {
      item.count--
    }
  }
})

/**
 * Event handler for extracting honeycombs and saturated honeycombs from
 * beehives.
 */
BlockEvents.rightClicked('minecraft:beehive', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'apotheosis:vial_of_extraction') return
  const honeyLevel = block.properties.getOrDefault('honey_level', 0)
  // Each usage will reset the honey level and create an explosion.
  block.set('minecraft:beehive', {
    facing: block.properties.facing,
    honey_level: '0',
  })
  const pos = block.pos.getCenter()
  for (let i = 0; i < 5; ++i) {
    level
      .createExplosion(
        pos.x() + global.randRange(-1.5, 1.5),
        pos.y() + global.randRange(0, 1.5),
        pos.z() + global.randRange(-1.5, 1.5)
      )
      .strength(1)
      .explode()
  }
  // Only if the honey level is 5 will there be loot returned.
  if (honeyLevel < 5) return
  const honeyCombs = Math.floor(honeyLevel * global.randRange(1.5, 2))
  block.popItemFromFace(Item.of('minecraft:honeycomb', honeyCombs), 'up')
  if (Math.random() < 0.5) {
    block.popItemFromFace(
      Item.of('kubejs:saturated_honeycomb', global.randRangeInt(3)),
      'up'
    )
  }
  // There is a 5% chance to consume the vial of extraction.
  if (Math.random() < 0.05) {
    item.count--
  }
})

LootJS.modifiers((e) => {
  // Make the ender dragon drop its head regardless of death condition.
  e.addEntityLootModifier('minecraft:ender_dragon').addLoot(
    'minecraft:dragon_head'
  )
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Remove tier salvaging recipes and recycling recipes so apotheotic materials
  // are only available through the automation recipes below.
  e.remove({ id: /^apotheotic_additions:salvaging\/[a-z]+_to_[a-z]+$/ })
  e.forEachRecipe(
    [
      { mod: 'apotheosis', type: 'create:crushing' },
      { mod: 'apotheotic_additions', type: 'create:crushing' },
    ],
    (r) => {
      const json = JSON.parse(r.json)
      if (
        json.ingredients.length === 1 &&
        json.ingredients[0].type === 'apotheosis:affix_item'
      ) {
        const rarity = json.ingredients[0].rarity
        r.replaceOutput(`${rarity}_material`, 'create:experience_block')
      }
    }
  )
  // Apotheosis material automation
  create // Common Material: Mysterious Scrap Metal
    .SequencedAssembly('tfmg:steel_mechanism')
    .fill(Fluid.of('create_enchantment_industry:experience', 16))
    .cut(2, 40)
    .custom('Next: Crush with Crushing Wheels', (pre, post) => {
      create.crushing(post, pre)
    })
    .outputs([
      'apotheosis:common_material',
      Item.of('apotheosis:common_material').withChance(0.25),
    ])
  // Uncommon Material: Timeworn Fabric
  e.remove({ id: 'apotheotic_additions:stonecutting/timeworn_fabric' })
  e.remove({ id: 'apotheotic_additions:stonecutting/timeworn_fancy' })
  create
    .deploying('apotheotic_additions:timeworn_fancy', [
      'minecraft:green_wool',
      'gag:time_sand_pouch',
    ])
    .keepHeldItem()
  create
    .deploying('apotheotic_additions:timeworn_fabric', [
      'apotheotic_additions:timeworn_fancy',
      'gag:time_sand_pouch',
    ])
    .keepHeldItem()
  create.cutting(
    '4x apotheosis:uncommon_material',
    'apotheotic_additions:timeworn_fabric'
  )
  create.cutting(
    '4x apotheosis:uncommon_material',
    'apotheotic_additions:timeworn_fancy'
  )
  create // Rare Material: Luminous Crystal Shard
    .SequencedAssembly('kubejs:crystalline_mechanism')
    .fill(Fluid.of('create_enchantment_industry:experience', 64))
    .cut(2, 40)
    .deploy('thermal:lumium_ingot')
    .custom('Next: Crush with Crushing Wheels', (pre, post) => {
      create.crushing(post, pre)
    })
    .outputs([
      'apotheosis:rare_material',
      Item.of('apotheosis:rare_material').withChance(0.25),
    ])
  create // Epic Material: Arcane Sands
    .SequencedAssembly('tfmg:limesand')
    .fill(Fluid.of('starbunclemania:source_fluid', 1000))
    .energize(50000)
    .outputs([
      'apotheosis:epic_material',
      Item.of('tfmg:limesand').withChance(0.5),
    ])
  create // Mythic Material: Godforged Pearl
    .SequencedAssembly('minecraft:ender_pearl')
    .fill(Fluid.of('create:honey', 1000))
    .energize(100000)
    .outputs('apotheosis:mythic_material')
  create // Ancient Material: rainbow thingy
    .SequencedAssembly('minecraft:totem_of_undying')
    .custom('', (pre, post) => {
      e.recipes.thermal.centrifuge(post, pre)
    })
    .press(2)
    .outputs('apotheosis:ancient_material')
  create // Artifact Material: Artifact Shards
    .SequencedAssembly('farmersdelight:pasta_with_meatballs')
    .custom('', (pre, post) => {
      create
        .mixing(post, [pre, Fluid.of('pneumaticcraft:lpg', 250)])
        .superheated()
    })
    .custom('Next: Blast with high heat', (pre, post) => {
      e.blasting(post, pre)
    })
    .custom('Next: Haunt with Soul Fire', (pre, post) => {
      create.haunting(post[0], pre)
    })
    .outputs('apotheotic_additions:artifact_material')
  // Heirloom Material: Core of the Family
  create.mixing('apotheotic_additions:heirloom_material', [
    'quark:diamond_heart',
    Fluid.of('thermal:ender', 250),
  ])
  const filledXpCrystal = Item.of('kubejs:xp_crystal')
    .enchant('cofh_core:holding', 3)
    .withNBT({ Xp: 25000 })
    .weakNBT()
  // Esoteric Material: Galactic Core
  create.energizing(
    'apotheotic_additions:esoteric_material',
    filledXpCrystal,
    1000000
  )

  // Heart of Diamond from quark
  create.mechanical_crafting(
    'quark:diamond_heart',
    [
      'AAAAA', //
      'ADDDA', //
      'ADMDA', //
      'ADDDA', //
      'AAAAA', //
    ],
    {
      A: 'createutilities:polished_amethyst',
      D: 'minecraft:diamond',
      M: 'kubejs:crystalline_mechanism',
    }
  )

  // Phantom membranes
  e.remove({ id: 'minecraft:honey_block' })
  create.haunting('minecraft:phantom_membrane', 'minecraft:honeycomb')

  // Overhauled recipe for Temporal Pouch
  e.remove({ id: 'gag:time_sand_pouch' })
  create
    .SequencedAssembly('thermal:satchel')
    .deploy('kubejs:crystalline_mechanism')
    .fill(Fluid.of('create_enchantment_industry:experience', 1000))
    .energize(20000)
    .loops(4)
    .outputs('gag:time_sand_pouch')
  // The output item for this recipe does not matter since .modifyResult will
  // dynamically add 1000 to the input item's nbt value.
  e.shapeless(Item.of('gag:time_sand_pouch', { grains: 1000 }), [
    'gag:time_sand_pouch',
    'ars_nouveau:glyph_extend_time',
  ]).modifyResult((grid) => {
    const currentGrains = grid.find('gag:time_sand_pouch').nbt.getInt('grains')
    return Item.of('gag:time_sand_pouch', `{grains:${currentGrains + 1000}}`)
  })

  // Apotheosis Vial of Searing Expulsion and Arcane Extraction
  create
    .SequencedAssembly('minecraft:glass_bottle')
    .fill(potionFluid('minecraft:thick', 125))
    .fill(Fluid.lava(500))
    .deploy('minecraft:blaze_rod')
    .deploy('minecraft:magma_cream')
    .deploy('apotheosis:gem_dust')
    .energize(10000)
    .outputs('apotheosis:vial_of_expulsion')
  create
    .SequencedAssembly('minecraft:glass_bottle')
    .fill(potionFluid('minecraft:thick', 125))
    .fill(Fluid.water(500))
    .deploy('minecraft:ender_pearl')
    .deploy('minecraft:amethyst_shard')
    .deploy('apotheosis:gem_dust')
    .energize(10000)
    .outputs('apotheosis:vial_of_extraction')

  // Custom XP Crystal
  e.replaceOutput(
    { id: 'thermal:tools/xp_crystal' },
    'thermal:xp_crystal',
    'kubejs:xp_crystal'
  )
  e.replaceInput({ mod: 'thermal' }, 'thermal:xp_crystal', 'kubejs:xp_crystal')
  create
    .SequencedAssembly('minecraft:experience_bottle')
    .deploy('minecraft:emerald')
    .deploy('minecraft:lapis_lazuli')
    .fill(Fluid.of('create_enchantment_industry:experience', 100))
    .outputs('kubejs:xp_crystal')

  // The Treasure Net is gated by a level 60 enchant
  e.recipes.apotheosis
    .enchanting('thermal:junk_net', 'kubejs:treasure_net')
    .requirements({ eterna: 30, quanta: 40, arcana: 40 })
  e.recipes.thermal.fisher_boost(
    'kubejs:treasure_net',
    1,
    0,
    'kubejs:gameplay/fishing/treasure'
  )

  // Overhauled Aquatic Entangler outputs
  global.RegisterAquaticEntanglerRecipeOverhauls(e)

  // Fish chum cycling
  create.crushing(
    [
      'kubejs:fish_chum',
      Item.of('kubejs:fish_chum').withChance(0.5),
      Item.of('kubejs:fish_chum').withChance(0.1),
      'minecraft:bone_meal',
    ],
    '#minecraft:fishes'
  )
  create
    .mixing(Fluid.of('sliceanddice:fertilizer', 1000), [
      '4x kubejs:fish_chum',
      '4x minecraft:bone_meal',
      Fluid.water(1000),
    ])
    .heated()
  redefineRecipe('4x thermal:aquachow', [
    'kubejs:fish_chum',
    'kubejs:fish_chum',
    'kubejs:fish_chum',
    'minecraft:slime_ball',
  ])
  e.remove({ id: 'thermal:deep_aquachow_4' })
  create
    .SequencedAssembly('thermal:aquachow')
    .deploy(
      Item.of('kubejs:fish_chum')
        .enchant('kubejs:nutrient_infusion', 1)
        .weakNBT()
    )
    .fill(Fluid.of('create_enchantment_industry:experience', 50))
    .deploy('kubejs:fish_hook')
    .outputs('thermal:deep_aquachow')

  // Nautilus shells can also be crushed into limestone dust.
  create.milling('tfmg:limesand', 'minecraft:nautilus_shell')

  // Totem of undying automation from Create: Totem Factory items.
  create.cutting('kubejs:totem_body_casing', 'create:brass_sheet')
  create
    .SequencedAssembly(
      'kubejs:totem_body_casing',
      'kubejs:incomplete_totem_body'
    )
    .fill(potionFluid('minecraft:long_fire_resistance', 250))
    .fill(potionFluid('minecraft:strong_regeneration', 250))
    .deploy('create:brass_sheet')
    .outputs('kubejs:totem_body')
  create.cutting('kubejs:totem_head_casing', 'create:brass_sheet')
  create
    .SequencedAssembly(
      'kubejs:totem_head_casing',
      'kubejs:incomplete_totem_head'
    )
    .deploy('minecraft:end_crystal') // TODO end crystals are expensive
    .deploy('create:brass_sheet')
    .energize(50000)
    .outputs('kubejs:totem_head')
  create.mechanical_crafting(
    'kubejs:inactive_totem',
    [
      'EHE', //
      ' B ', //
    ],
    {
      E: 'minecraft:emerald',
      H: 'kubejs:totem_head',
      B: 'kubejs:totem_body',
    }
  )
  create.filling('minecraft:totem_of_undying', [
    'kubejs:inactive_totem',
    Fluid.of('create_enchantment_industry:experience', 1000),
  ])

  // Bottles of Experience
  e.remove({ id: 'create_new_age:energising/splash_water_bottle' })

  // Liquid Hyper Experience condensing, gated behind a level 100 enchant
  e.remove({ id: 'create_enchantment_industry:mixing/hyper_experience' })
  e.recipes.apotheosis
    .enchanting('apotheosis:mythic_material', 'kubejs:inert_xp_condenser')
    .requirements({ eterna: 50, quanta: 80, arcana: 80 })
  // Hyper Experience condensing requires an inert XP condenser
  create
    .SequencedAssembly(
      'kubejs:inert_xp_condenser',
      'kubejs:incomplete_xp_condenser'
    )
    .fill(Fluid.of('create_enchantment_industry:experience', 1000))
    .custom('Next: Compact in a superheated basin', (pre, post) => {
      create.compacting(post, pre).superheated()
    })
    .outputs('kubejs:xp_condenser')
  create.emptying(
    [
      Fluid.of('create_enchantment_industry:hyper_experience', 100),
      'kubejs:inert_xp_condenser',
    ],
    'kubejs:xp_condenser'
  )

  // Provide a way to get Eternal Steak with a level 100 enchant
  e.recipes.apotheosis
    .enchanting('minecraft:cooked_beef', 'artifacts:eternal_steak')
    .requirements({ eterna: 50, quanta: 60, arcana: 60 })

  // Nether Star automation
  // Skeleton skulls can be automated with resonance crafting
  create
    .SequencedAssembly('minecraft:skeleton_skull')
    .fill(Fluid.of('create_enchantment_industry:ink', 100))
    .fill(potionFluid('apotheosis:strong_wither', 100))
    .energize(40000)
    .outputs('minecraft:wither_skeleton_skull')

  // Chorus fruit alternative pathways
  create
    .pressurizing('minecraft:chorus_fruit')
    .secondaryFluidResult(Fluid.of('starbunclemania:source_fluid', 125))
    .heated()
    .outputs('minecraft:popped_chorus_fruit')
  pneumaticcraft
    .thermo_plant()
    .item_input('minecraft:chorus_fruit')
    .temperature({ min_temp: 273 + 250 })
    .pressure(2)
    .item_output('minecraft:popped_chorus_fruit')
    .fluid_output(Fluid.of('starbunclemania:source_fluid', 150))

  // Purpur block overhaul
  e.remove({ id: 'minecraft:purpur_block' })
  create.mechanical_crafting(
    'minecraft:purpur_block',
    [
      'FFFF', //
      'FEEF', //
      'FEEF', //
      'FFFF', //
    ],
    {
      F: 'minecraft:popped_chorus_fruit',
      E: 'minecraft:end_stone',
    }
  )

  // Infused dragon's breath alternative
  pneumaticcraft
    .fluid_mixer(
      Fluid.of('create_central_kitchen:dragon_breath', 1),
      Fluid.of('create_enchantment_industry:hyper_experience', 1)
    )
    .pressure(4.8)
    .time(20)
    .fluid_output('kubejs:infused_dragon_breath', 1)

  // End crystal overhaul
  e.remove({ id: 'minecraft:end_crystal' })
  create
    .SequencedAssembly('minecraft:glass_pane')
    .deploy('minecraft:purpur_slab')
    .deploy('kubejs:crystalline_mechanism')
    .deploy('minecraft:nether_star')
    .energize(25000)
    .outputs('minecraft:end_crystal')

  e.remove({ id: 'minecraft:beacon' })
  create
    .SequencedAssembly('minecraft:obsidian')
    .deploy('minecraft:end_crystal')
    .deploy('minecraft:diamond_block')
    .deploy('minecraft:glass')
    .outputs('minecraft:beacon')

  e.remove({ id: 'create_things_and_misc:vibration_mecanism_craft' })
  create
    .SequencedAssembly('kubejs:crystalline_mechanism')
    .deploy('createutilities:polished_amethyst')
    .deploy(
      getGemItem(
        'apotheotic_additions:modded/ars_mana',
        'apotheotic_additions:esoteric'
      ),
      false,
      'Cosmic Source Jewel'
    )
    .deploy('create_things_and_misc:rose_quartz_sheet')
    .fill(potionFluid('apotheosis:extra_long_flying', 250))
    .fill(Fluid.of('kubejs:infused_dragon_breath', 250))
    .vibrate(200)
    .outputs('create_things_and_misc:vibration_mechanism')

  // TODO alternative uses for warden tendrils
  // TODO alternative uses for infused dragon's breath
})
