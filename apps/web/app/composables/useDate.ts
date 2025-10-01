/**
 * Composable pour formater les dates de manière cohérente
 */
export function useDate() {
  /**
   * Formate une date en français (ex: "15 janvier 2025")
   */
  const formatDate = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  /**
   * Formate une date en format court (ex: "15/01/2025")
   */
  const formatDateShort = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return new Intl.DateTimeFormat('fr-FR').format(date)
  }

  /**
   * Retourne une date relative (ex: "il y a 2 jours")
   */
  const formatDateRelative = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Aujourd'hui"
    if (diffInDays === 1) return 'Hier'
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaine${Math.floor(diffInDays / 7) > 1 ? 's' : ''}`
    if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`
    return `Il y a ${Math.floor(diffInDays / 365)} an${Math.floor(diffInDays / 365) > 1 ? 's' : ''}`
  }

  return {
    formatDate,
    formatDateShort,
    formatDateRelative
  }
}
