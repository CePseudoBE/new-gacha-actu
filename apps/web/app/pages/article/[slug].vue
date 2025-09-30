<template>
  <div v-if="article" class="container mx-auto px-4 py-12 max-w-4xl">
    <div class="mb-8">
      <Badge v-if="article.game">{{ article.game.name }}</Badge>
      <h1 class="text-4xl font-bold mt-4 mb-4">{{ article.title }}</h1>
      <div class="flex items-center gap-4 text-sm text-muted-foreground">
        <span>Par {{ article.author }}</span>
        <span>•</span>
        <span>{{ formatDate(article.publishedAt) }}</span>
        <span v-if="article.readingTime">•</span>
        <span v-if="article.readingTime">{{ article.readingTime }} min de lecture</span>
      </div>
    </div>

    <div v-if="article.imageUrl" class="mb-8 rounded-lg overflow-hidden">
      <NuxtImg
        :src="article.imageUrl"
        :alt="article.title"
        class="w-full h-auto"
        width="800"
        height="400"
      />
    </div>

    <div class="prose prose-lg max-w-none dark:prose-invert">
      <p class="lead text-xl mb-6">{{ article.summary }}</p>
      <div v-html="renderedContent" class="article-content"></div>
    </div>

    <div v-if="article.tags && article.tags.length > 0" class="mt-8 flex flex-wrap gap-2">
      <Badge v-for="tag in article.tags" :key="tag.id" variant="outline">
        {{ tag.name }}
      </Badge>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 py-12 text-center">
    <h1 class="text-2xl font-bold">Article non trouvé</h1>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { useMockArticles } from '@/composables/useMockData'
import { Badge } from '@/components/ui/badge'

const route = useRoute()
const { getArticleBySlug } = useMockArticles()

const article = computed(() => getArticleBySlug(route.params.slug as string))

const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  return marked.parse(article.value.content)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

useSeoMeta({
  title: article.value?.title || 'Article non trouvé',
  description: article.value?.metaDescription || article.value?.summary,
  ogTitle: article.value?.title,
  ogDescription: article.value?.metaDescription || article.value?.summary,
  ogImage: article.value?.imageUrl,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: article.value?.title,
  twitterDescription: article.value?.metaDescription || article.value?.summary,
  twitterImage: article.value?.imageUrl,
  articlePublishedTime: article.value?.publishedAt,
  articleModifiedTime: article.value?.updatedAt,
  articleAuthor: article.value?.author,
  articleTag: article.value?.tags?.map(tag => tag.name)
})

useHead({
  title: article.value ? article.value.title : 'Article non trouvé'
})
</script>
