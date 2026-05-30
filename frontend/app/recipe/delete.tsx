/**
 * Pantalla de eliminación de recetas.
 * Lista las recetas disponibles y permite eliminarlas del backend con confirmación.
 *
 * @returns {JSX.Element} Vista para eliminar recetas existentes.
 * @author Manuel García Nieto
 */
import { ActivityIndicator, Alert, FlatList, Image, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Recipe } from '@/data/demo'
import { colors, shadows } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { deleteRecipe, fetchRecipes } from '@/services/api'

export default function DeleteRecipeScreen() {
  const { token } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadRecipes = useCallback(async () => {
    if (!token) {
      setRecipes([])
      setError('Inicia sesión para gestionar recetas.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const apiRecipes = await fetchRecipes(token)
      setRecipes(apiRecipes)
    } catch {
      setRecipes([])
      setError('No se pudieron cargar las recetas.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useFocusEffect(
    useCallback(() => {
      loadRecipes()
    }, [loadRecipes]),
  )

  const handleDeleteRecipe = (recipe: Recipe) => {
    if (!token) {
      Alert.alert('Sesión necesaria', 'Inicia sesión para eliminar recetas.')
      return
    }

    Alert.alert('Eliminar receta', `¿Quieres eliminar "${recipe.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRecipe(token, recipe.id)
            setRecipes((currentRecipes) => currentRecipes.filter((currentRecipe) => currentRecipe.id !== recipe.id))
            Alert.alert('Receta eliminada', 'La receta se ha eliminado correctamente.')
          } catch {
            Alert.alert('No se pudo eliminar', 'Comprueba que tienes permisos para eliminar esta receta.')
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex-1 px-6 pt-4">
        <View className="mb-6 flex-row items-center gap-4">
          <Pressable className="h-12 w-12 items-center justify-center rounded-3xl bg-dish-surface" onPress={() => router.back()} style={shadows.soft}>
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-3xl font-black text-dish-text">Eliminar receta</Text>
            <Text className="mt-1 text-base font-bold text-dish-muted">Selecciona una receta para retirarla.</Text>
          </View>
        </View>

        {loading ? (
          <View className="min-h-64 items-center justify-center">
            <ActivityIndicator size="large" color={colors.green} />
            <Text className="mt-4 text-base font-bold text-dish-muted">Cargando recetas...</Text>
          </View>
        ) : null}

        {!loading && error ? <Text className="rounded-3xl bg-dish-muted-surface p-5 text-base font-bold leading-6 text-dish-muted">{error}</Text> : null}

        {!loading && !error ? (
          <FlatList
            data={recipes}
            keyExtractor={(recipe) => recipe.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-32"
            ListEmptyComponent={<Text className="rounded-3xl bg-dish-muted-surface p-5 text-base font-bold leading-6 text-dish-muted">No hay recetas disponibles para eliminar.</Text>}
            renderItem={({ item }) => (
              <View className="mb-6 rounded-3xl bg-dish-surface p-4" style={shadows.soft}>
                <View className="h-44 overflow-hidden rounded-3xl bg-dish-muted-surface">
                  <Image source={item.image} className="h-full w-full" resizeMode="cover" />
                </View>

                <Text className="mt-4 text-2xl font-black text-dish-text">{item.title}</Text>
                <Text className="mt-2 text-base leading-6 text-dish-muted" numberOfLines={2}>
                  {item.description}
                </Text>

                <View className="mt-4 flex-row items-center justify-between gap-3">
                  <View className="flex-row items-center gap-2 rounded-3xl bg-dish-muted-surface px-4 py-3">
                    <Ionicons name="time-outline" size={18} color={colors.green} />
                    <Text className="font-bold text-dish-muted">{item.cookingTime} min</Text>
                  </View>
                  <Pressable className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-3xl bg-dish-danger px-4" onPress={() => handleDeleteRecipe(item)}>
                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                    <Text className="font-extrabold text-white">Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        ) : null}
      </View>
    </SafeAreaView>
  )
}
