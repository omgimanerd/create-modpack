// priority: 0

ItemEvents.tooltip((e) => {
  e.add(
    'kubejs:screwdriver_of_assblasting',
    Text.green('An unbreakable screwdriver!')
  )
})

ClientEvents.lang('en_us', (e) => {
  e.renameItem('tfmg:plastic_sheet', 'Plastic')
})
