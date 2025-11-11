import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'

const gameFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  releaseDate: z.string().optional(),
  isPopular: z.boolean(),
  officialSite: z.string().optional(),
  wiki: z.string().optional(),
  genreIds: z.array(z.number()).min(1, 'Sélectionnez au moins un genre'),
  platformIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
  image: z.any().optional(),
})

export type GameFormValues = z.infer<typeof gameFormSchema>

export const useGameForm = (initialValues?: Partial<GameFormValues>) => {
  const api = useApi()
  const selectedImage = ref<File | null>(null)

  const form = useForm({
    validationSchema: toTypedSchema(gameFormSchema),
    initialValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      releaseDate: initialValues?.releaseDate || '',
      isPopular: initialValues?.isPopular || false,
      officialSite: initialValues?.officialSite || '',
      wiki: initialValues?.wiki || '',
      genreIds: initialValues?.genreIds || [],
      platformIds: initialValues?.platformIds || [],
      tagIds: initialValues?.tagIds || [],
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

  const prepareFormData = (values: GameFormValues) => {
    const payload: any = {
      name: values.name,
      description: values.description,
      isPopular: values.isPopular,
    }

    if (values.releaseDate) payload.releaseDate = values.releaseDate
    if (values.officialSite) payload.officialSite = values.officialSite
    if (values.wiki) payload.wiki = values.wiki

    // Backend expects genreId (singular) not genreIds
    if (values.genreIds && values.genreIds.length > 0) payload.genreId = values.genreIds
    if (values.platformIds && values.platformIds.length > 0) payload.platformId = values.platformIds
    if (values.tagIds && values.tagIds.length > 0) payload.tagId = values.tagIds

    const formData = new FormData()

    Object.keys(payload).forEach(key => {
      if (Array.isArray(payload[key])) {
        payload[key].forEach((item: any) => {
          formData.append(`${key}[]`, item.toString())
        })
      } else {
        formData.append(key, payload[key].toString())
      }
    })

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    return formData
  }

  const createGame = async (values: GameFormValues) => {
    const formData = prepareFormData(values)
    const response = await api.api.admin.games.$post(formData)

    if (response?.error || response?.status >= 400) {
      throw response
    }

    return response
  }

  const updateGame = async (gameId: number, values: GameFormValues) => {
    const formData = prepareFormData(values)
    const response = await api.api.admin.games({ id: gameId }).$put(formData)

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
    createGame,
    updateGame,
    handleError,
  }
}
