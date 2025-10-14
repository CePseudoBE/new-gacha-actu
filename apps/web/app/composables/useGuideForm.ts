import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { useApiErrorHandler } from './useApiErrorHandler'

const guideSectionSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200).describe('Titre de la section'),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères').max(10000).describe('Contenu de la section'),
  order: z.number().min(0).describe('Ordre de la section'),
})

const guidePrerequisiteSchema = z.object({
  description: z.string().min(5, 'La description doit contenir au moins 5 caractères').max(500).describe('Description du prérequis'),
})

const guideFormSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères').max(200),
  summary: z.string().min(50, 'Le résumé doit contenir au moins 50 caractères').max(500),
  author: z.string().min(2, "L'auteur doit contenir au moins 2 caractères").max(100),
  publishedAt: z.string(),
  readingTime: z.number().min(1).max(120).optional(),
  difficultyId: z.number({ required_error: 'Sélectionnez un niveau de difficulté' }),
  guideTypeId: z.number({ required_error: 'Sélectionnez un type de guide' }),
  isPopular: z.boolean(),
  gameId: z.number({ required_error: 'Sélectionnez un jeu' }),
  metaDescription: z.string().min(10).max(160).optional(),
  sections: z.array(guideSectionSchema).min(1, 'Au moins une section est requise').max(20),
  prerequisites: z.array(guidePrerequisiteSchema).max(10).optional(),
  tagIds: z.array(z.number()).optional(),
  seoKeywordIds: z.array(z.number()).optional(),
  image: z.any().optional(),
})

export type GuideFormValues = z.infer<typeof guideFormSchema>

interface GuidePayload {
  title: string
  summary: string
  author: string
  publishedAt: string
  isPopular: boolean
  gameId: number
  difficultyId: number
  guideTypeId: number
  sections: Array<{ title: string; content: string; order: number }>
  metaDescription?: string
  readingTime?: number
  prerequisites?: Array<{ description: string }>
  tagIds?: number[]
  seoKeywordIds?: number[]
}

export const useGuideForm = (initialValues?: Partial<GuideFormValues>) => {
  const api = useApi()
  const { handleError: apiHandleError } = useApiErrorHandler()
  const selectedImage = ref<File | null>(null)

  const form = useForm({
    validationSchema: toTypedSchema(guideFormSchema),
    initialValues: {
      title: initialValues?.title || '',
      summary: initialValues?.summary || '',
      author: initialValues?.author || '',
      publishedAt: initialValues?.publishedAt || new Date().toISOString().slice(0, 16),
      readingTime: initialValues?.readingTime || undefined,
      difficultyId: initialValues?.difficultyId || undefined,
      guideTypeId: initialValues?.guideTypeId || undefined,
      isPopular: initialValues?.isPopular || false,
      gameId: initialValues?.gameId || undefined,
      metaDescription: initialValues?.metaDescription || '',
      sections: initialValues?.sections || [{ title: '', content: '', order: 0 }],
      prerequisites: initialValues?.prerequisites || [],
      tagIds: initialValues?.tagIds || [],
      seoKeywordIds: initialValues?.seoKeywordIds || [],
      image: null,
    },
  })

  const { handleSubmit, isSubmitting, setFieldValue, setValues, resetForm, values } = form

  const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const file = target.files[0]

      // Validation type MIME
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(file.type)) {
        toast.error('Format de fichier invalide. Utilisez JPG, PNG, WEBP ou GIF.')
        target.value = ''
        return
      }

      // Validation taille (2MB max)
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        toast.error("L'image est trop volumineuse. Taille maximale : 2MB.")
        target.value = ''
        return
      }

      selectedImage.value = file
      setFieldValue('image', file)
    }
  }

  const prepareFormData = (values: GuideFormValues) => {
    // Convert datetime-local format to backend format
    const formatDateForBackend = (dateString: string) => {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    const payload: GuidePayload = {
      title: values.title,
      summary: values.summary,
      author: values.author,
      publishedAt: formatDateForBackend(values.publishedAt),
      isPopular: values.isPopular,
      gameId: values.gameId,
      difficultyId: values.difficultyId,
      guideTypeId: values.guideTypeId,
      sections: values.sections,
    }

    if (values.metaDescription) payload.metaDescription = values.metaDescription
    if (values.readingTime) payload.readingTime = values.readingTime
    if (values.prerequisites && values.prerequisites.length > 0)
      payload.prerequisites = values.prerequisites
    if (values.tagIds && values.tagIds.length > 0) payload.tagIds = values.tagIds
    if (values.seoKeywordIds && values.seoKeywordIds.length > 0)
      payload.seoKeywordIds = values.seoKeywordIds

    const formData = new FormData()

    // Append sections - each section as separate fields
    payload.sections.forEach((section, index) => {
      formData.append(`sections[${index}][title]`, section.title)
      formData.append(`sections[${index}][content]`, section.content)
      formData.append(`sections[${index}][order]`, section.order.toString())
    })

    // Append prerequisites if exists
    if (payload.prerequisites) {
      payload.prerequisites.forEach((prereq, index) => {
        formData.append(`prerequisites[${index}][description]`, prereq.description)
      })
    }

    // Append other fields
    Object.keys(payload).forEach((key) => {
      if (key !== 'sections' && key !== 'prerequisites') {
        const value = payload[key as keyof GuidePayload]

        // Skip undefined values
        if (value === undefined) {
          return
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item.toString())
          })
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    return formData
  }

  const createGuide = async (values: GuideFormValues) => {
    const formData = prepareFormData(values)
    const response = await api.api.admin.guides.$post(formData)

    if (response?.error || response?.status >= 400) {
      throw response
    }

    return response
  }

  const updateGuide = async (guideId: number, values: GuideFormValues) => {
    const formData = prepareFormData(values)
    const response = await api.api.admin.guides[guideId].$put(formData)

    if (response?.error || response?.status >= 400) {
      throw response
    }

    return response
  }

  return {
    form,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    setValues,
    resetForm,
    values,
    selectedImage,
    handleImageChange,
    createGuide,
    updateGuide,
    handleError: apiHandleError,
  }
}
