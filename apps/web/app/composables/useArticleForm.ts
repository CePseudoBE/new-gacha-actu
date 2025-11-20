import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useApiErrorHandler } from "./useApiErrorHandler";
import { toast } from "vue-sonner";

const articleFormSchema = z.object({
  title: z
    .string()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(200),
  summary: z
    .string()
    .min(10, "Le résumé doit contenir au moins 10 caractères")
    .max(500),
  author: z
    .string()
    .min(2, "L'auteur doit contenir au moins 2 caractères")
    .max(100),
  publishedAt: z.string(),
  content: z
    .string()
    .min(50, "Le contenu doit contenir au moins 50 caractères"),
  metaDescription: z.string().min(10).max(160).optional(),
  readingTime: z.number().min(1).max(120).optional(),
  categoryId: z.number().optional(),
  isPopular: z.boolean(),
  gameId: z.number({ error: "Sélectionnez un jeu" }),
  tagIds: z.array(z.number()).optional(),
  seoKeywordIds: z.array(z.number()).optional(),
  image: z.any().optional(),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export const useArticleForm = (initialValues?: Partial<ArticleFormValues>) => {
  const api = useApi();
  const { handleError: apiHandleError } = useApiErrorHandler();
  const selectedImage = ref<File | null>(null);

  const form = useForm({
    validationSchema: toTypedSchema(articleFormSchema),
    initialValues: {
      title: initialValues?.title || "",
      summary: initialValues?.summary || "",
      author: initialValues?.author || "",
      publishedAt:
        initialValues?.publishedAt || new Date().toISOString().slice(0, 16),
      content: initialValues?.content || "",
      metaDescription: initialValues?.metaDescription || "",
      readingTime: initialValues?.readingTime || undefined,
      categoryId: initialValues?.categoryId || undefined,
      isPopular: initialValues?.isPopular || false,
      gameId: initialValues?.gameId || undefined,
      tagIds: initialValues?.tagIds || [],
      seoKeywordIds: initialValues?.seoKeywordIds || [],
      image: null,
    },
  });

  const {
    handleSubmit,
    isSubmitting,
    setFieldValue,
    setValues,
    resetForm,
    values,
  } = form;

  const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];

      // Validation type MIME
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Format de fichier invalide. Utilisez JPG, PNG, WEBP ou GIF.",
        );
        target.value = "";
        return;
      }

      // Validation taille (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error("L'image est trop volumineuse. Taille maximale : 2MB.");
        target.value = "";
        return;
      }

      selectedImage.value = file;
      setFieldValue("image", file);
    }
  };

  const prepareFormData = (values: ArticleFormValues) => {
    // Convert datetime-local format (YYYY-MM-DDTHH:mm) to backend format (YYYY-MM-DD HH:mm:ss)
    const formatDateForBackend = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const payload: any = {
      title: values.title,
      summary: values.summary,
      author: values.author,
      publishedAt: formatDateForBackend(values.publishedAt),
      content: values.content,
      isPopular: values.isPopular,
      gameId: values.gameId,
    };

    if (values.metaDescription)
      payload.metaDescription = values.metaDescription;
    if (values.readingTime) payload.readingTime = values.readingTime;
    if (values.categoryId) payload.categoryId = values.categoryId;
    if (values.tagIds && values.tagIds.length > 0)
      payload.tagIds = values.tagIds;
    if (values.seoKeywordIds && values.seoKeywordIds.length > 0)
      payload.seoKeywordIds = values.seoKeywordIds;

    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      if (Array.isArray(payload[key])) {
        payload[key].forEach((item: any) => {
          formData.append(`${key}[]`, item.toString());
        });
      } else {
        formData.append(key, payload[key].toString());
      }
    });

    if (selectedImage.value) {
      formData.append("image", selectedImage.value);
    }

    return formData;
  };

  const createArticle = async (values: ArticleFormValues) => {
    const formData = prepareFormData(values);
    const response = await api.api.admin.articles.$post(formData);

    if (response?.error || response?.status >= 400) {
      throw response;
    }

    return response;
  };

  const updateArticle = async (
    articleId: number,
    values: ArticleFormValues,
  ) => {
    const formData = prepareFormData(values);
    const response = await api.api.admin.articles({ id: articleId }).$put(formData);

    if (response?.error || response?.status >= 400) {
      throw response;
    }

    return response;
  };

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
    handleError: apiHandleError,
  };
};
