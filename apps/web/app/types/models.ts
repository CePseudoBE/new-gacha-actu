/**
 * Types centralisés pour le frontend Nuxt
 * Synchronisés avec les DTOs du backend AdonisJS
 */

// ==================== ENTITÉS SIMPLES ====================

export interface Image {
  id: number;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  altText: string | null;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  games?: Game[];
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  games?: Game[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  articles?: Article[];
  guides?: Guide[];
  games?: Game[];
}

export interface SeoKeyword {
  id: number;
  keyword: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GuideType {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DifficultyLevel {
  id: number;
  name: string;
  slug: string;
  level: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tier {
  id: number;
  name: string;
  label: string;
  color: string;
  order: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  rarity: string;
  element: string | null;
  role: string | null;
  description: string | null;
  isLimited: boolean;
  releaseDate: string | null;
  createdAt: string;
  updatedAt: string;
  game?: Game;
  image: Image | null;
}

export interface TierListCategory {
  id: number;
  tierListId: number;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TierListEntry {
  id: number;
  tierListId: number;
  characterId: number;
  tierId: number;
  categoryId: number | null;
  notes: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  character?: Character;
  tier?: Tier;
  category?: TierListCategory;
}

export interface TierList {
  id: number;
  gameId: number;
  authorId: number;
  title: string;
  slug: string;
  description: string | null;
  version: string | null;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  game?: Game;
  author?: User;
  categories?: TierListCategory[];
  entries?: TierListEntry[];
  image: Image | null;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface YoutubeVideo {
  id: number;
  title: string;
  videoId: string;
  description: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceSetting {
  id: number;
  isActive: boolean;
  message: string | null;
  startedAt: string | null;
  estimatedEndAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== ENTITÉS COMPLEXES ====================

export interface Game {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  releaseDate: string | null;
  isPopular: boolean;
  officialSite: string | null;
  wiki: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  articles: Article[];
  guides: Guide[];
  youtubeVideos: YoutubeVideo[];
  genres: Genre[];
  tags: Tag[];
  platforms: Platform[];
  image: Image | null;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  author: string;
  publishedAt: string;
  slug: string;
  content: string;
  metaDescription: string | null;
  readingTime: number | null;
  categoryId: number | null;
  isPopular: boolean;
  gameId: number;
  createdAt: string;
  updatedAt: string;
  game: Game | null;
  category: ArticleCategory | null;
  tags: Tag[];
  seoKeywords: SeoKeyword[];
  image: Image | null;
}

export interface GuideSection {
  id: number;
  title: string;
  content: string;
  order: number;
  guideId: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  children?: GuideSection[];
  image: Image | null;
}

export interface GuidePrerequisite {
  id: number;
  description: string;
  guideId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Guide {
  id: number;
  title: string;
  summary: string;
  author: string;
  publishedAt: string;
  slug: string;
  readingTime: number | null;
  difficultyId: number;
  guideTypeId: number;
  isPopular: boolean;
  viewCount: number;
  gameId: number;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  game: Game | null;
  guideType: GuideType | null;
  difficulty: DifficultyLevel | null;
  sections: GuideSection[];
  prerequisites: GuidePrerequisite[];
  tags: Tag[];
  seoKeywords: SeoKeyword[];
  image: Image | null;
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
}

// ==================== ERREURS ====================

export interface ValidationError {
  field: string;
  rule: string;
  message: string;
}

export interface ApiError {
  message: string;
  errors?: ValidationError[];
  statusCode?: number;
}

// ==================== FORMULAIRES ====================

export interface GameFormValues {
  name: string;
  description: string;
  releaseDate: string | null;
  isPopular: boolean;
  officialSite: string;
  wiki: string;
  genreIds: number[];
  platformIds: number[];
  tagIds: number[];
  image?: File | null;
}

export interface ArticleFormValues {
  title: string;
  summary: string;
  author: string;
  publishedAt: string;
  content: string;
  metaDescription: string;
  readingTime: number | null;
  isPopular: boolean;
  gameId: number;
  categoryId: number | null;
  tagIds: number[];
  seoKeywordIds: number[];
  image?: File | null;
}

export interface GuideFormValues {
  title: string;
  summary: string;
  author: string;
  publishedAt: string;
  readingTime: number | null;
  metaDescription: string;
  isPopular: boolean;
  gameId: number;
  difficultyId: number;
  guideTypeId: number;
  tagIds: number[];
  seoKeywordIds: number[];
  sections: GuideFormSection[];
  prerequisites: string[];
  image?: File | null;
}

export interface GuideFormSection {
  title: string;
  content: string;
  order: number;
  parentId: number | null;
  imageUrl?: string | null;
}

export interface TierListFormCategory {
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface TierListFormEntry {
  characterId: number;
  tierId: number;
  categoryId?: number | null;
  notes: string;
  order: number;
}

export interface TierListFormValues {
  gameId: number;
  title: string;
  description: string;
  version: string;
  isPublished: boolean;
  categories: TierListFormCategory[];
  entries: TierListFormEntry[];
  image?: File | null;
}

// ==================== AUTH ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// ==================== STATS (Dashboard) ====================

export interface DashboardStats {
  articles: {
    total: number;
    thisMonth: number;
  };
  games: {
    total: number;
    thisMonth: number;
  };
  guides: {
    total: number;
    thisMonth: number;
  };
  videos: {
    total: number;
    thisWeek: number;
  };
}

// ==================== TYPE GUARDS ====================

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
}

export function isValidationError(
  error: unknown,
): error is { errors: ValidationError[] } {
  return (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors: unknown }).errors)
  );
}
