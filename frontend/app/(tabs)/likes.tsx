/**
 * Pantalla de recetas favoritas.
 * Presenta las recetas guardadas por el usuario para consultarlas más tarde.
 *
 * @returns {JSX.Element} Listado de favoritos.
 * @author Manuel García Nieto
 */
import { ActivityIndicator, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { AppScreen } from '@/components/AppScreen'
import { RecipeCard } from '@/components/RecipeCard'
import { Recipe } from '@/data/demo'
import { colors } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { fetchFavoriteRecipeIds, fetchRecipeById } from '@/services/api'

export default function LikesScreen() {
  const { token } = useAuth()
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useFocusEffect(
    useCallback(() => {
      let active = true

      const loadFavorites = async () => {
        if (!token) {
          setFavoriteRecipes([])
          setError('')
          return
        }

        setLoading(true)
        setError('')

        try {
          const favoriteIds = await fetchFavoriteRecipeIds(token)
          const recipes = await Promise.all(favoriteIds.map((id) => fetchRecipeById(token, id)))

          if (active) {
            setFavoriteRecipes(recipes)
          }
        } catch {
          if (active) {
            setFavoriteRecipes([])
            setError('No se pudieron cargar tus recetas favoritas.')
          }
        } finally {
          if (active) {
            setLoading(false)
          }
        }
      }

      loadFavorites()

      return () => {
        active = false
      }
    }, [token]),
  )

  return (
    <AppScreen title="Favoritos">
      <View className="mb-7 flex-row items-center gap-3 rounded-3xl bg-dish-muted-surface p-4">
        <Ionicons name="heart" size={26} color={colors.green} />
        <Text className="flex-1 text-lg font-bold leading-6 text-dish-muted">Tus recetas guardadas para cocinar después.</Text>
      </View>

      {loading ? (
        <View className="min-h-56 items-center justify-center">
          <ActivityIndicator size="large" color={colors.green} />
          <Text className="mt-4 text-base font-bold text-dish-muted">Cargando favoritos...</Text>
        </View>
      ) : null}

      {!loading && error ? <Text className="rounded-3xl bg-dish-muted-surface p-5 text-base font-bold leading-6 text-dish-muted">{error}</Text> : null}

      {!loading && !error && favoriteRecipes.length === 0 ? (
        <Text className="rounded-3xl bg-dish-muted-surface p-5 text-base font-bold leading-6 text-dish-muted">Todavía no has guardado ninguna receta como favorita.</Text>
      ) : null}

      {!loading && favoriteRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
    </AppScreen>
  )
}
