/**
 * Pantalla de creación de recetas.
 * Permite registrar una nueva receta validando los datos antes de enviarlos al backend.
 *
 * @returns {JSX.Element} Formulario de alta de receta.
 * @author Manuel García Nieto
 */
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, shadows } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { createRecipe } from '@/services/api'

const categories = ['Vegano', 'Vegetariano', 'Carne', 'Pescado'] as const

function isValidUrl(value: string) {
  // Validación simple para evitar enviar imágenes con URLs claramente incorrectas.
  return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)
}

type RecipeFieldProps = {
  label: string
  placeholder: string
  value: string
  onChangeText: (value: string) => void
  multiline?: boolean
  keyboardType?: 'default' | 'numeric' | 'url'
}

function RecipeField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
}: RecipeFieldProps) {
  return (
    <View className="gap-3">
      <Text className="font-poppins-bold text-dish-muted text-base">{label}</Text>
      <TextInput
        className="font-poppins-medium bg-dish-green-light text-dish-green-dark rounded-4xl px-7 text-lg"
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#FFFFF8"
        style={{
          minHeight: multiline ? 136 : 72,
          paddingTop: multiline ? 28 : 0,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        value={value}
      />
    </View>
  )
}

export default function CreateRecipeScreen() {
  const { token } = useAuth()
  const ingredientsRef = useRef<TextInput>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('Vegano')
  const [cookingTime, setCookingTime] = useState('')
  const [servings, setServings] = useState(4)
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateRecipe = async () => {
    // El backend espera cookingTime como número entero, no como texto.
    const parsedCookingTime = Number(cookingTime)

    if (!title.trim() || !description.trim() || !imageUrl.trim() || !cookingTime.trim() || !ingredients.trim()) {
      Alert.alert('Faltan datos', 'Completa todos los campos antes de publicar la receta.')
      return
    }

    if (!isValidUrl(imageUrl.trim())) {
      Alert.alert('Imagen no válida', 'Introduce una URL de imagen que empiece por http:// o https://.')
      return
    }

    if (!Number.isInteger(parsedCookingTime) || parsedCookingTime <= 0) {
      Alert.alert('Tiempo no válido', 'El tiempo de cocción debe ser un número entero positivo.')
      return
    }

    if (!token) {
      Alert.alert('Sesión no disponible', 'Inicia sesión de nuevo para crear una receta.')
      return
    }

    try {
      setLoading(true)
      // El payload respeta los nombres del DTO RecipeRequest de Spring Boot.
      await createRecipe(token, {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        cookingTime: parsedCookingTime,
        numPersons: servings,
        ingredients: ingredients.trim(),
        recipeCategory: category,
      })

      Alert.alert('Receta creada', 'La receta se ha publicado correctamente.')
      router.back()
    } catch {
      Alert.alert('No se pudo crear', 'Revisa los datos e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="bg-dish-surface-warm flex-1">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 30, paddingHorizontal: 30, paddingBottom: 54, paddingTop: 34 }}
      >
        <View className="flex-row items-center gap-5">
          <Pressable
            accessibilityLabel="Volver"
            className="h-11 w-11 items-center justify-center rounded-3xl"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color={colors.greenDark} />
          </Pressable>
          <Text className="font-poppins-bold text-dish-green-dark text-xl">Crear receta</Text>
        </View>

        <View className="gap-4 pt-12">
          <Text className="font-poppins-bold text-dish-green-dark text-5xl leading-14">Nueva receta</Text>
          <Text className="font-poppins-medium text-dish-muted max-w-80 text-lg leading-7">
            Comparte tu creación culinaria con la comunidad DishCover. Completa los datos para publicar tu plato.
          </Text>
        </View>

        <View className="gap-7">
          <RecipeField label="Título de la receta" placeholder="Título" value={title} onChangeText={setTitle} />
          <RecipeField
            label="Descripción de la receta"
            multiline
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
          />

          <View className="gap-3">
            <Text className="font-poppins-bold text-dish-muted text-base">Imagen de la receta</Text>
            <View className="bg-dish-green-light h-18 flex-row items-center gap-3 rounded-4xl px-7">
              <Ionicons name="image-outline" size={22} color="rgba(0, 109, 29, 0.64)" />
              <TextInput
                autoCapitalize="none"
                className="font-poppins-medium text-dish-green-dark flex-1 text-lg"
                keyboardType="url"
                onChangeText={setImageUrl}
                placeholder="https://ejemplo.com/imagen.jpg"
                placeholderTextColor="#FFFFF8"
                value={imageUrl}
              />
            </View>
          </View>

          <View className="gap-3">
            <Text className="font-poppins-bold text-dish-muted text-base">Categoría de la receta</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {categories.map((item) => {
                const active = item === category

                return (
                  <Pressable
                    key={item}
                    className={`min-h-14 justify-center rounded-4xl border px-7 ${active ? 'border-dish-green-dark bg-dish-green-dark' : 'border-dish-border bg-transparent'}`}
                    onPress={() => setCategory(item)}
                  >
                    <Text className={`font-poppins-bold text-base ${active ? 'text-white' : 'text-dish-text'}`}>
                      {item}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>

          <View className="gap-3">
            <Text className="font-poppins-bold text-dish-muted text-base">Tiempo de cocción</Text>
            <View className="flex-row gap-5">
              <TextInput
                className="font-poppins-medium bg-dish-green-light text-dish-green-dark h-20 flex-1 rounded-4xl px-7 text-lg"
                keyboardType="numeric"
                onChangeText={setCookingTime}
                placeholder="Minutos"
                placeholderTextColor="#FFFFF8"
                value={cookingTime}
              />
              <View className="h-20 flex-1 items-center justify-center rounded-4xl border-2 border-[#FFD891] bg-[#FFEBC8]">
                <Ionicons name="timer-outline" size={27} color="#9B5B10" />
                <Text className="font-poppins-bold text-dish-text mt-1 text-xs uppercase">Duración</Text>
              </View>
            </View>
          </View>

          <View className="gap-3">
            <Text className="font-poppins-bold text-dish-muted text-base">Raciones por persona</Text>
            <View className="bg-dish-green-light items-center rounded-4xl px-7 py-8">
              <Text className="font-poppins-bold text-7xl leading-18 text-[#063A12]">{servings}</Text>
              <View className="mt-3 flex-row gap-5">
                <Pressable
                  className="h-12 w-12 items-center justify-center rounded-3xl bg-[#063A12]"
                  onPress={() => setServings((current) => Math.max(1, current - 1))}
                >
                  <Ionicons name="remove" size={24} color="#FFFFF8" />
                </Pressable>
                <Pressable
                  className="h-12 w-12 items-center justify-center rounded-3xl bg-[#063A12]"
                  onPress={() => setServings((current) => Math.min(12, current + 1))}
                >
                  <Ionicons name="add" size={24} color="#FFFFF8" />
                </Pressable>
              </View>
              <Text className="font-poppins-bold text-dish-green-dark mt-5 text-xs tracking-wide uppercase">
                Ajustar número de personas
              </Text>
            </View>
          </View>

          <View className="gap-3">
            <Text className="font-poppins-bold text-dish-muted text-base">Ingredientes necesarios</Text>
            <View className="bg-dish-green-light min-h-18 flex-row items-center gap-3 rounded-4xl px-7">
              <TextInput
                ref={ingredientsRef}
                className="font-poppins-medium text-dish-green-dark flex-1 text-lg"
                multiline
                onChangeText={setIngredients}
                placeholder="Ingredientes necesarios"
                placeholderTextColor="#FFFFF8"
                style={{ paddingVertical: 18, textAlignVertical: 'center' }}
                value={ingredients}
              />
              <Pressable
                className="bg-dish-green-dark h-12 w-12 items-center justify-center rounded-3xl"
                onPress={() => ingredientsRef.current?.focus()}
              >
                <Ionicons name="add-circle-outline" size={28} color="#FFFFF8" />
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable
          className="mt-5 min-h-20 overflow-hidden rounded-4xl"
          disabled={loading}
          onPress={handleCreateRecipe}
          style={({ pressed }) => [
            shadows.soft,
            loading && { opacity: 0.58 },
            pressed && !loading && { opacity: 0.86 },
          ]}
        >
          <LinearGradient
            colors={['#17661E', '#5CAB4F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ alignItems: 'center', flex: 1, flexDirection: 'row', gap: 12, justifyContent: 'center' }}
          >
            {loading ? <ActivityIndicator color="#FFFFF8" /> : null}
            <Text className="font-poppins-bold text-2xl text-white">
              {loading ? 'Publicando...' : 'Publicar receta'}
            </Text>
            {!loading ? <Ionicons name="send-outline" size={25} color="#FFFFF8" /> : null}
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
