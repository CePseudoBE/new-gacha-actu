export default defineNuxtPlugin(() => {
  const { initColorMode } = useColorMode()
  initColorMode()
})
