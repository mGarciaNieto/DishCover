/**
 * Pantalla de detalle de receta.
 * Muestra la información completa de una receta, favoritos, reportes y comentarios.
 *
 * @returns {JSX.Element} Vista de detalle y participación sobre una receta.
 * @author Manuel García Nieto
 */
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Recipe, recipes } from '@/data/demo'
import { categoryTranslationKeys } from '@/constants/translations'
import { shadows } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import {
  createRecipeComment,
  createRecipeReport,
  deleteFavoriteRecipe,
  deleteRecipeComment,
  fetchFavoriteRecipeIds,
  fetchRecipeById,
  fetchRecipeComments,
  RecipeComment,
  saveFavoriteRecipe,
  updateRecipeComment,
} from '@/services/api'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

export default function RecipeDetailsScreen() {
  const { contentWidthStyle, isShortPhone, isSmallPhone, isTablet, screenPaddingStyle } = useResponsiveLayout()
  const { t } = useLanguage()
  const { colors, isDarkMode } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const recipeId = useMemo(() => Number(Array.isArray(id) ? id[0] : id), [id])
  const fallbackRecipe = useMemo(() => recipes.find((recipe) => recipe.id === recipeId) ?? null, [recipeId])
  const { token, user } = useAuth()
  const [recipe, setRecipe] = useState<Recipe | null>(fallbackRecipe)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [comments, setComments] = useState<RecipeComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportText, setReportText] = useState('')
  const recipeCategoryKey = recipe ? categoryTranslationKeys[recipe.category] : undefined
  const recipeCategoryLabel = recipe ? (recipeCategoryKey ? t(recipeCategoryKey) : recipe.category) : ''
  const servingLabel = recipe?.servings === 1 ? t('unit.serving') : t('unit.servings')
  const categoryTextColor = isDarkMode ? '#0B3213' : colors.greenDark

  const loadComments = useCallback(async () => {
    if (!token || !Number.isFinite(recipeId)) {
      setComments([])
      return
    }

    try {
      const apiComments = await fetchRecipeComments(token, recipeId)
      setComments(apiComments)
    } catch {
      setComments([])
    }
  }, [recipeId, token])

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true)

      if (!Number.isFinite(recipeId)) {
        setLoading(false)
        return
      }

      if (!token) {
        setRecipe(fallbackRecipe)
        setLoading(false)
        return
      }

      try {
        const apiRecipe = await fetchRecipeById(token, recipeId)
        setRecipe(apiRecipe)
      } catch {
        setRecipe(fallbackRecipe)
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [fallbackRecipe, recipeId, token])

  useEffect(() => {
    const loadFavoriteState = async () => {
      if (!token || !Number.isFinite(recipeId)) {
        setIsFavorite(false)
        return
      }

      try {
        const favoriteIds = await fetchFavoriteRecipeIds(token)
        setIsFavorite(favoriteIds.includes(recipeId))
      } catch {
        setIsFavorite(false)
      }
    }

    loadFavoriteState()
    loadComments()
  }, [loadComments, recipeId, token])

  const requireSession = () => {
    if (token) {
      return true
    }

    Alert.alert(t('recipeDetails.alertSessionTitle'), t('recipeDetails.alertSessionMessage'))
    return false
  }

  const handleToggleFavorite = async () => {
    if (!requireSession()) {
      return
    }

    const nextFavorite = !isFavorite
    setIsFavorite(nextFavorite)

    try {
      if (nextFavorite) {
        await saveFavoriteRecipe(token!, recipeId)
      } else {
        await deleteFavoriteRecipe(token!, recipeId)
      }
    } catch {
      try {
        const favoriteIds = await fetchFavoriteRecipeIds(token!)
        setIsFavorite(favoriteIds.includes(recipeId))
      } catch {
        setIsFavorite(!nextFavorite)
        Alert.alert(t('recipeDetails.alertFavoriteTitle'), t('recipeDetails.alertFavoriteMessage'))
      }
    }
  }

  const handleCreateComment = async () => {
    if (!requireSession()) {
      return
    }

    const cleanComment = newComment.trim()
    if (cleanComment.length < 2) {
      Alert.alert(t('recipeDetails.alertCommentEmptyTitle'), t('recipeDetails.alertCommentEmptyMessage'))
      return
    }

    try {
      await createRecipeComment(token!, recipeId, cleanComment)
      setNewComment('')
      await loadComments()
    } catch {
      Alert.alert(t('recipeDetails.alertCommentCreateTitle'), t('recipeDetails.alertCommentCreateMessage'))
    }
  }

  const handleSaveEditedComment = async () => {
    if (!requireSession() || !editingCommentId) {
      return
    }

    const cleanComment = editingCommentText.trim()
    if (cleanComment.length < 2) {
      Alert.alert(t('recipeDetails.alertCommentEmptyTitle'), t('recipeDetails.alertCommentEmptyEditMessage'))
      return
    }

    try {
      await updateRecipeComment(token!, editingCommentId, cleanComment)
      setEditingCommentId(null)
      setEditingCommentText('')
      await loadComments()
    } catch {
      Alert.alert(t('recipeDetails.alertCommentEditTitle'), t('recipeDetails.alertCommentEditMessage'))
    }
  }

  const handleDeleteComment = (commentId: number) => {
    if (!requireSession()) {
      return
    }

    Alert.alert(t('recipeDetails.deleteCommentTitle'), t('recipeDetails.deleteCommentMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRecipeComment(token!, commentId)
            await loadComments()
          } catch {
            Alert.alert(t('recipeDetails.alertCommentDeleteTitle'), t('recipeDetails.alertCommentDeleteMessage'))
          }
        },
      },
    ])
  }

  const handleCreateReport = async () => {
    if (!requireSession()) {
      return
    }

    const cleanReport = reportText.trim()
    if (cleanReport.length < 4) {
      Alert.alert(t('recipeDetails.alertReportIncompleteTitle'), t('recipeDetails.alertReportIncompleteMessage'))
      return
    }

    try {
      await createRecipeReport(token!, recipeId, cleanReport)
      setReportText('')
      setReportOpen(false)
      Alert.alert(t('recipeDetails.alertReportSuccessTitle'), t('recipeDetails.alertReportSuccessMessage'))
    } catch {
      Alert.alert(t('recipeDetails.alertReportErrorTitle'), t('recipeDetails.alertReportErrorMessage'))
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.green} />
          <Text className="mt-4 text-base font-bold" style={{ color: colors.mutedText }}>{t('recipeDetails.loading')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-2xl font-black" style={{ color: colors.text }}>{t('recipeDetails.unavailable')}</Text>
          <Pressable className="mt-8 min-h-14 flex-row items-center justify-center rounded-3xl px-6" style={{ backgroundColor: colors.green }} onPress={() => router.back()}>
            <Text className="text-lg font-extrabold text-white">{t('common.back')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
        <View style={[screenPaddingStyle, contentWidthStyle, { paddingTop: isShortPhone ? 12 : 16 }]}>
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable className="h-12 w-12 items-center justify-center rounded-3xl" onPress={() => router.back()} style={[shadows.soft, { backgroundColor: colors.surface }]}>
              <Ionicons name="chevron-back" size={25} color={colors.text} />
            </Pressable>

            <View className="flex-row gap-3">
              <Pressable className="h-12 w-12 items-center justify-center rounded-3xl" onPress={handleToggleFavorite} style={[shadows.soft, { backgroundColor: colors.surface }]}>
                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={25} color={isFavorite ? colors.danger : colors.text} />
              </Pressable>

              <Pressable className="h-12 w-12 items-center justify-center rounded-3xl" onPress={() => setReportOpen((current) => !current)} style={[shadows.soft, { backgroundColor: colors.surface }]}>
                <Ionicons name="flag-outline" size={23} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View
            className="overflow-hidden rounded-3xl"
            style={{ backgroundColor: colors.mutedSurface, height: isTablet ? 330 : isShortPhone ? 224 : 288, width: '100%' }}
          >
            <Image source={recipe.image} className="h-full w-full" resizeMode="cover" />
          </View>

          <View className="mt-6 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className={`${isSmallPhone ? 'text-3xl' : 'text-4xl'} font-black`} style={{ color: colors.text, lineHeight: isSmallPhone ? 34 : 40 }}>
                {recipe.title}
              </Text>
              <Text className="mt-3 self-start rounded-3xl px-4 py-2 text-xs font-extrabold uppercase" style={{ backgroundColor: colors.greenLight, color: categoryTextColor }}>{recipeCategoryLabel}</Text>
            </View>
          </View>

          <View className="mt-6 flex-row gap-3">
            <View className="min-h-16 flex-1 flex-row items-center justify-center gap-2 rounded-3xl" style={{ backgroundColor: colors.surface }}>
              <Ionicons name="time-outline" size={20} color={colors.green} />
              <Text adjustsFontSizeToFit numberOfLines={1} className="text-base font-extrabold" style={{ color: colors.mutedText }}>{recipe.cookingTime} {t('unit.minute')}</Text>
            </View>
            <View className="min-h-16 flex-1 flex-row items-center justify-center gap-2 rounded-3xl" style={{ backgroundColor: colors.surface }}>
              <Ionicons name="people-outline" size={20} color={colors.green} />
              <Text adjustsFontSizeToFit numberOfLines={1} className="text-base font-extrabold" style={{ color: colors.mutedText }}>{recipe.servings} {servingLabel}</Text>
            </View>
          </View>

          <Text className="mt-8 text-lg leading-7" style={{ color: colors.mutedText }}>{recipe.description}</Text>

          <View className="mt-8 rounded-3xl p-5" style={{ backgroundColor: colors.surface }}>
            <Text className="text-2xl font-black" style={{ color: colors.text }}>{t('recipeDetails.ingredientsTitle')}</Text>
            <Text className="mt-3 text-base leading-7" style={{ color: colors.mutedText }}>{recipe.ingredients ?? t('recipeDetails.ingredientsFallback')}</Text>
          </View>

          {reportOpen ? (
            <View className="mt-6 rounded-3xl p-5" style={{ backgroundColor: colors.mutedSurface }}>
              <Text className="text-xl font-black" style={{ color: colors.text }}>{t('recipeDetails.reportTitle')}</Text>
              <TextInput
                value={reportText}
                onChangeText={setReportText}
                placeholder={t('recipeDetails.reportPlaceholder')}
                placeholderTextColor={colors.softText}
                multiline
                className="mt-4 min-h-24 rounded-3xl px-4 py-3 text-base leading-6"
                style={{ backgroundColor: colors.surface, color: colors.text }}
                textAlignVertical="top"
              />
              <Pressable className="mt-4 min-h-14 items-center justify-center rounded-3xl" style={{ backgroundColor: colors.green }} onPress={handleCreateReport}>
                <Text className="text-base font-extrabold text-white">{t('recipeDetails.reportSubmit')}</Text>
              </Pressable>
            </View>
          ) : null}

          <View className="mt-9">
            <Text className="text-2xl font-black" style={{ color: colors.text }}>{t('recipeDetails.commentsTitle')}</Text>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder={t('recipeDetails.commentPlaceholder')}
              placeholderTextColor={colors.softText}
              multiline
              className="mt-4 min-h-24 rounded-3xl px-4 py-3 text-base leading-6"
              style={{ backgroundColor: colors.surface, color: colors.text }}
              textAlignVertical="top"
            />
            <Pressable className="mt-4 min-h-14 items-center justify-center rounded-3xl" style={{ backgroundColor: colors.green }} onPress={handleCreateComment}>
              <Text className="text-base font-extrabold text-white">{t('recipeDetails.commentSubmit')}</Text>
            </Pressable>
          </View>

          <View className="mt-6 gap-4">
            {comments.length === 0 ? (
              <Text className="rounded-3xl p-5 text-base font-bold leading-6" style={{ backgroundColor: colors.mutedSurface, color: colors.mutedText }}>{t('recipeDetails.noComments')}</Text>
            ) : (
              comments.map((comment) => {
                const isEditing = editingCommentId === comment.id
                const isOwner = comment.author === user.username

                return (
                  <View key={comment.id} className="rounded-3xl p-5" style={{ backgroundColor: colors.surface }}>
                    {isEditing ? (
                      <>
                        <TextInput
                          value={editingCommentText}
                          onChangeText={setEditingCommentText}
                          multiline
                          className="min-h-20 rounded-3xl px-4 py-3 text-base leading-6"
                          placeholderTextColor={colors.softText}
                          style={{ backgroundColor: colors.mutedSurface, color: colors.text }}
                          textAlignVertical="top"
                        />
                        <View className="mt-4 flex-row gap-3">
                          <Pressable className="min-h-12 flex-1 items-center justify-center rounded-3xl" style={{ backgroundColor: colors.green }} onPress={handleSaveEditedComment}>
                            <Text className="font-extrabold text-white">{t('common.save')}</Text>
                          </Pressable>
                          <Pressable
                            className="min-h-12 flex-1 items-center justify-center rounded-3xl"
                            style={{ backgroundColor: colors.mutedSurface }}
                            onPress={() => {
                              setEditingCommentId(null)
                              setEditingCommentText('')
                            }}
                          >
                            <Text className="font-extrabold" style={{ color: colors.text }}>{t('common.cancel')}</Text>
                          </Pressable>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text className="text-sm font-extrabold uppercase" style={{ color: colors.green }}>{comment.author}</Text>
                        <Text className="mt-2 text-base leading-7" style={{ color: colors.mutedText }}>{comment.comment}</Text>
                        {isOwner ? (
                          <View className="mt-4 flex-row gap-3">
                            <Pressable
                              className="min-h-11 flex-1 items-center justify-center rounded-3xl"
                              style={{ backgroundColor: colors.mutedSurface }}
                              onPress={() => {
                                setEditingCommentId(comment.id)
                                setEditingCommentText(comment.comment)
                              }}
                            >
                              <Text className="font-extrabold" style={{ color: colors.text }}>{t('common.edit')}</Text>
                            </Pressable>
                            <Pressable className="min-h-11 flex-1 items-center justify-center rounded-3xl" style={{ backgroundColor: colors.mutedSurface }} onPress={() => handleDeleteComment(comment.id)}>
                              <Text className="font-extrabold" style={{ color: colors.danger }}>{t('common.delete')}</Text>
                            </Pressable>
                          </View>
                        ) : null}
                      </>
                    )}
                  </View>
                )
              })
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
