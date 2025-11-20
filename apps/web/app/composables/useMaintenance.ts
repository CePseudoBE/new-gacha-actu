/**
 * Composable pour gérer le mode maintenance
 * Fournit les fonctions pour charger, activer, désactiver et mettre à jour la maintenance
 */
export const useMaintenance = () => {
  const api = useApi()
  const { handleApiCall } = useApiErrorHandler()

  // État serveur (réel)
  const maintenanceEnabledServer = ref(false)
  const maintenanceMessageServer = ref('')

  // État local (formulaire)
  const maintenanceEnabled = ref(false)
  const maintenanceMessage = ref('')
  const estimatedEndTime = ref('')
  const isUpdating = ref(false)

  /**
   * Charge le statut de maintenance depuis l'API
   */
  const loadStatus = async () => {
    await handleApiCall(() => api.api.maintenance.status.$get(), {
      errorMessage: 'Erreur lors du chargement du statut de maintenance',
      onSuccess: (data) => {
        if (data?.data?.data) {
          const maintenanceData = data.data.data

          // Mettre à jour l'état serveur
          maintenanceEnabledServer.value = maintenanceData.isEnabled || false
          maintenanceMessageServer.value = maintenanceData.message || ''

          // Mettre à jour l'état local
          maintenanceEnabled.value = maintenanceData.isEnabled || false
          maintenanceMessage.value = maintenanceData.message || ''

          // Convertir estimatedEndTime en format datetime-local
          if (maintenanceData.estimatedEndTime) {
            const date = new Date(maintenanceData.estimatedEndTime)
            estimatedEndTime.value = date.toISOString().slice(0, 16)
          } else {
            estimatedEndTime.value = ''
          }
        }
      },
    })
  }

  /**
   * Sauvegarde les paramètres de maintenance (enable/disable + message + estimatedEndTime)
   */
  const save = async () => {
    isUpdating.value = true

    const shouldEnable = maintenanceEnabled.value

    await handleApiCall(
      async () => {
        const body: any = { message: maintenanceMessage.value }

        // Ajouter estimatedEndTime si fourni
        if (estimatedEndTime.value) {
          body.estimatedEndTime = new Date(estimatedEndTime.value).toISOString()
        }

        if (shouldEnable) {
          return await api.api.admin.maintenance.enable.$patch(body)
        } else {
          return await api.api.admin.maintenance.disable.$patch()
        }
      },
      {
        successMessage: shouldEnable
          ? 'Mode maintenance activé'
          : 'Mode maintenance désactivé',
        errorMessage: 'Erreur lors de la modification du mode maintenance',
        onSuccess: async () => {
          maintenanceEnabledServer.value = shouldEnable
          maintenanceMessageServer.value = maintenanceMessage.value
        },
      }
    )

    isUpdating.value = false
  }

  return {
    // État serveur
    maintenanceEnabledServer,
    maintenanceMessageServer,
    // État local
    maintenanceEnabled,
    maintenanceMessage,
    estimatedEndTime,
    isUpdating,
    // Actions
    loadStatus,
    save,
  }
}
