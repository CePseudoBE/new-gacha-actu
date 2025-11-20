import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import type { TierListFormValues, TierListFormCategory, TierListFormEntry } from '@/types/models'

const tierListCategorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.coerce.number().int().min(1),
})

const tierListEntrySchema = z.object({
  characterId: z.coerce.number().int().min(1, 'Le personnage est requis'),
  tierId: z.coerce.number().int().min(1, 'Le tier est requis'),
  categoryId: z.coerce.number().int().optional().nullable(),
  notes: z.string().optional(),
  order: z.coerce.number().int().min(1),
})

const tierListFormSchema = z.object({
  gameId: z.coerce.number().int().min(1, 'Le jeu est requis'),
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  version: z.string().optional(),
  isPublished: z.boolean(),
  categories: z.array(tierListCategorySchema),
  entries: z.array(tierListEntrySchema),
  image: z.any().optional(),
})

export type TierListFormSchema = z.infer<typeof tierListFormSchema>

export const useTierListForm = (initialValues?: Partial<TierListFormValues>) => {
  const api = useApi()
  const selectedImage = ref<File | null>(null)

  const form = useForm({
    validationSchema: toTypedSchema(tierListFormSchema),
    initialValues: {
      gameId: initialValues?.gameId || 0,
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      version: initialValues?.version || '1.0',
      isPublished: initialValues?.isPublished || false,
      categories: initialValues?.categories || [],
      entries: initialValues?.entries || [],
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
        toast.error('L\'image est trop volumineuse. Taille maximale : 2MB.')
        target.value = ''
        return
      }

      selectedImage.value = file
      setFieldValue('image', file)
    }
  }

  const prepareFormData = (values: TierListFormSchema) => {
    const payload: any = {
      gameId: values.gameId,
      title: values.title,
      isPublished: values.isPublished,
    }

    if (values.description) payload.description = values.description
    if (values.version) payload.version = values.version
    if (values.categories && values.categories.length > 0) payload.categories = values.categories
    if (values.entries && values.entries.length > 0) payload.entries = values.entries

    const formData = new FormData()

    // Append simple fields
    Object.keys(payload).forEach(key => {
      if (key !== 'categories' && key !== 'entries') {
        formData.append(key, payload[key].toString())
      }
    })

    // Append categories as JSON
    if (payload.categories) {
      formData.append('categories', JSON.stringify(payload.categories))
    }

    // Append entries as JSON
    if (payload.entries) {
      formData.append('entries', JSON.stringify(payload.entries))
    }

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    return formData
  }

  const createTierList = async (values: TierListFormSchema) => {
    const formData = prepareFormData(values)
    const response = await api.api.admin['tier-lists'].$post(formData)

    if (response?.error || response?.status >= 400) {
      throw response
    }

    return response
  }

  const updateTierList = async (tierListId: number, values: TierListFormSchema) => {
    const formData = prepareFormData(values)
    const response = await api.api.admin['tier-lists']({ id: tierListId }).$put(formData)

    if (response?.error || response?.status >= 400) {
      throw response
    }

    return response
  }

  const publishTierList = async (tierListId: number) => {
    const response = await api.api.admin['tier-lists']({ id: tierListId }).publish.$patch()

    if (response?.error || response?.status >= 400) {
      throw response
    }

    return response
  }

  const unpublishTierList = async (tierListId: number) => {
    const response = await api.api.admin['tier-lists']({ id: tierListId }).unpublish.$patch()

    if (response?.error || response?.status >= 400) {
      throw response
    }

    return response
  }

  const handleError = (error: any) => {
    const errorData = error?.error?.value

    if (errorData?.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err: any) => {
        toast.error(err.message || 'Erreur de validation')
      })
    } else {
      const message = errorData?.message || 'Une erreur est survenue'
      toast.error(message)
    }
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
    createTierList,
    updateTierList,
    publishTierList,
    unpublishTierList,
    handleError,
  }
}
