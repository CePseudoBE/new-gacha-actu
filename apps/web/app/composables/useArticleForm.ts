import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'

const articleFormSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères').max(200),
  summary: z.string().min(10, 'Le résumé doit contenir au moins 10 caractères').max(500),
  author: z.string().min(2, 'L\'auteur doit contenir au moins 2 caractères').max(100),
  publishedAt: z.string(),
  content: z.string().min(50, 'Le contenu doit contenir au moins 50 caractères'),
  metaDescription: z.string().min(10).max(160).optional(),
  readingTime: z.number().min(1).max(120).optional(),
  categoryId: z.number().optional(),
  isPopular: z.boolean(),
  gameId: z.number({ required_error: 'Sélectionnez un jeu' }),
  tagIds: z.array(z.number()).optional(),
  seoKeywordIds: z.array(z.number()).optional(),
  image: z.any().optional(),
})

export type ArticleFormValues = z.infer<typeof articleFormSchema>

export const useArticleForm = (initialValues?: Partial<ArticleFormValues>) => {
  const api = useApi()
  const selectedImage = ref<File | null>(null)

  const form = useForm({
    validationSchema: toTypedSchema(articleFormSchema),
    initialValues: {
      title: initialValues?.title || '',
      summary: initialValues?.summary || '',
      author: initialValues?.author || '',
      publishedAt: initialValues?.publishedAt || new Date().toISOString().slice(0, 16),
      content: initialValues?.content || '',
      metaDescription: initialValues?.metaDescription || '',
      readingTime: initialValues?.readingTime || undefined,
      categoryId: initialValues?.categoryId || undefined,
      isPopular: initialValues?.isPopular || false,
      gameId: initialValues?.gameId || undefined,
      tagIds: initialValues?.tagIds || [],
      seoKeywordIds: initialValues?.seoKeywordIds || [],
      image: null,
    },
  })

  const { handleSubmit, isSubmitting, setFieldValue, setValues, resetForm, values } = form

  const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      selectedImage.value = target.files[0]
      setFieldValue('image', target.files[0])
    }
  }

  const prepareFormData = (values: ArticleFormValues) => {
    const payload: any = {
      title: values.title,
      summary: values.summary,
      author: values.author,
      publishedAt: values.publishedAt,
      content: values.content,
      isPopular: values.isPopular,
      gameId: values.gameId,
    }

    if (values.metaDescription) payload.metaDescription = values.metaDescription
    if (values.readingTime) payload.readingTime = values.readingTime
    if (values.categoryId) payload.categoryId = values.categoryId
    if (values.tagIds && values.tagIds.length > 0) payload.tagIds = values.tagIds
    if (values.seoKeywordIds && values.seoKeywordIds.length > 0) payload.seoKeywordIds = values.seoKeywordIds

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

  const createArticle = async (values: ArticleFormValues) => {
    const formData = prepareFormData(values)
    const response = await api.api.admin.articles.$post(formData)

    if (response?.error || response?.status >= 400) {
      throw response
    }

    return response
  }

  const updateArticle = async (articleId: number, values: ArticleFormValues) => {
    const formData = prepareFormData(values)
    const response = await api.api.admin.articles({ id: articleId }).$put(formData)

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
    createArticle,
    updateArticle,
    handleError,
  }
}
