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

type RecipeCardProps = {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Pressable className="mb-8" onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id.toString() } })} style={({ pressed }) => [pressed && { opacity: 0.82 }]}>
      <View className="mb-5 h-52 overflow-hidden rounded-3xl bg-dish-muted-surface">
        <Image source={recipe.image} className="h-full w-full" resizeMode="cover" />
        <View className="absolute left-4 top-3 rounded-2xl bg-dish-green-light px-4 py-2">
          <Text className="text-xs font-extrabold uppercase text-dish-green-dark">{recipe.category}</Text>
        </View>
      </View>

      <Text className="mb-2.5 text-3xl font-black leading-9 text-dish-text">{recipe.title}</Text>
      <Text className="text-lg leading-7 text-dish-muted" numberOfLines={2}>
        {recipe.description}
      </Text>

      <View className="mt-4 flex-row items-center gap-6">
        <View className="flex-row items-center gap-2">
          <Ionicons name="time-outline" size={18} color={colors.green} />
          <Text className="font-bold text-base text-dish-muted">{recipe.cookingTime} min</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="people-outline" size={18} color={colors.green} />
          <Text className="font-bold text-base text-dish-muted">{recipe.servings} ración</Text>
        </View>
      </View>
    </Pressable>
  )
}
