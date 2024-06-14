// priority: 0
// Recategorizes the custom brewing and centrifugation recipes so that potion
// recipes don't clutter JEI.

;(() => {
  // The Centrifugation recipe category, contains the code that performs the
  // actual rendering of the recipe inputs and outputs in JEI
  const $CentrifugationCategory = Java.loadClass(
    'com.negodya1.vintageimprovements.compat.jei.category.CentrifugationCategory'
  )

  // RecipeType and the actual underlying processing recipe. Needed to create a
  // RecipeType for the custom category registration.
  const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  const $CentrifugationRecipe = Java.loadClass(
    'com.negodya1.vintageimprovements.content.kinetics.centrifuge.CentrifugationRecipe'
  )
  const $Info = Java.loadClass(
    'com.simibubi.create.compat.jei.category.CreateRecipeCategory$Info'
  )
  const potionCentrifugationRecipeType = $RecipeType.create(
    'kubejs',
    'potion_centrifuging',
    $CentrifugationRecipe
  )

  JEIAddedEvents.registerCategories((e) => {
    const guiHelper = e.data.jeiHelpers.guiHelper
    // Create a concrete instance of the centrifugation recipe category and
    // defer our custom category to use its render code.
    const centrifugationCategory = new $CentrifugationCategory(
      // Don't actually need any of the subfields, just need an instance of
      // CentrifugationCategory to call its lookup and draw handler.
      new $Info(null, null, null, null, null, null)
    )
    e.register(potionCentrifugationRecipeType, (category) => {
      category
        .title('Potion Centrifugation')
        .background(guiHelper.createBlankDrawable(177, 113))
        .icon(
          doubleItemIcon(
            'vintageimprovements:centrifuge',
            Item.of('minecraft:potion', '{Potion:"minecraft:healing"}')
          )
        )
        .isRecipeHandled(() => true)
        .handleLookup((builder, recipe, focuses) => {
          centrifugationCategory.setRecipe(builder, recipe, focuses)
        })
        .setDrawHandler(
          (recipe, recipeSlotsView, guiGraphics, mouseX, mouseY) => {
            centrifugationCategory.draw(
              recipe,
              recipeSlotsView,
              guiGraphics,
              mouseX,
              mouseY
            )
          }
        )
    })
  })

  JEIAddedEvents.onRuntimeAvailable((e) => {
    const { recipeManager } = e.data

    // Move all custom potion brewing recipes from the Create mixer category to
    // Create automated brewing.
    const createMixingRecipeType = recipeManager
      .getRecipeType('create:mixing')
      .get()
    const createAutomaticBrewingRecipeType = recipeManager
      .getRecipeType('create:automatic_brewing')
      .get()
    const customBrewingRecipes = recipeManager
      .createRecipeLookup(createMixingRecipeType)
      .get()
      .filter((recipe) => {
        return recipe
          .getId()
          .toString()
          .startsWith('kubejs:create_potion_mixing')
      })
      .toList()
    recipeManager.hideRecipes(createMixingRecipeType, customBrewingRecipes)
    recipeManager.addRecipes(
      createAutomaticBrewingRecipeType,
      customBrewingRecipes
    )

    // Move all potion centrifugation recipes from the CVI category to the new
    // custom category.
    const centrifugationRecipeType = recipeManager
      .getRecipeType('vintageimprovements:centrifugation')
      .get()
    const customCentrifugationRecipes = recipeManager
      .createRecipeLookup(centrifugationRecipeType)
      .get()
      .filter((recipe) => {
        return recipe
          .getId()
          .toString()
          .startsWith('kubejs:create_potion_centrifuging')
      })
      .toList()
    recipeManager.hideRecipes(
      centrifugationRecipeType,
      customCentrifugationRecipes
    )
    recipeManager.addRecipes(
      potionCentrifugationRecipeType,
      customCentrifugationRecipes
    )
  })

  JEIAddedEvents.registerRecipeCatalysts((e) => {
    e.data.addRecipeCatalyst(
      'vintageimprovements:centrifuge',
      potionCentrifugationRecipeType
    )
    e.data.addRecipeCatalyst('create:basin', potionCentrifugationRecipeType)
  })
})()
