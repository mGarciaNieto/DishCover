/**
 * Tarjeta visual de receta.
 * Muestra imagen, categoría, descripción breve y datos de tiempo/personas.
 *
 * @returns {JSX.Element} Tarjeta de receta para listados.
 * @author Manuel García Nieto
 */
import { Image, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Recipe } from '@/data/demo'
import { colors } from '@/constants/theme'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'
import { useTheme } from '@/context/ThemeContext'

type RecipeCardProps = {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { isSmallPhone } = useResponsiveLayout()
  const { colors: themeColors } = useTheme()
  const imageHeight = isSmallPhone ? 188 : 208

  return (
    <Pressable className="mb-8" onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id.toString() } })} style={({ pressed }) => [pressed && { opacity: 0.82 }]}>
      <View className="mb-5 overflow-hidden rounded-3xl" style={{ backgroundColor: themeColors.mutedSurface, height: imageHeight, width: '100%' }}>
        <Image source={recipe.image} className="h-full w-full" resizeMode="cover" />
        <View className="absolute left-4 top-3 rounded-2xl bg-dish-green-light px-4 py-2">
          <Text className="text-xs font-extrabold uppercase text-dish-green-dark">{recipe.category}</Text>
        </View>
      </View>

      <Text
        className={`${isSmallPhone ? 'text-2xl' : 'text-3xl'} mb-2.5 font-black`}
        style={{ color: themeColors.text, lineHeight: isSmallPhone ? 30 : 36 }}
      >
        {recipe.title}
      </Text>
      <Text className="text-lg leading-7" numberOfLines={2} style={{ color: themeColors.mutedText }}>
        {recipe.description}
      </Text>

      <View className="mt-4 flex-row items-center gap-6">
        <View className="flex-row items-center gap-2">
          <Ionicons name="time-outline" size={18} color={colors.green} />
          <Text className="font-bold text-base" style={{ color: themeColors.mutedText }}>{recipe.cookingTime} min</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="people-outline" size={18} color={colors.green} />
          <Text className="font-bold text-base" style={{ color: themeColors.mutedText }}>{recipe.servings} ración</Text>
        </View>
      </View>
    </Pressable>
  )
}
