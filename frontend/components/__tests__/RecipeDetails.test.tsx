/**
 * Pruebas de la pantalla de detalle de receta.
 * Comprueba la carga de datos, favoritos y comentarios desde la vista de detalle.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import RecipeDetailsScreen from '@/app/recipe/[id]'
import {
  createRecipeComment,
  createRecipeReport,
  deleteFavoriteRecipe,
  deleteRecipeComment,
  fetchFavoriteRecipeIds,
  fetchRecipeById,
  fetchRecipeComments,
  saveFavoriteRecipe,
  updateRecipeComment,
} from '@/services/api'

let mockToken: string | null = null

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
  useLocalSearchParams: () => ({ id: '1' }),
}))

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    token: mockToken,
    user: {
      username: 'Manuel',
      email: 'manuel.garcia@dishcover.local',
      firstName: 'Manuel',
      lastName: 'García Nieto',
    },
  }),
}))

jest.mock('@/services/api', () => ({
  createRecipeComment: jest.fn(),
  createRecipeReport: jest.fn(),
  deleteFavoriteRecipe: jest.fn(),
  deleteRecipeComment: jest.fn(),
  fetchFavoriteRecipeIds: jest.fn(),
  fetchRecipeById: jest.fn(),
  fetchRecipeComments: jest.fn(),
  saveFavoriteRecipe: jest.fn(),
  updateRecipeComment: jest.fn(),
}))

describe('RecipeDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToken = null
  })

  test('muestra la receta local si no hay sesión activa', async () => {
    const { getByText } = render(<RecipeDetailsScreen />)

    await waitFor(() => expect(getByText('Revuelto de tofu')).toBeTruthy())
    expect(getByText('Ingredientes')).toBeTruthy()
    expect(fetchRecipeById).not.toHaveBeenCalled()
  })

  test('carga detalle, favorito y comentarios desde el backend', async () => {
    mockToken = 'token-academico'
    ;(fetchRecipeById as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Receta API',
      category: 'Vegano',
      description: 'Descripción desde backend',
      ingredients: 'Ingrediente 1, ingrediente 2',
      cookingTime: 12,
      servings: 2,
      image: require('@/assets/dishcover/tofu.png'),
    })
    ;(fetchFavoriteRecipeIds as jest.Mock).mockResolvedValue([1])
    ;(fetchRecipeComments as jest.Mock).mockResolvedValue([{ id: 7, author: 'Manuel', comment: 'Muy buena receta' }])

    const { getByText } = render(<RecipeDetailsScreen />)

    await waitFor(() => expect(getByText('Receta API')).toBeTruthy())
    expect(getByText('Muy buena receta')).toBeTruthy()
    expect(fetchRecipeById).toHaveBeenCalledWith('token-academico', 1)
    expect(fetchFavoriteRecipeIds).toHaveBeenCalledWith('token-academico')
  })

  test('permite publicar un comentario', async () => {
    mockToken = 'token-academico'
    ;(fetchRecipeById as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Receta API',
      category: 'Vegano',
      description: 'Descripción desde backend',
      ingredients: 'Ingrediente 1',
      cookingTime: 12,
      servings: 2,
      image: require('@/assets/dishcover/tofu.png'),
    })
    ;(fetchFavoriteRecipeIds as jest.Mock).mockResolvedValue([])
    ;(fetchRecipeComments as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 8, author: 'Manuel', comment: 'Comentario nuevo' }])
    ;(createRecipeComment as jest.Mock).mockResolvedValue({ id: 8, author: 'Manuel', comment: 'Comentario nuevo' })

    const { getByPlaceholderText, getByText } = render(<RecipeDetailsScreen />)

    await waitFor(() => expect(getByText('Receta API')).toBeTruthy())
    fireEvent.changeText(getByPlaceholderText('Escribe un comentario...'), 'Comentario nuevo')
    fireEvent.press(getByText('Publicar comentario'))

    await waitFor(() => {
      expect(createRecipeComment).toHaveBeenCalledWith('token-academico', 1, 'Comentario nuevo')
      expect(getByText('Comentario nuevo')).toBeTruthy()
    })
  })

  test('abre el formulario de reporte desde el icono', async () => {
    const { getByText } = render(<RecipeDetailsScreen />)

    await waitFor(() => expect(getByText('Revuelto de tofu')).toBeTruthy())
    fireEvent.press(getByText('flag-outline'))

    expect(getByText('Reportar receta')).toBeTruthy()
    expect(createRecipeReport).not.toHaveBeenCalled()
    expect(deleteFavoriteRecipe).not.toHaveBeenCalled()
    expect(deleteRecipeComment).not.toHaveBeenCalled()
    expect(saveFavoriteRecipe).not.toHaveBeenCalled()
    expect(updateRecipeComment).not.toHaveBeenCalled()
  })
})
