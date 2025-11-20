import type { Image } from "@/types/models";
import { toast } from "vue-sonner";

export const useArticleImageGallery = (articleId: Ref<number | undefined>) => {
  const api = useApi();

  const images = ref<Image[]>([]);
  const selectedImageId = ref<number | null>(null);
  const altText = ref("");
  const isLoading = ref(false);
  const isUploading = ref(false);

  const selectedImage = computed(() => {
    return images.value.find((img) => img.id === selectedImageId.value) || null;
  });

  // Load images for the article
  const loadImages = async () => {
    if (!articleId.value) {
      images.value = [];
      return;
    }

    try {
      isLoading.value = true;
      const response =
        await api.api.admin.articles({ id: articleId.value }).images.$get();
      images.value = response.data?.data || [];
    } catch (error: any) {
      console.error("Failed to load images:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les images",
        variant: "destructive",
      });
    } finally {
      isLoading.value = false;
    }
  };

  // Upload a new image
  const uploadImage = async (file: File) => {
    if (!articleId.value) {
      toast({
        title: "Erreur",
        description: "Vous devez d'abord créer l'article",
        variant: "destructive",
      });
      return;
    }

    try {
      isUploading.value = true;

      const formData = new FormData();
      formData.append("image", file);

      const response =
        await api.api.admin.articles({ id: articleId.value }).images.$post(formData);
      const newImage = response.data?.data;

      if (newImage) {
        images.value.push(newImage);
        toast({
          title: "Image uploadée",
          description: "L'image a été ajoutée à la galerie",
        });
      }
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      const errorMessage =
        error.response?.data?.message || "Impossible d'uploader l'image";
      toast({
        title: "Erreur d'upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      isUploading.value = false;
    }
  };

  // Delete an image from the gallery
  const deleteImage = async (imageId: number) => {
    if (!articleId.value) return;

    try {
      await api.api.admin.articles({ id: articleId.value }).images({ imageId: imageId }).$delete();

      images.value = images.value.filter((img) => img.id !== imageId);

      if (selectedImageId.value === imageId) {
        selectedImageId.value = null;
        altText.value = "";
      }

      toast({
        title: "Image supprimée",
        description: "L'image a été retirée de la galerie",
      });
    } catch (error: any) {
      console.error("Failed to delete image:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      });
    }
  };

  // Select an image
  const selectImage = (imageId: number) => {
    selectedImageId.value = imageId;
    const image = images.value.find((img) => img.id === imageId);
    if (image) {
      altText.value = image.altText || "";
    }
  };

  // Insert markdown syntax at cursor position
  const insertImageAtCursor = (textarea: HTMLTextAreaElement | undefined) => {
    if (!selectedImage.value || !textarea) return;

    const markdownSyntax = `![${altText.value || "Image"}](${selectedImage.value.url})`;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const text = textarea.value || "";
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    // Insert markdown at cursor position
    textarea.value = before + markdownSyntax + after;

    // Move cursor after inserted text
    const newCursorPos = start + markdownSyntax.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);

    // Trigger input event to update v-model (use InputEvent for better compatibility)
    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: markdownSyntax,
    });
    textarea.dispatchEvent(inputEvent);

    // Also trigger change event for vee-validate
    textarea.dispatchEvent(new Event("change", { bubbles: true }));

    // Focus back on textarea
    nextTick(() => {
      textarea.focus();
    });

    return markdownSyntax;
  };

  // Reset selection
  const resetSelection = () => {
    selectedImageId.value = null;
    altText.value = "";
  };

  return {
    images,
    selectedImageId,
    selectedImage,
    altText,
    isLoading,
    isUploading,
    loadImages,
    uploadImage,
    deleteImage,
    selectImage,
    insertImageAtCursor,
    resetSelection,
  };
};
