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
import { colors, shadows } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
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

export default function RecipeDetailsScreen() {
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

    Alert.alert('Sesión necesaria', 'Inicia sesión para utilizar esta funcionalidad.')
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
        Alert.alert('No se pudo actualizar', 'Inténtalo de nuevo dentro de unos segundos.')
      }
    }
  }

  const handleCreateComment = async () => {
    if (!requireSession()) {
      return
    }

    const cleanComment = newComment.trim()
    if (cleanComment.length < 2) {
      Alert.alert('Comentario vacío', 'Escribe un comentario antes de publicarlo.')
      return
    }

    try {
      await createRecipeComment(token!, recipeId, cleanComment)
      setNewComment('')
      await loadComments()
    } catch {
      Alert.alert('No se pudo comentar', 'Revisa la conexión con el backend e inténtalo de nuevo.')
    }
  }

  const handleSaveEditedComment = async () => {
    if (!requireSession() || !editingCommentId) {
      return
    }

    const cleanComment = editingCommentText.trim()
    if (cleanComment.length < 2) {
      Alert.alert('Comentario vacío', 'El comentario editado no puede estar vacío.')
      return
    }

    try {
      await updateRecipeComment(token!, editingCommentId, cleanComment)
      setEditingCommentId(null)
      setEditingCommentText('')
      await loadComments()
    } catch {
      Alert.alert('No se pudo editar', 'Solo puedes modificar tus propios comentarios.')
    }
  }

  const handleDeleteComment = (commentId: number) => {
    if (!requireSession()) {
      return
    }

    Alert.alert('Eliminar comentario', '¿Quieres eliminar este comentario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRecipeComment(token!, commentId)
            await loadComments()
          } catch {
            Alert.alert('No se pudo eliminar', 'Solo puedes eliminar tus propios comentarios.')
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
      Alert.alert('Reporte incompleto', 'Describe brevemente el problema de la receta.')
      return
    }

    try {
      await createRecipeReport(token!, recipeId, cleanReport)
      setReportText('')
      setReportOpen(false)
      Alert.alert('Reporte enviado', 'Gracias por ayudar a revisar el contenido.')
    } catch {
      Alert.alert('No se pudo reportar', 'Revisa la conexión con el backend e inténtalo de nuevo.')
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.green} />
          <Text className="mt-4 text-base font-bold text-dish-muted">Cargando receta...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-2xl font-black text-dish-text">No se pudo cargar la receta.</Text>
          <Pressable className="mt-8 min-h-14 flex-row items-center justify-center rounded-3xl bg-dish-green px-6" onPress={() => router.back()}>
            <Text className="text-lg font-extrabold text-white">Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
        <View className="px-6 pt-4">
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable className="h-12 w-12 items-center justify-center rounded-3xl bg-dish-surface" onPress={() => router.back()} style={shadows.soft}>
              <Ionicons name="chevron-back" size={25} color={colors.text} />
            </Pressable>

            <View className="flex-row gap-3">
              <Pressable className="h-12 w-12 items-center justify-center rounded-3xl bg-dish-surface" onPress={handleToggleFavorite} style={shadows.soft}>
                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={25} color={isFavorite ? colors.danger : colors.text} />
              </Pressable>

              <Pressable className="h-12 w-12 items-center justify-center rounded-3xl bg-dish-surface" onPress={() => setReportOpen((current) => !current)} style={shadows.soft}>
                <Ionicons name="flag-outline" size={23} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View className="h-72 overflow-hidden rounded-3xl bg-dish-muted-surface">
            <Image source={recipe.image} className="h-full w-full" resizeMode="cover" />
          </View>

          <View className="mt-6 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-4xl font-black leading-10 text-dish-text">{recipe.title}</Text>
              <Text className="mt-3 self-start rounded-3xl bg-dish-green-light px-4 py-2 text-xs font-extrabold uppercase text-dish-green-dark">{recipe.category}</Text>
            </View>
          </View>

          <View className="mt-6 flex-row gap-3">
            <View className="min-h-16 flex-1 flex-row items-center justify-center gap-2 rounded-3xl bg-dish-surface">
              <Ionicons name="time-outline" size={20} color={colors.green} />
              <Text className="text-base font-extrabold text-dish-muted">{recipe.cookingTime} min</Text>
            </View>
            <View className="min-h-16 flex-1 flex-row items-center justify-center gap-2 rounded-3xl bg-dish-surface">
              <Ionicons name="people-outline" size={20} color={colors.green} />
              <Text className="text-base font-extrabold text-dish-muted">{recipe.servings} ración</Text>
            </View>
          </View>

          <Text className="mt-8 text-lg leading-7 text-dish-muted">{recipe.description}</Text>

          <View className="mt-8 rounded-3xl bg-dish-surface p-5">
            <Text className="text-2xl font-black text-dish-text">Ingredientes</Text>
            <Text className="mt-3 text-base leading-7 text-dish-muted">{recipe.ingredients ?? 'Ingredientes pendientes de completar.'}</Text>
          </View>

          {reportOpen ? (
            <View className="mt-6 rounded-3xl bg-dish-muted-surface p-5">
              <Text className="text-xl font-black text-dish-text">Reportar receta</Text>
              <TextInput
                value={reportText}
                onChangeText={setReportText}
                placeholder="Describe el problema..."
                placeholderTextColor="#7B8076"
                multiline
                className="mt-4 min-h-24 rounded-3xl bg-dish-surface px-4 py-3 text-base leading-6 text-dish-text"
                textAlignVertical="top"
              />
              <Pressable className="mt-4 min-h-14 items-center justify-center rounded-3xl bg-dish-green" onPress={handleCreateReport}>
                <Text className="text-base font-extrabold text-white">Enviar reporte</Text>
              </Pressable>
            </View>
          ) : null}

          <View className="mt-9">
            <Text className="text-2xl font-black text-dish-text">Comentarios</Text>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Escribe un comentario..."
              placeholderTextColor="#7B8076"
              multiline
              className="mt-4 min-h-24 rounded-3xl bg-dish-surface px-4 py-3 text-base leading-6 text-dish-text"
              textAlignVertical="top"
            />
            <Pressable className="mt-4 min-h-14 items-center justify-center rounded-3xl bg-dish-green" onPress={handleCreateComment}>
              <Text className="text-base font-extrabold text-white">Publicar comentario</Text>
            </Pressable>
          </View>

          <View className="mt-6 gap-4">
            {comments.length === 0 ? (
              <Text className="rounded-3xl bg-dish-muted-surface p-5 text-base font-bold leading-6 text-dish-muted">Todavía no hay comentarios para esta receta.</Text>
            ) : (
              comments.map((comment) => {
                const isEditing = editingCommentId === comment.id
                const isOwner = comment.author === user.username

                return (
                  <View key={comment.id} className="rounded-3xl bg-dish-surface p-5">
                    {isEditing ? (
                      <>
                        <TextInput
                          value={editingCommentText}
                          onChangeText={setEditingCommentText}
                          multiline
                          className="min-h-20 rounded-3xl bg-dish-muted-surface px-4 py-3 text-base leading-6 text-dish-text"
                          textAlignVertical="top"
                        />
                        <View className="mt-4 flex-row gap-3">
                          <Pressable className="min-h-12 flex-1 items-center justify-center rounded-3xl bg-dish-green" onPress={handleSaveEditedComment}>
                            <Text className="font-extrabold text-white">Guardar</Text>
                          </Pressable>
                          <Pressable
                            className="min-h-12 flex-1 items-center justify-center rounded-3xl bg-dish-muted-surface"
                            onPress={() => {
                              setEditingCommentId(null)
                              setEditingCommentText('')
                            }}
                          >
                            <Text className="font-extrabold text-dish-text">Cancelar</Text>
                          </Pressable>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text className="text-sm font-extrabold uppercase text-dish-green">{comment.author}</Text>
                        <Text className="mt-2 text-base leading-7 text-dish-muted">{comment.comment}</Text>
                        {isOwner ? (
                          <View className="mt-4 flex-row gap-3">
                            <Pressable
                              className="min-h-11 flex-1 items-center justify-center rounded-3xl bg-dish-muted-surface"
                              onPress={() => {
                                setEditingCommentId(comment.id)
                                setEditingCommentText(comment.comment)
                              }}
                            >
                              <Text className="font-extrabold text-dish-text">Editar</Text>
                            </Pressable>
                            <Pressable className="min-h-11 flex-1 items-center justify-center rounded-3xl bg-dish-muted-surface" onPress={() => handleDeleteComment(comment.id)}>
                              <Text className="font-extrabold text-dish-danger">Eliminar</Text>
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
