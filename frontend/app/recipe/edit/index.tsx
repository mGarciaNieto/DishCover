/**
 * Pantalla de selección de receta para editar.
 * Lista las recetas del usuario autenticado y abre el formulario de edición correspondiente.
 *
 * @returns {JSX.Element} Vista de selección de recetas editables.
 * @author Manuel García Nieto
 */
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { categoryTranslationKeys } from '@/constants/translations'
import { shadows } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { Recipe } from '@/data/demo'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'
import { fetchMyRecipes } from '@/services/api'

export default function EditRecipeScreen() {
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
      setError(t('editRecipe.loginRequired'))
      return
    }

    setLoading(true)
    setError('')

    try {
      // Igual que en TastyMeal, se recargan solo las recetas propias del usuario.
      const apiRecipes = await fetchMyRecipes(token)
      setRecipes(apiRecipes)
    } catch {
      setRecipes([])
      setError(t('editRecipe.error'))
    } finally {
      setLoading(false)
    }
  }, [t, token])

  useFocusEffect(
    useCallback(() => {
      loadRecipes()
    }, [loadRecipes]),
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex-1" style={[screenPaddingStyle, contentWidthStyle, { paddingTop: isShortPhone ? 12 : 16 }]}>
        <View className="mb-6 flex-row items-center gap-4">
          <Pressable className="h-12 w-12 items-center justify-center rounded-3xl" onPress={() => router.back()} style={[shadows.soft, { backgroundColor: colors.surface }]}>
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </Pressable>
          <View className="flex-1">
            <Text className="font-poppins-bold text-3xl" style={{ color: colors.text }}>{t('editRecipe.title')}</Text>
            <Text className="font-poppins-bold mt-1 text-base" style={{ color: colors.mutedText }}>{t('editRecipe.subtitle')}</Text>
          </View>
        </View>

        {loading ? (
          <View className="min-h-64 items-center justify-center">
            <ActivityIndicator size="large" color={colors.green} />
            <Text className="font-poppins-bold mt-4 text-base" style={{ color: colors.mutedText }}>{t('editRecipe.loading')}</Text>
          </View>
        ) : null}

        {!loading && error ? <Text className="font-poppins-bold rounded-3xl p-5 text-base leading-6" style={{ backgroundColor: colors.mutedSurface, color: colors.mutedText }}>{error}</Text> : null}

        {!loading && !error ? (
          <FlatList
            data={recipes}
            keyExtractor={(recipe) => recipe.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-32"
            ListEmptyComponent={<Text className="font-poppins-bold rounded-3xl p-5 text-base leading-6" style={{ backgroundColor: colors.mutedSurface, color: colors.mutedText }}>{t('editRecipe.empty')}</Text>}
            renderItem={({ item }) => {
              const categoryKey = categoryTranslationKeys[item.category]
              const categoryLabel = categoryKey ? t(categoryKey) : item.category

              return (
                <Pressable
                  className="mb-6 rounded-3xl p-4"
                  style={({ pressed }) => [
                    shadows.soft,
                    { backgroundColor: colors.surface },
                    pressed && { opacity: 0.86 },
                  ]}
                  onPress={() => router.push({ pathname: '/recipe/edit/[id]', params: { id: item.id.toString() } })}
                >
                  <View className="overflow-hidden rounded-3xl" style={{ aspectRatio: 16 / 9, backgroundColor: colors.mutedSurface, width: '100%' }}>
                    <Image source={item.image} className="h-full w-full" resizeMode="cover" />
                  </View>

                  <Text className="font-poppins-bold mt-4 text-2xl" style={{ color: colors.text }}>{item.title}</Text>
                  <Text className="font-poppins-medium mt-2 text-base leading-6" style={{ color: colors.mutedText }} numberOfLines={2}>
                    {item.description}
                  </Text>

                  <View className="mt-4 flex-row items-center justify-between gap-3">
                    <View className="flex-row items-center gap-2 rounded-3xl px-4 py-3" style={{ backgroundColor: colors.mutedSurface }}>
                      <Ionicons name="time-outline" size={18} color={colors.green} />
                      <Text className="font-poppins-bold" style={{ color: colors.mutedText }}>{item.cookingTime} {t('unit.minute')}</Text>
                    </View>
                    <View className="flex-1 flex-row items-center justify-center gap-2 rounded-3xl px-4 py-3" style={{ backgroundColor: colors.greenLight }}>
                      <Text className="font-poppins-bold text-center text-sm uppercase" style={{ color: '#0B3213' }}>{categoryLabel}</Text>
                    </View>
                    <Ionicons name="create-outline" size={26} color={colors.green} />
                  </View>
                </Pressable>
              )
            }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  )
}
