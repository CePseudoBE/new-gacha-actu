type ColorMode = 'light' | 'dark' | 'system'

const COLOR_MODE_KEY = 'color-mode'

export function useColorMode() {
  const colorMode = useState<ColorMode>('color-mode', () => 'system')
  const isDark = computed(() => {
    if (import.meta.server) return false
    if (colorMode.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return colorMode.value === 'dark'
  })

  function applyColorMode() {
    if (import.meta.server) return

    const shouldBeDark = isDark.value
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function setColorMode(mode: ColorMode) {
    colorMode.value = mode
    if (import.meta.client) {
      localStorage.setItem(COLOR_MODE_KEY, mode)
    }
    applyColorMode()
  }

  function toggleColorMode() {
    if (colorMode.value === 'light') {
      setColorMode('dark')
    } else if (colorMode.value === 'dark') {
      setColorMode('light')
    } else {
      // Si system, on bascule vers l'opposé de la préférence actuelle
      setColorMode(isDark.value ? 'light' : 'dark')
    }
  }

  function initColorMode() {
    if (import.meta.server) return

    // Récupérer la préférence sauvegardée
    const saved = localStorage.getItem(COLOR_MODE_KEY) as ColorMode | null
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      colorMode.value = saved
    }

    applyColorMode()

    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (colorMode.value === 'system') {
        applyColorMode()
      }
    })
  }

  return {
    colorMode: readonly(colorMode),
    isDark,
    setColorMode,
    toggleColorMode,
    initColorMode,
  }
}
