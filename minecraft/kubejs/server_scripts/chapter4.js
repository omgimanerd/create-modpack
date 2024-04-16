// priority: 100
// Recipe overhauls for Chapter 4 progression.

ItemEvents.rightClicked('kubejs:unbreakable_screwdriver', (e) => {
  const player = e.player
  if (player.level.isClientSide()) {
    player.tell('You got screwed!')
  }
})

ServerEvents.tags('item', (e) => {
  e.add('kubejs:screwdriver', 'tfmg:screwdriver')
  e.add('kubejs:screwdriver', 'kubejs:unbreakable_screwdriver')

  e.add('kubejs:steel_casts', 'kubejs:steel_ingot_cast')
  e.add('kubejs:steel_casts', 'kubejs:steel_gem_cast')
  e.add('kubejs:steel_casts', 'kubejs:steel_block_cast')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const redefineRecipe = redefineRecipe_(e)
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  // Eggs from dough
  create.haunting('minecraft:egg', 'create:dough')

  // Lava generation should be cheaper
  e.remove({ id: 'create:mixing/lava_from_cobble' })
  create.mixing(Fluid.lava(250), '#minecraft:cobblestone').superheated()

  // Make the lava filling recipe cheaper
  e.remove({ id: 'create:filling/blaze_cake' })
  create.filling('create:blaze_cake', [
    Fluid.of('minecraft:lava', 25),
    'create:blaze_cake_base',
  ])

  // Rebalance the biofuel recipe so that the ingredient per burn time
  // cost is exactly the same as blaze cakes.
  //
  // 1 blaze cake burns superheated for 160s x 20t/s = 3200t
  // 8 blaze cakes equal the ingredient cost for 1b
  // 3200t * 8 = 25600 t
  e.remove({ id: 'createaddition:liquid_burning/biofuel' })
  e.custom({
    type: 'createaddition:liquid_burning',
    input: {
      fluidTag: 'forge:biofuel',
      amount: 1000,
    },
    burnTime: 25600, // 25600 ticks per bucket (equivalent to 8x blaze cake)
    superheated: true,
  })

  // Additional straw recipe from sugarcane
  e.custom({
    type: 'createaddition:rolling',
    input: {
      item: 'minecraft:sugar_cane',
    },
    result: {
      item: 'createaddition:straw',
      count: 1,
    },
  })

  // Bone blocks
  create.compacting('minecraft:bone_block', [Fluid.of('minecraft:milk', 1000)])

  // Lime automation to allow limesand creation
  create.mixing('create:limestone', ['minecraft:bone_block', Fluid.water(1000)])

  // Charcoal transmutation to coal, with a discount for blocks
  e.recipes.ars_nouveau.enchanting_apparatus(
    ['ars_nouveau:earth_essence', 'ars_nouveau:fire_essence'],
    'minecraft:charcoal',
    'minecraft:coal',
    200
  )
  e.recipes.ars_nouveau.enchanting_apparatus(
    ['ars_nouveau:earth_essence', 'ars_nouveau:fire_essence'],
    'thermal:charcoal_block',
    'minecraft:coal_block',
    1000
  )

  // TODO use mech crafting for some recipes
  // TODO revamp cast iron? maybe remove

  // Obsidian overhaul for sturdy sheets
  e.remove({ output: 'minecraft:magma_block' })
  e.remove({ id: 'thermal:machines/press/packing2x2/press_magma_packing' })
  create.filling('minecraft:magma_block', [
    '#forge:cobblestone',
    Fluid.lava(250),
  ])
  e.remove({ id: 'create:crushing/obsidian' })
  e.recipes.ars_nouveau.crush('minecraft:obsidian', [
    Item.of('create:powdered_obsidian').withChance(1),
    Item.of('create:powdered_obsidian').withChance(0.1),
  ])
  create
    .crushing(
      Item.of('create:powdered_obsidian').withChance(0.5),
      'minecraft:obsidian'
    )
    .processingTime(200)

  // Fireclay ball recipe
  create
    .mixing('4x tfmg:fireclay_ball', [
      '2x minecraft:clay_ball',
      'create:cinder_flour',
      'create:powdered_obsidian',
    ])
    .heated()

  // Allow fireclay blocks to be crafted from fireclay
  e.shaped('tfmg:fireclay', ['FF', 'FF'], {
    F: 'tfmg:fireclay_ball',
  })

  // Coke oven blocks
  redefineRecipe(
    'tfmg:coke_oven',
    [
      'BBB', //
      'BFB', //
      'BBB',
    ],
    {
      B: 'tfmg:fireproof_bricks',
      F: 'minecraft:furnace',
    }
  )

  // Coke overhaul, this actually produces the fluid amount per tick, so the
  // total output is determined by multiplying by the processing time.
  e.remove({ id: 'tfmg:coking/coal_coke' })
  e.custom({
    type: 'tfmg:coking',
    ingredients: [
      {
        item: 'minecraft:coal',
        count: 1,
      },
    ],
    processingTime: 1000,
    results: [
      {
        item: 'tfmg:coal_coke',
        count: 4,
      },
      {
        fluid: 'tfmg:creosote',
        amount: 1,
      },
    ],
  })

  // Steel overhaul
  e.remove({ id: 'tfmg:casting/steel' })
  e.remove({ id: 'tfmg:industrial_blasting/steel' })
  create
    .mixing(
      [
        Fluid.of('tfmg:molten_steel', 3 * ingotFluid),
        Item.of('thermal:slag').withChance(0.5),
      ],
      [
        '2x tfmg:coal_coke_dust',
        Fluid.of('kubejs:molten_iron', 3 * ingotFluid),
        'tfmg:limesand',
      ]
    )
    .superheated()
    .id('kubejs:steel_smelting_overhaul')
  e.shaped(
    'tfmg:steel_block',
    [
      'SSS', //
      'SSS', //
      'SSS', //
    ],
    {
      S: 'tfmg:steel_ingot',
    }
  )

  // Recipes for reusable steel casts
  create
    .SequencedAssembly('tfmg:heavy_plate')
    .transitional('kubejs:intermediate_steel_ingot_cast')
    .deploy('tfmg:steel_ingot')
    .press(3)
    .outputs('kubejs:steel_ingot_cast')
  create
    .SequencedAssembly('tfmg:heavy_plate')
    .transitional('kubejs:intermediate_steel_gem_cast')
    .deploy('minecraft:diamond')
    .press(3)
    .outputs('kubejs:steel_gem_cast')
  create
    .SequencedAssembly('tfmg:heavy_plate')
    .transitional('kubejs:intermediate_steel_block_cast')
    .deploy('tfmg:steel_block')
    .press(3)
    .outputs('kubejs:steel_block_cast')

  // Recipe for screwdriver with rebar overhaul.
  e.remove({ id: 'tfmg:stonecutting/rebar' })
  e.custom({
    type: 'createaddition:rolling',
    input: {
      item: 'tfmg:heavy_plate',
    },
    result: {
      item: 'tfmg:rebar',
      count: 2,
    },
  })
  redefineRecipe(
    'tfmg:screwdriver',
    [
      '  R', //
      ' S ', //
      'D  ', //
    ],
    {
      R: 'tfmg:rebar',
      S: 'tfmg:steel_ingot',
      D: 'minecraft:red_dye',
    }
  )

  // Steel mechanism overhaul
  e.remove({ id: 'tfmg:sequenced_assembly/steel_mechanism' })
  create
    .SequencedAssembly('create:precision_mechanism')
    .transitional('tfmg:unfinished_steel_mechanism')
    .deploy('tfmg:heavy_plate')
    .deploy('create:sturdy_sheet')
    .press()
    .deploy('tfmg:screw')
    .deploy('#kubejs:screwdriver')
    .loops(2)
    .outputs('tfmg:steel_mechanism')
})
