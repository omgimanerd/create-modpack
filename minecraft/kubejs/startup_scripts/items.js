// priority: 10

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  // Wooden hand used for crafting deployers
  registerItem('kubejs:wooden_hand')

  // Unbreakable screwdriver for crafting steel mechanisms
  e.create('kubejs:unbreakable_screwdriver')
    .texture(getResourceLocation('tfmg:screwdriver'))
    .displayName('Unbreakable Screwdriver')
    .tooltip(Text.green('An unbreakable screwdriver!'))
    .glow(true)
    .fireResistant(true)
    .maxDamage(0)

  // Diamond sawblades for silicon cutting
  e.create('kubejs:diamond_saw_blade')
    .textureJson({
      layer0: getResourceLocation('thermal:saw_blade'),
    })
    .color(0xaffffa)
    .displayName('Diamond Saw Blade')
    .fireResistant(true)
    .maxDamage(64)
    .tag('kubejs:diamond_saw_blade')
    .unstackable()
  e.create('kubejs:unbreakable_diamond_saw_blade')
    .textureJson({
      layer0: getResourceLocation('thermal:saw_blade'),
    })
    .color(0xaffffa)
    .displayName('Unbreakable Diamond Saw Blade')
    .tooltip(Text.green("An unbreakable diamond saw blade. It's quite sharp"))
    .fireResistant(true)
    .glow(true)
    .maxDamage(0)
    .tag('kubejs:diamond_saw_blade')
    .unstackable()

  // Silicon wafers produced from cutting silicon
  e.create('kubejs:silicon_wafer')
    .textureJson({
      layer0: getResourceLocation('refinedstorage:silicon'),
    })
    .color(0, 0xaa9eac)
    .displayName('Silicon Wafer')

  // Intermediate item for transistors
  e.create('kubejs:intermediate_transistor', 'create:sequenced_assembly')
    .texture(getResourceLocation('pneumaticcraft:transistor'))
    .maxStackSize(16)

  // Intermediate item for capacitors
  e.create('kubejs:intermediate_capacitor', 'create:sequenced_assembly')
    .texture(getResourceLocation('pneumaticcraft:capacitor'))
    .maxStackSize(16)

  // Intermediate item for pneumatic cylinders
  e.create(
    'kubejs:intermediate_pneumatic_cylinder',
    'create:sequenced_assembly'
  )
    .texture(getResourceLocation('pneumaticcraft:pneumatic_cylinder'))
    .maxStackSize(16)

  // Wire variant of Create: New Age charged items
  e.create('kubejs:overcharged_diamond_wire')
    .textureJson({
      layer0: getResourceLocation('createaddition:iron_wire'),
    })
    .color(0, 0x75eae3)
    .displayName('Overcharged Diamond Wire')

  // Graphite, produced by heating silicon carbide
  registerItem('kubejs:graphite')

  // Essences from killing wandering traders
  e.create('kubejs:agony_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_tube_coral',
    })
    .color(0, 0x75eae3)
    .glow(true)
    .displayName('Agony Essence')
    .tooltip('Magical Essences created through the distillation of agony.')
  e.create('kubejs:suffering_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_brain_coral',
    })
    .color(0, 0xab87d2)
    .glow(true)
    .displayName('Suffering Essence')
    .tooltip(
      'Magical Essences created through the concentration of raw suffering.'
    )
  e.create('kubejs:torment_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_bubble_coral',
    })
    .color(0, 0x69fa00)
    .glow(true)
    .displayName('Torment Essence')
    .tooltip('Magical Essences created through the application of torment.')
  e.create('kubejs:debilitation_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_fire_coral',
    })
    .color(0, 0x696969)
    .glow(true)
    .displayName('Debilitation Essence')
    .tooltip('Magical Essences created through the refinement of debilitation.')
  e.create('kubejs:mutilation_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_horn_coral',
    })
    .color(0, 0xa999bc)
    .glow(true)
    .displayName('Mutilation Essence')
    .tooltip('Magical Essences created through merciless mutilation.')
})
