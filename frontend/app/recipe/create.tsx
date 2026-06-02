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
import { categoryTranslationKeys } from '@/constants/translations'
import { shadows } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { createRecipe } from '@/services/api'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

const categories = ['Vegano', 'Vegetariano', 'Carne', 'Pescado', 'Pasta', 'Pizza', 'Ensalada', 'Postre', 'Bebidas', 'Desayuno', 'Sopa' ] as const

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
  const { isShortPhone } = useResponsiveLayout()
  const { colors } = useTheme()

  return (
    <View className="gap-3">
      <Text className="font-poppins-bold text-base" style={{ color: colors.mutedText }}>{label}</Text>
      <TextInput
        className="font-poppins-medium rounded-4xl px-7 text-lg"
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#FFFFF8"
        style={{
          backgroundColor: colors.greenLight,
          color: '#0B3213',
          minHeight: multiline ? (isShortPhone ? 116 : 136) : isShortPhone ? 64 : 72,
          paddingTop: multiline ? (isShortPhone ? 22 : 28) : 0,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        value={value}
      />
    </View>
  )
}

export default function CreateRecipeScreen() {
  const { contentWidthStyle, horizontalPadding, isShortPhone, isSmallPhone, width } = useResponsiveLayout()
  const { token } = useAuth()
  const { t } = useLanguage()
  const { colors, isDarkMode } = useTheme()
  const ingredientsRef = useRef<TextInput>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('Vegano')
  const [cookingTime, setCookingTime] = useState('')
  const [servings, setServings] = useState(4)
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)
  const stackCookingTime = width < 380
  const publishButtonHeight = isShortPhone ? 58 : 68
  const activeCategoryBackground = isDarkMode ? colors.greenLight : colors.greenDark
  const activeCategoryText = isDarkMode ? '#0B3213' : '#FFFFFF'

  const handleCreateRecipe = async () => {
    // El backend espera cookingTime como número entero, no como texto.
    const parsedCookingTime = Number(cookingTime)

    if (!title.trim() || !description.trim() || !imageUrl.trim() || !cookingTime.trim() || !ingredients.trim()) {
      Alert.alert(t('recipeCreate.alertMissingTitle'), t('recipeCreate.alertMissingMessage'))
      return
    }

    if (!isValidUrl(imageUrl.trim())) {
      Alert.alert(t('recipeCreate.alertImageTitle'), t('recipeCreate.alertImageMessage'))
      return
    }

    if (!Number.isInteger(parsedCookingTime) || parsedCookingTime <= 0) {
      Alert.alert(t('recipeCreate.alertTimeTitle'), t('recipeCreate.alertTimeMessage'))
      return
    }

    if (!token) {
      Alert.alert(t('recipeCreate.alertSessionTitle'), t('recipeCreate.alertSessionMessage'))
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

      Alert.alert(t('recipeCreate.alertSuccessTitle'), t('recipeCreate.alertSuccessMessage'))
      router.back()
    } catch {
      Alert.alert(t('recipeCreate.alertErrorTitle'), t('recipeCreate.alertErrorMessage'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfaceWarm }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          contentWidthStyle,
          {
            gap: isShortPhone ? 22 : 30,
            paddingBottom: 54,
            paddingHorizontal: horizontalPadding,
            paddingTop: isShortPhone ? 24 : 34,
          },
        ]}
      >
        <View className="flex-row items-center gap-5">
          <Pressable
            accessibilityLabel={t('common.back')}
            className="h-11 w-11 items-center justify-center rounded-3xl"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color={colors.greenDark} />
          </Pressable>
          <Text className="font-poppins-bold text-xl" style={{ color: colors.greenDark }}>{t('recipeCreate.header')}</Text>
        </View>

        <View className="gap-4" style={{ paddingTop: isShortPhone ? 20 : 48 }}>
          <Text
            className={`${isSmallPhone ? 'text-4xl' : 'text-5xl'} font-poppins-bold`}
            style={{ color: colors.greenDark, lineHeight: isSmallPhone ? 44 : 56 }}
          >
            {t('recipeCreate.title')}
          </Text>
          <Text className="font-poppins-medium max-w-80 text-lg" style={{ color: colors.mutedText, lineHeight: isSmallPhone ? 25 : 28 }}>
            {t('recipeCreate.subtitle')}
          </Text>
        </View>

        <View style={{ gap: isShortPhone ? 22 : 28 }}>
          <RecipeField label={t('recipeCreate.titleLabel')} placeholder={t('recipeCreate.titlePlaceholder')} value={title} onChangeText={setTitle} />
          <RecipeField
            label={t('recipeCreate.descriptionLabel')}
            multiline
            placeholder={t('recipeCreate.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
          />

          <View className="gap-3">
            <Text className="font-poppins-bold text-base" style={{ color: colors.mutedText }}>{t('recipeCreate.imageLabel')}</Text>
            <View className="flex-row items-center gap-3 rounded-4xl px-7" style={{ backgroundColor: colors.greenLight, minHeight: isShortPhone ? 64 : 72 }}>
              <Ionicons name="image-outline" size={22} color="#0B3213" />
              <TextInput
                autoCapitalize="none"
                className="font-poppins-medium flex-1 text-lg"
                keyboardType="url"
                onChangeText={setImageUrl}
                placeholder={t('recipeCreate.imagePlaceholder')}
                placeholderTextColor="#FFFFF8"
                style={{ color: '#0B3213' }}
                value={imageUrl}
              />
            </View>
          </View>

          <View className="gap-3">
            <Text className="font-poppins-bold text-base" style={{ color: colors.mutedText }}>{t('recipeCreate.categoryLabel')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {categories.map((item) => {
                const active = item === category

                return (
                  <Pressable
                    key={item}
                    className="justify-center rounded-4xl border"
                    style={{
                      backgroundColor: active ? activeCategoryBackground : colors.surface,
                      borderColor: active ? activeCategoryBackground : colors.border,
                      minHeight: isShortPhone ? 48 : 56,
                      paddingHorizontal: isSmallPhone ? 20 : 28,
                    }}
                    onPress={() => setCategory(item)}
                  >
                    <Text className="font-poppins-bold text-base" style={{ color: active ? activeCategoryText : colors.text }}>
                      {t(categoryTranslationKeys[item])}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>

          <View className="gap-3">
            <Text className="font-poppins-bold text-base" style={{ color: colors.mutedText }}>{t('recipeCreate.cookingTimeLabel')}</Text>
            <View className={`${stackCookingTime ? 'gap-4' : 'flex-row gap-5'}`}>
              <TextInput
                className="font-poppins-medium rounded-4xl px-7 text-lg"
                keyboardType="numeric"
                onChangeText={setCookingTime}
                placeholder={t('recipeCreate.minutesPlaceholder')}
                placeholderTextColor="#FFFFF8"
                style={{ backgroundColor: colors.greenLight, color: '#0B3213', minHeight: isShortPhone ? 64 : 80, flex: stackCookingTime ? undefined : 1 }}
                value={cookingTime}
              />
              <View
                className="items-center justify-center rounded-4xl border-2"
                style={{ backgroundColor: isDarkMode ? colors.mutedSurface : '#FFEBC8', borderColor: '#FFD891', minHeight: isShortPhone ? 64 : 80, flex: stackCookingTime ? undefined : 1 }}
              >
                <Ionicons name="timer-outline" size={27} color="#9B5B10" />
                <Text className="font-poppins-bold mt-1 text-xs uppercase" style={{ color: colors.text }}>{t('recipeCreate.durationLabel')}</Text>
              </View>
            </View>
          </View>

          <View className="gap-3">
            <Text className="font-poppins-bold text-base" style={{ color: colors.mutedText }}>{t('recipeCreate.servingsLabel')}</Text>
            <View className="items-center rounded-4xl px-7" style={{ backgroundColor: colors.greenLight, paddingVertical: isShortPhone ? 22 : 32 }}>
              <Text className={`${isSmallPhone ? 'text-6xl' : 'text-7xl'} font-poppins-bold`} style={{ color: '#063A12', lineHeight: isSmallPhone ? 60 : 72 }}>
                {servings}
              </Text>
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
              <Text className="font-poppins-bold mt-5 text-xs tracking-wide uppercase" style={{ color: '#063A12' }}>
                {t('recipeCreate.adjustPeople')}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            <Text className="font-poppins-bold text-base" style={{ color: colors.mutedText }}>{t('recipeCreate.ingredientsLabel')}</Text>
            <View className="flex-row items-center gap-3 rounded-4xl px-7" style={{ backgroundColor: colors.greenLight, minHeight: isShortPhone ? 64 : 72 }}>
              <TextInput
                ref={ingredientsRef}
                className="font-poppins-medium flex-1 text-lg"
                multiline
                onChangeText={setIngredients}
                placeholder={t('recipeCreate.ingredientsPlaceholder')}
                placeholderTextColor="#FFFFF8"
                style={{ color: '#0B3213', paddingVertical: 18, textAlignVertical: 'center' }}
                value={ingredients}
              />
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-3xl"
                style={{ backgroundColor: '#063A12' }}
                onPress={() => ingredientsRef.current?.focus()}
              >
                <Ionicons name="add-circle-outline" size={28} color="#FFFFF8" />
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable
          className="mt-5 overflow-hidden rounded-4xl"
          disabled={loading}
          onPress={handleCreateRecipe}
          style={({ pressed }) => [
            shadows.soft,
            { minHeight: publishButtonHeight, width: '100%' },
            loading && { opacity: 0.58 },
            pressed && !loading && { opacity: 0.86 },
          ]}
        >
          <LinearGradient
            colors={['#17661E', '#5CAB4F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: 12,
              justifyContent: 'center',
              minHeight: publishButtonHeight,
              paddingVertical: isShortPhone ? 16 : 18,
              width: '100%',
            }}
          >
            {loading ? <ActivityIndicator color="#FFFFF8" /> : null}
            <Text className="font-poppins-bold text-2xl text-white">
              {loading ? t('recipeCreate.publishing') : t('recipeCreate.publish')}
            </Text>
            {!loading ? <Ionicons name="send-outline" size={25} color="#FFFFF8" /> : null}
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
