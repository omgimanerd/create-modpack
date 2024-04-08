// priority: 100
// Recipe overhauls for Chapter 3B progression.

ServerEvents.compostableRecipes((e) => {
  // Add compostable magical stuff
  e.remove('ars_nouveau:sourceberry_bush')
  e.add('ars_nouveau:sourceberry_bush', 1)
})

ServerEvents.recipes((e) => {
  const nuggetFluid = global.metallurgy.kDefaultNuggetFluid
  const ingotFluid = global.metallurgy.kDefaultIngotFluid

  // Blaze burner crafting
  e.recipes.ars_nouveau.enchanting_apparatus(
    Array(8).fill('ars_nouveau:fire_essence'),
    'create:empty_blaze_burner',
    'create:blaze_burner'
  )

  // Automated dirt reward
  e.recipes.create.mixing(Item.of('minecraft:dirt', 4), [
    'thermal:compost',
    'thermal:slag',
    '#forge:sand',
  ])

  // Clay block automation, dirt comes from thermal recipe
  e.recipes.create.mixing(Item.of('minecraft:clay', 2), [
    'minecraft:dirt',
    'minecraft:sand',
    Fluid.of('minecraft:water', 1000),
  ])

  // Clay block processing
  e.remove({ id: 'create:milling/clay' })
  e.recipes.create.milling(Item.of('minecraft:clay_ball', 4), 'minecraft:clay')
  e.recipes.create.cutting(Item.of('minecraft:clay_ball', 4), 'minecraft:clay')

  // Clay block cutting into cast
  e.stonecutting('kubejs:clay_ingot_cast', 'minecraft:clay')
  e.stonecutting('kubejs:clay_gem_cast', 'minecraft:clay')

  // Tuff recipe overhaul
  e.recipes.ars_nouveau.imbuement(
    'minecraft:cobblestone',
    'minecraft:tuff',
    10,
    Array(4).fill('ars_nouveau:manipulation_essence')
  )

  // Zinc overhaul
  e.remove({ id: 'create:crushing/tuff' })
  e.remove({ id: 'create:crushing/tuff_recycling' })
  e.recipes.create
    .compacting(
      [
        Fluid.of('kubejs:molten_zinc', 3 * nuggetFluid),
        Fluid.of('kubejs:molten_lead', 3 * nuggetFluid),
      ],
      'minecraft:tuff'
    )
    .heated()

  // Brass mixing
  e.recipes.create
    .mixing(Fluid.of('kubejs:molten_brass', 2 * ingotFluid), [
      Fluid.of('kubejs:molten_copper', ingotFluid),
      Fluid.of('kubejs:molten_zinc', ingotFluid),
    ])
    .heated()

  // Nether quartz automation from soul sand
  e.recipes.create.splashing(
    ['minecraft:quartz', Item.of('minecraft:clay_ball').withChance(0.25)],
    'minecraft:soul_sand'
  )

  // Redstone automation
  e.recipes.create
    .mixing(Item.of('minecraft:redstone', 8), [
      Item.of('minecraft:cobblestone', 8),
      'minecraft:red_dye',
      Fluid.of('starbunclemania:source_fluid', 800),
    ])
    .heated()

  // Rose quartz overhaul
  e.recipes.create.filling('create:rose_quartz', [
    'minecraft:quartz',
    Fluid.of('kubejs:molten_redstone', ingotFluid * 4),
  ])

  // Polished rose quartz overhaul
  e.remove({ id: 'create:sandpaper_polishing/rose_quartz' })
  e.remove({ id: 'create:sandpaper_polishing/rose_quartz_using_deployer' })
  e.recipes.create.mixing(
    ['create:polished_rose_quartz', Item.of('minecraft:sand').withChance(0.9)],
    'create:rose_quartz'
  )

  // Electron tube overhaul
  e.remove({ id: 'create:crafting/materials/electron_tube' })
  e.recipes.create.deploying('create:electron_tube', [
    'create:iron_sheet',
    'create:polished_rose_quartz',
  ])

  // Precision mechanism
  e.remove({ output: 'create:precision_mechanism' })
  new SequencedAssembly('kubejs:andesite_mechanism')
    .transitional('create:incomplete_precision_mechanism')
    .deploy('create:electron_tube')
    .press()
    .deploy('create:brass_sheet')
    .press()
    .outputs(e, 'create:precision_mechanism')
})