/**
 * Pantalla principal de recetas.
 * Permite buscar recetas, filtrar por categoría y mostrar datos locales o remotos.
 *
 * @returns {JSX.Element} Listado principal de recetas.
 * @author Manuel García Nieto
 */
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useMemo, useState } from 'react'
import { AppScreen } from '@/components/AppScreen'
import { RecipeCard } from '@/components/RecipeCard'
import { Recipe, recipes } from '@/data/demo'
import { useAuth } from '@/context/AuthContext'
import { fetchRecipes } from '@/services/api'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'
import { useTheme } from '@/context/ThemeContext'

export default function HomeScreen() {
  const { isSmallPhone } = useResponsiveLayout()
  const { colors, isDarkMode } = useTheme()
  const { token } = useAuth()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [remoteRecipes, setRemoteRecipes] = useState<Recipe[] | null>(null)
  const visibleRecipes = remoteRecipes ?? recipes
  const visibleCategories = useMemo(() => Array.from(new Set(visibleRecipes.map((recipe) => recipe.category))).filter(Boolean), [visibleRecipes])

  useEffect(() => {
    if (!token) {
      setRemoteRecipes(null)
      return
    }

    fetchRecipes(token)
      .then((apiRecipes) => setRemoteRecipes(apiRecipes.length > 0 ? apiRecipes : null))
      .catch(() => setRemoteRecipes(null))
  }, [token])

  useEffect(() => {
    if (activeCategory && !visibleCategories.includes(activeCategory)) {
      setActiveCategory('')
    }
  }, [activeCategory, visibleCategories])

  const filteredRecipes = useMemo(
    () =>
      visibleRecipes.filter((recipe) => {
        const matchesCategory = activeCategory ? recipe.category === activeCategory : true
        const matchesQuery = recipe.title.toLowerCase().includes(query.toLowerCase())
        return matchesCategory && matchesQuery
      }),
    [activeCategory, query, visibleRecipes],
  )

  return (
    <AppScreen scroll={false}>
      <View className="gap-6 pb-6">
        <View className={`${isSmallPhone ? 'gap-4' : 'flex-row items-center gap-4'}`}>
          <Text className="text-3xl font-black" style={{ color: isDarkMode ? colors.text : colors.greenDark }}>Recetas</Text>
          <View
            className={`${isSmallPhone ? 'w-full' : 'flex-1'} min-h-14 flex-row items-center gap-2 rounded-sm px-3.5`}
            style={{ backgroundColor: colors.mutedSurface }}
          >
            <Ionicons name="search" size={24} color={colors.mutedText} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar recetas..."
              placeholderTextColor={colors.mutedText}
              className="flex-1 text-lg"
              style={{ color: colors.text }}
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="flex-row gap-3 pr-6">
          {visibleCategories.map((category) => {
            const active = category === activeCategory
            return (
              <Pressable
                key={category}
                className="min-h-12 items-center justify-center rounded-3xl px-5"
                style={{ backgroundColor: active ? colors.green : colors.mutedSurface }}
                onPress={() => setActiveCategory(active ? '' : category)}
              >
                <Text className="font-extrabold text-base" style={{ color: active ? '#FFFFFF' : colors.text }}>{category}</Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={filteredRecipes}
        keyExtractor={(recipe) => recipe.id.toString()}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="pb-32"
        ListEmptyComponent={<Text className="text-lg leading-7" style={{ color: colors.mutedText }}>No hay recetas para esta búsqueda.</Text>}
      />
    </AppScreen>
  )
}
