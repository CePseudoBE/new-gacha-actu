<template>
  <div class="space-y-6">
    <!-- Game Selection -->
    <FormField v-slot="{ value, handleChange }" name="gameId">
      <FormItem>
        <FormLabel>Jeu *</FormLabel>
        <Select :model-value="value?.toString()" @update:model-value="(val) => { handleChange(Number(val)); handleGameChange(val as string); }">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un jeu" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem v-for="game in games" :key="game.id" :value="game.id.toString()">
              {{ game.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Title -->
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>Titre *</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Tier List PvP" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Description -->
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Description de la tier list..."
            rows="4"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Version -->
    <FormField v-slot="{ componentField }" name="version">
      <FormItem>
        <FormLabel>Version</FormLabel>
        <FormControl>
          <Input type="text" placeholder="1.0" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          Version du jeu ou de la tier list
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Categories Section -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Catégories</CardTitle>
            <p class="text-sm text-muted-foreground mt-1">
              Organisez votre tier list en catégories (PvP, PvE, etc.)
            </p>
          </div>
          <Button type="button" size="sm" @click="addCategory">
            <Plus class="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="categories.length === 0" class="text-center py-8 text-muted-foreground">
          Aucune catégorie. Cliquez sur "Ajouter" pour commencer.
        </div>
        <div v-else class="space-y-4">
          <Card v-for="(category, index) in categories" :key="index" class="p-4">
            <div class="space-y-4">
              <div class="flex items-start justify-between">
                <h4 class="font-semibold">Catégorie {{ index + 1 }}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="removeCategory(index)"
                >
                  <Trash class="w-4 h-4" />
                </Button>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <FormField v-slot="{ componentField }" :name="`categories.${index}.name`">
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="PvP" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" :name="`categories.${index}.icon`">
                  <FormItem>
                    <FormLabel>Icône</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="sword" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <FormField v-slot="{ componentField }" :name="`categories.${index}.description`">
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Classement pour le mode joueur contre joueur" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" :name="`categories.${index}.order`">
                <FormItem>
                  <FormLabel>Ordre</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>

    <!-- Entries Section -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Classement des Personnages</CardTitle>
            <p class="text-sm text-muted-foreground mt-1">
              Ajoutez les personnages et attribuez-leur un tier
            </p>
          </div>
          <Button type="button" size="sm" @click="addEntry" :disabled="!selectedGameId || characters.length === 0">
            <Plus class="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="!selectedGameId" class="text-center py-8 text-muted-foreground">
          Sélectionnez d'abord un jeu pour ajouter des personnages
        </div>
        <div v-else-if="characters.length === 0" class="text-center py-8 text-muted-foreground">
          Aucun personnage disponible pour ce jeu
        </div>
        <div v-else-if="entries.length === 0" class="text-center py-8 text-muted-foreground">
          Aucun personnage classé. Cliquez sur "Ajouter" pour commencer.
        </div>
        <div v-else class="space-y-4">
          <Card v-for="(entry, index) in entries" :key="index" class="p-4">
            <div class="space-y-4">
              <div class="flex items-start justify-between">
                <h4 class="font-semibold">Entrée {{ index + 1 }}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="removeEntry(index)"
                >
                  <Trash class="w-4 h-4" />
                </Button>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <FormField v-slot="{ value, handleChange }" :name="`entries.${index}.characterId`">
                  <FormItem>
                    <FormLabel>Personnage *</FormLabel>
                    <Select :model-value="value?.toString()" @update:model-value="(val) => handleChange(Number(val))">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un personnage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="character in characters" :key="character.id" :value="character.id.toString()">
                          {{ character.name }} ({{ character.rarity }})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ value, handleChange }" :name="`entries.${index}.tierId`">
                  <FormItem>
                    <FormLabel>Tier *</FormLabel>
                    <Select :model-value="value?.toString()" @update:model-value="(val) => handleChange(Number(val))">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="tier in tiers" :key="tier.id" :value="tier.id.toString()">
                          <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded" :style="{ backgroundColor: tier.color }"></div>
                            {{ tier.name }} - {{ tier.label }}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <FormField v-slot="{ value, handleChange }" :name="`entries.${index}.categoryId`">
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select :model-value="value?.toString() || 'null'" @update:model-value="(val) => handleChange(val === 'null' ? null : val)">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Aucune catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">Aucune catégorie</SelectItem>
                        <SelectItem v-for="(category, catIndex) in categories" :key="catIndex" :value="catIndex.toString()">
                          {{ category.value.name }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" :name="`entries.${index}.order`">
                  <FormItem>
                    <FormLabel>Ordre</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <FormField v-slot="{ componentField }" :name="`entries.${index}.notes`">
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Pourquoi ce personnage est dans ce tier..."
                      rows="2"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>

    <!-- Image Upload -->
    <ImageUploadField
      variant="formfield"
      name="image"
      label="Image de couverture"
      description="Format: PNG, JPG, WEBP (max 2MB)"
      :current-image-url="currentImageUrl"
      :image-to-delete="imageToDelete"
      @change="$emit('imageChange', $event)"
      @delete="$emit('deleteImage')"
    />

    <!-- Is Published -->
    <FormField v-slot="{ value, handleChange }" name="isPublished">
      <FormItem class="flex items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel>Publier</FormLabel>
          <FormDescription>
            Publier cette tier list immédiatement
          </FormDescription>
        </div>
        <FormControl>
          <Switch
            :model-value="!!value"
            @update:model-value="handleChange"
          />
        </FormControl>
      </FormItem>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { Plus, Trash } from 'lucide-vue-next'
import { useFieldArray } from 'vee-validate'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ImageUploadField from '@/components/shared/ImageUploadField.vue'

// Types minimaux pour ce qui est réellement utilisé dans le composant
type GameOption = { id: number; name: string }
type TierOption = { id: number; name: string; label: string; color: string }
type CharacterOption = { id: number; name: string; rarity: string }

interface Props {
  games: GameOption[]
  tiers: TierOption[]
  currentImageUrl?: string
  imageToDelete?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'imageChange', event: Event): void
  (e: 'deleteImage'): void
}>()

const api = useApi()

// Field arrays for dynamic categories and entries
const { fields: categories, push: pushCategory, remove: removeCategory } = useFieldArray<any>('categories')
const { fields: entries, push: pushEntry, remove: removeEntry } = useFieldArray<any>('entries')

// Selected game and characters
const selectedGameId = ref<number | null>(null)
const characters = ref<CharacterOption[]>([])

const addCategory = () => {
  pushCategory({
    name: '',
    description: '',
    icon: '',
    order: categories.value.length + 1,
  })
}

const addEntry = () => {
  pushEntry({
    characterId: 0,
    tierId: 0,
    categoryId: null,
    notes: '',
    order: entries.value.length + 1,
  })
}

const handleGameChange = async (gameId: string) => {
  selectedGameId.value = parseInt(gameId)

  if (selectedGameId.value) {
    try {
      const { data } = await api.api.characters.$get({
        query: { gameId: selectedGameId.value.toString() }
      })
      characters.value = (data?.data || []) as CharacterOption[]
    } catch (error) {
      console.error('Error fetching characters:', error)
      characters.value = []
    }
  } else {
    characters.value = []
  }
}
</script>
