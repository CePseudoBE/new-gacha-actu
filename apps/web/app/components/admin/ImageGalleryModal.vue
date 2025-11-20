<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-4xl max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Insérer une image</DialogTitle>
        <DialogDescription>
          Sélectionnez une image existante ou uploadez-en une nouvelle
        </DialogDescription>
      </DialogHeader>

      <!-- Gallery Grid -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="isLoading" class="grid grid-cols-4 gap-4 mb-4">
          <Skeleton v-for="i in 8" :key="i" class="aspect-square" />
        </div>

        <div v-else class="space-y-4">
          <!-- Empty state message (only when no images) -->
          <div
            v-if="images.length === 0 && !isUploading"
            class="text-center py-8"
          >
            <ImageIcon class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p class="text-muted-foreground mb-2">
              Aucune image dans la galerie
            </p>
            <p class="text-sm text-muted-foreground">
              Uploadez votre première image ci-dessous
            </p>
          </div>

          <!-- Images grid -->
          <div v-if="images.length > 0" class="grid grid-cols-4 gap-4 mb-4">
            <div
              v-for="image in images"
              :key="image.id"
              :class="{
                'border-primary ring-2 ring-primary':
                  selectedImageId === image.id,
                'border-transparent hover:border-muted-foreground':
                  selectedImageId !== image.id,
              }"
              class="relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
              @click="selectImage(image.id)"
            >
              <img
                :alt="image.altText || 'Image'"
                :src="image.url"
                class="w-full aspect-square object-cover"
              />

              <!-- Selected Checkmark -->
              <div
                v-if="selectedImageId === image.id"
                class="absolute top-2 right-2 bg-primary rounded-full p-1"
              >
                <Check class="w-4 h-4 text-primary-foreground" />
              </div>

              <!-- Delete Button -->
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Button
                  size="icon"
                  variant="destructive"
                  @click.stop="handleDeleteImage(image.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Upload Card (always visible) -->
          <div
            :class="{ 'opacity-50 pointer-events-none': isUploading }"
            class="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors aspect-square max-w-xs mx-auto"
          >
            <input
              ref="fileInput"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              class="hidden"
              type="file"
              @change="handleFileChange"
            />
            <div class="text-center p-4" @click="fileInput?.click()">
              <Loader2
                v-if="isUploading"
                class="mx-auto mb-2 w-8 h-8 animate-spin text-primary"
              />
              <Plus v-else class="mx-auto mb-2 w-8 h-8 text-muted-foreground" />
              <p class="text-sm text-muted-foreground">
                {{
                  isUploading ? "Upload en cours..." : "Cliquez pour uploader"
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Selected Image Details -->
        <div v-if="selectedImage" class="mt-6 p-4 border rounded-lg space-y-4">
          <div>
            <Label class="text-sm font-medium mb-2 block">Aperçu</Label>
            <img
              :alt="altText || 'Image'"
              :src="selectedImage.url"
              class="w-48 h-48 object-cover rounded-lg border"
            />
          </div>

          <div class="space-y-2">
            <Label class="text-sm font-medium" for="altText">
              Texte alternatif
              <span class="text-muted-foreground font-normal"
                >(pour l'accessibilité et le SEO)</span
              >
            </Label>
            <Input
              id="altText"
              v-model="altText"
              class="w-full"
              placeholder="Décrivez cette image..."
            />
          </div>

          <div class="p-3 bg-muted rounded-lg">
            <p class="text-sm text-muted-foreground mb-1">
              Sera inséré comme :
            </p>
            <code class="text-sm font-mono"
              >![{{ altText || "Image" }}]({{ selectedImage.url }})</code
            >
          </div>
        </div>
      </div>

      <DialogFooter class="mt-4">
        <Button variant="outline" @click="cancel"> Annuler </Button>
        <Button :disabled="!selectedImage || isUploading" @click="handleInsert">
          <ImageIcon class="w-4 h-4 mr-2" />
          Insérer au curseur
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Check, ImageIcon, Loader2, Plus, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "vue-sonner";

interface Props {
  open?: boolean;
  articleId?: number;
  textareaRef?: HTMLTextAreaElement;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "insert", markdown: string): void;
}>();

const fileInput = ref<HTMLInputElement>();
const articleIdRef = computed(() => props.articleId);

const {
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
} = useArticleImageGallery(articleIdRef);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

// Load images when modal opens
watch(
  () => props.open,
  async (newValue) => {
    if (newValue && props.articleId) {
      await loadImages();
    }
  },
);

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast({
      title: "Fichier trop volumineux",
      description: "L'image ne doit pas dépasser 2MB",
      variant: "destructive",
    });
    return;
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    toast({
      title: "Format non supporté",
      description: "Formats acceptés : JPG, PNG, WEBP",
      variant: "destructive",
    });
    return;
  }

  await uploadImage(file);

  // Reset input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleDeleteImage = async (imageId: number) => {
  if (!confirm("Supprimer cette image de la galerie ?")) return;
  await deleteImage(imageId);
};

const handleInsert = () => {
  if (!selectedImage.value || !props.textareaRef) return;

  const markdown = insertImageAtCursor(props.textareaRef);

  if (markdown) {
    emit("insert", markdown);
    isOpen.value = false;
    resetSelection();
  }
};

const cancel = () => {
  isOpen.value = false;
  resetSelection();
};
</script>
