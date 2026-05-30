/**
 * Servicio de comunicación con el backend de DishCover.
 * Define las llamadas HTTP necesarias para autenticación, recetas, eventos y usuario.
 *
 * @author Manuel García Nieto
 */
import { Event, Recipe } from '@/data/demo'
import { Platform } from 'react-native'

const DEFAULT_API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080',
  default: 'http://localhost:8080',
})

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '')

// Tipos de datos usados para mantener alineado el contrato entre React Native y Spring Boot.
type LoginResponse = {
  token: string
  role: string
}

export type RegisterPayload = {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
}

export type RecipePayload = {
  title: string
  imageUrl: string
  description: string
  cookingTime: number
  numPersons: number
  ingredients: string
  recipeCategory: string
}

export type ApiUser = {
  username: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
}

type ApiRecipe = {
  id: number
  title?: string
  imageUrl?: string
  description?: string
  ingredients?: string
  cookingTime?: number
  numPersons?: number
  categoryName?: string
  recipeCategory?: {
    category?: string
  }
}

export type RecipeComment = {
  id: number
  author: string
  comment: string
}

type ApiReport = {
  id: number
  report: string
}

type ApiEvent = {
  id: number
  title: string
  date: string
  duration: number
  description: string
  categoryName?: string
}

async function request<T>(path: string, options: RequestInit = {}) {
  // Wrapper común para centralizar URL base, cabeceras JSON y control de errores HTTP.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`)
  }

  return (await response.json()) as T
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

function mapApiRecipe(recipe: ApiRecipe): Recipe {
  // Adapta la respuesta del backend al modelo que consumen las tarjetas del frontend.
  return {
    id: recipe.id,
    title: recipe.title ?? 'Receta sin título',
    category: recipe.categoryName ?? recipe.recipeCategory?.category ?? 'Receta',
    description: recipe.description ?? 'Receta disponible en DishCover.',
    ingredients: recipe.ingredients,
    cookingTime: recipe.cookingTime ?? 0,
    servings: recipe.numPersons ?? 1,
    image: recipe.imageUrl ? { uri: recipe.imageUrl } : require('@/assets/dishcover/tofu.png'),
  }
}

export async function loginUser(username: string, password: string) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function registerUser(payload: RegisterPayload) {
  return request<ApiUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchCurrentUser(token: string) {
  return request<ApiUser>('/api/user', {
    headers: authHeaders(token),
  })
}

export async function fetchRecipes(token: string): Promise<Recipe[]> {
  const recipes = await request<ApiRecipe[]>('/api/recipes/all', {
    headers: authHeaders(token),
  })

  return recipes.map(mapApiRecipe)
}

export async function fetchRecipeById(token: string, id: number): Promise<Recipe> {
  const recipe = await request<ApiRecipe>(`/api/recipe/${id}`, {
    headers: authHeaders(token),
  })

  return mapApiRecipe(recipe)
}

export async function createRecipe(token: string, payload: RecipePayload) {
  await request<unknown>('/api/recipe', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
}

export async function fetchFavoriteRecipeIds(token: string): Promise<number[]> {
  return request<number[]>('/api/recipes/favorite', {
    headers: authHeaders(token),
  })
}

export async function saveFavoriteRecipe(token: string, id: number) {
  await request<unknown>(`/api/recipe/${id}/favorite`, {
    method: 'POST',
    headers: authHeaders(token),
  })
}

export async function deleteFavoriteRecipe(token: string, id: number) {
  await request<unknown>(`/api/recipe/${id}/favorite`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export async function deleteRecipe(token: string, id: number) {
  try {
    await request<unknown>(`/api/recipe/a/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
  } catch {
    await request<unknown>(`/api/recipe/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
  }
}

export async function fetchRecipeComments(token: string, id: number) {
  return request<RecipeComment[]>(`/api/recipe/${id}/comments`, {
    headers: authHeaders(token),
  })
}

export async function createRecipeComment(token: string, id: number, comment: string) {
  return request<RecipeComment>(`/api/recipe/${id}/comment`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ comment }),
  })
}

export async function updateRecipeComment(token: string, id: number, comment: string) {
  await request<unknown>(`/api/comment/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ comment }),
  })
}

export async function deleteRecipeComment(token: string, id: number) {
  await request<unknown>(`/api/comment/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export async function createRecipeReport(token: string, id: number, report: string) {
  return request<ApiReport>(`/api/recipe/${id}/report`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ report }),
  })
}

export async function fetchEvents(token: string): Promise<Event[]> {
  // Los eventos del backend no incluyen imagen; se asigna una imagen local común para la interfaz.
  const events = await request<ApiEvent[]>('/api/event/all', {
    headers: authHeaders(token),
  })

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.categoryName ?? 'Evento',
    date: event.date,
    duration: `${event.duration} min`,
    image: require('@/assets/dishcover/event-buffet.png'),
  }))
}
