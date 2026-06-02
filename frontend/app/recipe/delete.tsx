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
import { shadows } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { deleteRecipe, fetchRecipes } from '@/services/api'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

export default function DeleteRecipeScreen() {
  const { contentWidthStyle, isShortPhone, screenPaddingStyle } = useResponsiveLayout()
  const { token } = useAuth()
  const { t } = useLanguage()
  const { colors } = useTheme()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadRecipes = useCallback(async () => {
    if (!token) {
      setRecipes([])
      setError(t('deleteRecipe.loginRequired'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const apiRecipes = await fetchRecipes(token)
      setRecipes(apiRecipes)
    } catch {
      setRecipes([])
      setError(t('deleteRecipe.error'))
    } finally {
      setLoading(false)
    }
  }, [t, token])

  useFocusEffect(
    useCallback(() => {
      loadRecipes()
    }, [loadRecipes]),
  )

  const handleDeleteRecipe = (recipe: Recipe) => {
    if (!token) {
      Alert.alert(t('recipeDetails.alertSessionTitle'), t('deleteRecipe.alertMissingSessionMessage'))
      return
    }

    Alert.alert(t('deleteRecipe.confirmTitle'), t('deleteRecipe.confirmMessage').replace('{title}', recipe.title), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRecipe(token, recipe.id)
            setRecipes((currentRecipes) => currentRecipes.filter((currentRecipe) => currentRecipe.id !== recipe.id))
            Alert.alert(t('deleteRecipe.alertSuccessTitle'), t('deleteRecipe.alertSuccessMessage'))
          } catch {
            Alert.alert(t('deleteRecipe.alertErrorTitle'), t('deleteRecipe.alertErrorMessage'))
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex-1" style={[screenPaddingStyle, contentWidthStyle, { paddingTop: isShortPhone ? 12 : 16 }]}>
        <View className="mb-6 flex-row items-center gap-4">
          <Pressable className="h-12 w-12 items-center justify-center rounded-3xl" onPress={() => router.back()} style={[shadows.soft, { backgroundColor: colors.surface }]}>
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-3xl font-black" style={{ color: colors.text }}>{t('deleteRecipe.title')}</Text>
            <Text className="mt-1 text-base font-bold" style={{ color: colors.mutedText }}>{t('deleteRecipe.subtitle')}</Text>
          </View>
        </View>

        {loading ? (
          <View className="min-h-64 items-center justify-center">
            <ActivityIndicator size="large" color={colors.green} />
            <Text className="mt-4 text-base font-bold" style={{ color: colors.mutedText }}>{t('deleteRecipe.loading')}</Text>
          </View>
        ) : null}

        {!loading && error ? <Text className="rounded-3xl p-5 text-base font-bold leading-6" style={{ backgroundColor: colors.mutedSurface, color: colors.mutedText }}>{error}</Text> : null}

        {!loading && !error ? (
          <FlatList
            data={recipes}
            keyExtractor={(recipe) => recipe.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-32"
            ListEmptyComponent={<Text className="rounded-3xl p-5 text-base font-bold leading-6" style={{ backgroundColor: colors.mutedSurface, color: colors.mutedText }}>{t('deleteRecipe.empty')}</Text>}
            renderItem={({ item }) => (
              <View className="mb-6 rounded-3xl p-4" style={[shadows.soft, { backgroundColor: colors.surface }]}>
                <View className="overflow-hidden rounded-3xl" style={{ aspectRatio: 16 / 9, backgroundColor: colors.mutedSurface, width: '100%' }}>
                  <Image source={item.image} className="h-full w-full" resizeMode="cover" />
                </View>

                <Text className="mt-4 text-2xl font-black" style={{ color: colors.text }}>{item.title}</Text>
                <Text className="mt-2 text-base leading-6" style={{ color: colors.mutedText }} numberOfLines={2}>
                  {item.description}
                </Text>

                <View className="mt-4 flex-row items-center justify-between gap-3">
                  <View className="flex-row items-center gap-2 rounded-3xl px-4 py-3" style={{ backgroundColor: colors.mutedSurface }}>
                    <Ionicons name="time-outline" size={18} color={colors.green} />
                    <Text className="font-bold" style={{ color: colors.mutedText }}>{item.cookingTime} {t('unit.minute')}</Text>
                  </View>
                  <Pressable className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-3xl px-4" style={{ backgroundColor: colors.danger }} onPress={() => handleDeleteRecipe(item)}>
                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                    <Text className="font-extrabold text-white">{t('common.delete')}</Text>
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
