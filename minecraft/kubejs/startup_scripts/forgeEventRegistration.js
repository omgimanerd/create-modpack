// priority: 1000

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityStruckByLightningEvent',
  (e) => {
    // Callback defined in server_scripts
    if (global.EntityStruckByLightningEventCallback) {
      global.EntityStruckByLightningEventCallback(e)
    }
  }
)
